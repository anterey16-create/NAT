import React, { useState } from 'react';
import { CASE_STUDIES } from '../data/content';
import { SectorType, CaseStudy } from '../types';
import { CheckCircle2, Shield, Calendar, MapPin } from 'lucide-react';

interface CaseStudiesProps {
  onSelectCase: (caseItem: CaseStudy) => void;
  lang: 'pt' | 'en';
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({ onSelectCase, lang }) => {
  const [filter, setFilter] = useState<'all' | SectorType>('all');

  const filteredCases = filter === 'all'
    ? CASE_STUDIES
    : CASE_STUDIES.filter(c => c.clientSector === filter);

  return (
    <section id="casos" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">
              {lang === 'pt' ? 'Histórico Comprovado' : 'Proven Track Record'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
              {lang === 'pt' ? (
                <>Casos Reais e Resultados Quantificados em Campo</>
              ) : (
                <>Case Studies & Measured Environmental Performance</>
              )}
            </h2>
            <p className="mt-3 text-base text-slate-600">
              {lang === 'pt' ? (
                <>Projetos executados com auditoria e homologação junto aos principais órgãos ambientais e concessionárias do Brasil.</>
              ) : (
                <>Audited environmental stabilization delivered for major infrastructure, mining, and renewable concessionaires.</>
              )}
            </p>
          </div>

          {/* Interactive filter tabs (functional buttons) */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-lg border border-slate-200 overflow-x-auto max-w-full">
            {[
              { id: 'all', label: lang === 'pt' ? 'Todos os Projetos' : 'All Projects' },
              { id: 'infraestrutura', label: 'Infraestrutura' },
              { id: 'mineracao', label: 'Mineração' },
              { id: 'energia', label: 'Energia' },
              { id: 'loteamentos', label: 'Loteamentos' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as 'all' | SectorType)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  filter === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Case Study Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCases.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              {/* Media banner */}
              <div className="relative aspect-[16/9] bg-slate-800 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 text-xs font-semibold text-white bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded">
                  {item.sectorLabel}
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item.location}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item.year}</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 mb-4">
                    <span>Área: {item.area}</span>
                    <span aria-hidden="true">·</span>
                    <span>Prazo de Execução: {item.timeline}</span>
                  </div>

                  <div className="space-y-3 text-xs text-slate-600">
                    <div>
                      <span className="font-bold text-slate-900 block mb-0.5">Desafio Geotécnico/Ambiental:</span>
                      <p className="leading-relaxed">{item.challenge}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block mb-0.5">Solução de Engenharia Nativa:</span>
                      <p className="leading-relaxed">{item.solution}</p>
                    </div>
                  </div>
                </div>

                {/* Quantitative Results Strip */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                    {item.results.map((res, i) => (
                      <div key={i} className="text-center">
                        <div className="text-sm font-extrabold text-emerald-700 tabular-nums">
                          {res.value}
                        </div>
                        <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                          {res.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-[11px] font-medium">{item.regulatoryCompliance}</span>
                    </div>

                    <button
                      onClick={() => onSelectCase(item)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2 whitespace-nowrap"
                    >
                      {lang === 'pt' ? 'Consultar Similar' : 'Request Similar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
