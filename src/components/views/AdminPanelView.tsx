import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  CalendarRange, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  ShieldAlert, 
  Users, 
  PieChart as PieChartIcon,
  Layers,
  Truck,
  Package,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  Empresa, 
  Establecimiento, 
  PeriodoBalance, 
  DocumentoSoporte, 
  RegistroResiduo,
  GestorAmbiental,
  NavigationModule 
} from '../../types';

interface AdminPanelViewProps {
  empresas: Empresa[];
  establecimientos: Establecimiento[];
  periodos: PeriodoBalance[];
  documentos: DocumentoSoporte[];
  residuos?: RegistroResiduo[];
  gestores?: GestorAmbiental[];
  onSelectEmpresaId: (id: string) => void;
  onSelectPeriodoId: (id: string) => void;
  onNavigateToModule: (module: NavigationModule) => void;
  onUpdateDocumentStatus: (docId: string, status: 'Pendiente de revisión' | 'Aprobado' | 'Requiere subsanación') => void;
  onUpdateResiduo?: (r: RegistroResiduo) => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  empresas,
  establecimientos,
  periodos,
  documentos,
  residuos = [],
  gestores = [],
  onSelectEmpresaId,
  onSelectPeriodoId,
  onNavigateToModule,
  onUpdateDocumentStatus,
  onUpdateResiduo
}) => {
  const [filterEmpresaId, setFilterEmpresaId] = useState<string>('all');
  const [filterInconsistencias, setFilterInconsistencias] = useState<boolean>(false);
  const [editingObservationId, setEditingObservationId] = useState<string | null>(null);
  const [tempObservation, setTempObservation] = useState<string>('');

  const pendingDocs = documentos.filter(d => d.estadoValidacion === 'Pendiente de revisión');
  const approvedDocs = documentos.filter(d => d.estadoValidacion === 'Aprobado');

  // Métricas globales de residuos
  const totalResiduosKg = residuos.reduce((acc, r) => acc + (Number(r.cantidadGeneradaKg) || 0), 0);
  const totalRespelKg = residuos
    .filter(r => r.peligrosidad === 'Peligroso (RESPEL)')
    .reduce((acc, r) => acc + (Number(r.cantidadGeneradaKg) || 0), 0);

  // Detección de inconsistencias en registros de residuos
  const hoyMs = new Date().getTime();
  const residuosConInconsistencia = residuos.filter(r => {
    // 1. Entregado sin manifiesto o sin certificado
    if (r.estadoGestion === 'Entregado a gestor' && (!r.numeroManifiesto || !r.numeroCertificadoDisposicion)) return true;
    // 2. RESPEL en acopio con más de 180 días
    if (r.peligrosidad === 'Peligroso (RESPEL)' && r.estadoGestion === 'En acopio temporal') {
      const dias = Math.floor((hoyMs - new Date(r.fechaGeneracion).getTime()) / (1000 * 60 * 60 * 24));
      if (dias > 180) return true;
    }
    // 3. Marcado como requiere corrección
    if (r.estadoRevision === 'Requiere corrección') return true;
    return false;
  });

  // Filtrado de residuos para la tabla de auditoría
  const filteredResiduos = residuos.filter(r => {
    const matchEmp = filterEmpresaId === 'all' || r.empresaId === filterEmpresaId;
    if (!matchEmp) return false;
    if (filterInconsistencias) {
      return residuosConInconsistencia.some(inc => inc.id === r.id);
    }
    return true;
  });

  // Datos para el gráfico circular agrupados por estado de diligenciamiento de períodos
  const chartData = [
    { 
      name: 'Listo para cargue', 
      estadoKey: 'Listo para cargue',
      value: periodos.filter(p => p.estado === 'Listo para cargue').length,
      color: '#059669'
    },
    { 
      name: 'En revisión técnica', 
      estadoKey: 'En revisión técnica',
      value: periodos.filter(p => p.estado === 'En revisión técnica').length,
      color: '#2563eb'
    },
    { 
      name: 'En diligenciamiento', 
      estadoKey: 'En diligenciamiento',
      value: periodos.filter(p => p.estado === 'En diligenciamiento').length,
      color: '#d97706'
    },
    { 
      name: 'Borrador / Inicial', 
      estadoKey: 'Borrador',
      value: periodos.filter(p => p.estado === 'Borrador').length,
      color: '#64748b'
    }
  ];

  const activeChartData = chartData.filter(d => d.value > 0);
  const safeChartData = activeChartData.length > 0 ? activeChartData : [
    { name: 'Sin períodos registrados', estadoKey: 'Vacio', value: 1, color: '#cbd5e1' }
  ];

  const handleSaveObservation = (residuo: RegistroResiduo, nuevoEstado?: 'Borrador' | 'Registrado' | 'Validado' | 'Requiere corrección') => {
    if (onUpdateResiduo) {
      onUpdateResiduo({
        ...residuo,
        observacionesAdmin: tempObservation,
        estadoRevision: nuevoEstado || residuo.estadoRevision || 'Validado'
      });
    }
    setEditingObservationId(null);
    setTempObservation('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Consola del Administrador y Auditor Ambiental
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Supervisión Global de Residuos y Empresas
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Auditoría de registros de residuos, identificación de inconsistencias, revisión documental y catálogos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateToModule('gestores_catalogos')}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Catálogos & Gestores ({gestores.length})</span>
          </button>
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold font-mono">
            {empresas.length} Empresas · {establecimientos.length} Sedes
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Empresas en Custodia</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">{empresas.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">{establecimientos.length} sedes registradas</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Volumen Total Auditado</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {(totalResiduosKg / 1000).toFixed(1)} <span className="text-xs font-normal text-slate-500">ton</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{residuos.length} registros en bitácoras</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Inconsistencias Detectadas</div>
          <div className="text-2xl font-extrabold text-amber-700 mt-1 tabular-nums">
            {residuosConInconsistencia.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Registros pendientes de subsanar</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Soportes por Auditar</div>
          <div className="text-2xl font-extrabold text-blue-700 mt-1 tabular-nums">
            {pendingDocs.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{approvedDocs.length} ya aprobados</div>
        </div>
      </div>

      {/* Módulo de Auditoría de Registros de Residuos (Supervisión e Inconsistencias) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Auditoría de Bitácoras de Residuos de Empresas Clientes</span>
            </h3>
            <p className="text-xs text-slate-500">
              Revise las cargas de residuos, identifique faltantes de manifiesto y deje observaciones técnicas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterEmpresaId}
              onChange={(e) => setFilterEmpresaId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700"
            >
              <option value="all">Todas las empresas ({empresas.length})</option>
              {empresas.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.razonSocial}</option>
              ))}
            </select>

            <button
              onClick={() => setFilterInconsistencias(!filterInconsistencias)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                filterInconsistencias
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Solo con inconsistencias ({residuosConInconsistencia.length})</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Empresa / Sede</th>
                <th className="py-3 px-3">Fecha & Residuo</th>
                <th className="py-3 px-3">Peligrosidad</th>
                <th className="py-3 px-3 text-right">Cantidad (kg)</th>
                <th className="py-3 px-3">Estado & Gestor</th>
                <th className="py-3 px-3">Manifiesto / Certificado</th>
                <th className="py-3 px-3">Auditoría / Observación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResiduos.map(r => {
                const emp = empresas.find(e => e.id === r.empresaId);
                const est = establecimientos.find(e => e.id === r.establecimientoId);
                const faltaManifiesto = r.estadoGestion === 'Entregado a gestor' && !r.numeroManifiesto;
                const faltaCertificado = r.estadoGestion === 'Entregado a gestor' && !r.numeroCertificadoDisposicion;
                const diasAcopio = Math.floor((hoyMs - new Date(r.fechaGeneracion).getTime()) / (1000 * 60 * 60 * 24));
                const acopioLargo = r.peligrosidad === 'Peligroso (RESPEL)' && r.estadoGestion === 'En acopio temporal' && diasAcopio > 180;

                return (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Empresa y Sede */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 truncate max-w-[150px]">{emp?.razonSocial || 'Empresa'}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{est?.nombre}</div>
                    </td>

                    {/* Fecha y Residuo */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{r.nombreResiduo}</div>
                      <div className="text-[11px] text-slate-400">{r.fechaGeneracion} · {r.corrienteRespel || 'N/A'}</div>
                    </td>

                    {/* Peligrosidad */}
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.peligrosidad === 'Peligroso (RESPEL)'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {r.peligrosidad}
                      </span>
                    </td>

                    {/* Cantidad */}
                    <td className="py-3 px-3 text-right font-bold text-slate-900 tabular-nums">
                      {Number(r.cantidadGeneradaKg).toLocaleString('es-CO')}
                    </td>

                    {/* Estado & Gestor */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{r.estadoGestion}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[140px]">{r.gestorNombre || 'N/A'}</div>
                      {acopioLargo && (
                        <span className="inline-block mt-0.5 text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 rounded">
                          Acopio: {diasAcopio} días
                        </span>
                      )}
                    </td>

                    {/* Manifiesto / Certificado */}
                    <td className="py-3 px-3">
                      {r.estadoGestion === 'Entregado a gestor' ? (
                        <div className="space-y-0.5 text-[11px]">
                          <div>
                            {r.numeroManifiesto ? (
                              <span className="text-emerald-700 font-mono">Manif: {r.numeroManifiesto}</span>
                            ) : (
                              <span className="text-red-600 font-bold flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Falta manifiesto
                              </span>
                            )}
                          </div>
                          <div>
                            {r.numeroCertificadoDisposicion ? (
                              <span className="text-emerald-700 font-mono">Cert: {r.numeroCertificadoDisposicion}</span>
                            ) : (
                              <span className="text-amber-600 font-bold flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Falta certificado
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">En almacén de sede</span>
                      )}
                    </td>

                    {/* Auditoría / Dejar Observaciones */}
                    <td className="py-3 px-3">
                      {editingObservationId === r.id ? (
                        <div className="space-y-1.5 min-w-[200px]">
                          <textarea
                            rows={2}
                            value={tempObservation}
                            onChange={(e) => setTempObservation(e.target.value)}
                            placeholder="Ingrese observación técnica o solicitud de corrección..."
                            className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          />
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleSaveObservation(r, 'Validado')}
                              className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[10px] font-bold hover:bg-emerald-800"
                            >
                              Validar
                            </button>
                            <button
                              onClick={() => handleSaveObservation(r, 'Requiere corrección')}
                              className="px-2 py-0.5 bg-red-700 text-white rounded text-[10px] font-bold hover:bg-red-800"
                            >
                              Solicitar Corrección
                            </button>
                            <button
                              onClick={() => setEditingObservationId(null)}
                              className="px-1.5 py-0.5 text-slate-500 text-[10px]"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="max-w-[150px]">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              r.estadoRevision === 'Validado'
                                ? 'bg-emerald-100 text-emerald-800'
                                : r.estadoRevision === 'Requiere corrección'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {r.estadoRevision || 'Registrado'}
                            </span>
                            {r.observacionesAdmin && (
                              <div className="text-[10px] text-slate-600 truncate mt-0.5 italic" title={r.observacionesAdmin}>
                                "{r.observacionesAdmin}"
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setEditingObservationId(r.id);
                              setTempObservation(r.observacionesAdmin || '');
                            }}
                            className="p-1 rounded text-slate-500 hover:bg-slate-100"
                            title="Dejar observación o cambiar estado de auditoría"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredResiduos.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No se encontraron registros de residuos con los criterios seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráfico Circular de Progreso de Períodos de Balance */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-emerald-700" />
              <span>Estado Global de Diligenciamiento de Períodos de Balance</span>
            </h3>
            <p className="text-xs text-slate-500">
              Distribución de las vigencias anuales activas de las empresas en custodia.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700">
            {periodos.length} períodos totales
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
          <div className="lg:col-span-7 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={safeChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={50}
                  paddingAngle={3}
                >
                  {safeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any) => [`${value} período(s)`, name]}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-5 space-y-2.5">
            {chartData.map(item => (
              <div
                key={item.estadoKey}
                className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-800">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 tabular-nums">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Table of Companies */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Seguimiento de Empresas Clientes y Residuos Asociados
          </h3>
          <button
            onClick={() => onNavigateToModule('empresas')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Administrar empresas →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Empresa / Razón Social</th>
                <th className="py-3 px-4">Establecimientos</th>
                <th className="py-3 px-4 text-right">Residuos Generados</th>
                <th className="py-3 px-4 text-right">Saldo en Acopio</th>
                <th className="py-3 px-4">Período de Balance</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {empresas.map(emp => {
                const empEsts = establecimientos.filter(e => e.empresaId === emp.id);
                const empPeriodo = periodos.find(p => p.empresaId === emp.id);
                const empResiduos = residuos.filter(r => r.empresaId === emp.id);
                const empTotalKg = empResiduos.reduce((acc, r) => acc + (Number(r.cantidadGeneradaKg) || 0), 0);
                const empAcopioKg = empResiduos
                  .filter(r => r.estadoGestion === 'En acopio temporal')
                  .reduce((acc, r) => acc + (Number(r.cantidadGeneradaKg) || 0), 0);

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{emp.razonSocial}</div>
                      <div className="text-[11px] font-mono text-slate-500">NIT: {emp.nit} · {emp.ciudad}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {empEsts.length} sedes
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 tabular-nums">
                      {empTotalKg.toLocaleString('es-CO')} kg
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-amber-700 tabular-nums">
                      {empAcopioKg.toLocaleString('es-CO')} kg
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        empPeriodo?.estado === 'Listo para cargue'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {empPeriodo?.estado || 'Vigencia activa'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          onSelectEmpresaId(emp.id);
                          if (empPeriodo) onSelectPeriodoId(empPeriodo.id);
                          onNavigateToModule('bitacora_residuos');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                      >
                        Ver Bitácora
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Support Documents Audit Console */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Bandeja de Validación de Soportes Documentales
            </h3>
            <p className="text-xs text-slate-500">
              Certificados de disposición, manifiestos y actas que requieren verificación del auditor.
            </p>
          </div>
          <button
            onClick={() => onNavigateToModule('documentos')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Ver repositorio completo →
          </button>
        </div>

        <div className="space-y-3">
          {documentos.length > 0 ? (
            documentos.map(doc => (
              <div
                key={doc.id}
                className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <FileText className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">{doc.nombre}</div>
                    <div className="text-[11px] text-slate-500">
                      {doc.tipoDocumento} · Emisión: {doc.fechaEmision}
                    </div>
                    {doc.observaciones && (
                      <div className="text-[11px] text-slate-600 mt-0.5 italic">
                        "{doc.observaciones}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={doc.estadoValidacion}
                    onChange={(e) => onUpdateDocumentStatus(doc.id, e.target.value as any)}
                    className={`text-xs font-bold px-2 py-1 rounded border focus:outline-none ${
                      doc.estadoValidacion === 'Aprobado'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : doc.estadoValidacion === 'Requiere subsanación'
                        ? 'bg-red-50 text-red-800 border-red-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    <option value="Aprobado">Aprobado</option>
                    <option value="Pendiente de revisión">Pendiente</option>
                    <option value="Requiere subsanación">Requiere subsanación</option>
                  </select>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
              No hay soportes documentales registrados para auditar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
