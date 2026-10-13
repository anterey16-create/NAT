import React, { useState } from 'react';
import { DocumentoSoporte, PeriodoBalance, Establecimiento, Empresa, UserRole } from '../../types';
import { FileText, Plus, Search, Filter, CheckCircle2, AlertTriangle, Download, X } from 'lucide-react';

interface DocumentsViewProps {
  userRole: UserRole;
  documentos: DocumentoSoporte[];
  activePeriodo: PeriodoBalance | undefined;
  activeEstablecimiento: Establecimiento | undefined;
  activeEmpresa: Empresa | undefined;
  onAddDocument: (doc: Omit<DocumentoSoporte, 'id'>) => void;
  onUpdateDocumentStatus: (docId: string, status: 'Pendiente de revisión' | 'Aprobado' | 'Requiere subsanación') => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  userRole,
  documentos,
  activePeriodo,
  activeEstablecimiento,
  activeEmpresa,
  onAddDocument,
  onUpdateDocumentStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFichaFilter, setSelectedFichaFilter] = useState<'all' | number>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    fichaNumero: 1,
    tipoDocumento: 'Acta o certificado técnico' as DocumentoSoporte['tipoDocumento'],
    fechaEmision: new Date().toISOString().split('T')[0],
    tamano: '1.5 MB',
    observaciones: ''
  });

  const filtered = documentos.filter(doc => {
    const matchesPeriod = activePeriodo ? doc.periodoId === activePeriodo.id : true;
    const matchesFicha = selectedFichaFilter === 'all' ? true : doc.fichaNumero === selectedFichaFilter;
    const matchesSearch = 
      doc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tipoDocumento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.observaciones.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPeriod && matchesFicha && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    onAddDocument({
      periodoId: activePeriodo?.id || 'per-01',
      establecimientoId: activeEstablecimiento?.id || 'est-01',
      fichaNumero: Number(formData.fichaNumero),
      nombre: formData.nombre.endsWith('.pdf') ? formData.nombre : `${formData.nombre}.pdf`,
      tipoDocumento: formData.tipoDocumento,
      fechaEmision: formData.fechaEmision,
      tamano: formData.tamano,
      estadoValidacion: 'Pendiente de revisión',
      observaciones: formData.observaciones
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar soporte por nombre o contenido..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedFichaFilter}
              onChange={(e) => setSelectedFichaFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium text-slate-700"
            >
              <option value="all">Todas las secciones</option>
              {Array.from(new Set(documentos.map(d => d.fichaNumero))).sort((a, b) => a - b).map(num => (
                <option key={num} value={num}>Capítulo / Sección {num}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Adjuntar Soporte Técnico</span>
        </button>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Documento / Archivo</th>
                <th className="py-3 px-4">Ficha RUA Vinculada</th>
                <th className="py-3 px-4">Tipo de Soporte</th>
                <th className="py-3 px-4">Fecha de Emisión</th>
                <th className="py-3 px-4">Observaciones Técnicas</th>
                <th className="py-3 px-4 text-center">Estado Validación</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5 font-bold text-slate-900">
                      <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="truncate max-w-xs">{doc.nombre}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 pl-6">{doc.tamano}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                    Ficha {doc.fichaNumero}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {doc.tipoDocumento}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">
                    {doc.fechaEmision}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                    <div className="truncate" title={doc.observaciones}>
                      {doc.observaciones || 'Sin observaciones'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      doc.estadoValidacion === 'Aprobado'
                        ? 'bg-emerald-100 text-emerald-800'
                        : doc.estadoValidacion === 'Requiere subsanación'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {doc.estadoValidacion}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {userRole === 'admin' ? (
                      <select
                        value={doc.estadoValidacion}
                        onChange={(e) => onUpdateDocumentStatus(doc.id, e.target.value as any)}
                        className="text-[11px] font-semibold bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700"
                      >
                        <option value="Aprobado">Aprobar</option>
                        <option value="Pendiente de revisión">Pendiente</option>
                        <option value="Requiere subsanación">Subsanar</option>
                      </select>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Archivado</span>
                    )}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No hay documentos que coincidan con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Document */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-tight">
                Adjuntar Nuevo Soporte Documental RUA
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre del Archivo / Certificado *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Certificado-Disposicion-Tecnica-2024.pdf"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Capítulo o Ficha Vinculada *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.fichaNumero}
                    onChange={(e) => setFormData({ ...formData, fichaNumero: Number(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Soporte Documental *</label>
                  <select
                    value={formData.tipoDocumento}
                    onChange={(e) => setFormData({ ...formData, tipoDocumento: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Acta o certificado técnico">Acta o certificado técnico</option>
                    <option value="Factura de servicio público">Factura de servicio público</option>
                    <option value="Caracterización o análisis de laboratorio">Caracterización o análisis de laboratorio</option>
                    <option value="Permiso o acto administrativo">Permiso o acto administrativo</option>
                    <option value="Manifiesto de transporte">Manifiesto de transporte</option>
                    <option value="Certificado de calibración">Certificado de calibración</option>
                    <option value="Plan de contingencia ambiental">Plan de contingencia ambiental</option>
                    <option value="Otro soporte documental">Otro soporte documental</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha de Emisión</label>
                  <input
                    type="date"
                    value={formData.fechaEmision}
                    onChange={(e) => setFormData({ ...formData, fechaEmision: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tamaño Estimado</label>
                  <input
                    type="text"
                    value={formData.tamano}
                    onChange={(e) => setFormData({ ...formData, tamano: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción / Observaciones del Documento</label>
                <textarea
                  rows={2}
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  placeholder="Detalle del gestor, número de manifiesto o alcance de la certificación..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
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
                  Guardar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
