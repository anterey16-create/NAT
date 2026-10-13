import React from 'react';
import { Leaf } from 'lucide-react';

interface FooterProps {
  onOpenQuoteModal: () => void;
  lang: 'pt' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ onOpenQuoteModal, lang }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-white tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                <Leaf className="w-4 h-4 text-emerald-100" />
              </div>
              <span>Nativa Ambiental</span>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              {lang === 'pt'
                ? 'Soluções avançadas em bioengenharia de solos, hidrossemeadura de alta performance, restauração florestal nativa e licenciamento de grandes empreendimentos.'
                : 'Advanced soil bioengineering, high-pressure hydroseeding, native reforestation, and environmental compliance for large scale projects.'}
            </p>

            <div className="text-slate-500 text-[11px]">
              CNPJ: 01.458.912/0001-44 · CREA-ES / CRBio 2ª Região
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="font-bold text-white tracking-wider uppercase text-[11px]">
              {lang === 'pt' ? 'Soluções Técnicas' : 'Solutions'}
            </div>
            <ul className="space-y-2">
              <li><a href="#solucoes" className="hover:text-emerald-400 transition-colors">Hidrossemeadura</a></li>
              <li><a href="#solucoes" className="hover:text-emerald-400 transition-colors">PRAD & Reflorestamento</a></li>
              <li><a href="#solucoes" className="hover:text-emerald-400 transition-colors">Monitoramento Faunístico</a></li>
              <li><a href="#solucoes" className="hover:text-emerald-400 transition-colors">Licenciamento Ambiental</a></li>
              <li><a href="#solucoes" className="hover:text-emerald-400 transition-colors">Supressão e Resgate</a></li>
            </ul>
          </div>

          {/* Standards & Compliance */}
          <div className="space-y-3">
            <div className="font-bold text-white tracking-wider uppercase text-[11px]">
              {lang === 'pt' ? 'Conformidade' : 'Compliance'}
            </div>
            <ul className="space-y-2">
              <li><span className="text-slate-400">ABNT NBR 11682</span></li>
              <li><span className="text-slate-400">DNIT 074/2006-ES</span></li>
              <li><span className="text-slate-400">Resoluções CONAMA</span></li>
              <li><span className="text-slate-400">Cadastro Técnico Federal</span></li>
              <li><span className="text-slate-400">Pacto Mata Atlântica</span></li>
            </ul>
          </div>

          {/* Action & Contact */}
          <div className="space-y-3">
            <div className="font-bold text-white tracking-wider uppercase text-[11px]">
              {lang === 'pt' ? 'Atendimento' : 'Direct Line'}
            </div>
            <div className="space-y-2">
              <p className="text-slate-300 font-semibold">+55 (27) 3022-4500</p>
              <p className="text-slate-400">contato@nativaambiental.com.br</p>
              <button
                onClick={onOpenQuoteModal}
                className="mt-2 inline-block px-3.5 py-1.5 rounded bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition-colors text-[11px]"
              >
                {lang === 'pt' ? 'Solicitar Cotação' : 'Request RFQ'}
              </button>
            </div>
          </div>
        </div>

        {/* Quiet Bottom Legal */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Nativa Ambiental. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Política de Privacidade</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Termos de Serviços Técnicos</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Manual de Segurança e ART</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
