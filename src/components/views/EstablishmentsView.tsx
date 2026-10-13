import React, { useState } from 'react';
import { Establecimiento, Empresa, UserRole } from '../../types';
import { AUTORIDADES_AMBIENTALES_COLOMBIA } from '../../data/ruaDefinitions';
import { MapPin, Plus, Search, Edit2, Building2, Compass, X } from 'lucide-react';

interface EstablishmentsViewProps {
  userRole: UserRole;
  establecimientos: Establecimiento[];
  empresas: Empresa[];
  selectedEmpresaId: string;
  onAddEstablecimiento: (est: Omit<Establecimiento, 'id'>) => void;
  onUpdateEstablecimiento: (est: Establecimiento) => void;
}

export const EstablishmentsView: React.FC<EstablishmentsViewProps> = ({
  userRole,
  establecimientos,
  empresas,
  selectedEmpresaId,
  onAddEstablecimiento,
  onUpdateEstablecimiento
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEst, setEditingEst] = useState<Establecimiento | null>(null);

  const [formData, setFormData] = useState({
    empresaId: selectedEmpresaId,
    nombre: '',
    codigoEstablecimiento: '',
    autoridadAmbiental: AUTORIDADES_AMBIENTALES_COLOMBIA[0],
    departamento: 'Bogotá D.C.',
    municipio: 'Bogotá D.C.',
    direccion: '',
    coordenadasLat: '4.638421',
    coordenadasLng: '-74.119253',
    ciiuPrincipal: '',
    descripcionActividad: ''
  });

  const [formError, setFormError] = useState('');

  const filtered = establecimientos.filter(est => {
    const matchesCompany = userRole === 'admin' ? true : est.empresaId === selectedEmpresaId;
    const matchesSearch = 
      est.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.codigoEstablecimiento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.autoridadAmbiental.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCompany && matchesSearch;
  });

  const openCreateModal = () => {
    setEditingEst(null);
    setFormData({
      empresaId: selectedEmpresaId,
      nombre: '',
      codigoEstablecimiento: `EST-${Math.floor(1000 + Math.random() * 9000)}`,
      autoridadAmbiental: AUTORIDADES_AMBIENTALES_COLOMBIA[0],
      departamento: 'Bogotá D.C.',
      municipio: 'Bogotá D.C.',
      direccion: '',
      coordenadasLat: '4.638421',
      coordenadasLng: '-74.119253',
      ciiuPrincipal: '2011 - Fabricación de sustancias químicas básicas',
      descripcionActividad: ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (est: Establecimiento) => {
    setEditingEst(est);
    setFormData({
      empresaId: est.empresaId,
      nombre: est.nombre,
      codigoEstablecimiento: est.codigoEstablecimiento,
      autoridadAmbiental: est.autoridadAmbiental,
      departamento: est.departamento,
      municipio: est.municipio,
      direccion: est.direccion,
      coordenadasLat: est.coordenadasLat,
      coordenadasLng: est.coordenadasLng,
      ciiuPrincipal: est.ciiuPrincipal,
      descripcionActividad: est.descripcionActividad
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.codigoEstablecimiento.trim()) {
      setFormError('El nombre de la sede y el código de establecimiento son requeridos.');
      return;
    }

    if (editingEst) {
      onUpdateEstablecimiento({
        ...editingEst,
        ...formData
      });
    } else {
      onAddEstablecimiento(formData);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por sede, código RUA, municipio o autoridad ambiental..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Establecimiento</span>
        </button>
      </div>

      {/* Establishments Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Establecimiento & Código RUA</th>
                <th className="py-3 px-4">Empresa Matriz</th>
                <th className="py-3 px-4">Autoridad Ambiental Competente</th>
                <th className="py-3 px-4">Ubicación & Coordenadas</th>
                <th className="py-3 px-4">CIIU Principal</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((est) => {
                const empresa = empresas.find(e => e.id === est.empresaId);

                return (
                  <tr key={est.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{est.nombre}</div>
                      <div className="font-mono text-[11px] text-emerald-700 font-semibold">
                        {est.codigoEstablecimiento}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{empresa?.razonSocial || 'No asignada'}</div>
                      <div className="text-[11px] text-slate-500">NIT: {empresa?.nit}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium max-w-xs truncate" title={est.autoridadAmbiental}>
                        {est.autoridadAmbiental}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800">{est.municipio}, {est.departamento}</div>
                      <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                        <Compass className="w-3 h-3 text-slate-400" />
                        <span>Lat: {est.coordenadasLat}, Lng: {est.coordenadasLng}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-700 max-w-xs truncate" title={est.ciiuPrincipal}>
                        {est.ciiuPrincipal}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openEditModal(est)}
                        className="px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-semibold transition-colors"
                      >
                        Editar Sede
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No se encontraron establecimientos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Establishment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 animate-fade-in">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-tight">
                {editingEst ? 'Editar Establecimiento' : 'Registrar Nuevo Establecimiento RUA'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-[11px] border border-red-200">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Empresa Propietaria *</label>
                  <select
                    value={formData.empresaId}
                    onChange={(e) => setFormData({ ...formData, empresaId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {empresas.map(e => (
                      <option key={e.id} value={e.id}>{e.razonSocial} ({e.nit})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre de la Sede / Planta *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Planta Industrial Puente Aranda"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Código RUA del Establecimiento *</label>
                  <input
                    type="text"
                    value={formData.codigoEstablecimiento}
                    onChange={(e) => setFormData({ ...formData, codigoEstablecimiento: e.target.value })}
                    placeholder="Ej: EST-SDA-2024-0891"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <span className="text-[10px] text-slate-400">Código asignado por la autoridad ambiental.</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Autoridad Ambiental Competente *</label>
                  <select
                    value={formData.autoridadAmbiental}
                    onChange={(e) => setFormData({ ...formData, autoridadAmbiental: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {AUTORIDADES_AMBIENTALES_COLOMBIA.map(aut => (
                      <option key={aut} value={aut}>{aut}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Departamento</label>
                  <input
                    type="text"
                    value={formData.departamento}
                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                    placeholder="Bogotá D.C."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Municipio</label>
                  <input
                    type="text"
                    value={formData.municipio}
                    onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                    placeholder="Bogotá D.C."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dirección del Predio</label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    placeholder="Calle 17 No. 68D-21"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coordenada Latitud Decimal</label>
                  <input
                    type="text"
                    value={formData.coordenadasLat}
                    onChange={(e) => setFormData({ ...formData, coordenadasLat: e.target.value })}
                    placeholder="Ej: 4.638421"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coordenada Longitud Decimal</label>
                  <input
                    type="text"
                    value={formData.coordenadasLng}
                    onChange={(e) => setFormData({ ...formData, coordenadasLng: e.target.value })}
                    placeholder="Ej: -74.119253"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Actividad Económica CIIU Principal</label>
                <input
                  type="text"
                  value={formData.ciiuPrincipal}
                  onChange={(e) => setFormData({ ...formData, ciiuPrincipal: e.target.value })}
                  placeholder="Ej: 2011 - Fabricación de sustancias químicas básicas"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción de Procesos Desarrollados en Sede</label>
                <textarea
                  rows={2}
                  value={formData.descripcionActividad}
                  onChange={(e) => setFormData({ ...formData, descripcionActividad: e.target.value })}
                  placeholder="Síntesis química, almacenamiento de insumos y tratamiento de vertimientos..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors font-bold shadow-sm"
                >
                  {editingEst ? 'Guardar Cambios' : 'Registrar Sede'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
