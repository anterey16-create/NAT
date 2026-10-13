import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  RegistroResiduo, 
  GestorAmbiental, 
  CatalogoResiduo, 
  Establecimiento, 
  Empresa, 
  DocumentoSoporte, 
  UserRole,
  TipoPeligrosidad,
  SubcategoriaResiduo,
  TipoManejoTratamiento,
  EstadoGestionResiduo
} from '../../types';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  FileText, 
  Edit3, 
  Trash2, 
  X, 
  ShieldAlert, 
  Layers, 
  Building2,
  Calendar,
  Package,
  Info,
  ChevronDown,
  Check,
  AlertCircle
} from 'lucide-react';

interface WasteLogViewProps {
  userRole: UserRole;
  residuos: RegistroResiduo[];
  gestores: GestorAmbiental[];
  catalogoResiduos: CatalogoResiduo[];
  establecimientos: Establecimiento[];
  activeEmpresa: Empresa | undefined;
  activeEstablecimiento: Establecimiento | undefined;
  documentos: DocumentoSoporte[];
  onAddResiduo: (item: Omit<RegistroResiduo, 'id' | 'fechaCreacion'>) => void;
  onUpdateResiduo: (item: RegistroResiduo) => void;
  onDeleteResiduo: (id: string) => void;
  onNavigateToDocumentos?: () => void;
}

export const WasteLogView: React.FC<WasteLogViewProps> = ({
  userRole,
  residuos,
  gestores,
  catalogoResiduos,
  establecimientos,
  activeEmpresa,
  activeEstablecimiento,
  documentos,
  onAddResiduo,
  onUpdateResiduo,
  onDeleteResiduo
}) => {
  // Filtros de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstablecimiento, setFilterEstablecimiento] = useState<string>('all');
  const [filterPeligrosidad, setFilterPeligrosidad] = useState<string>('all');
  const [filterEstado, setFilterEstado] = useState<string>('all');

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResiduo, setEditingResiduo] = useState<RegistroResiduo | null>(null);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchTarget, setDispatchTarget] = useState<RegistroResiduo | null>(null);

  // Formulario de Generación
  const [formData, setFormData] = useState({
    establecimientoId: activeEstablecimiento?.id || establecimientos[0]?.id || '',
    fechaGeneracion: new Date().toISOString().split('T')[0],
    nombreResiduo: '',
    peligrosidad: 'No Peligroso' as TipoPeligrosidad,
    subcategoria: 'Aprovechable' as SubcategoriaResiduo,
    corrienteRespel: '',
    cantidadGeneradaKg: 0,
    areaOrigen: '',
    tipoEmbalaje: 'Bolsa / Contenedor',
    estadoGestion: 'En acopio temporal' as EstadoGestionResiduo,
    observacionesAdmin: ''
  });

  // Formulario de Despacho / Entrega a Gestor
  const [dispatchData, setDispatchData] = useState({
    fechaEntrega: new Date().toISOString().split('T')[0],
    gestorId: gestores[0]?.id || '',
    tipoTratamiento: 'Aprovechamiento / Reciclaje' as TipoManejoTratamiento,
    cantidadEntregadaKg: 0,
    numeroManifiesto: '',
    numeroCertificadoDisposicion: '',
    documentoSoporteId: ''
  });

  // Selector con búsqueda para Sede / Establecimiento
  const [establecimientoSearch, setEstablecimientoSearch] = useState('');
  const [isEstablecimientoDropdownOpen, setIsEstablecimientoDropdownOpen] = useState(false);
  const [establecimientoError, setEstablecimientoError] = useState('');
  const establecimientoDropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar desplegable de establecimiento al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        establecimientoDropdownRef.current &&
        !establecimientoDropdownRef.current.contains(event.target as Node)
      ) {
        setIsEstablecimientoDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Establecimientos existentes y disponibles para la empresa seleccionada (relación 1:N)
  const establecimientosEmpresa = useMemo(() => {
    return activeEmpresa
      ? establecimientos.filter(e => e.empresaId === activeEmpresa.id)
      : establecimientos;
  }, [establecimientos, activeEmpresa]);

  // Filtrado de establecimientos en tiempo real por búsqueda
  const filteredEstablecimientos = useMemo(() => {
    const term = establecimientoSearch.trim().toLowerCase();
    if (!term) return establecimientosEmpresa;
    return establecimientosEmpresa.filter(est =>
      est.nombre.toLowerCase().includes(term) ||
      est.municipio.toLowerCase().includes(term) ||
      est.codigoEstablecimiento.toLowerCase().includes(term) ||
      (est.departamento && est.departamento.toLowerCase().includes(term))
    );
  }, [establecimientosEmpresa, establecimientoSearch]);

  const handleSelectEstablecimiento = (est: Establecimiento) => {
    setFormData(prev => ({ ...prev, establecimientoId: est.id }));
    setEstablecimientoSearch(est.nombre);
    setIsEstablecimientoDropdownOpen(false);
    setEstablecimientoError('');
  };

  const handleEstablecimientoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEstablecimientoSearch(val);
    setIsEstablecimientoDropdownOpen(true);
    setEstablecimientoError('');

    // Verificar si coincide de forma exacta con el nombre de un establecimiento existente
    const exact = establecimientosEmpresa.find(
      est => est.nombre.trim().toLowerCase() === val.trim().toLowerCase()
    );
    if (exact) {
      setFormData(prev => ({ ...prev, establecimientoId: exact.id }));
    } else {
      // Guardar el identificador real solo al seleccionar una opción válida
      setFormData(prev => ({ ...prev, establecimientoId: '' }));
    }
  };

  // Filtrado de registros para la empresa activa
  const empresaResiduos = activeEmpresa
    ? residuos.filter(r => r.empresaId === activeEmpresa.id)
    : residuos;

  const filtered = empresaResiduos.filter(item => {
    const matchEst = filterEstablecimiento === 'all' || item.establecimientoId === filterEstablecimiento;
    const matchPeligro = filterPeligrosidad === 'all' || item.peligrosidad === filterPeligrosidad;
    const matchEstado = filterEstado === 'all' || item.estadoGestion === filterEstado;
    const term = searchTerm.toLowerCase();
    const matchSearch = 
      item.nombreResiduo.toLowerCase().includes(term) ||
      (item.corrienteRespel && item.corrienteRespel.toLowerCase().includes(term)) ||
      item.areaOrigen.toLowerCase().includes(term) ||
      (item.gestorNombre && item.gestorNombre.toLowerCase().includes(term)) ||
      (item.numeroManifiesto && item.numeroManifiesto.toLowerCase().includes(term));
    return matchEst && matchPeligro && matchEstado && matchSearch;
  });

  // Cálculos de métricas operativas
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

  // Alerta normativa: residuos RESPEL en acopio con más de 180 días o 365 días (Decreto 1076/2015 Art. 2.2.6.2.2.2)
  const hoyMs = new Date().getTime();
  const respelEnAcopioCritico = empresaResiduos.filter(r => {
    if (r.peligrosidad !== 'Peligroso (RESPEL)' || r.estadoGestion !== 'En acopio temporal') return false;
    const dias = Math.floor((hoyMs - new Date(r.fechaGeneracion).getTime()) / (1000 * 60 * 60 * 24));
    return dias > 180;
  });

  // Apertura modal nuevo registro
  const handleOpenCreateModal = () => {
    setEditingResiduo(null);
    const initialEst = (activeEstablecimiento && establecimientosEmpresa.some(e => e.id === activeEstablecimiento.id))
      ? activeEstablecimiento
      : (establecimientosEmpresa[0] || null);

    setFormData({
      establecimientoId: initialEst ? initialEst.id : '',
      fechaGeneracion: new Date().toISOString().split('T')[0],
      nombreResiduo: '',
      peligrosidad: 'No Peligroso',
      subcategoria: 'Aprovechable',
      corrienteRespel: '',
      cantidadGeneradaKg: 0,
      areaOrigen: '',
      tipoEmbalaje: 'Bolsa / Contenedor',
      estadoGestion: 'En acopio temporal',
      observacionesAdmin: ''
    });
    setEstablecimientoSearch(initialEst ? initialEst.nombre : '');
    setIsEstablecimientoDropdownOpen(false);
    setEstablecimientoError('');
    setIsModalOpen(true);
  };

  // Apertura modal edición
  const handleOpenEditModal = (item: RegistroResiduo) => {
    setEditingResiduo(item);
    const existingEst = establecimientos.find(e => e.id === item.establecimientoId);
    setFormData({
      establecimientoId: item.establecimientoId,
      fechaGeneracion: item.fechaGeneracion,
      nombreResiduo: item.nombreResiduo,
      peligrosidad: item.peligrosidad,
      subcategoria: item.subcategoria,
      corrienteRespel: item.corrienteRespel || '',
      cantidadGeneradaKg: item.cantidadGeneradaKg,
      areaOrigen: item.areaOrigen,
      tipoEmbalaje: item.tipoEmbalaje,
      estadoGestion: item.estadoGestion,
      observacionesAdmin: item.observacionesAdmin || ''
    });
    setEstablecimientoSearch(existingEst ? existingEst.nombre : '');
    setIsEstablecimientoDropdownOpen(false);
    setEstablecimientoError('');
    setIsModalOpen(true);
  };

  // Apertura modal despacho rápido
  const handleOpenDispatchModal = (item: RegistroResiduo) => {
    setDispatchTarget(item);
    setDispatchData({
      fechaEntrega: new Date().toISOString().split('T')[0],
      gestorId: gestores[0]?.id || '',
      tipoTratamiento: 'Aprovechamiento / Reciclaje',
      cantidadEntregadaKg: item.cantidadGeneradaKg,
      numeroManifiesto: '',
      numeroCertificadoDisposicion: '',
      documentoSoporteId: ''
    });
    setIsDispatchModalOpen(true);
  };

  // Selección rápida desde catálogo
  const handleSelectFromCatalogo = (catId: string) => {
    const selected = catalogoResiduos.find(c => c.id === catId);
    if (!selected) return;
    setFormData(prev => ({
      ...prev,
      nombreResiduo: selected.nombre,
      peligrosidad: selected.peligrosidad,
      subcategoria: selected.subcategoria,
      corrienteRespel: selected.corrienteRespel || ''
    }));
  };

  // Guardar creación o edición
  const handleSubmitResiduo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.establecimientoId) {
      setEstablecimientoError('Debe seleccionar una sede o establecimiento válido.');
      setIsEstablecimientoDropdownOpen(true);
      return;
    }
    if (!formData.nombreResiduo.trim()) return;
    const estId = formData.establecimientoId;
    const empId = activeEmpresa?.id || establecimientos.find(e => e.id === estId)?.empresaId || '';

    if (editingResiduo) {
      onUpdateResiduo({
        ...editingResiduo,
        establecimientoId: estId,
        fechaGeneracion: formData.fechaGeneracion,
        nombreResiduo: formData.nombreResiduo,
        peligrosidad: formData.peligrosidad,
        subcategoria: formData.subcategoria,
        corrienteRespel: formData.corrienteRespel,
        cantidadGeneradaKg: Number(formData.cantidadGeneradaKg),
        areaOrigen: formData.areaOrigen,
        tipoEmbalaje: formData.tipoEmbalaje,
        estadoGestion: formData.estadoGestion,
        observacionesAdmin: formData.observacionesAdmin
      });
    } else {
      onAddResiduo({
        empresaId: empId,
        establecimientoId: estId,
        fechaGeneracion: formData.fechaGeneracion,
        nombreResiduo: formData.nombreResiduo,
        peligrosidad: formData.peligrosidad,
        subcategoria: formData.subcategoria,
        corrienteRespel: formData.corrienteRespel,
        cantidadGeneradaKg: Number(formData.cantidadGeneradaKg),
        areaOrigen: formData.areaOrigen,
        tipoEmbalaje: formData.tipoEmbalaje,
        estadoGestion: formData.estadoGestion,
        estadoRevision: 'Registrado',
        observacionesAdmin: formData.observacionesAdmin
      });
    }
    setIsModalOpen(false);
  };

  // Confirmar despacho / entrega a gestor
  const handleSubmitDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchTarget) return;

    const selectedGestor = gestores.find(g => g.id === dispatchData.gestorId);

    onUpdateResiduo({
      ...dispatchTarget,
      estadoGestion: 'Entregado a gestor',
      fechaEntrega: dispatchData.fechaEntrega,
      gestorId: dispatchData.gestorId,
      gestorNombre: selectedGestor?.nombre || 'Gestor Autorizado',
      gestorNit: selectedGestor?.nit || '',
      tipoTratamiento: dispatchData.tipoTratamiento,
      cantidadEntregadaKg: Number(dispatchData.cantidadEntregadaKg) || dispatchTarget.cantidadGeneradaKg,
      numeroManifiesto: dispatchData.numeroManifiesto,
      numeroCertificadoDisposicion: dispatchData.numeroCertificadoDisposicion,
      documentoSoporteId: dispatchData.documentoSoporteId
    });

    setIsDispatchModalOpen(false);
    setDispatchTarget(null);
  };

  // Exportar bitácora a CSV (Libro de Operaciones)
  const handleExportCSV = () => {
    if (filtered.length === 0) {
      alert('No hay registros de residuos para exportar con los filtros actuales.');
      return;
    }

    const headers = [
      'ID Registro',
      'Fecha Generación',
      'Establecimiento / Sede',
      'Nombre Residuo',
      'Peligrosidad',
      'Subcategoría',
      'Corriente RESPEL (Dec 1076)',
      'Cantidad Generada (kg)',
      'Área de Origen',
      'Embalaje',
      'Estado de Gestión',
      'Fecha Entrega',
      'Gestor Ambiental Receptor',
      'NIT Gestor',
      'Tratamiento / Manejo',
      'Cantidad Entregada (kg)',
      'No. Manifiesto Carga',
      'No. Certificado Disposición'
    ];

    const rows = filtered.map(r => {
      const est = establecimientos.find(e => e.id === r.establecimientoId);
      return [
        `"${r.id}"`,
        `"${r.fechaGeneracion}"`,
        `"${est?.nombre || ''}"`,
        `"${r.nombreResiduo.replace(/"/g, '""')}"`,
        `"${r.peligrosidad}"`,
        `"${r.subcategoria}"`,
        `"${r.corrienteRespel || 'N/A'}"`,
        r.cantidadGeneradaKg,
        `"${r.areaOrigen || ''}"`,
        `"${r.tipoEmbalaje || ''}"`,
        `"${r.estadoGestion}"`,
        `"${r.fechaEntrega || ''}"`,
        `"${(r.gestorNombre || '').replace(/"/g, '""')}"`,
        `"${r.gestorNit || ''}"`,
        `"${r.tipoTratamiento || ''}"`,
        r.cantidadEntregadaKg || 0,
        `"${r.numeroManifiesto || ''}"`,
        `"${r.numeroCertificadoDisposicion || ''}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const fecha = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `bitacora_residuos_${activeEmpresa?.nit || 'nativa'}_${fecha}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Alerta Normativa de Acopio Temporal Prolongado */}
      {respelEnAcopioCritico.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block text-amber-950 mb-0.5">
              Alerta de Almacenamiento Prolongado (Decreto 1076 de 2015)
            </span>
            <span>
              Existen <strong>{respelEnAcopioCritico.length} lote(s)</strong> de residuos peligrosos en acopio temporal con más de 6 meses de permanencia. Recuerde que el límite normativo máximo en Colombia antes de entrega a gestor autorizado es de 12 meses.
            </span>
          </div>
        </div>
      )}

      {/* KPI Cards de Trazabilidad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Generado
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
              {totalGeneradoKg.toLocaleString('es-CO')} <span className="text-xs font-normal text-slate-500">kg</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {(totalGeneradoKg / 1000).toFixed(2)} toneladas totales
            </p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              En Acopio Temporal
            </div>
            <div className="text-2xl font-extrabold text-amber-700 mt-1 tabular-nums">
              {totalEnAcopioKg.toLocaleString('es-CO')} <span className="text-xs font-normal text-slate-500">kg</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Saldo en bodega de la empresa
            </p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Entregado a Gestores
            </div>
            <div className="text-2xl font-extrabold text-blue-700 mt-1 tabular-nums">
              {totalEntregadoKg.toLocaleString('es-CO')} <span className="text-xs font-normal text-slate-500">kg</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Con trazabilidad de transporte
            </p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Residuos Peligrosos (RESPEL)
            </div>
            <div className="text-2xl font-extrabold text-red-700 mt-1 tabular-nums">
              {totalRespelKg.toLocaleString('es-CO')} <span className="text-xs font-normal text-slate-500">kg</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {totalGeneradoKg > 0 ? Math.round((totalRespelKg / totalGeneradoKg) * 100) : 0}% del volumen total
            </p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-700">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Acciones */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Búsqueda y Filtros Rápidos */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar residuo, corriente RESPEL, gestor, área..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Filtro por Sede */}
            <select
              value={filterEstablecimiento}
              onChange={(e) => setFilterEstablecimiento(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium text-slate-700"
            >
              <option value="all">Todas las Sedes ({establecimientos.length})</option>
              {establecimientos.map(est => (
                <option key={est.id} value={est.id}>{est.nombre}</option>
              ))}
            </select>

            {/* Filtro por Peligrosidad */}
            <select
              value={filterPeligrosidad}
              onChange={(e) => setFilterPeligrosidad(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium text-slate-700"
            >
              <option value="all">Todas las Categorías</option>
              <option value="Peligroso (RESPEL)">Peligroso (RESPEL)</option>
              <option value="No Peligroso">No Peligroso</option>
              <option value="RCD">RCD (Escombros)</option>
              <option value="Especial">Especial</option>
            </select>

            {/* Filtro por Estado */}
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium text-slate-700"
            >
              <option value="all">Todos los Estados</option>
              <option value="En acopio temporal">En acopio temporal</option>
              <option value="Entregado a gestor">Entregado a gestor</option>
              <option value="Gestionado internamente">Gestionado internamente</option>
            </select>
          </div>

          {/* Botones Principales */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              title="Descargar libro de operaciones en formato CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Exportar Libro CSV</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Generación</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de la Bitácora de Residuos */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Fecha & Sede</th>
                <th className="py-3 px-4">Residuo & Corriente</th>
                <th className="py-3 px-4">Clasificación</th>
                <th className="py-3 px-4 text-right">Cantidad (kg)</th>
                <th className="py-3 px-4">Área de Origen</th>
                <th className="py-3 px-4">Estado & Trazabilidad</th>
                <th className="py-3 px-4">Gestor / Manifiesto</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => {
                const est = establecimientos.find(e => e.id === item.establecimientoId);
                const isRespel = item.peligrosidad === 'Peligroso (RESPEL)';
                const enAcopio = item.estadoGestion === 'En acopio temporal';

                // Cálculo de días en acopio
                const diasAcopio = Math.floor((hoyMs - new Date(item.fechaGeneracion).getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Fecha y Sede */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{item.fechaGeneracion}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                        {est?.nombre || 'Sede principal'}
                      </div>
                    </td>

                    {/* Nombre Residuo & Corriente */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.nombreResiduo}</div>
                      {item.corrienteRespel && (
                        <span className="inline-block mt-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-800 border border-red-200">
                          {item.corrienteRespel}
                        </span>
                      )}
                    </td>

                    {/* Peligrosidad & Subcategoría */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        isRespel
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : item.peligrosidad === 'RCD'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.peligrosidad}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {item.subcategoria}
                      </div>
                    </td>

                    {/* Cantidad */}
                    <td className="py-3 px-4 text-right">
                      <div className="font-extrabold text-slate-900 tabular-nums">
                        {Number(item.cantidadGeneradaKg).toLocaleString('es-CO')}
                      </div>
                      <div className="text-[10px] text-slate-400">kg</div>
                    </td>

                    {/* Área Origen */}
                    <td className="py-3 px-4 text-slate-600">
                      <div>{item.areaOrigen || 'General'}</div>
                      <div className="text-[10px] text-slate-400">{item.tipoEmbalaje}</div>
                    </td>

                    {/* Estado de Gestión */}
                    <td className="py-3 px-4">
                      {enAcopio ? (
                        <div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>En acopio ({diasAcopio}d)</span>
                          </span>
                          {isRespel && diasAcopio > 180 && (
                            <div className="text-[10px] text-red-600 font-semibold mt-0.5">
                              Excede 6 meses
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" />
                            <span>Entregado a gestor</span>
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {item.fechaEntrega}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Gestor y Manifiesto */}
                    <td className="py-3 px-4">
                      {item.gestorNombre ? (
                        <div className="max-w-[160px]">
                          <div className="font-semibold text-slate-900 truncate" title={item.gestorNombre}>
                            {item.gestorNombre}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {item.tipoTratamiento}
                          </div>
                          {item.numeroManifiesto && (
                            <div className="text-[10px] text-emerald-700 font-mono mt-0.5">
                              Manif: {item.numeroManifiesto}
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenDispatchModal(item)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors flex items-center gap-1"
                        >
                          <Truck className="w-3 h-3" />
                          <span>Despachar a gestor</span>
                        </button>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {enAcopio && (
                          <button
                            onClick={() => handleOpenDispatchModal(item)}
                            className="p-1.5 rounded text-blue-700 hover:bg-blue-50"
                            title="Registrar salida o entrega a gestor"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded text-slate-600 hover:bg-slate-100"
                          title="Editar registro"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Eliminar el registro de ${item.nombreResiduo}?`)) {
                              onDeleteResiduo(item.id);
                            }
                          }}
                          className="p-1.5 rounded text-red-600 hover:bg-red-50"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No se encontraron registros de residuos</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchTerm || filterPeligrosidad !== 'all' || filterEstado !== 'all'
                        ? 'Intente modificar los criterios de filtro aplicados.'
                        : 'Comience registrando los residuos generados en su establecimiento.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Registro / Edición de Generación */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-700" />
                <span>{editingResiduo ? 'Editar Registro de Residuo' : 'Nuevo Registro de Generación'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitResiduo} className="mt-4 space-y-4">
              {/* Selector Rápido desde Catálogo Normativo */}
              {!editingResiduo && catalogoResiduos.length > 0 && (
                <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100">
                  <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                    Cargar desde Catálogo Normativo de Residuos (Opcional):
                  </label>
                  <select
                    onChange={(e) => handleSelectFromCatalogo(e.target.value)}
                    defaultValue=""
                    className="w-full text-xs bg-white border border-emerald-200 rounded-lg p-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="" disabled>Seleccione un residuo común para autocompletar...</option>
                    {catalogoResiduos.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre} — [{cat.peligrosidad}] {cat.corrienteRespel ? `(${cat.corrienteRespel})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Sede / Establecimiento con búsqueda integrada */}
                <div className="relative" ref={establecimientoDropdownRef}>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sede / Establecimiento *
                  </label>

                  {establecimientosEmpresa.length === 0 ? (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <div className="text-xs">
                          <p className="font-semibold text-amber-900">No hay establecimientos registrados</p>
                          <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
                            {activeEmpresa 
                              ? `La empresa «${activeEmpresa.razonSocial}» no tiene sedes o establecimientos registrados.`
                              : 'No hay sedes o establecimientos registrados en el sistema.'}
                            {' '}Primero deben crearse en el módulo de <strong>Establecimientos</strong> antes de registrar eventos de residuos.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Campo interactivo con búsqueda en tiempo real */}
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={establecimientoSearch}
                          onChange={handleEstablecimientoInputChange}
                          onFocus={() => setIsEstablecimientoDropdownOpen(true)}
                          placeholder="Escriba para buscar por nombre o municipio..."
                          className={`w-full pl-9 pr-14 py-2.5 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs transition-colors ${
                            establecimientoError ? 'border-red-300 bg-red-50/30' : 'border-slate-200'
                          }`}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          {establecimientoSearch && (
                            <button
                              type="button"
                              onClick={() => {
                                setEstablecimientoSearch('');
                                setFormData(prev => ({ ...prev, establecimientoId: '' }));
                                setIsEstablecimientoDropdownOpen(true);
                              }}
                              className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                              title="Limpiar búsqueda"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setIsEstablecimientoDropdownOpen(prev => !prev)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                            title="Desplegar sedes disponibles"
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform ${isEstablecimientoDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Input oculto para validación obligatoria estándar de formulario HTML */}
                      <input
                        type="text"
                        tabIndex={-1}
                        aria-hidden="true"
                        required
                        value={formData.establecimientoId}
                        onChange={() => {}}
                        className="sr-only"
                      />

                      {/* Menú flotante de resultados filtrados en tiempo real */}
                      {isEstablecimientoDropdownOpen && (
                        <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-56 overflow-y-auto">
                          {filteredEstablecimientos.length === 0 ? (
                            <div className="p-3 text-center text-xs bg-slate-50">
                              <AlertCircle className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                              <p className="font-semibold text-slate-700">Sin coincidencias</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                No se encontraron sedes o establecimientos que coincidan con «{establecimientoSearch}».
                              </p>
                            </div>
                          ) : (
                            <div>
                              <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex justify-between items-center">
                                <span>Sedes disponibles ({filteredEstablecimientos.length})</span>
                                <span className="text-[9px] text-slate-400">Clic para seleccionar</span>
                              </div>
                              <div className="divide-y divide-slate-100">
                                {filteredEstablecimientos.map(est => {
                                  const isSelected = est.id === formData.establecimientoId;
                                  return (
                                    <button
                                      key={est.id}
                                      type="button"
                                      onClick={() => handleSelectEstablecimiento(est)}
                                      className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between gap-2 ${
                                        isSelected 
                                          ? 'bg-emerald-50 text-emerald-950 font-medium' 
                                          : 'hover:bg-slate-50 text-slate-700'
                                      }`}
                                    >
                                      <div className="min-w-0 flex-1">
                                        <div className="font-semibold text-slate-900 flex items-center gap-1.5 truncate">
                                          <Building2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                                          <span className="truncate">{est.nombre}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                                          {est.municipio} {est.departamento ? `• ${est.departamento}` : ''} • Cód: {est.codigoEstablecimiento}
                                        </div>
                                      </div>
                                      {isSelected && (
                                        <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Confirmación visual del identificador real seleccionado */}
                      {formData.establecimientoId ? (
                        (() => {
                          const estSel = establecimientosEmpresa.find(e => e.id === formData.establecimientoId);
                          return estSel ? (
                            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">
                                Sede seleccionada: <strong className="text-slate-800">{estSel.nombre}</strong>{' '}
                                <span className="text-slate-400">({estSel.municipio})</span>
                              </span>
                            </div>
                          ) : null;
                        })()
                      ) : establecimientoSearch ? (
                        <p className="mt-1 text-[11px] text-amber-700 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                          Seleccione una opción válida de la lista desplegable
                        </p>
                      ) : null}

                      {establecimientoError && (
                        <p className="mt-1 text-[11px] text-red-600 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
                          {establecimientoError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Fecha de Generación */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fecha de Generación *</label>
                  <input
                    type="date"
                    value={formData.fechaGeneracion}
                    onChange={(e) => setFormData(prev => ({ ...prev, fechaGeneracion: e.target.value }))}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                  </input>
                </div>

                {/* Nombre del Residuo */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Nombre Técnico del Residuo *</label>
                  <input
                    type="text"
                    value={formData.nombreResiduo}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombreResiduo: e.target.value }))}
                    placeholder="Ej. Aceite usado de motor, Cartón limpio, Lámparas fluorescentes"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* Peligrosidad */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Clasificación de Peligrosidad *</label>
                  <select
                    value={formData.peligrosidad}
                    onChange={(e) => setFormData(prev => ({ ...prev, peligrosidad: e.target.value as TipoPeligrosidad }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
                  >
                    <option value="No Peligroso">No Peligroso</option>
                    <option value="Peligroso (RESPEL)">Peligroso (RESPEL)</option>
                    <option value="RCD">RCD (Escombros y Construcción)</option>
                    <option value="Especial">Especial</option>
                  </select>
                </div>

                {/* Subcategoría */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subcategoría *</label>
                  <select
                    value={formData.subcategoria}
                    onChange={(e) => setFormData(prev => ({ ...prev, subcategoria: e.target.value as SubcategoriaResiduo }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Aprovechable">Aprovechable (Reciclaje)</option>
                    <option value="Orgánico">Orgánico (Compostaje)</option>
                    <option value="Ordinario/No aprovechable">Ordinario / No aprovechable</option>
                    <option value="Aceites Usados">Aceites Usados</option>
                    <option value="RESPEL Químico">RESPEL Químico</option>
                    <option value="RESPEL Biológico/Infeccioso">RESPEL Biológico/Infeccioso</option>
                    <option value="RESPEL RAEE">RESPEL RAEE (Eléctrico/Electrónico)</option>
                    <option value="RCD">RCD</option>
                  </select>
                </div>

                {/* Corriente RESPEL (si aplica) */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Corriente RESPEL (Código A o Y - Decreto 1076/2015)
                  </label>
                  <input
                    type="text"
                    value={formData.corrienteRespel}
                    onChange={(e) => setFormData(prev => ({ ...prev, corrienteRespel: e.target.value }))}
                    placeholder="Ej. Y8, A3020, Y1, A4070 (dejar vacío si no es peligroso)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                  />
                </div>

                {/* Cantidad Generada (kg) */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cantidad Generada (kg) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.cantidadGeneradaKg}
                    onChange={(e) => setFormData(prev => ({ ...prev, cantidadGeneradaKg: Number(e.target.value) }))}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-extrabold"
                  />
                </div>

                {/* Área de Origen */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Área o Proceso de Origen *</label>
                  <input
                    type="text"
                    value={formData.areaOrigen}
                    onChange={(e) => setFormData(prev => ({ ...prev, areaOrigen: e.target.value }))}
                    placeholder="Ej. Taller de mantenimiento, Línea de producción, Casino, Oficinas"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* Tipo de Embalaje / Acopio */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Embalaje / Almacenamiento *</label>
                  <input
                    type="text"
                    value={formData.tipoEmbalaje}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipoEmbalaje: e.target.value }))}
                    placeholder="Ej. Caneca 55 gal plástica, Bolsa roja, Big Bag, Contenedor metálico"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Notas u observaciones técnicas */}
              <div className="text-xs">
                <label className="block font-semibold text-slate-700 mb-1">Notas u Observaciones Operativas</label>
                <textarea
                  rows={2}
                  value={formData.observacionesAdmin}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacionesAdmin: e.target.value }))}
                  placeholder="Detalles sobre rotulado, condición del residuo o instrucciones de acopio..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-sm"
                >
                  {editingResiduo ? 'Actualizar Registro' : 'Guardar en Bitácora'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Despacho / Entrega a Gestor */}
      {isDispatchModalOpen && dispatchTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-700" />
                <span>Registrar Salida / Entrega a Gestor Autorizado</span>
              </h3>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 my-3 bg-slate-50 rounded-lg text-xs space-y-1">
              <div className="font-bold text-slate-900">{dispatchTarget.nombreResiduo}</div>
              <div className="text-slate-500">
                Generado: {dispatchTarget.fechaGeneracion} · Cantidad en acopio: {dispatchTarget.cantidadGeneradaKg} kg
              </div>
            </div>

            <form onSubmit={handleSubmitDispatch} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Fecha de Entrega */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fecha de Entrega / Despacho *</label>
                  <input
                    type="date"
                    value={dispatchData.fechaEntrega}
                    onChange={(e) => setDispatchData(prev => ({ ...prev, fechaEntrega: e.target.value }))}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* Cantidad Entregada (kg) */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cantidad Entregada (kg) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={dispatchData.cantidadEntregadaKg}
                    onChange={(e) => setDispatchData(prev => ({ ...prev, cantidadEntregadaKg: Number(e.target.value) }))}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-extrabold"
                  />
                </div>

                {/* Gestor Receptor */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Gestor Ambiental Receptor Autorizado *</label>
                  <select
                    value={dispatchData.gestorId}
                    onChange={(e) => setDispatchData(prev => ({ ...prev, gestorId: e.target.value }))}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {gestores.map(ges => (
                      <option key={ges.id} value={ges.id}>
                        {ges.nombre} (NIT: {ges.nit} - Lic: {ges.numeroLicencia})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tipo de Tratamiento / Manejo */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Tratamiento o Manejo *</label>
                  <select
                    value={dispatchData.tipoTratamiento}
                    onChange={(e) => setDispatchData(prev => ({ ...prev, tipoTratamiento: e.target.value as TipoManejoTratamiento }))}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Aprovechamiento / Reciclaje">Aprovechamiento / Reciclaje</option>
                    <option value="Compostaje / Biotransformación">Compostaje / Biotransformación</option>
                    <option value="Coprocesamiento">Coprocesamiento térmico</option>
                    <option value="Tratamiento térmico / Incineración">Tratamiento térmico / Incineración</option>
                    <option value="Tratamiento físico-químico">Tratamiento físico-químico</option>
                    <option value="Celda de seguridad">Celda de seguridad</option>
                    <option value="Disposición final (Relleno Sanitario)">Disposición final (Relleno Sanitario)</option>
                    <option value="Otro">Otro tratamiento autorizado</option>
                  </select>
                </div>

                {/* Número de Manifiesto */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. Manifiesto de Carga / Remisión</label>
                  <input
                    type="text"
                    value={dispatchData.numeroManifiesto}
                    onChange={(e) => setDispatchData(prev => ({ ...prev, numeroManifiesto: e.target.value }))}
                    placeholder="Ej. MAN-2024-0045"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                  />
                </div>

                {/* Número de Certificado de Disposición */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. Certificado de Disposición Final / Acta</label>
                  <input
                    type="text"
                    value={dispatchData.numeroCertificadoDisposicion}
                    onChange={(e) => setDispatchData(prev => ({ ...prev, numeroCertificadoDisposicion: e.target.value }))}
                    placeholder="Ej. CERT-DISP-8921"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                  />
                </div>

                {/* Enlace a soporte documental existente */}
                {documentos.length > 0 && (
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Vincular Soporte Documental del Expediente</label>
                    <select
                      value={dispatchData.documentoSoporteId}
                      onChange={(e) => setDispatchData(prev => ({ ...prev, documentoSoporteId: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="">Sin vincular (o pendiente de cargue)</option>
                      {documentos.map(doc => (
                        <option key={doc.id} value={doc.id}>
                          {doc.nombre} — {doc.tipoDocumento}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-sm"
                >
                  Confirmar Entrega a Gestor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
