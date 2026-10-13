import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Award, Clock } from 'lucide-react';

interface ContactSectionProps {
  onOpenQuoteModal: () => void;
  lang: 'pt' | 'en';
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenQuoteModal, lang }) => {
  return (
    <section id="contato" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl overflow-hidden shadow-xl border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            {/* Left 7 cols: Direct Engagement */}
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-8">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                  {lang === 'pt' ? 'Atendimento Corporativo' : 'Enterprise Inquiries'}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight [text-wrap:balance]">
                  {lang === 'pt' ? (
                    <>Fale Diretamente com Nossa Engenharia de Solos e Meio Ambiente</>
                  ) : (
                    <>Consult Directly with Our Environmental and Soil Engineers</>
                  )}
                </h2>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-xl">
                  {lang === 'pt' ? (
                    <>
                      Seja para conter taludes em rodovias, cumprir TACs florestais ou licenciar novos empreendimentos industriais e imobiliários, disponibilizamos corpo técnico experiente com frota própria.
                    </>
                  ) : (
                    <>
                      Whether to stabilize critical highway slopes, deliver native reforestation commitments, or license new industrial developments, our team is equipped with heavy machinery and certified engineers.
                    </>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-900/50 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">{lang === 'pt' ? 'Central de Atendimento' : 'Phone / WhatsApp'}</div>
                    <a href="tel:+552730224500" className="text-sm font-bold text-white hover:text-emerald-400 transition-colors">
                      +55 (27) 3022-4500
                    </a>
                    <div className="text-[11px] text-slate-500 mt-0.5">Segunda a Sexta, 08h às 18h</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-900/50 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">{lang === 'pt' ? 'E-mail Comercial' : 'Direct Email'}</div>
                    <a href="mailto:contato@nativaambiental.com.br" className="text-sm font-bold text-white hover:text-emerald-400 transition-colors">
                      contato@nativaambiental.com.br
                    </a>
                    <div className="text-[11px] text-slate-500 mt-0.5">Resposta em até 4 horas úteis</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Plantão técnico para emergências de deslizamento e contenção</span>
                </div>

                <button
                  onClick={onOpenQuoteModal}
                  className="px-6 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
                >
                  {lang === 'pt' ? 'Iniciar Cotação Formal' : 'Request RFQ Online'}
                </button>
              </div>
            </div>

            {/* Right 5 cols: Certifications & Headquarter Credentials */}
            <div className="lg:col-span-5 p-8 sm:p-12 bg-slate-950/60 space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
                  {lang === 'pt' ? 'Credenciais Institucionais' : 'Regulatory Registrations'}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white">Registro no CREA / CRBio</div>
                      <div className="text-[11px] text-slate-400">Emissão de ART/RRT compulsória em todas as frentes de trabalho.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white">Cadastro Técnico Federal (CTF/IBAMA)</div>
                      <div className="text-[11px] text-slate-400">Habilitada para transporte, manejo florestal e resgate de germoplasma.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white">Bases Operacionais</div>
                      <div className="text-[11px] text-slate-400">Vitória/ES (Matriz) · Bases de apoio em São Paulo/SP, Belo Horizonte/MG e Salvador/BA.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                "Nosso compromisso é entregar soluções de bioengenharia com garantia contratual de estabilização e recomposição de ecossistemas."
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
