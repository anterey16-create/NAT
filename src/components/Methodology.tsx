import React from 'react';
import { Compass, Beaker, Truck, FileCheck, CheckCircle2 } from 'lucide-react';

interface MethodologyProps {
  lang: 'pt' | 'en';
}

export const Methodology: React.FC<MethodologyProps> = ({ lang }) => {
  const steps = [
    {
      num: '01',
      title: lang === 'pt' ? 'Diagnóstico & Mapeamento Geotécnico' : 'Geotechnical Site Survey',
      desc: lang === 'pt' 
        ? 'Levantamento topográfico com drones e sensores LiDAR, amostragem granulométrica do solo, teste de pH e identificação de linhas de fluxo pluvial.'
        : 'Drone topography, soil texture and pH laboratory testing, and surface hydrological drainage mapping.',
      icon: Compass,
      points: [
        'Modelagem 3D do perfil do talude',
        'Cálculo de fatores de estabilidade e escorregamento',
        'Definição da matriz de espécies adequadas ao bioma'
      ]
    },
    {
      num: '02',
      title: lang === 'pt' ? 'Formulação Biomecânica de Calda' : 'Botanical Slurry Formulation',
      desc: lang === 'pt'
        ? 'Dosagem agronômica de sementes certificadas de alta taxa germinativa, aditivos bioestimulantes, fixadores poliméricos e biomantas antierosivas.'
        : 'Engineered seed batch calculation with rapid-rooting legumes, mycorrhizal inoculants, and biodegradable polymer tackifiers.',
      icon: Beaker,
      points: [
        'Controle de pureza e vigor de sementes',
        'Ajuste para resistência a períodos de estiagem',
        'Fixadores resistentes a chuvas de até 80 mm/h'
      ]
    },
    {
      num: '03',
      title: lang === 'pt' ? 'Aplicação Mecanizada de Alta Vazão' : 'High-Pressure Heavy Deployment',
      desc: lang === 'pt'
        ? 'Disparo hidrostático com caminhões hidrossemeadores FINN T120, atingindo taludes de difícil acesso a até 65 metros de distância do leito viário.'
        : 'Industrial hydroseeding application utilizing FINN heavy machinery with reach up to 65 meters on steep gradients.',
      icon: Truck,
      points: [
        'Equipe certificada em NR-35 (Trabalho em Altura)',
        'Ancoragem de grampos metálicos galvanizados',
        'Rendimento operacional de até 35.000 m²/dia por equipe'
      ]
    },
    {
      num: '04',
      title: lang === 'pt' ? 'Monitoramento & Laudos de ART' : 'NDVI Monitoring & Engineering Sign-off',
      desc: lang === 'pt'
        ? 'Acompanhamento do índice de cobertura vegetal através de imagens multiespectrais, controle fitossanitário e emissão de laudo técnico final com ART.'
        : 'NDVI multispectral canopy tracking, maintenance irrigation protocols, and final regulatory technical sign-off.',
      icon: FileCheck,
      points: [
        'Garantia contratual de taxa mínima de cobertura (>85%)',
        'Atestados técnicos para auditorias ambientais',
        'Protocolo imediato junto aos órgãos competentes'
      ]
    }
  ];

  return (
    <section id="metodologia" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">
            {lang === 'pt' ? 'Rigor Metodológico' : 'Engineering Process'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
            {lang === 'pt' ? (
              <>Protocolo Técnico em 4 Fases para Garantia de Resultado</>
            ) : (
              <>4-Stage Engineering Protocol for Guaranteed Vegetal Stabilization</>
            )}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {lang === 'pt' ? (
              <>Nossa metodologia elimina retrabalhos e assegura a liberação de licenças dentro do cronograma do empreendimento.</>
            ) : (
              <>Eliminating rework and securing formal agency release within project budget milestones.</>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(step => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between hover:border-emerald-600 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-mono font-extrabold text-emerald-700 tabular-nums">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-emerald-100/60 flex items-center justify-center text-emerald-800">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 space-y-2">
                  {step.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
