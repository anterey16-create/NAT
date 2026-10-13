import React, { useState } from 'react';
import { 
  GestorAmbiental, 
  CatalogoResiduo, 
  UserRole,
  TipoPeligrosidad,
  SubcategoriaResiduo,
  TipoManejoTratamiento
} from '../../types';
import { 
  Building2, 
  Plus, 
  Search, 
  ShieldCheck, 
  FileText, 
  Edit3, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Tag,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { AUTORIDADES_AMBIENTALES_COLOMBIA } from '../../data/ruaDefinitions';

interface EnvironmentalCatalogsViewProps {
  userRole: UserRole;
  gestores: GestorAmbiental[];
  catalogos: CatalogoResiduo[];
  onAddGestor: (g: Omit<GestorAmbiental, 'id'>) => void;
  onUpdateGestor: (g: GestorAmbiental) => void;
  onDeleteGestor: (id: string) => void;
  onAddCatalogo: (c: Omit<CatalogoResiduo, 'id'>) => void;
  onUpdateCatalogo: (c: CatalogoResiduo) => void;
  onDeleteCatalogo: (id: string) => void;
}

export const EnvironmentalCatalogsView: React.FC<EnvironmentalCatalogsViewProps> = ({
  userRole,
  gestores,
  catalogos,
  onAddGestor,
  onUpdateGestor,
  onDeleteGestor,
  onAddCatalogo,
  onUpdateCatalogo,
  onDeleteCatalogo
}) => {
  const [activeTab, setActiveTab] = useState<'gestores' | 'residuos'>('gestores');
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [isGestorModalOpen, setIsGestorModalOpen] = useState(false);
  const [editingGestor, setEditingGestor] = useState<GestorAmbiental | null>(null);

  const [isCatalogoModalOpen, setIsCatalogoModalOpen] = useState(false);
  const [editingCatalogo, setEditingCatalogo] = useState<CatalogoResiduo | null>(null);

  // Form Gestor
  const [gestorForm, setGestorForm] = useState({
    nombre: '',
    nit: '',
    autoridadAmbiental: AUTORIDADES_AMBIENTALES_COLOMBIA[0] || 'Secretaría Distrital de Ambiente (SDA) - Bogotá D.C.',
    numeroLicencia: '',
    vigenciaLicencia: '2028-12-31',
    lineasAutorizadasStr: '',
    contacto: '',
    telefono: '',
    direccion: '',
    estado: 'Activo' as 'Activo' | 'Inactivo'
  });

  // Form Catálogo
  const [catalogoForm, setCatalogoForm] = useState({
    nombre: '',
    peligrosidad: 'Peligroso (RESPEL)' as TipoPeligrosidad,
    subcategoria: 'RESPEL Químico' as SubcategoriaResiduo,
    corrienteRespel: '',
    descripcion: '',
    tratamientoSugerido: 'Aprovechamiento / Reciclaje' as TipoManejoTratamiento
  });

  // Filtros
  const filteredGestores = gestores.filter(g => 
    g.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.nit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.autoridadAmbiental.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.lineasAutorizadas.some(l => l.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredCatalogos = catalogos.filter(c =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.corrienteRespel && c.corrienteRespel.toLowerCase().includes(searchTerm.toLowerCase())) ||
    c.subcategoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gestor Handlers
  const handleOpenAddGestor = () => {
    setEditingGestor(null);
    setGestorForm({
      nombre: '',
      nit: '',
      autoridadAmbiental: AUTORIDADES_AMBIENTALES_COLOMBIA[0] || 'Secretaría Distrital de Ambiente (SDA) - Bogotá D.C.',
      numeroLicencia: '',
      vigenciaLicencia: '2028-12-31',
      lineasAutorizadasStr: '',
      contacto: '',
      telefono: '',
      direccion: '',
      estado: 'Activo'
    });
    setIsGestorModalOpen(true);
  };

  const handleOpenEditGestor = (g: GestorAmbiental) => {
    setEditingGestor(g);
    setGestorForm({
      nombre: g.nombre,
      nit: g.nit,
      autoridadAmbiental: g.autoridadAmbiental,
      numeroLicencia: g.numeroLicencia,
      vigenciaLicencia: g.vigenciaLicencia,
      lineasAutorizadasStr: g.lineasAutorizadas.join(', '),
      contacto: g.contacto,
      telefono: g.telefono,
      direccion: g.direccion || '',
      estado: g.estado
    });
    setIsGestorModalOpen(true);
  };

  const handleSubmitGestor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gestorForm.nombre.trim() || !gestorForm.nit.trim()) return;

    const lineas = gestorForm.lineasAutorizadasStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingGestor) {
      onUpdateGestor({
        ...editingGestor,
        nombre: gestorForm.nombre,
        nit: gestorForm.nit,
        autoridadAmbiental: gestorForm.autoridadAmbiental,
        numeroLicencia: gestorForm.numeroLicencia,
        vigenciaLicencia: gestorForm.vigenciaLicencia,
        lineasAutorizadas: lineas.length > 0 ? lineas : ['Residuos autorizados'],
        contacto: gestorForm.contacto,
        telefono: gestorForm.telefono,
        direccion: gestorForm.direccion,
        estado: gestorForm.estado
      });
    } else {
      onAddGestor({
        nombre: gestorForm.nombre,
        nit: gestorForm.nit,
        autoridadAmbiental: gestorForm.autoridadAmbiental,
        numeroLicencia: gestorForm.numeroLicencia,
        vigenciaLicencia: gestorForm.vigenciaLicencia,
        lineasAutorizadas: lineas.length > 0 ? lineas : ['Residuos autorizados'],
        contacto: gestorForm.contacto,
        telefono: gestorForm.telefono,
        direccion: gestorForm.direccion,
        estado: gestorForm.estado
      });
    }
    setIsGestorModalOpen(false);
  };

  // Catálogo Handlers
  const handleOpenAddCatalogo = () => {
    setEditingCatalogo(null);
    setCatalogoForm({
      nombre: '',
      peligrosidad: 'Peligroso (RESPEL)',
      subcategoria: 'RESPEL Químico',
      corrienteRespel: '',
      descripcion: '',
      tratamientoSugerido: 'Aprovechamiento / Reciclaje'
    });
    setIsCatalogoModalOpen(true);
  };

  const handleOpenEditCatalogo = (c: CatalogoResiduo) => {
    setEditingCatalogo(c);
    setCatalogoForm({
      nombre: c.nombre,
      peligrosidad: c.peligrosidad,
      subcategoria: c.subcategoria,
      corrienteRespel: c.corrienteRespel || '',
      descripcion: c.descripcion,
      tratamientoSugerido: c.tratamientoSugerido
    });
    setIsCatalogoModalOpen(true);
  };

  const handleSubmitCatalogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catalogoForm.nombre.trim()) return;

    if (editingCatalogo) {
      onUpdateCatalogo({
        ...editingCatalogo,
        nombre: catalogoForm.nombre,
        peligrosidad: catalogoForm.peligrosidad,
        subcategoria: catalogoForm.subcategoria,
        corrienteRespel: catalogoForm.corrienteRespel,
        descripcion: catalogoForm.descripcion,
        tratamientoSugerido: catalogoForm.tratamientoSugerido
      });
    } else {
      onAddCatalogo({
        nombre: catalogoForm.nombre,
        peligrosidad: catalogoForm.peligrosidad,
        subcategoria: catalogoForm.subcategoria,
        corrienteRespel: catalogoForm.corrienteRespel,
        descripcion: catalogoForm.descripcion,
        tratamientoSugerido: catalogoForm.tratamientoSugerido
      });
    }
    setIsCatalogoModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Catálogos Ambientales Normativos
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Gestores Autorizados y Clasificación de Residuos
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Administración de empresas gestoras receptoras con licencia ambiental y catálogo de corrientes de residuo.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('gestores')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'gestores'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Gestores Ambientales ({gestores.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('residuos')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'residuos'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Catálogo de Residuos ({catalogos.length})</span>
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={activeTab === 'gestores' ? 'Buscar gestor por nombre, NIT, licencia...' : 'Buscar residuo o código...'}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <button
          onClick={activeTab === 'gestores' ? handleOpenAddGestor : handleOpenAddCatalogo}
          className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{activeTab === 'gestores' ? 'Registrar Gestor Autorizado' : 'Agregar Residuo al Catálogo'}</span>
        </button>
      </div>

      {/* TAB 1: GESTORES AMBIENTALES */}
      {activeTab === 'gestores' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGestores.map(g => (
            <div
              key={g.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 relative hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{g.nombre}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      g.estado === 'Activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {g.estado}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    NIT: {g.nit}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditGestor(g)}
                    className="p-1.5 rounded text-slate-500 hover:bg-slate-100"
                    title="Editar gestor"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Eliminar gestor ${g.nombre}?`)) {
                        onDeleteGestor(g.id);
                      }
                    }}
                    className="p-1.5 rounded text-red-500 hover:bg-red-50"
                    title="Eliminar gestor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Licencia y Autoridad */}
              <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold text-[11px]">Licencia Ambiental:</span>
                  <span className="font-mono font-bold text-emerald-800">{g.numeroLicencia}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold text-[11px]">Vigencia:</span>
                  <span className="font-mono text-slate-700">{g.vigenciaLicencia}</span>
                </div>
                <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                  <strong>Autoridad:</strong> {g.autoridadAmbiental}
                </div>
              </div>

              {/* Líneas Autorizadas */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Líneas / Residuos Autorizados:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {g.lineasAutorizadas.map((lin, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100"
                    >
                      {lin}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contacto */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                {g.contacto && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{g.contacto}</span>
                  </span>
                )}
                {g.telefono && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{g.telefono}</span>
                  </span>
                )}
              </div>
            </div>
          ))}

          {filteredGestores.length === 0 && (
            <div className="col-span-full p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-400">
              No se encontraron gestores ambientales con el término de búsqueda.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CATÁLOGO DE RESIDUOS */}
      {activeTab === 'residuos' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Residuo</th>
                  <th className="py-3 px-4">Peligrosidad</th>
                  <th className="py-3 px-4">Corriente RESPEL</th>
                  <th className="py-3 px-4">Tratamiento Sugerido</th>
                  <th className="py-3 px-4">Descripción Técnica</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCatalogos.map(cat => (
                  <tr key={cat.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {cat.nombre}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cat.peligrosidad === 'Peligroso (RESPEL)'
                          ? 'bg-red-100 text-red-800'
                          : cat.peligrosidad === 'RCD'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {cat.peligrosidad}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">{cat.subcategoria}</div>
                    </td>
                    <td className="py-3 px-4">
                      {cat.corrienteRespel ? (
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {cat.corrienteRespel}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">No aplica</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {cat.tratamientoSugerido}
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs">
                      {cat.descripcion}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditCatalogo(cat)}
                          className="p-1.5 rounded text-slate-500 hover:bg-slate-100"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Eliminar ${cat.nombre} del catálogo?`)) {
                              onDeleteCatalogo(cat.id);
                            }
                          }}
                          className="p-1.5 rounded text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL GESTOR */}
      {isGestorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>{editingGestor ? 'Editar Gestor Ambiental' : 'Nuevo Gestor Ambiental Autorizado'}</span>
              </h3>
              <button onClick={() => setIsGestorModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitGestor} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Razón Social del Gestor *</label>
                  <input
                    type="text"
                    value={gestorForm.nombre}
                    onChange={(e) => setGestorForm(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Ej. Ecoeficiencia S.A.S."
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIT con dígito de verificación *</label>
                  <input
                    type="text"
                    value={gestorForm.nit}
                    onChange={(e) => setGestorForm(prev => ({ ...prev, nit: e.target.value }))}
                    placeholder="Ej. 900.852.147-3"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estado de Habilitación *</label>
                  <select
                    value={gestorForm.estado}
                    onChange={(e) => setGestorForm(prev => ({ ...prev, estado: e.target.value as any }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-bold"
                  >
                    <option value="Activo">Activo / Autorizado</option>
                    <option value="Inactivo">Inactivo / En Suspensión</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Autoridad Ambiental Competente *</label>
                  <select
                    value={gestorForm.autoridadAmbiental}
                    onChange={(e) => setGestorForm(prev => ({ ...prev, autoridadAmbiental: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {AUTORIDADES_AMBIENTALES_COLOMBIA.map((aut, idx) => (
                      <option key={idx} value={aut}>{aut}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. Resolución / Licencia Ambiental *</label>
                  <input
                    type="text"
                    value={gestorForm.numeroLicencia}
                    onChange={(e) => setGestorForm(prev => ({ ...prev, numeroLicencia: e.target.value }))}
                    placeholder="Ej. Resolución CAR No. 1845 de 2021"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fecha de Vigencia de Licencia *</label>
                  <input
                    type="date"
                    value={gestorForm.vigenciaLicencia}
                    onChange={(e) => setGestorForm(prev => ({ ...prev, vigenciaLicencia: e.target.value }))}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Líneas de Residuos Autorizadas (Separadas por comas) *
                  </label>
                  <input
                    type="text"
                    value={gestorForm.lineasAutorizadasStr}
                    onChange={(e) => setGestorForm(prev => ({ ...prev, lineasAutorizadasStr: e.target.value }))}
                    placeholder="Ej. Aceites usados, Baterías plomo-ácido, Solventes, Coprocesamiento"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Correo de Contacto</label>
                  <input
                    type="email"
                    value={gestorForm.contacto}
                    onChange={(e) => setGestorForm(prev => ({ ...prev, contacto: e.target.value }))}
                    placeholder="operaciones@gestor.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={gestorForm.telefono}
                    onChange={(e) => setGestorForm(prev => ({ ...prev, telefono: e.target.value }))}
                    placeholder="(601) 745 2200"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsGestorModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
                >
                  {editingGestor ? 'Guardar Cambios' : 'Registrar Gestor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CATÁLOGO */}
      {isCatalogoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-700" />
                <span>{editingCatalogo ? 'Editar Residuo en Catálogo' : 'Nuevo Residuo en Catálogo'}</span>
              </h3>
              <button onClick={() => setIsCatalogoModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCatalogo} className="mt-4 space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre Técnico del Residuo *</label>
                <input
                  type="text"
                  value={catalogoForm.nombre}
                  onChange={(e) => setCatalogoForm(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Ej. Aceite dieléctrico usado"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Peligrosidad *</label>
                  <select
                    value={catalogoForm.peligrosidad}
                    onChange={(e) => setCatalogoForm(prev => ({ ...prev, peligrosidad: e.target.value as any }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="No Peligroso">No Peligroso</option>
                    <option value="Peligroso (RESPEL)">Peligroso (RESPEL)</option>
                    <option value="RCD">RCD</option>
                    <option value="Especial">Especial</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subcategoría *</label>
                  <select
                    value={catalogoForm.subcategoria}
                    onChange={(e) => setCatalogoForm(prev => ({ ...prev, subcategoria: e.target.value as any }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Aprovechable">Aprovechable</option>
                    <option value="Orgánico">Orgánico</option>
                    <option value="Ordinario/No aprovechable">Ordinario</option>
                    <option value="Aceites Usados">Aceites Usados</option>
                    <option value="RESPEL Químico">RESPEL Químico</option>
                    <option value="RESPEL Biológico/Infeccioso">RESPEL Biológico</option>
                    <option value="RESPEL RAEE">RESPEL RAEE</option>
                    <option value="RCD">RCD</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Corriente RESPEL (Dec 1076)</label>
                  <input
                    type="text"
                    value={catalogoForm.corrienteRespel}
                    onChange={(e) => setCatalogoForm(prev => ({ ...prev, corrienteRespel: e.target.value }))}
                    placeholder="Ej. Y8, A3020"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tratamiento Sugerido *</label>
                  <select
                    value={catalogoForm.tratamientoSugerido}
                    onChange={(e) => setCatalogoForm(prev => ({ ...prev, tratamientoSugerido: e.target.value as any }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Aprovechamiento / Reciclaje">Aprovechamiento / Reciclaje</option>
                    <option value="Compostaje / Biotransformación">Compostaje</option>
                    <option value="Coprocesamiento">Coprocesamiento</option>
                    <option value="Tratamiento térmico / Incineración">Incineración</option>
                    <option value="Celda de seguridad">Celda de seguridad</option>
                    <option value="Disposición final (Relleno Sanitario)">Relleno Sanitario</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descripción Técnica</label>
                <textarea
                  rows={2}
                  value={catalogoForm.descripcion}
                  onChange={(e) => setCatalogoForm(prev => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Instrucciones sobre segregación, compatibilidad química o almacenamiento..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCatalogoModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
                >
                  {editingCatalogo ? 'Guardar Cambios' : 'Agregar Residuo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
