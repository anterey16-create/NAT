import React, { useState, useEffect } from 'react';
import { 
  FichaRuaRegistro, 
  FichaRuaStatus, 
  PeriodoBalance, 
  Establecimiento, 
  Empresa, 
  DocumentoSoporte 
} from '../../types';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Save, 
  FileText, 
  Paperclip, 
  Info, 
  FileSpreadsheet,
  Plus,
  Trash2
} from 'lucide-react';

interface RuaFichasViewProps {
  activePeriodo: PeriodoBalance | undefined;
  activeEstablecimiento: Establecimiento | undefined;
  activeEmpresa: Empresa | undefined;
  fichasRecords: FichaRuaRegistro[];
  documentos: DocumentoSoporte[];
  onSaveFicha: (fichaNumero: number, estado: FichaRuaStatus, responsable: string, observaciones: string, datos: Record<string, any>) => void;
  onAddChapter: () => void;
  onAddDocument: (doc: Omit<DocumentoSoporte, 'id'>) => void;
  selectedFichaNumero?: number;
}

export const RuaFichasView: React.FC<RuaFichasViewProps> = ({
  activePeriodo,
  activeEstablecimiento,
  activeEmpresa,
  fichasRecords,
  documentos,
  onSaveFicha,
  onAddChapter,
  onAddDocument,
  selectedFichaNumero
}) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  useEffect(() => {
    if (selectedFichaNumero && fichasRecords.length > 0) {
      const idx = fichasRecords.findIndex(r => r.fichaNumero === selectedFichaNumero);
      if (idx >= 0) {
        setSelectedChapterIndex(idx);
      }
    }
  }, [selectedFichaNumero, fichasRecords]);

  const currentRecord = fichasRecords[selectedChapterIndex];

  // Form state
  const [estado, setEstado] = useState<FichaRuaStatus>('sin_iniciar');
  const [responsable, setResponsable] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [tituloCapitulo, setTituloCapitulo] = useState('');
  const [datosRegistro, setDatosRegistro] = useState({
    variablesCuantitativas: '',
    unidadesMedida: '',
    metodologiaCalculo: '',
    entidadLaboratorio: '',
    notasTecnicas: ''
  });

  useEffect(() => {
    if (currentRecord) {
      setEstado(currentRecord.estado);
      setResponsable(currentRecord.responsableDiligenciamiento || '');
      setObservaciones(currentRecord.observacionesTecnicas || '');
      setTituloCapitulo(currentRecord.datos?.titulo || `Capítulo ${currentRecord.fichaNumero}`);
      setDatosRegistro({
        variablesCuantitativas: currentRecord.datos?.variablesCuantitativas || '',
        unidadesMedida: currentRecord.datos?.unidadesMedida || '',
        metodologiaCalculo: currentRecord.datos?.metodologiaCalculo || '',
        entidadLaboratorio: currentRecord.datos?.entidadLaboratorio || '',
        notasTecnicas: currentRecord.datos?.notasTecnicas || ''
      });
    } else {
      setEstado('sin_iniciar');
      setResponsable('');
      setObservaciones('');
      setTituloCapitulo('');
      setDatosRegistro({
        variablesCuantitativas: '',
        unidadesMedida: '',
        metodologiaCalculo: '',
        entidadLaboratorio: '',
        notasTecnicas: ''
      });
    }
    setSaveSuccessMsg(false);
  }, [selectedChapterIndex, currentRecord]);

  const handleFieldChange = (field: string, value: string) => {
    setDatosRegistro(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRecord) return;

    onSaveFicha(
      currentRecord.fichaNumero,
      estado,
      responsable,
      observaciones,
      {
        ...datosRegistro,
        titulo: tituloCapitulo || `Capítulo ${currentRecord.fichaNumero}`
      }
    );
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const chapterDocs = currentRecord 
    ? documentos.filter(d => d.periodoId === activePeriodo?.id && d.fichaNumero === currentRecord.fichaNumero)
    : [];

  return (
    <div className="space-y-6">
      {/* Banner de Contexto */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Diligenciamiento y Preparación RUA
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
            {activeEstablecimiento?.nombre || 'Establecimiento Seleccionado'} — Período {activePeriodo?.anio || 'N/A'}
          </h2>
          <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
            <span><strong>Empresa:</strong> {activeEmpresa?.razonSocial || 'No especificada'}</span>
            <span><strong>Código RUA:</strong> {activeEstablecimiento?.codigoEstablecimiento || 'Sin código'}</span>
            <span><strong>Estado del Período:</strong> {activePeriodo?.estado || 'Sin período'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Progreso real del período:</span>
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded">
            {activePeriodo?.progresoPorcentaje || 0}%
          </span>
        </div>
      </div>

      {/* Nota de Preparación Documental sin nombres inventados */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-slate-900 block">Estructura preparada para incorporación documental</strong>
          <p>
            Este módulo conserva la arquitectura necesaria para registrar variables, notas técnicas de auditoría y anexar soportes documentales. La lista definitiva de capítulos, nombres normativos y reglas de obligatoriedad se incorporará una vez se verifique y cargue el manual oficial del RUA.
          </p>
        </div>
      </div>

      {/* Si no hay capítulos creados para este período */}
      {fichasRecords.length === 0 ? (
        <div className="p-8 rounded-xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">
              No hay capítulos registrados para este período de balance
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Puede registrar los capítulos necesarios para estructurar las variables y soportes del establecimiento.
            </p>
          </div>
          <button
            onClick={onAddChapter}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Primer Capítulo de Balance</span>
          </button>
        </div>
      ) : (
        /* Grid con listado de capítulos a la izquierda y editor a la derecha */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Navegación izquierda de capítulos */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Capítulos Registrados ({fichasRecords.length})</span>
              <button
                onClick={onAddChapter}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                title="Agregar nuevo capítulo de balance"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
              {fichasRecords.map((record, index) => {
                const isSelected = index === selectedChapterIndex;

                return (
                  <button
                    key={record.id}
                    onClick={() => setSelectedChapterIndex(index)}
                    className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 ${
                      isSelected 
                        ? 'bg-emerald-50 border-l-4 border-l-emerald-700' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                      isSelected 
                        ? 'bg-emerald-700 text-white' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {record.fichaNumero}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[11px] font-mono text-slate-400">Capítulo {record.fichaNumero}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          record.estado === 'completada'
                            ? 'bg-emerald-100 text-emerald-800'
                            : record.estado === 'en_progreso'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {record.estado === 'completada' ? 'Completada' : record.estado === 'en_progreso' ? 'En progreso' : 'Sin iniciar'}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-slate-900 truncate">
                        {record.datos?.titulo || `Capítulo ${record.fichaNumero}`}
                      </div>

                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {record.observacionesTecnicas || 'Sin observaciones'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editor del capítulo seleccionado */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            {currentRecord && (
              <>
                {/* Header del Capítulo */}
                <div className="pb-5 border-b border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-700">
                      Registro Técnico · Capítulo {currentRecord.fichaNumero}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Estado:</span>
                      <select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value as FichaRuaStatus)}
                        className={`text-xs font-bold px-2.5 py-1 rounded border focus:outline-none ${
                          estado === 'completada'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : estado === 'en_progreso'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-slate-50 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="sin_iniciar">Sin iniciar</option>
                        <option value="en_progreso">En progreso</option>
                        <option value="completada">Completada</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Identificador o Nombre del Capítulo
                    </label>
                    <input
                      type="text"
                      value={tituloCapitulo}
                      onChange={(e) => setTituloCapitulo(e.target.value)}
                      placeholder={`Ej: Capítulo ${currentRecord.fichaNumero} - Registro de Variables`}
                      className="w-full text-base font-bold text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                {/* Formulario de Registro */}
                <form onSubmit={handleSave} className="space-y-6">
                  {saveSuccessMsg && (
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Avance guardado exitosamente. El progreso del período ha sido actualizado.</span>
                    </div>
                  )}

                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Variables Cuantitativas / Cantidades Consolidadas
                        </label>
                        <input
                          type="text"
                          value={datosRegistro.variablesCuantitativas}
                          onChange={(e) => handleFieldChange('variablesCuantitativas', e.target.value)}
                          placeholder="Ej: Valores numéricos recopilados del balance"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Unidades de Medida Empleadas
                        </label>
                        <input
                          type="text"
                          value={datosRegistro.unidadesMedida}
                          onChange={(e) => handleFieldChange('unidadesMedida', e.target.value)}
                          placeholder="Ej: m³, kWh, kg, Toneladas, horas/año..."
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Metodología de Medición o Estimación
                        </label>
                        <input
                          type="text"
                          value={datosRegistro.metodologiaCalculo}
                          onChange={(e) => handleFieldChange('metodologiaCalculo', e.target.value)}
                          placeholder="Ej: Macromedición / Facturación / Balance de masa"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Entidad, Proveedor o Laboratorio Involucrado
                        </label>
                        <input
                          type="text"
                          value={datosRegistro.entidadLaboratorio}
                          onChange={(e) => handleFieldChange('entidadLaboratorio', e.target.value)}
                          placeholder="Ej: Empresa prestadora / Laboratorio ambiental"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Notas Técnicas y Registro Detallado del Capítulo
                      </label>
                      <textarea
                        rows={3}
                        value={datosRegistro.notasTecnicas}
                        onChange={(e) => handleFieldChange('notasTecnicas', e.target.value)}
                        placeholder="Describa los datos analizados, fuentes de información y detalles técnicos..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Metadatos: Responsable y Observaciones */}
                  <div className="pt-4 border-t border-slate-200 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Profesional Responsable del Diligenciamiento
                        </label>
                        <input
                          type="text"
                          value={responsable}
                          onChange={(e) => setResponsable(e.target.value)}
                          placeholder="Nombre y cargo del responsable técnico"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Soportes Vinculados a este Capítulo
                        </label>
                        <div className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-between">
                          <span>{chapterDocs.length} archivo(s) anexo(s)</span>
                          <span className="font-semibold text-emerald-700">Expediente al día</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Observaciones Técnicas y Pendientes de Información
                      </label>
                      <textarea
                        rows={2}
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        placeholder="Detalle sobre estados de avance o requerimientos de subsanación..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Sección de Soportes Vinculados */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                      <span>Soportes Anexos ({chapterDocs.length})</span>
                    </span>

                    {chapterDocs.length > 0 ? (
                      <div className="space-y-2">
                        {chapterDocs.map(doc => (
                          <div
                            key={doc.id}
                            className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                              <div>
                                <div className="font-semibold text-slate-800">{doc.nombre}</div>
                                <div className="text-[10px] text-slate-400">{doc.tipoDocumento} · {doc.tamano}</div>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {doc.estadoValidacion}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">
                        No hay archivos vinculados a este capítulo aún. Puede cargarlos en el módulo "Documentos y Soportes".
                      </div>
                    )}
                  </div>

                  {/* Botón de Guardado */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500">
                      Última modificación: {currentRecord.ultimaActualizacion || 'Sin guardar'}
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>Guardar Avance de Capítulo</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
