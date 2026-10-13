import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Copy, Send, Phone, Mail, FileText } from 'lucide-react';
import { QuoteFormData, SectorType, ProjectCategory } from '../types';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<QuoteFormData>;
  lang: 'pt' | 'en';
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  initialData,
  lang
}) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    sector: 'infraestrutura',
    category: 'hidrossemeadura',
    estimatedArea: '',
    location: '',
    projectDetails: '',
    urgency: 'padrao'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedProtocol, setSubmittedProtocol] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Nome é obrigatório.';
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail corporativo é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Por favor, insira um e-mail válido.';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Telefone/WhatsApp é obrigatório.';
    if (!formData.companyName.trim()) newErrors.companyName = 'Nome da empresa é obrigatório.';
    if (!formData.location.trim()) newErrors.location = 'Cidade/UF é obrigatório.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Generate reference protocol
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const protocol = `NAT-2026-${randomCode}`;
    setSubmittedProtocol(protocol);
  };

  const handleCopyProtocol = () => {
    if (submittedProtocol) {
      navigator.clipboard.writeText(submittedProtocol);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetAndClose = () => {
    setSubmittedProtocol(null);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold tracking-tight">
              {lang === 'pt' ? 'Solicitar Proposta Técnica e Orçamento' : 'Request Technical Engineering Proposal'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Nativa Ambiental Engenharia Florestal e Bioengenharia de Solos
            </p>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submittedProtocol ? (
            /* Success confirmation */
            <div className="py-6 text-center space-y-5">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-900">
                  {lang === 'pt' ? 'Solicitação Registrada com Sucesso!' : 'Proposal Request Submitted!'}
                </h4>
                <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                  {lang === 'pt'
                    ? 'Nossa diretoria técnica recebeu suas especificações. Um engenheiro responsável entrará em contato em até 4 horas úteis.'
                    : 'Our technical directorate has received your project data. A project engineer will review and contact you within 4 business hours.'}
                </p>
              </div>

              {/* Protocol Badge */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-sm mx-auto flex items-center justify-between">
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    {lang === 'pt' ? 'Protocolo de Atendimento:' : 'Service Protocol:'}
                  </div>
                  <div className="text-base font-mono font-bold text-slate-900">
                    {submittedProtocol}
                  </div>
                </div>
                <button
                  onClick={handleCopyProtocol}
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              {/* Direct channels */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-600">
                <a
                  href={`https://wa.me/552730224500?text=${encodeURIComponent(`Olá Nativa Ambiental, registrei a proposta sob protocolo ${submittedProtocol}. Gostaria de agilizar o atendimento.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp Direto: (27) 3022-4500</span>
                </a>
                <span className="hidden sm:inline" aria-hidden="true">·</span>
                <a
                  href={`mailto:contato@nativaambiental.com.br?subject=Orçamento ${submittedProtocol}`}
                  className="flex items-center gap-2 font-semibold text-slate-700 hover:text-slate-900"
                >
                  <Mail className="w-4 h-4" />
                  <span>contato@nativaambiental.com.br</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={resetAndClose}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  {lang === 'pt' ? 'Fechar esta Janela' : 'Close Window'}
                </button>
              </div>
            </div>
          ) : (
            /* Lead Capture Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ex: Eng. Marcelo Rocha"
                    className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                      errors.fullName ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                    }`}
                  />
                  {errors.fullName && <p className="text-[11px] text-red-600 mt-0.5">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    E-mail Corporativo *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="marcelo@construtora.com.br"
                    className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                      errors.email ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-red-600 mt-0.5">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(27) 99999-0000"
                    className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                      errors.phone ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-600 mt-0.5">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Empresa / Concessionária *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Ex: Construtora Aliança S.A."
                    className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                      errors.companyName ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                    }`}
                  />
                  {errors.companyName && <p className="text-[11px] text-red-600 mt-0.5">{errors.companyName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Solução Principal
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="hidrossemeadura">Hidrossemeadura & Taludes</option>
                    <option value="reflorestamento">PRAD & Reflorestamento</option>
                    <option value="monitoramento">Monitoramento de Fauna/Água</option>
                    <option value="licenciamento">Licenciamento Ambiental</option>
                    <option value="supressao">Supressão & Resgate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Área Estimada (m² ou ha)
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedArea}
                    onChange={(e) => setFormData({ ...formData, estimatedArea: e.target.value })}
                    placeholder="Ex: 25.000 m²"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Localização (Cidade/UF) *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Vitória / ES"
                    className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                      errors.location ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                    }`}
                  />
                  {errors.location && <p className="text-[11px] text-red-600 mt-0.5">{errors.location}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Detalhes Técnicos do Projeto / Desafio
                </label>
                <textarea
                  rows={3}
                  value={formData.projectDetails}
                  onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                  placeholder="Descreva a situação do talude, tipo de solo, exigência do órgão ambiental (IBAMA/IEMA/CETESB) ou prazo pretendido..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Emissão de ART garantida em todos os contratos</span>
                </span>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{lang === 'pt' ? 'Enviar Solicitação' : 'Submit Proposal Request'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
