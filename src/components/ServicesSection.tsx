import React, { useState } from 'react';
import { SERVICES_DATA } from '../data/content';
import { ServiceItem } from '../types';
import { CheckCircle2, ChevronDown, ChevronUp, Cpu, ShieldCheck } from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceForQuote: (serviceId: string) => void;
  lang: 'pt' | 'en';
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForQuote, lang }) => {
  const [expandedId, setExpandedId] = useState<string | null>(SERVICES_DATA[0].id);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <section id="solucoes" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">
            {lang === 'pt' ? 'Linhas de Atuação' : 'Core Capabilities'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
            {lang === 'pt' ? (
              <>Soluções Integradas em Engenharia Florestal e Bioengenharia</>
            ) : (
              <>Integrated Environmental Engineering and Forest Recovery</>
            )}
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            {lang === 'pt' ? (
              <>
                Atendemos construtoras, concessionárias de rodovias, mineradoras, loteadoras e operadoras de energia com maquinário especializado e metodologia alinhada à legislação brasileira.
              </>
            ) : (
              <>
                Serving infrastructure contractors, mining companies, real estate developers, and energy operators with specialized heavy machinery and strict environmental compliance.
              </>
            )}
          </p>
        </div>

        {/* Bento Grid layout with asymmetric emphasis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main featured showcase (Left 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {SERVICES_DATA.map((service: ServiceItem) => {
              const isExpanded = expandedId === service.id;

              return (
                <div
                  key={service.id}
                  className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                    isExpanded 
                      ? 'border-emerald-600 shadow-sm ring-1 ring-emerald-600/20' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => toggleExpand(service.id)}
                    className="w-full p-6 text-left flex items-start justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-sm font-mono font-bold text-emerald-700 pt-0.5 tabular-nums">
                        {service.order}.
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                          {service.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {service.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 p-1 rounded-md text-slate-400 bg-slate-100">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
                      <p className="text-sm text-slate-700 leading-relaxed mb-5">
                        {service.description}
                      </p>

                      <div className="space-y-4">
                        <div>
                          <div className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                            {lang === 'pt' ? 'Diferenciais Técnicos' : 'Technical Highlights'}
                          </div>
                          <ul className="space-y-2">
                            {service.highlights.map((h, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                              <Cpu className="w-3.5 h-3.5 text-slate-500" />
                              <span>{lang === 'pt' ? 'Maquinário e Tecnologia' : 'Machinery & Tech'}</span>
                            </div>
                            <ul className="space-y-1 text-xs text-slate-600">
                              {service.equipment.map((eq, i) => (
                                <li key={i}>• {eq}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                              <span>{lang === 'pt' ? 'Normas e Legislação' : 'Regulatory Standards'}</span>
                            </div>
                            <ul className="space-y-1 text-xs text-slate-600">
                              {service.regulations.map((reg, i) => (
                                <li key={i}>• {reg}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="pt-4 flex items-center justify-between">
                          <span className="text-xs font-mono font-medium text-slate-500">
                            {service.metrics}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectServiceForQuote(service.id);
                            }}
                            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-sm"
                          >
                            {lang === 'pt' ? 'Cotar esta Solução' : 'Quote this Service'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Marquee Visual & Technical Preview (Right 5 cols) */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            {(() => {
              const currentActive = SERVICES_DATA.find(s => s.id === expandedId) || SERVICES_DATA[0];
              const imageSrc = currentActive.image || SERVICES_DATA[0].image;

              return (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="relative aspect-[4/3] bg-slate-800">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={currentActive.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 text-sm">
                        Nativa Ambiental Engenharia
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="text-xs font-mono text-emerald-400">
                        {currentActive.order}. {currentActive.title}
                      </div>
                      <div className="text-sm font-semibold tracking-tight mt-0.5">
                        {currentActive.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
                      <span>Equipe Técnica Própria</span>
                      <span aria-hidden="true">·</span>
                      <span>Responsabilidade Técnica com ART</span>
                      <span aria-hidden="true">·</span>
                      <span>Laudos Oficiais</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      Nossas intervenções são conduzidas por engenheiros florestais, agrônomos, geólogos e biólogos registrados no CREA/CRBio, garantindo total segurança contra multas e embargos ambientais.
                    </p>

                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-between">
                      <span className="text-xs font-medium text-emerald-900">
                        {lang === 'pt' ? 'Precisa de diagnóstico de talude ou APP?' : 'Need a slope or degraded area diagnosis?'}
                      </span>
                      <button
                        onClick={() => onSelectServiceForQuote(currentActive.id)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
                      >
                        {lang === 'pt' ? 'Falar com Especialista' : 'Talk to Engineer'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
};
