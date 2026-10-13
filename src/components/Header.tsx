import React from 'react';
import { 
  Menu, 
  Calendar, 
  Building2, 
  UserCheck, 
  Building, 
  Home, 
  ChevronRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { NavigationModule, UserRole, Empresa, PeriodoBalance, Establecimiento } from '../types';

interface HeaderProps {
  currentModule: NavigationModule;
  userRole: UserRole;
  empresas: Empresa[];
  periodos: PeriodoBalance[];
  establecimientos: Establecimiento[];
  selectedEmpresaId: string;
  selectedPeriodoId: string;
  onSelectEmpresaId: (id: string) => void;
  onSelectPeriodoId: (id: string) => void;
  onToggleMobileMenu: () => void;
  onExitToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModule,
  userRole,
  empresas,
  periodos,
  establecimientos,
  selectedEmpresaId,
  selectedPeriodoId,
  onSelectEmpresaId,
  onSelectPeriodoId,
  onToggleMobileMenu,
  onExitToLanding
}) => {
  const moduleTitles: Record<NavigationModule, { section: string; title: string; subtitle: string }> = {
    dashboard: { 
      section: 'Visión General',
      title: 'Panel Consolidado', 
      subtitle: 'Balance de generación, acopio, valorización y expedientes' 
    },
    panel_admin: {
      section: 'Supervisión y Control',
      title: 'Panel del Administrador Ambiental',
      subtitle: 'Supervisión de empresas, auditoría de residuos, catálogos y consistencia'
    },
    panel_empresas: {
      section: 'Mi Operación',
      title: 'Panel de la Empresa Generadora',
      subtitle: 'Monitoreo operativo de sedes, inventario de residuos en acopio y trazabilidad'
    },
    bitacora_residuos: {
      section: 'Trazabilidad y Registros',
      title: 'Bitácora de Residuos (Libro de Operaciones)',
      subtitle: 'Registro de generación, salidas a gestores, transportadores y tratamientos'
    },
    informes: {
      section: 'Informes y Estadísticas',
      title: 'Informes y Balance Ambiental',
      subtitle: 'Balance de masa, tasa de aprovechamiento, categorización y resumen RUA'
    },
    gestores_catalogos: {
      section: 'Recursos Maestros',
      title: 'Gestores Autorizados y Catálogos',
      subtitle: 'Directorio de empresas gestoras con licencia ambiental y corrientes de residuo'
    },
    documentos: { 
      section: 'Expediente Legal',
      title: 'Archivo de Documentos y Soportes', 
      subtitle: 'Manifiestos de carga, certificados de disposición final, licencias y actas' 
    },
    empresas: { 
      section: 'Directorio Maestro',
      title: 'Directorio de Empresas', 
      subtitle: 'Registro de organizaciones generadoras titulares de sedes operativas' 
    },
    establecimientos: { 
      section: 'Sedes y Plantas',
      title: 'Establecimientos y Sedes Operativas', 
      subtitle: 'Plantas, bodegas y sedes generadoras con autoridad ambiental competente' 
    },
    periodos: { 
      section: 'Vigencias Anuales',
      title: 'Períodos de Balance', 
      subtitle: 'Gestión de vigencias de reporte y balance ambiental consolidado' 
    },
    fichas: { 
      section: 'Cumplimiento Normativo',
      title: 'Preparación de Reporte RUA', 
      subtitle: 'Estructuración y verificación de datos de balance para cargue en el aplicativo oficial RUA' 
    },
    guia: { 
      section: 'Marco Legal',
      title: 'Guía y Manual Normativo Ambiental', 
      subtitle: 'Marco legal colombiano: Decreto 1076/2015, Resolución 1023/2010 y lineamientos RESPEL' 
    },
    configuracion: { 
      section: 'Sistema',
      title: 'Ajustes del Sistema', 
      subtitle: 'Respaldo de datos, exportación del libro de operaciones y parámetros' 
    }
  };

  const current = moduleTitles[currentModule] || {
    section: 'Nativa Ambiental',
    title: 'Gestión Ambiental',
    subtitle: 'Plataforma de Trazabilidad'
  };

  const activeEmpresa = empresas.find(e => e.id === selectedEmpresaId) || empresas[0];
  const activePeriodo = periodos.find(p => p.id === selectedPeriodoId) || periodos[0];

  return (
    <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumb / Title */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden shrink-0"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          {/* Breadcrumb line */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium tracking-tight mb-0.5">
            <span className="hover:text-slate-700">{current.section}</span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="text-emerald-800 font-semibold truncate">
              {userRole === 'admin' ? 'Supervisión Administrador' : (activeEmpresa?.razonSocial || 'Empresa')}
            </span>
          </div>

          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight truncate">
            {current.title}
          </h1>
          <p className="text-[11px] text-slate-600 hidden md:block truncate">
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Context Selectors & Workspace Change Button */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Selector de Empresa Activa */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
          <Building2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <select
            value={selectedEmpresaId}
            onChange={(e) => onSelectEmpresaId(e.target.value)}
            className="bg-transparent font-medium text-slate-800 focus:outline-none max-w-[170px] xl:max-w-[210px] truncate cursor-pointer"
            title="Seleccionar empresa en foco"
          >
            {empresas.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.razonSocial}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Período de Balance */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <select
            value={selectedPeriodoId}
            onChange={(e) => onSelectPeriodoId(e.target.value)}
            className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
            title="Seleccionar vigencia de balance"
          >
            {periodos
              .filter(p => userRole === 'admin' || p.empresaId === selectedEmpresaId)
              .map(p => (
                <option key={p.id} value={p.id}>
                  {p.anio} ({p.estado})
                </option>
              ))}
          </select>
        </div>

        {/* Workspace Switcher / Back to Landing */}
        {onExitToLanding && (
          <button
            onClick={onExitToLanding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200/80 transition-colors cursor-pointer"
            title="Cambiar espacio de trabajo y volver a la portada de selección"
          >
            <Home className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Cambiar espacio</span>
          </button>
        )}

        {/* Notice of IDEAM Deadline */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span className="font-medium text-slate-700">Vence 31 Mayo</span>
        </div>
      </div>
    </header>
  );
};
