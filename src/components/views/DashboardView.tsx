import React from 'react';
import { 
  Building2, 
  MapPin, 
  CalendarRange, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  ArrowRight,
  ShieldAlert,
  FileSpreadsheet,
  Plus,
  Layers,
  Truck,
  Package,
  Recycle,
  Scale,
  ClipboardList,
  BarChart3
} from 'lucide-react';
import { 
  Empresa, 
  Establecimiento, 
  PeriodoBalance, 
  DocumentoSoporte, 
  FichaRuaRegistro,
  RegistroResiduo,
  GestorAmbiental,
  UserRole,
  NavigationModule
} from '../../types';

interface DashboardViewProps {
  userRole: UserRole;
  empresas: Empresa[];
  establecimientos: Establecimiento[];
  periodos: PeriodoBalance[];
  activePeriodo: PeriodoBalance | undefined;
  activeEstablecimiento: Establecimiento | undefined;
  activeEmpresa: Empresa | undefined;
  documentos: DocumentoSoporte[];
  fichasRecords: FichaRuaRegistro[];
  residuos?: RegistroResiduo[];
  gestores?: GestorAmbiental[];
  onNavigateToFichas: (fichaNumero?: number) => void;
  onNavigateToModule: (module: NavigationModule) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userRole,
  empresas,
  establecimientos,
  periodos,
  activePeriodo,
  activeEstablecimiento,
  activeEmpresa,
  documentos,
  fichasRecords,
  residuos = [],
  gestores = [],
  onNavigateToFichas,
  onNavigateToModule
}) => {
  // Filtrar residuos de la empresa activa si existe
  const empresaResiduos = activeEmpresa
    ? residuos.filter(r => r.empresaId === activeEmpresa.id)
    : residuos;

  // Métricas operativas de residuos calculadas estrictamente de datos reales
  const totalGeneradoKg = empresaResiduos.reduce((acc, r) => acc + (Number(r.cantidadGeneradaKg) || 0), 0);
  const totalEnAcopioKg = empresaResiduos
    .filter(r => r.estadoGestion === 'En acopio temporal')
    .reduce((acc, r) => acc + (Number(r.cantidadGeneradaKg) || 0), 0);
  const totalEntregadoKg = empresaResiduos
    .filter(r => r.estadoGestion === 'Entregado a gestor')
    .reduce((acc, r) => acc + (Number(r.cantidadEntregadaKg || r.cantidadGeneradaKg) || 0), 0);

  const totalRespelKg = empresaResiduos
    .filter(r => r.peligrosidad === 'Peligroso (RESPEL)')
    .reduce((acc, r) => acc + (Number(r.cantidadGeneradaKg) || 0), 0);

  const aprovechadosKg = empresaResiduos
    .filter(r => r.tipoTratamiento === 'Aprovechamiento / Reciclaje' || r.tipoTratamiento === 'Compostaje / Biotransformación')
    .reduce((acc, r) => acc + (Number(r.cantidadEntregadaKg || r.cantidadGeneradaKg) || 0), 0);

  const tasaAprovechamiento = totalGeneradoKg > 0 ? Math.round((aprovechadosKg / totalGeneradoKg) * 100) : 0;

  // Promedio mensual y clasificación RESPEL según Decreto 1076 de 2015
  const promedioMensualRespelKg = Math.round((totalRespelKg / 12) * 10) / 10;
  let categoriaRespelLabel = 'Microgenerador (< 10 kg/mes)';
  if (promedioMensualRespelKg >= 1000) {
    categoriaRespelLabel = 'Gran Generador (≥ 1.000 kg/mes)';
  } else if (promedioMensualRespelKg >= 100) {
    categoriaRespelLabel = 'Mediano Generador (100 - 1.000 kg/mes)';
  } else if (promedioMensualRespelKg >= 10) {
    categoriaRespelLabel = 'Pequeño Generador (10 - 100 kg/mes)';
  }

  // Alerta normativa de acopio prolongado
  const hoyMs = new Date().getTime();
  const respelEnAcopioCritico = empresaResiduos.filter(r => {
    if (r.peligrosidad !== 'Peligroso (RESPEL)' || r.estadoGestion !== 'En acopio temporal') return false;
    const dias = Math.floor((hoyMs - new Date(r.fechaGeneracion).getTime()) / (1000 * 60 * 60 * 24));
    return dias > 180;
  });

  // Métricas de RUA / Fichas
  const totalFichasGuardadas = fichasRecords.length;
  const completedFichas = fichasRecords.filter(f => f.estado === 'completada').length;
  const progressPercent = totalFichasGuardadas > 0 
    ? Math.round((completedFichas / totalFichasGuardadas) * 100) 
    : 0;

  const pendingDocs = documentos.filter(d => d.estadoValidacion === 'Pendiente de revisión').length;
  const approvedDocs = documentos.filter(d => d.estadoValidacion === 'Aprobado').length;

  return (
    <div className="space-y-6">
      {/* Aviso de Alcance del Producto */}
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-start gap-3 shadow-sm">
        <Layers className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-emerald-950 mb-0.5">
            Plataforma de Gestión y Trazabilidad de Residuos — Nativa Ambiental
          </span>
          Herramienta operativa para registrar la bitácora de generación, entregas a gestores autorizados con manifiesto y organizar la información documental requerida para informes de gestión y reportes RUA en Colombia.
        </div>
      </div>

      {/* Alerta de Acopio Temporal si aplica */}
      {respelEnAcopioCritico.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block text-amber-950 mb-0.5">
              Atención Normativa: {respelEnAcopioCritico.length} lote(s) RESPEL con almacenamiento prolongado
            </span>
            De acuerdo con el Decreto 1076 de 2015, los residuos peligrosos no deben permanecer en acopio temporal más de 12 meses antes de su entrega a gestor autorizado.
          </div>
          <button
            onClick={() => onNavigateToModule('bitacora_residuos')}
            className="px-2.5 py-1 text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 rounded transition-colors"
          >
            Ver Bitácora
          </button>
        </div>
      )}

      {/* Estado si no hay empresas registradas */}
      {empresas.length === 0 && (
        <div className="p-8 rounded-xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">
              No hay empresas registradas en el sistema
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Comience registrando su empresa para habilitar la bitácora de residuos, gestión de sedes y vinculación de gestores ambientales autorizados.
            </p>
          </div>
          <button
            onClick={() => onNavigateToModule('empresas')}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Primera Empresa</span>
          </button>
        </div>
      )}

      {/* KPI Cards Principales: Centrados en Trazabilidad de Residuos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Generación Total */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Generación Total Registrada
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
              {totalGeneradoKg.toLocaleString('es-CO')} <span className="text-xs font-normal text-slate-500">kg</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {(totalGeneradoKg / 1000).toFixed(2)} toneladas en {empresaResiduos.length} registro(s)
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Tasa de Aprovechamiento */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tasa de Aprovechamiento
            </div>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1 tabular-nums">
              {tasaAprovechamiento}%
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {aprovechadosKg.toLocaleString('es-CO')} kg valorizados / reciclados
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
            <Recycle className="w-6 h-6" />
          </div>
        </div>

        {/* Saldo en Acopio Temporal */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              En Acopio Temporal
            </div>
            <div className="text-2xl font-extrabold text-amber-700 mt-1 tabular-nums">
              {totalEnAcopioKg.toLocaleString('es-CO')} <span className="text-xs font-normal text-slate-500">kg</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Saldo en almacenamiento en sede
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Residuos Peligrosos y Categoría */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Peligrosos (RESPEL)
            </div>
            <div className="text-2xl font-extrabold text-red-700 mt-1 tabular-nums">
              {totalRespelKg.toLocaleString('es-CO')} <span className="text-xs font-normal text-slate-500">kg</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 truncate" title={categoriaRespelLabel}>
              {categoriaRespelLabel}
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-700">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sección Destacada: Acceso a Bitácora y Operaciones Rápidas */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-sm">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Bitácora de Operaciones y Movimientos de Residuos
              </h2>
              <p className="text-xs text-slate-500">
                Registro de pesajes, salidas a gestores autorizados y trazabilidad de manifiestos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToModule('informes')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <BarChart3 className="w-4 h-4 text-slate-600" />
              <span>Ver Informes y Balance</span>
            </button>

            <button
              onClick={() => onNavigateToModule('bitacora_residuos')}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Abrir Bitácora Completa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resumen de Últimos Movimientos en Bitácora */}
        {empresaResiduos.length > 0 ? (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-600 mb-2">
              Últimos movimientos registrados ({Math.min(empresaResiduos.length, 4)} de {empresaResiduos.length}):
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {empresaResiduos.slice(0, 4).map(res => (
                <div
                  key={res.id}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs hover:border-slate-200 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-slate-900 truncate">{res.nombreResiduo}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {res.fechaGeneracion} · {res.areaOrigen || 'Planta'} · {res.peligrosidad}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-extrabold text-slate-900 tabular-nums">
                      {Number(res.cantidadGeneradaKg).toLocaleString('es-CO')} kg
                    </div>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mt-0.5 ${
                      res.estadoGestion === 'Entregado a gestor'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {res.estadoGestion}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500 space-y-2">
            <p className="font-medium text-slate-700">No hay movimientos de residuos registrados aún</p>
            <p className="text-slate-400 max-w-md mx-auto">
              Empiece registrando la generación diaria o mensual de residuos en su bitácora operativa.
            </p>
            <button
              onClick={() => onNavigateToModule('bitacora_residuos')}
              className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar primer residuo</span>
            </button>
          </div>
        )}
      </div>

      {/* Módulo de Preparación para Reportes RUA (No obligatorio para el día a día) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Preparación para Reporte Ambiental / RUA Colombia
              </h3>
              <p className="text-xs text-slate-500">
                Consolida la información de la bitácora cuando corresponda reportar a la autoridad ambiental.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToFichas()}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>Ver Módulo de Preparación RUA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {activePeriodo ? (
          <div className="p-4 bg-slate-50 rounded-lg text-xs space-y-2 border border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-slate-900">
                Vigencia de Balance Activa: {activePeriodo.anio} — {activeEstablecimiento?.nombre || 'Sede principal'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {activePeriodo.estado}
              </span>
            </div>
            <p className="text-slate-500">
              Los datos acumulados de generación y entrega a gestores en la bitácora pueden vincularse como fuente documental para el balance de masa oficial.
            </p>
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic">
            Sin período de balance ambiental activo seleccionado. Puede configurarlo en el módulo de Períodos de Balance.
          </div>
        )}
      </div>

      {/* Expediente de Soportes Documentales */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Soportes y Manifiestos Documentales ({documentos.length})
            </h3>
            <p className="text-xs text-slate-500">
              Manifiestos de transporte, actas de aprovechamiento y certificados de disposición final.
            </p>
          </div>
          <button
            onClick={() => onNavigateToModule('documentos')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Administrar soportes →
          </button>
        </div>

        {documentos.length > 0 ? (
          <div className="space-y-2">
            {documentos.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">{doc.nombre}</div>
                    <div className="text-[11px] text-slate-400">
                      {doc.tipoDocumento} · {doc.tamano} · {doc.fechaEmision}
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                  doc.estadoValidacion === 'Aprobado'
                    ? 'bg-emerald-100 text-emerald-800'
                    : doc.estadoValidacion === 'Requiere subsanación'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {doc.estadoValidacion}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
            No se han cargado documentos de soporte aún. Puede adjuntar manifiestos o certificados en el módulo de Documentos.
          </div>
        )}
      </div>
    </div>
  );
};
