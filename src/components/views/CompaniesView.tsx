import React, { useState } from 'react';
import { Empresa, UserRole } from '../../types';
import { Building2, Plus, Search, Edit2, CheckCircle2, Mail, Phone, MapPin, X } from 'lucide-react';

interface CompaniesViewProps {
  userRole: UserRole;
  empresas: Empresa[];
  onAddEmpresa: (empresa: Omit<Empresa, 'id'>) => void;
  onUpdateEmpresa: (empresa: Empresa) => void;
  selectedEmpresaId: string;
  onSelectEmpresaId: (id: string) => void;
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({
  userRole,
  empresas,
  onAddEmpresa,
  onUpdateEmpresa,
  selectedEmpresaId,
  onSelectEmpresaId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    nit: '',
    razonSocial: '',
    representanteLegal: '',
    correoContacto: '',
    telefono: '',
    direccionPrincipal: '',
    ciudad: '',
    departamento: '',
    sectorCIIU: '',
    estado: 'Activa' as 'Activa' | 'Inactiva'
  });

  const [formError, setFormError] = useState('');

  const filtered = empresas.filter(e => 
    e.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.nit.includes(searchTerm) ||
    e.ciudad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const normalizeNit = (rawNit: string) => {
    return rawNit.replace(/[^0-9kK]/g, '').toLowerCase();
  };

  const openCreateModal = () => {
    setEditingEmpresa(null);
    setFormData({
      nit: '',
      razonSocial: '',
      representanteLegal: '',
      correoContacto: '',
      telefono: '',
      direccionPrincipal: '',
      ciudad: 'Bogotá D.C.',
      departamento: 'Cundinamarca',
      sectorCIIU: '2011 - Fabricación de sustancias químicas básicas',
      estado: 'Activa'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (empresa: Empresa) => {
    setEditingEmpresa(empresa);
    setFormData({
      nit: empresa.nit,
      razonSocial: empresa.razonSocial,
      representanteLegal: empresa.representanteLegal || '',
      correoContacto: empresa.correoContacto || '',
      telefono: empresa.telefono || '',
      direccionPrincipal: empresa.direccionPrincipal || '',
      ciudad: empresa.ciudad || 'Bogotá D.C.',
      departamento: empresa.departamento || 'Cundinamarca',
      sectorCIIU: empresa.sectorCIIU || '',
      estado: empresa.estado || 'Activa'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNit = formData.nit.trim();
    const cleanRazonSocial = formData.razonSocial.trim();

    if (!cleanNit || !cleanRazonSocial) {
      setFormError('El NIT y la Razón Social son campos obligatorios requeridos.');
      return;
    }

    // Validación de duplicados de NIT normalizado
    const normNewNit = normalizeNit(cleanNit);
    const existsDuplicateNit = empresas.some(e => {
      // Si estamos editando, omitir la misma empresa
      if (editingEmpresa && e.id === editingEmpresa.id) return false;
      return normalizeNit(e.nit) === normNewNit;
    });

    if (existsDuplicateNit) {
      setFormError(`Ya existe una empresa registrada con el NIT «${cleanNit}». Por favor verifique el número.`);
      return;
    }

    if (editingEmpresa) {
      onUpdateEmpresa({
        ...editingEmpresa,
        ...formData,
        nit: cleanNit,
        razonSocial: cleanRazonSocial
      });
    } else {
      onAddEmpresa({
        ...formData,
        nit: cleanNit,
        razonSocial: cleanRazonSocial
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por Razón Social, NIT o Ciudad..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Registrar Empresa</span>
        </button>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Razón Social & NIT</th>
                <th className="py-3 px-4">Representante Legal</th>
                <th className="py-3 px-4">Ubicación</th>
                <th className="py-3 px-4">Sector Económico (CIIU)</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((emp) => {
                const isSelected = emp.id === selectedEmpresaId;

                return (
                  <tr 
                    key={emp.id} 
                    className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-emerald-50/50' : ''}`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{emp.razonSocial}</div>
                      <div className="font-mono text-[11px] text-slate-500">NIT: {emp.nit}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{emp.representanteLegal}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{emp.correoContacto}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{emp.ciudad}, {emp.departamento}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 pl-4">{emp.direccionPrincipal}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-700 max-w-xs truncate" title={emp.sectorCIIU}>
                        {emp.sectorCIIU}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        emp.estado === 'Activa'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {emp.estado}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => onSelectEmpresaId(emp.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                          isSelected 
                            ? 'bg-emerald-700 text-white' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? 'Activa' : 'Seleccionar'}
                      </button>
                      <button
                        onClick={() => openEditModal(emp)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors"
                        title="Editar Empresa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No se encontraron empresas registradas</p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                      {searchTerm ? 'No hay coincidencias con el término de búsqueda ingresado.' : 'No existen empresas en el directorio. Utiliza el botón superior para crear la primera.'}
                    </p>
                    {!searchTerm && (
                      <button
                        onClick={openCreateModal}
                        className="mt-3 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Registrar Empresa</span>
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden my-8 animate-fade-in">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-tight">
                {editingEmpresa ? 'Editar Datos de la Empresa' : 'Registrar Nueva Empresa'}
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
                  <label className="block font-bold text-slate-700 mb-1">NIT con dígito de verificación *</label>
                  <input
                    type="text"
                    value={formData.nit}
                    onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                    placeholder="Ej: 900.512.441-8"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Razón Social *</label>
                  <input
                    type="text"
                    value={formData.razonSocial}
                    onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
                    placeholder="Ej: Industrias Químicas S.A.S."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Representante Legal</label>
                  <input
                    type="text"
                    value={formData.representanteLegal}
                    onChange={(e) => setFormData({ ...formData, representanteLegal: e.target.value })}
                    placeholder="Nombre completo"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Correo de Contacto Ambiental</label>
                  <input
                    type="email"
                    value={formData.correoContacto}
                    onChange={(e) => setFormData({ ...formData, correoContacto: e.target.value })}
                    placeholder="ambiental@empresa.com.co"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="+57 (601) 745-8900"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ciudad / Municipio</label>
                  <input
                    type="text"
                    value={formData.ciudad}
                    onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                    placeholder="Bogotá D.C."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Departamento</label>
                  <input
                    type="text"
                    value={formData.departamento}
                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                    placeholder="Cundinamarca"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dirección Principal</label>
                <input
                  type="text"
                  value={formData.direccionPrincipal}
                  onChange={(e) => setFormData({ ...formData, direccionPrincipal: e.target.value })}
                  placeholder="Calle / Carrera / Zona Industrial"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Sector Económico (CIIU Rev. 4 A.C.)</label>
                  <input
                    type="text"
                    value={formData.sectorCIIU}
                    onChange={(e) => setFormData({ ...formData, sectorCIIU: e.target.value })}
                    placeholder="Ej: 2011 - Fabricación de sustancias químicas básicas"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estado Operativo *</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value as 'Activa' | 'Inactiva' })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Activa">Activa</option>
                    <option value="Inactiva">Inactiva</option>
                  </select>
                </div>
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
                  {editingEmpresa ? 'Guardar Cambios' : 'Registrar Empresa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
