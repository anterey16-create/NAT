import React, { useState } from 'react';
import { 
  RegistroResiduo, 
  GestorAmbiental, 
  Establecimiento, 
  Empresa, 
  PeriodoBalance, 
  DocumentoSoporte,
  UserRole
} from '../../types';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  Building2, 
  Scale, 
  Flame, 
  Recycle, 
  FileCheck,
  AlertCircle,
  HelpCircle,
  Printer
} from 'lucide-react';

interface WasteReportsViewProps {
  userRole: UserRole;
  residuos: RegistroResiduo[];
  gestores: GestorAmbiental[];
  establecimientos: Establecimiento[];
  activeEmpresa: Empresa | undefined;
  activePeriodo: PeriodoBalance | undefined;
  documentos: DocumentoSoporte[];
  onNavigateToModule?: (mod: any) => void;
}

export const WasteReportsView: React.FC<WasteReportsViewProps> = ({
  userRole,
  residuos,
  gestores,
  establecimientos,
  activeEmpresa,
  activePeriodo,
  documentos,
  onNavigateToModule
}) => {
  const [selectedEstablecimientoId, setSelectedEstablecimientoId] = useState<string>('all');
  const [filterAnio, setFilterAnio] = useState<string>('all');

  // Filtrar residuos de la empresa activa
  const empresaResiduos = activeEmpresa
    ? residuos.filter(r => r.empresaId === activeEmpresa.id)
    : residuos;

  // Filtrar por sede y año si se selecciona
  const filteredResiduos = empresaResiduos.filter(r => {
    const matchEst = selectedEstablecimientoId === 'all' || r.establecimientoId === selectedEstablecimientoId;
    const matchAnio = filterAnio === 'all' || (r.fechaGeneracion && r.fechaGeneracion.startsWith(filterAnio));
    return matchEst && matchAnio;
  });

  // Cálculos de Balance de Masa
  const totalGeneradoKg = filteredResiduos.reduce((acc, r) => acc + (Number(r.cantidadGeneradaKg) || 0), 0);
  const totalEntregadoKg = filteredResiduos
    .filter(r => r.estadoGestion === 'Entregado a gestor')
    .reduce((acc, r) => acc + (Number(r.cantidadEntregadaKg || r.cantidadGeneradaKg) || 0), 0);
  const totalEnAcopioKg = filteredResiduos
    .filter(r => r.estadoGestion === 'En acopio temporal')
    .reduce((acc, r) => acc + (Number(r.cantidadGeneradaKg) || 0), 0);

  // Residuos Peligrosos (RESPEL)
  const respelResiduos = filteredResiduos.filter(r => r.peligrosidad === 'Peligroso (RESPEL)');
  const totalRespelKg = respelResiduos.reduce((acc, r) => acc + (Number(r.cantidadGeneradaKg) || 0), 0);

  // Residuos No Peligrosos y Aprovechables
  const aprovechadosKg = filteredResiduos
    .filter(r => r.tipoTratamiento === 'Aprovechamiento / Reciclaje' || r.tipoTratamiento === 'Compostaje / Biotransformación')
    .reduce((acc, r) => acc + (Number(r.cantidadEntregadaKg || r.cantidadGeneradaKg) || 0), 0);

  const dispuestosKg = filteredResiduos
    .filter(r => r.tipoTratamiento === 'Disposición final (Relleno Sanitario)' || r.tipoTratamiento === 'Celda de seguridad')
    .reduce((acc, r) => acc + (Number(r.cantidadEntregadaKg || r.cantidadGeneradaKg) || 0), 0);

  const valorizacionRate = totalGeneradoKg > 0 ? Math.round((aprovechadosKg / totalGeneradoKg) * 100) : 0;

  // Clasificación de Generador RESPEL según Decreto 1076 de 2015 (Título 2, Capítulo 2, Sección 2)
  // Medias móviles mensuales:
  // - Microgenerador: < 10 kg/mes
  // - Pequeño generador: 10 a 100 kg/mes
  // - Mediano generador: 100 a 1.000 kg/mes
  // - Gran generador: >= 1.000 kg/mes
  // Calculamos la media mensual considerando los meses transcurridos o 12 meses
  const promedioMensualRespelKg = Math.round((totalRespelKg / 12) * 10) / 10;

  let clasificacionRespel = {
    categoria: 'Microgenerador',
    rango: 'Menos de 10 kg/mes',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    descripcion: 'Generación mínima. No está obligado a registro RUA ante la autoridad, pero debe conservar bitácora de entrega y soporte de disposición.',
    obligadoRua: false
  };

  if (promedioMensualRespelKg >= 1000) {
    clasificacionRespel = {
      categoria: 'Gran Generador de RESPEL',
      rango: 'Más de 1.000 kg/mes (≥ 12 ton/año)',
      color: 'bg-red-100 text-red-900 border-red-300',
      descripcion: 'Obligado a registrarse en el RUA ante la autoridad ambiental competente, formular e implementar Plan de Gestión Integral de RESPEL (PGIRESPEL) y tramitar el reporte anual.',
      obligadoRua: true
    };
  } else if (promedioMensualRespelKg >= 100) {
    clasificacionRespel = {
      categoria: 'Mediano Generador de RESPEL',
      rango: 'Entre 100 kg/mes y 1.000 kg/mes',
      color: 'bg-amber-100 text-amber-900 border-amber-300',
      descripcion: 'Obligado a registro en el aplicativo RUA de la autoridad ambiental, Plan de Gestión Integral de RESPEL y reporte anual.',
      obligadoRua: true
    };
  } else if (promedioMensualRespelKg >= 10) {
    clasificacionRespel = {
      categoria: 'Pequeño Generador de RESPEL',
      rango: 'Entre 10 kg/mes y 100 kg/mes',
      color: 'bg-blue-100 text-blue-900 border-blue-300',
      descripcion: 'Debe contar con plan interno y conservar manifiestos. Inscripción en RUA según requerimiento específico de la autoridad regional.',
      obligadoRua: false
    };
  }

  // Datos para Gráfico de Tratamientos (PieChart)
  const tratamientosMap: Record<string, number> = {};
  filteredResiduos.forEach(r => {
    const trat = r.tipoTratamiento || (r.estadoGestion === 'En acopio temporal' ? 'En acopio temporal' : 'Sin clasificar');
    tratamientosMap[trat] = (tratamientosMap[trat] || 0) + (Number(r.cantidadEntregadaKg || r.cantidadGeneradaKg) || 0);
  });

  const COLORES_TRATAMIENTOS: Record<string, string> = {
    'Aprovechamiento / Reciclaje': '#059669',
    'Compostaje / Biotransformación': '#10b981',
    'Coprocesamiento': '#0284c7',
    'Tratamiento térmico / Incineración': '#f97316',
    'Tratamiento físico-químico': '#8b5cf6',
    'Celda de seguridad': '#64748b',
    'Disposición final (Relleno Sanitario)': '#475569',
    'En acopio temporal': '#f59e0b',
    'Sin clasificar': '#94a3b8'
  };

  const pieTratamientosData = Object.entries(tratamientosMap)
    .filter(([_, val]) => val > 0)
    .map(([name, value]) => ({
      name,
      value: Math.round(value),
      color: COLORES_TRATAMIENTOS[name] || '#64748b'
    }));

  // Datos para Gráfico de Peligrosidad
  const peligrosidadMap: Record<string, number> = {};
  filteredResiduos.forEach(r => {
    peligrosidadMap[r.peligrosidad] = (peligrosidadMap[r.peligrosidad] || 0) + (Number(r.cantidadGeneradaKg) || 0);
  });

  const piePeligrosidadData = Object.entries(peligrosidadMap)
    .filter(([_, val]) => val > 0)
    .map(([name, value]) => ({
      name,
      value: Math.round(value),
      color: name === 'Peligroso (RESPEL)' ? '#dc2626' : name === 'RCD' ? '#d97706' : '#059669'
    }));

  // Auditoría de Consistencia y Preparación RUA
  const entregasSinSoporte = filteredResiduos.filter(
    r => r.estadoGestion === 'Entregado a gestor' && !r.numeroCertificadoDisposicion && !r.documentoSoporteId
  );
  const entregasSinManifiesto = filteredResiduos.filter(
    r => r.estadoGestion === 'Entregado a gestor' && !r.numeroManifiesto
  );
  const hoyMs = new Date().getTime();
  const respelVencidosAcopio = filteredResiduos.filter(r => {
    if (r.peligrosidad !== 'Peligroso (RESPEL)' || r.estadoGestion !== 'En acopio temporal') return false;
    const dias = Math.floor((hoyMs - new Date(r.fechaGeneracion).getTime()) / (1000 * 60 * 60 * 24));
    return dias > 365;
  });

  // Agrupación por Corriente RESPEL / Residuo para la Matriz de Balance
  const matrizConsolidada = React.useMemo(() => {
    const mapa: Record<string, {
      nombre: string;
      peligrosidad: string;
      corriente: string;
      totalGenerado: number;
      totalEntregado: number;
      saldoAcopio: number;
      tratamientos: Set<string>;
      gestores: Set<string>;
    }> = {};

    filteredResiduos.forEach(r => {
      const key = `${r.nombreResiduo}__${r.corrienteRespel || 'SIN_CORRIENTE'}`;
      if (!mapa[key]) {
        mapa[key] = {
          nombre: r.nombreResiduo,
          peligrosidad: r.peligrosidad,
          corriente: r.corrienteRespel || 'N/A',
          totalGenerado: 0,
          totalEntregado: 0,
          saldoAcopio: 0,
          tratamientos: new Set(),
          gestores: new Set()
        };
      }
      mapa[key].totalGenerado += Number(r.cantidadGeneradaKg) || 0;
      if (r.estadoGestion === 'Entregado a gestor') {
        mapa[key].totalEntregado += Number(r.cantidadEntregadaKg || r.cantidadGeneradaKg) || 0;
      } else {
        mapa[key].saldoAcopio += Number(r.cantidadGeneradaKg) || 0;
      }
      if (r.tipoTratamiento) mapa[key].tratamientos.add(r.tipoTratamiento);
      if (r.gestorNombre) mapa[key].gestores.add(r.gestorNombre);
    });

    return Object.values(mapa);
  }, [filteredResiduos]);

  // Exportar consolidado
  const handleExportConsolidado = () => {
    if (matrizConsolidada.length === 0) {
      alert('No hay información para exportar.');
      return;
    }

    const headers = [
      'Nombre Residuo',
      'Clasificación',
      'Corriente RESPEL (Dec 1076/2015)',
      'Total Generado (kg)',
      'Total Entregado a Gestor (kg)',
      'Saldo en Acopio Temporal (kg)',
      'Tratamientos Aplicados',
      'Gestores Receptores'
    ];

    const rows = matrizConsolidada.map(m => [
      `"${m.nombre.replace(/"/g, '""')}"`,
      `"${m.peligrosidad}"`,
      `"${m.corriente}"`,
      m.totalGenerado,
      m.totalEntregado,
      m.saldoAcopio,
      `"${Array.from(m.tratamientos).join('; ')}"`,
      `"${Array.from(m.gestores).join('; ')}"`
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const fecha = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `informe_consolidado_residuos_${activeEmpresa?.nit || 'nativa'}_${fecha}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Banner Superior con Filtros Contextuales */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Trazabilidad, Indicadores y Reportes
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Informes Operativos y Preparación RUA
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Empresa: <strong>{activeEmpresa?.razonSocial || 'Todas las empresas'}</strong> (NIT: {activeEmpresa?.nit || 'N/A'})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Selector de Sede */}
          <select
            value={selectedEstablecimientoId}
            onChange={(e) => setSelectedEstablecimientoId(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700"
          >
            <option value="all">Consolidado Todas las Sedes</option>
            {establecimientos.map(est => (
              <option key={est.id} value={est.id}>{est.nombre}</option>
            ))}
          </select>

          {/* Selector de Año */}
          <select
            value={filterAnio}
            onChange={(e) => setFilterAnio(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700"
          >
            <option value="all">Todos los años</option>
            <option value="2025">Año 2025</option>
            <option value="2024">Año 2024</option>
            <option value="2023">Año 2023</option>
          </select>

          <button
            onClick={handleExportConsolidado}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Balance</span>
          </button>
        </div>
      </div>

      {/* Tarjeta de Clasificación Normativa RESPEL - Decreto 1076 de 2015 */}
      <div className={`p-5 rounded-xl border ${clasificacionRespel.color} shadow-sm space-y-3`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-current shrink-0" />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80">
                Clasificación de Generador RESPEL — Decreto 1076 de 2015
              </span>
              <h3 className="text-base font-extrabold tracking-tight">
                {clasificacionRespel.categoria}
              </h3>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold font-mono">
              Promedio: {promedioMensualRespelKg.toLocaleString('es-CO')} kg/mes
            </div>
            <div className="text-[10px] opacity-75">{clasificacionRespel.rango}</div>
          </div>
        </div>

        <p className="text-xs leading-relaxed opacity-90">
          {clasificacionRespel.descripcion}
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-current/20 text-[11px] font-medium">
          <span>Total RESPEL registrado: <strong>{totalRespelKg.toLocaleString('es-CO')} kg</strong></span>
          <span>·</span>
          <span>Obligación de reporte anual RUA: <strong>{clasificacionRespel.obligadoRua ? 'SÍ (Exigible)' : 'Exento por volumen'}</strong></span>
        </div>
      </div>

      {/* KPI Cards de Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Generación Anual Consolidada</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {(totalGeneradoKg / 1000).toFixed(2)} <span className="text-xs font-normal text-slate-500">ton</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {totalGeneradoKg.toLocaleString('es-CO')} kg netos
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Tasa de Aprovechamiento</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1 tabular-nums">
            {valorizacionRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {aprovechadosKg.toLocaleString('es-CO')} kg reciclados o compostados
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Saldo en Acopio Temporal</div>
          <div className="text-2xl font-extrabold text-amber-700 mt-1 tabular-nums">
            {totalEnAcopioKg.toLocaleString('es-CO')} <span className="text-xs font-normal text-slate-500">kg</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Pendiente de entrega a gestor
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Disposición en Relleno / Celda</div>
          <div className="text-2xl font-extrabold text-slate-700 mt-1 tabular-nums">
            {dispuestosKg.toLocaleString('es-CO')} <span className="text-xs font-normal text-slate-500">kg</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {totalGeneradoKg > 0 ? Math.round((dispuestosKg / totalGeneradoKg) * 100) : 0}% con destino a relleno
          </div>
        </div>
      </div>

      {/* Gráficos Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Destino / Tratamiento */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Distribución por Tratamiento y Destino (kg)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {pieTratamientosData.length} categorías
            </span>
          </div>

          {pieTratamientosData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieTratamientosData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {pieTratamientosData.map((entry, index) => (
                      <Cell key={`cell-t-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: any) => [`${Number(val).toLocaleString('es-CO')} kg`, 'Cantidad']}
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
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
              No hay registros de residuos para graficar tratamientos.
            </div>
          )}
        </div>

        {/* Gráfico 2: Peligrosidad */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Composición por Peligrosidad (kg)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Peligrosos vs Ordinarios
            </span>
          </div>

          {piePeligrosidadData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={piePeligrosidadData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {piePeligrosidadData.map((entry, index) => (
                      <Cell key={`cell-p-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: any) => [`${Number(val).toLocaleString('es-CO')} kg`, 'Cantidad']}
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
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
              No hay registros para graficar composición.
            </div>
          )}
        </div>
      </div>

      {/* Auditoría de Consistencia para Preparación RUA */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Verificación de Consistencia Técnica y Soporte Legal</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Identificación de vacíos de información antes del cierre anual de balance o informe oficial.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Item 1: Certificados de Disposición */}
          <div className={`p-4 rounded-xl border ${
            entregasSinSoporte.length === 0 ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="font-bold flex items-center gap-2">
              {entregasSinSoporte.length === 0 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-700" />
              )}
              <span>Certificados de Disposición / Actas</span>
            </div>
            <p className="mt-1 text-[11px] opacity-85">
              {entregasSinSoporte.length === 0 
                ? 'Todas las entregas cuentan con número de certificado o documento soporte vinculado.'
                : `${entregasSinSoporte.length} entrega(s) sin número de certificado de disposición final registrado.`}
            </p>
          </div>

          {/* Item 2: Manifiestos de Carga */}
          <div className={`p-4 rounded-xl border ${
            entregasSinManifiesto.length === 0 ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="font-bold flex items-center gap-2">
              {entregasSinManifiesto.length === 0 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-700" />
              )}
              <span>Manifiestos de Transporte / Carga</span>
            </div>
            <p className="mt-1 text-[11px] opacity-85">
              {entregasSinManifiesto.length === 0 
                ? 'Todos los despachos cuentan con número de remisión o manifiesto de carga.'
                : `${entregasSinManifiesto.length} despacho(s) sin número de manifiesto asignado.`}
            </p>
          </div>

          {/* Item 3: Alertas de Tiempo de Acopio */}
          <div className={`p-4 rounded-xl border ${
            respelVencidosAcopio.length === 0 ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            <div className="font-bold flex items-center gap-2">
              {respelVencidosAcopio.length === 0 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-700" />
              )}
              <span>Límite de Acopio (12 Meses - Dec 1076)</span>
            </div>
            <p className="mt-1 text-[11px] opacity-85">
              {respelVencidosAcopio.length === 0 
                ? 'No existen lotes RESPEL que superen el año en almacenamiento temporal.'
                : `¡ALERTA! ${respelVencidosAcopio.length} lote(s) RESPEL superan 1 año en bodega sin entrega.`}
            </p>
          </div>
        </div>
      </div>

      {/* Matriz Consolidada de Balance de Residuos */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Matriz Consolidada de Balance de Residuos
            </h3>
            <p className="text-xs text-slate-500">
              Consolidación acumulada por corriente y tipo de residuo para reporte anual.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700">
            {matrizConsolidada.length} corrientes registradas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Residuo</th>
                <th className="py-3 px-4">Clasificación & Corriente</th>
                <th className="py-3 px-4 text-right">Generado (kg)</th>
                <th className="py-3 px-4 text-right">Entregado (kg)</th>
                <th className="py-3 px-4 text-right">En Acopio (kg)</th>
                <th className="py-3 px-4">Tratamiento(s)</th>
                <th className="py-3 px-4">Gestor(es)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrizConsolidada.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {item.nombre}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.peligrosidad === 'Peligroso (RESPEL)'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.peligrosidad}
                    </span>
                    {item.corriente !== 'N/A' && (
                      <span className="ml-1.5 font-mono text-[10px] font-bold text-slate-600">
                        {item.corriente}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                    {item.totalGenerado.toLocaleString('es-CO')}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-blue-700 tabular-nums">
                    {item.totalEntregado.toLocaleString('es-CO')}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-amber-700 tabular-nums">
                    {item.saldoAcopio.toLocaleString('es-CO')}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {Array.from(item.tratamientos).join(', ') || 'Pendiente de entrega'}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate" title={Array.from(item.gestores).join(', ')}>
                    {Array.from(item.gestores).join(', ') || 'N/A'}
                  </td>
                </tr>
              ))}

              {matrizConsolidada.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No se han registrado residuos con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
