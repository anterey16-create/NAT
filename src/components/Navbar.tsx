import React from 'react';
import { Leaf } from 'lucide-react';

interface NavbarProps {
  onOpenQuoteModal: () => void;
  lang: 'pt' | 'en';
  onToggleLang: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuoteModal, lang, onToggleLang }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <a href="#" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 group">
          <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-800 transition-colors">
            <Leaf className="w-5 h-5 text-emerald-100" />
          </div>
          <span className="font-semibold text-slate-900 tracking-tight">
            Nativa Ambiental
          </span>
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#solucoes" className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0">
            {lang === 'pt' ? 'Soluções' : 'Solutions'}
          </a>
          <a href="#metodologia" className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0">
            {lang === 'pt' ? 'Metodologia' : 'Methodology'}
          </a>
          <a href="#casos" className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0">
            {lang === 'pt' ? 'Projetos' : 'Projects'}
          </a>
          <a href="#calculadora" className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0">
            {lang === 'pt' ? 'Calculadora' : 'Calculator'}
          </a>
          <a href="#contato" className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0">
            {lang === 'pt' ? 'Contato' : 'Contact'}
          </a>
        </nav>

        {/* Zone 3: 1 primary action (+ language switch toggle) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleLang}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap"
            title="Alternar Idioma / Switch Language"
          >
            {lang === 'pt' ? 'EN' : 'PT'}
          </button>
          <button
            onClick={onOpenQuoteModal}
            className="px-4 py-2 text-sm font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 active:scale-[0.99] transition-all whitespace-nowrap shrink-0 shadow-sm"
          >
            {lang === 'pt' ? 'Solicitar Orçamento' : 'Request Proposal'}
          </button>
        </div>
      </div>
    </header>
  );
};
