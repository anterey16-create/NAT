import React from 'react';
import { 
  Building2, 
  MapPin, 
  CalendarRange, 
  FileSpreadsheet, 
  FileText, 
  ArrowRight, 
  Plus, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Clock,
  Layers,
  Truck,
  Package,
  Recycle,
  AlertTriangle,
  Scale,
  ClipboardList,
  BarChart3,
  ShieldCheck
} from 'lucide-react';
import { 
  Empresa, 
  Establecimiento, 
  PeriodoBalance, 
  DocumentoSoporte, 
  RegistroResiduo,
  GestorAmbiental,
  NavigationModule 
} from '../../types';

interface CompanyPanelViewProps {
  activeEmpresa: Empresa | undefined;
  establecimientos: Establecimiento[];
  periodos: PeriodoBalance[];
  documentos: DocumentoSoporte[];
  residuos?: RegistroResiduo[];
  gestores?: GestorAmbiental[];
  onNavigateToModule: (module: NavigationModule) => void;
  onSelectPeriodoId: (id: string) => void;
  onSelectFicha?: (fichaNum: number) => void;
}

export const CompanyPanelView: React.FC<CompanyPanelViewProps> = ({
  activeEmpresa,
  establecimientos,
  periodos,
  documentos,
  residuos = [],
  gestores = [],
  onNavigateToModule,
  onSelectPeriodoId
}) => {
  const companyEsts = establecimientos.filter(e => e.empresaId === activeEmpresa?.id);
  const companyPeriodos = periodos.filter(p => p.empresaId === activeEmpresa?.id);
  const companyDocs = documentos.filter(d => 
    companyPeriodos.some(p => p.id === d.periodoId) ||
    companyEsts.some(est => est.id === d.establecimientoId)
  );

  const companyResiduos = residuos.filter(r => r.empresaId === activeEmpresa?.id);

  // Métricas de residuos para la empresa
  const totalGeneradoKg = companyResiduos.reduce((acc, r) => acc + (Number(r.cantidadGeneradaKg) || 0), 0);
  const totalEnAcopioKg = companyResiduos
    .filter(r => r.estadoGestion === 'En acopio temporal')
    .reduce((acc, r) => acc + (Number(r.cantidadGeneradaKg) || 0), 0);
  const totalEntregadoKg = companyResiduos
    .filter(r => r.estadoGestion === 'Entregado a gestor')
    .reduce((acc, r) => acc + (Number(r.cantidadEntregadaKg || r.cantidadGeneradaKg) || 0), 0);

  const totalRespelKg = companyResiduos
    .filter(r => r.peligrosidad === 'Peligroso (RESPEL)')
    .reduce((acc, r) => acc + (Number(r.cantidadGeneradaKg) || 0), 0);

  const aprovechadosKg = companyResiduos
    .filter(r => r.tipoTratamiento === 'Aprovechamiento / Reciclaje' || r.tipoTratamiento === 'Compostaje / Biotransformación')
    .reduce((acc, r) => acc + (Number(r.cantidadEntregadaKg || r.cantidadGeneradaKg) || 0), 0);

  const tasaAprovechamiento = totalGeneradoKg > 0 ? Math.round((aprovechadosKg / totalGeneradoKg) * 100) : 0;

  // Clasificación de Generador RESPEL según Decreto 1076 de 2015
  const promedioMensualRespelKg = Math.round((totalRespelKg / 12) * 10) / 10;
  let categoriaRespel = 'Microgenerador (< 10 kg/mes)';
  if (promedioMensualRespelKg >= 1000) {
    categoriaRespel = 'Gran Generador (≥ 1.000 kg/mes)';
  } else if (promedioMensualRespelKg >= 100) {
    categoriaRespel = 'Mediano Generador (100 - 1.000 kg/mes)';
  } else if (promedioMensualRespelKg >= 10) {
    categoriaRespel = 'Pequeño Generador (10 - 100 kg/mes)';
  }

  // Alerta de acopio prolongado
  const hoyMs = new Date().getTime();
  const respelEnAcopioCritico = companyResiduos.filter(r => {
    if (r.peligrosidad !== 'Peligroso (RESPEL)' || r.estadoGestion !== 'En acopio temporal') return false;
    const dias = Math.floor((hoyMs - new Date(r.fechaGeneracion).getTime()) / (1000 * 60 * 60 * 24));
    return dias > 180;
  });

  return (
    <div className="space-y-6">
      {/* Company Header Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Espacio Operativo de la Empresa Generadora
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              {activeEmpresa?.razonSocial || 'Empresa Seleccionada'}
            </h2>
            <div className="text-xs text-slate-500 font-mono mt-1">
              NIT: {activeEmpresa?.nit} · CIIU: {activeEmpresa?.sectorCIIU || 'No especificado'} · Estado: {activeEmpresa?.estado || 'Activa'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToModule('bitacora_residuos')}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Registrar en Bitácora</span>
            </button>
            <button
              onClick={() => onNavigateToModule('informes')}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
            >
              <BarChart3 className="w-4 h-4 text-slate-600" />
              <span>Balance</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block text-[11px]">Representante Legal:</span>
            <span className="font-semibold text-slate-900">{activeEmpresa?.representanteLegal || 'No registrado'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Contacto Ambiental:</span>
            <span className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{activeEmpresa?.correoContacto || 'Sin correo registrado'}</span>
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Ubicación Matriz:</span>
            <span className="font-semibold text-slate-900">{activeEmpresa?.ciudad}, {activeEmpresa?.departamento}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards de Residuos de la Empresa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Generación Total de la Empresa</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {totalGeneradoKg.toLocaleString('es-CO')} <span className="text-xs font-normal text-slate-500">kg</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {(totalGeneradoKg / 1000).toFixed(2)} toneladas totales
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Tasa de Aprovechamiento / Reciclaje</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1 tabular-nums">
            {tasaAprovechamiento}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {aprovechadosKg.toLocaleString('es-CO')} kg valorizados
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Saldo en Bodega / Acopio</div>
          <div className="text-2xl font-extrabold text-amber-700 mt-1 tabular-nums">
            {totalEnAcopioKg.toLocaleString('es-CO')} <span className="text-xs font-normal text-slate-500">kg</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Pendiente de entrega a gestores
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Clasificación RESPEL (Dec. 1076)</div>
          <div className="text-sm font-extrabold text-red-800 mt-1 truncate" title={categoriaRespel}>
            {categoriaRespel}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            {totalRespelKg.toLocaleString('es-CO')} kg generados
          </div>
        </div>
      </div>

      {/* Alerta si hay residuos que exceden 6 meses */}
      {respelEnAcopioCritico.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              Tiene <strong>{respelEnAcopioCritico.length} lote(s)</strong> de residuos peligrosos en acopio temporal con más de 6 meses de almacenamiento. Planifique su despacho a gestor autorizado antes del límite legal de 12 meses.
            </span>
          </div>
          <button
            onClick={() => onNavigateToModule('bitacora_residuos')}
            className="px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 rounded-lg shrink-0"
          >
            Gestionar Despacho
          </button>
        </div>
      )}

      {/* Establishments for this Company */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Establecimientos y Sedes de la Empresa ({companyEsts.length})
            </h3>
            <p className="text-xs text-slate-500">
              Sedes físicas con código RUA asignado por la autoridad ambiental competente.
            </p>
          </div>
          <button
            onClick={() => onNavigateToModule('establecimientos')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ver o registrar sedes</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companyEsts.map(est => {
            const sedeResiduos = companyResiduos.filter(r => r.establecimientoId === est.id);
            const sedeKg = sedeResiduos.reduce((acc, r) => acc + (Number(r.cantidadGeneradaKg) || 0), 0);

            return (
              <div
                key={est.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-slate-900">{est.nombre}</div>
                  <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    {est.codigoEstablecimiento}
                  </span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  {est.municipio}, {est.departamento} · {est.direccion}
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                  <span className="text-slate-600"><strong>Generación:</strong> {sedeKg.toLocaleString('es-CO')} kg</span>
                  <span className="text-slate-500">{est.autoridadAmbiental?.split('-')[0]}</span>
                </div>
              </div>
            );
          })}

          {companyEsts.length === 0 && (
            <div className="col-span-full py-6 text-center text-slate-400 text-xs">
              No hay establecimientos asociados a esta empresa.
            </div>
          )}
        </div>
      </div>

      {/* Balance Periods & RUA for this Company */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Vigencias de Balance Ambiental y Preparación RUA ({companyPeriodos.length})
            </h3>
            <p className="text-xs text-slate-500">
              Períodos para consolidar balances de masa y exportar informes ambientales anuales.
            </p>
          </div>
          <button
            onClick={() => onNavigateToModule('periodos')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Gestionar períodos</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companyPeriodos.map(per => (
            <div
              key={per.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-extrabold font-mono text-slate-900">
                  Año {per.anio}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  per.estado === 'Listo para cargue'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {per.estado}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                <span>Límite: {per.fechaLimiteReporte}</span>
                <button
                  onClick={() => {
                    onSelectPeriodoId(per.id);
                    onNavigateToModule('informes');
                  }}
                  className="font-bold text-emerald-700 hover:text-emerald-800"
                >
                  Ver balance →
                </button>
              </div>
            </div>
          ))}

          {companyPeriodos.length === 0 && (
            <div className="col-span-full py-6 text-center text-slate-400 text-xs">
              No hay períodos de balance activos registrados para esta empresa.
            </div>
          )}
        </div>
      </div>

      {/* Supporting Documents for this Company */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Soportes y Manifiestos Documentales de la Empresa ({companyDocs.length})
            </h3>
            <p className="text-xs text-slate-500">
              Expediente de manifiestos de transporte, actas de entrega técnica y certificados de disposición final.
            </p>
          </div>
          <button
            onClick={() => onNavigateToModule('documentos')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Gestionar soportes →
          </button>
        </div>

        {companyDocs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {companyDocs.map(doc => (
              <div
                key={doc.id}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">{doc.nombre}</div>
                    <div className="text-[11px] text-slate-400">
                      {doc.tipoDocumento} · {doc.fechaEmision}
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
          <div className="py-6 text-center text-slate-400 text-xs">
            No hay soportes documentales adjuntados para esta empresa aún.
          </div>
        )}
      </div>
    </div>
  );
};
