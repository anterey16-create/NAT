import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Leaf, 
  ArrowRight, 
  FileCheck2, 
  ClipboardList, 
  BarChart3, 
  HardDrive, 
  CheckCircle2, 
  ChevronRight,
  Building,
  UserCheck,
  Scale,
  FolderLock
} from 'lucide-react';
import { Empresa, Establecimiento, PeriodoBalance, DocumentoSoporte, RegistroResiduo } from '../../types';

interface WorkspaceLandingViewProps {
  empresas: Empresa[];
  establecimientos: Establecimiento[];
  periodos: PeriodoBalance[];
  documentos: DocumentoSoporte[];
  residuos: RegistroResiduo[];
  selectedEmpresaId: string;
  onSelectEmpresaId: (id: string) => void;
  onEnterWorkspace: (role: 'admin' | 'empresa', empresaId?: string) => void;
}

export const WorkspaceLandingView: React.FC<WorkspaceLandingViewProps> = ({
  empresas,
  establecimientos,
  periodos,
  documentos,
  residuos,
  selectedEmpresaId,
  onSelectEmpresaId,
  onEnterWorkspace,
}) => {
  const [chosenEmpresaId, setChosenEmpresaId] = useState<string>(
    selectedEmpresaId || empresas[0]?.id || ''
  );

  const activeEmpresa = empresas.find(e => e.id === chosenEmpresaId) || empresas[0];
  const empresaSedesCount = establecimientos.filter(e => e.empresaId === activeEmpresa?.id).length;
  const empresaResiduosCount = residuos.filter(r => r.empresaId === activeEmpresa?.id).length;

  const handleSelectEmpresa = (empresaId: string) => {
    setChosenEmpresaId(empresaId);
    onSelectEmpresaId(empresaId);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50 border border-emerald-500/30">
              <Leaf className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="text-lg font-bold text-white tracking-tight leading-none">
                Nativa Ambiental
              </div>
              <div className="text-xs text-emerald-400 font-medium tracking-wide mt-1">
                Gestión y Trazabilidad de Residuos · Colombia
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5">
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            <span>Almacenamiento Local Seguro</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300 font-medium">{empresas.length} Empresas registradas</span>
          </div>
        </div>
      </header>

      {/* Hero & Selection Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-10 lg:py-14 flex flex-col justify-center">
        {/* Editorial Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-800/60 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Plataforma Profesional de Gestión Ambiental
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Gestión ambiental, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">en un solo lugar</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Administra, registra y consulta la trazabilidad integral de los residuos de tu organización bajo la normatividad ambiental colombiana.
          </p>
        </div>

        {/* 2 Main Workspace Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto w-full">
          {/* Card 1: Administrador Ambiental */}
          <div className="group relative bg-gradient-to-b from-slate-900 to-slate-950/90 border border-slate-800 hover:border-emerald-700/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/20">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center text-emerald-300">
                  <UserCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md">
                  Supervisión Global
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Administrador ambiental
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Gestiona empresas, revisa registros, supervisa soportes documentales y consolida reportes técnicos de múltiples organizaciones.
              </p>

              {/* Functional Highlights */}
              <div className="space-y-2.5 pt-4 border-t border-slate-800/80 mb-8">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Auditoría y control consolidado de todas las organizaciones</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Directorio maestro de empresas clientes y sedes operativas</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Validación de manifiestos, certificados y actas de disposición</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Preparación y estructuración técnica de capítulos RUA</span>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => onEnterWorkspace('admin')}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-md hover:shadow-emerald-700/20 cursor-pointer"
              >
                <span>Entrar como administrador</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 2: Empresa Generadora */}
          <div className="group relative bg-gradient-to-b from-slate-900 to-slate-950/90 border border-slate-800 hover:border-teal-700/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-teal-950/20">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-teal-950/80 border border-teal-800/50 flex items-center justify-center text-teal-300">
                  <Building className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-teal-400 bg-teal-950/40 border border-teal-800/40 px-2.5 py-1 rounded-md">
                  Operación de Organización
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Empresa generadora
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Registra eventos de residuos, gestiona tus sedes operativas, consulta informes de generación y carga certificados de disposición final.
              </p>

              {/* Selector interactivo de Empresa */}
              <div className="mb-6 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Selecciona la empresa a gestionar:
                </label>
                <div className="relative">
                  <select
                    value={chosenEmpresaId}
                    onChange={(e) => handleSelectEmpresa(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 text-white rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                  >
                    {empresas.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.razonSocial} (NIT: {emp.nit})
                      </option>
                    ))}
                  </select>
                </div>
                {activeEmpresa && (
                  <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{empresaSedesCount} sede(s) registrada(s)</span>
                    <span className="text-teal-400">{empresaResiduosCount} registro(s) en bitácora</span>
                  </div>
                )}
              </div>

              {/* Functional Highlights */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800/80 mb-8">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>Bitácora diaria de residuos (generación, salidas, gestores)</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>Control de sedes operativas y acopios temporales</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>Custodia digital de certificados y manifiestos de transporte</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>Informes de balance de masa y tasa de aprovechamiento</span>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => onEnterWorkspace('empresa', chosenEmpresaId)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-semibold text-sm transition-all shadow-md hover:shadow-teal-700/20 cursor-pointer"
              >
                <span>Entrar como empresa</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Pillars / Value Proposition */}
        <div className="mt-16 sm:mt-20 pt-12 border-t border-slate-800/80 max-w-5xl mx-auto w-full">
          <div className="text-center mb-8">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Pilares de Operación y Cumplimiento Normativo
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Diseñado según los lineamientos de las autoridades ambientales en Colombia
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <ClipboardList className="w-5 h-5 text-emerald-400 mb-2" />
              <h4 className="text-xs font-bold text-white">Trazabilidad Operativa</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                Libro digital de operaciones de residuos ordinarios, aprovechables y peligrosos (RESPEL).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <Scale className="w-5 h-5 text-teal-400 mb-2" />
              <h4 className="text-xs font-bold text-white">Decreto 1076 de 2015</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                Clasificación de gran, mediano y pequeño generador y balance de masa en kg/mes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <FolderLock className="w-5 h-5 text-amber-400 mb-2" />
              <h4 className="text-xs font-bold text-white">Custodia Documental</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                Archivo centralizado de manifiestos, certificados de disposición y licencias de gestores.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <FileCheck2 className="w-5 h-5 text-blue-400 mb-2" />
              <h4 className="text-xs font-bold text-white">Preparación RUA</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                Estructuración de datos de balance anual para radicación oficial ante el IDEAM / CAR.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 px-4 sm:px-8 py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-semibold text-slate-400">Nativa Ambiental</span> · Plataforma de Trazabilidad y Gestión de Residuos
          </div>
          <div className="text-[11px] text-slate-400">
            Los datos se almacenan y persisten localmente en este navegador · Listo para operación
          </div>
        </div>
      </footer>
    </div>
  );
};
