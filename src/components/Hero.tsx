import React from 'react';
import { ArrowRight, CheckCircle2, Calculator } from 'lucide-react';
import { HERO_IMAGE } from '../data/content';

interface HeroProps {
  onOpenQuoteModal: () => void;
  lang: 'pt' | 'en';
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuoteModal, lang }) => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {/* Visual Carrier with measured contrast scrim */}
      <div className="relative min-h-[560px] lg:min-h-[640px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt="Hidrossemeadura e bioengenharia de solos em taludes pela Nativa Ambiental"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="max-w-3xl">
            {/* Clean unboxed metadata separator without pills */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-emerald-400 mb-4">
              <span>Bioengenharia de Solos</span>
              <span aria-hidden="true">·</span>
              <span>Restauração Ecológica</span>
              <span aria-hidden="true">·</span>
              <span>Desde 1996</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6 [text-wrap:balance]">
              {lang === 'pt' ? (
                <>
                  Engenharia e Soluções Ambientais para Grandes Empreendimentos
                </>
              ) : (
                <>
                  Environmental Engineering & Bio-restoration for Large Scale Infrastructure
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
              {lang === 'pt' ? (
                <>
                  Especialistas em hidrossemeadura de alta performance, recuperação de áreas degradadas (PRAD), estabilização geotécnica de taludes e licenciamento ambiental com conformidade rigorosa.
                </>
              ) : (
                <>
                  Specialists in high-performance hydroseeding, degraded area recovery (PRAD), geotechnical slope stabilization, and continuous regulatory environmental compliance.
                </>
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <button
                onClick={onOpenQuoteModal}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg shadow-emerald-950/30 active:scale-[0.99] transition-all whitespace-nowrap"
              >
                <span>{lang === 'pt' ? 'Solicitar Proposta Técnica' : 'Request Technical Quote'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#calculadora"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-100 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg backdrop-blur-sm transition-all whitespace-nowrap"
              >
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'pt' ? 'Simular Projeto Ambiental' : 'Simulate Project Scope'}</span>
              </a>
            </div>

            {/* Credential cues */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Frota própria FINN T120</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Responsabilidade Técnica com ART</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Atuação em todo o território nacional</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Column Proof & KPI Strip in a full-width row below hero */}
      <div className="bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            <div className="pt-4 lg:pt-0 lg:px-4 first:lg:pl-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums tracking-tight">
                +1.200.000 <span className="text-emerald-400 text-2xl font-bold">m²</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'pt' ? 'Áreas hidrossemeadas e estabilizadas' : 'Hydroseeded and stabilized areas'}
              </p>
            </div>

            <div className="pt-4 lg:pt-0 lg:px-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums tracking-tight">
                +480.000
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'pt' ? 'Mudas nativas de biomas brasileiros plantadas' : 'Native tree seedlings planted in biomes'}
              </p>
            </div>

            <div className="pt-4 lg:pt-0 lg:px-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tabular-nums tracking-tight">
                100%
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'pt' ? 'Conformidade e aprovação em órgãos ambientais' : 'Regulatory approval rate (IBAMA/IEMA)'}
              </p>
            </div>

            <div className="pt-4 lg:pt-0 lg:px-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums tracking-tight">
                28+ <span className="text-slate-400 text-lg font-medium">anos</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'pt' ? 'Experiência contínua e corpo técnico sênior' : 'Years of environmental engineering expertise'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
