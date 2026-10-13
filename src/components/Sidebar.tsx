import React from 'react';
import { 
  Building2, 
  MapPin, 
  CalendarRange, 
  FileSpreadsheet, 
  FileText, 
  BookOpen, 
  Settings, 
  ShieldAlert, 
  UserCheck, 
  Building,
  X,
  Leaf,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  ArrowLeftRight,
  Home
} from 'lucide-react';
import { NavigationModule, UserRole, Empresa, PeriodoBalance, Establecimiento } from '../types';

interface SidebarProps {
  currentModule: NavigationModule;
  onSelectModule: (module: NavigationModule) => void;
  userRole: UserRole;
  onToggleRole: () => void;
  selectedEmpresa: Empresa | undefined;
  selectedPeriodo: PeriodoBalance | undefined;
  selectedEstablecimiento: Establecimiento | undefined;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
  onExitToLanding?: () => void;
}

interface NavSection {
  title: string;
  items: {
    id: NavigationModule;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  userRole,
  onToggleRole,
  selectedEmpresa,
  selectedPeriodo,
  selectedEstablecimiento,
  isOpenMobile,
  onToggleMobile,
  onExitToLanding
}) => {
  // Navigation sections tailored to the active role
  const adminSections: NavSection[] = [
    {
      title: 'Supervisión y Control',
      items: [
        { id: 'panel_admin', label: 'Panel Administrador', icon: UserCheck },
        { id: 'empresas', label: 'Directorio de Empresas', icon: Building2 },
        { id: 'establecimientos', label: 'Establecimientos y Sedes', icon: MapPin }
      ]
    },
    {
      title: 'Trazabilidad y Registros',
      items: [
        { id: 'bitacora_residuos', label: 'Bitácora de Residuos', icon: ClipboardList },
        { id: 'informes', label: 'Informes y Estadísticas', icon: BarChart3 },
        { id: 'gestores_catalogos', label: 'Gestores y Transportadores', icon: ShieldCheck }
      ]
    },
    {
      title: 'Cumplimiento y Soportes',
      items: [
        { id: 'fichas', label: 'Fichas Ambientales (RUA)', icon: FileSpreadsheet },
        { id: 'documentos', label: 'Archivo de Documentos', icon: FileText }
      ]
    },
    {
      title: 'Configuración y Normativa',
      items: [
        { id: 'periodos', label: 'Períodos de Balance', icon: CalendarRange },
        { id: 'guia', label: 'Guía y Normativa', icon: BookOpen },
        { id: 'configuracion', label: 'Ajustes del Sistema', icon: Settings }
      ]
    }
  ];

  const empresaSections: NavSection[] = [
    {
      title: 'Mi Operación',
      items: [
        { id: 'panel_empresas', label: 'Panel de la Empresa', icon: Building },
        { id: 'bitacora_residuos', label: 'Bitácora de Residuos', icon: ClipboardList },
        { id: 'establecimientos', label: 'Sedes Operativas', icon: MapPin }
      ]
    },
    {
      title: 'Cumplimiento Ambiental',
      items: [
        { id: 'informes', label: 'Informes de Gestión', icon: BarChart3 },
        { id: 'documentos', label: 'Certificados y Manifiestos', icon: FileText },
        { id: 'fichas', label: 'Preparación RUA', icon: FileSpreadsheet }
      ]
    },
    {
      title: 'Recursos y Catálogos',
      items: [
        { id: 'gestores_catalogos', label: 'Gestores y Catálogos', icon: ShieldCheck },
        { id: 'guia', label: 'Guía Normativa', icon: BookOpen }
      ]
    }
  ];

  const sections = userRole === 'admin' ? adminSections : empresaSections;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onToggleMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-slate-800 shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md border border-emerald-500/20">
              <Leaf className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="text-base font-bold text-white tracking-tight leading-none">
                Nativa Ambiental
              </div>
              <div className="text-[11px] text-emerald-400 font-medium tracking-wide mt-1">
                Trazabilidad de Residuos
              </div>
            </div>
          </div>
          <button
            onClick={onToggleMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Identity & Switcher */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Espacio Activo:
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
              userRole === 'admin' 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' 
                : 'bg-teal-950 text-teal-300 border border-teal-800/60'
            }`}>
              {userRole === 'admin' ? 'Administrador' : 'Empresa'}
            </span>
          </div>

          <p className="text-[11px] font-medium text-slate-300 leading-snug truncate">
            {userRole === 'admin'
              ? 'Supervisión multiorganización y auditoría'
              : selectedEmpresa ? selectedEmpresa.razonSocial : 'Operación empresarial'}
          </p>

          {/* Quick Switch Role or Return to Portal */}
          <div className="mt-3 flex items-center gap-2">
            {onExitToLanding && (
              <button
                onClick={() => {
                  onExitToLanding();
                  if (isOpenMobile) onToggleMobile();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-[11px] text-slate-200 font-medium transition-colors border border-slate-700/60 cursor-pointer"
                title="Volver a la selección de espacios de trabajo"
              >
                <Home className="w-3.5 h-3.5 text-slate-400" />
                <span>Portada</span>
              </button>
            )}

            <button
              onClick={onToggleRole}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-[11px] text-slate-200 font-medium transition-colors border border-slate-700/60 cursor-pointer"
              title="Cambiar entre modo administrador y empresa"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
              <span>{userRole === 'admin' ? 'Ir a Empresa' : 'Ir a Admin'}</span>
            </button>
          </div>
        </div>

        {/* Active Context Information */}
        <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-[11px]">
          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">
            Organización en foco:
          </div>
          <div className="text-white font-medium truncate">
            {selectedEmpresa ? selectedEmpresa.razonSocial : 'Sin empresa seleccionada'}
          </div>
          <div className="text-slate-400 text-[10px] flex items-center justify-between mt-0.5">
            <span className="truncate text-emerald-400">
              {selectedEstablecimiento?.nombre || 'Sede Principal'}
            </span>
            <span className="font-mono text-slate-300">
              Año {selectedPeriodo?.anio || '2024'}
            </span>
          </div>
        </div>

        {/* Categorized Navigation Menu */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-4">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentModule === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectModule(item.id);
                      if (isOpenMobile) onToggleMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-950/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Technical & Regulatory Notice */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/40 text-[10px] text-slate-400 leading-tight space-y-1">
          <div className="font-semibold text-slate-300 flex items-center justify-between">
            <span>Marco Técnico</span>
            <span className="text-emerald-400 font-mono">Dec. 1076/15</span>
          </div>
          <p className="text-slate-400 text-[10px]">
            Libro de operaciones y trazabilidad. Los envíos formales al RUA se realizan ante la autoridad ambiental competente.
          </p>
        </div>
      </aside>
    </>
  );
};
