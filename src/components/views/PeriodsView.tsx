import React, { useState } from 'react';
import { PeriodoBalance, Establecimiento, Empresa, PeriodStatus, UserRole } from '../../types';
import { CalendarRange, Plus, CheckCircle2, Clock, ArrowRight, X, AlertCircle } from 'lucide-react';

interface PeriodsViewProps {
  userRole: UserRole;
  periodos: PeriodoBalance[];
  establecimientos: Establecimiento[];
  empresas: Empresa[];
  selectedPeriodoId: string;
  onSelectPeriodoId: (id: string) => void;
  onAddPeriodo: (periodo: Omit<PeriodoBalance, 'id'>) => void;
  onUpdatePeriodoStatus: (periodoId: string, newStatus: PeriodStatus) => void;
  onNavigateToFichas: () => void;
}

export const PeriodsView: React.FC<PeriodsViewProps> = ({
  userRole,
  periodos,
  establecimientos,
  empresas,
  selectedPeriodoId,
  onSelectPeriodoId,
  onAddPeriodo,
  onUpdatePeriodoStatus,
  onNavigateToFichas
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAnio, setNewAnio] = useState(2025);
  const [newEstablecimientoId, setNewEstablecimientoId] = useState(establecimientos[0]?.id || '');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const est = establecimientos.find(e => e.id === newEstablecimientoId);
    if (!est) return;

    onAddPeriodo({
      establecimientoId: est.id,
      empresaId: est.empresaId,
      anio: Number(newAnio),
      fechaInicio: `${newAnio}-01-01`,
      fechaFin: `${newAnio}-12-31`,
      estado: 'Borrador',
      fechaLimiteReporte: `${Number(newAnio) + 1}-05-31`,
      progresoPorcentaje: 0,
      totalFichasCompletadas: 0,
      ultimaModificacion: new Date().toISOString().split('T')[0]
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Períodos de Balance Anual
          </h2>
          <p className="text-xs text-slate-500">
            Cada período agrupa el balance ambiental anual del establecimiento para la preparación y consolidación del RUA.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Abrir Nuevo Período de Balance</span>
        </button>
      </div>

      {/* Periods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {periodos.map((periodo) => {
          const est = establecimientos.find(e => e.id === periodo.establecimientoId);
          const emp = empresas.find(e => e.id === periodo.empresaId);
          const isSelected = periodo.id === selectedPeriodoId;

          return (
            <div
              key={periodo.id}
              className={`bg-white rounded-xl border transition-all p-6 flex flex-col justify-between shadow-sm ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-600/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-700">
                      Vigencia Fiscal
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-900 tabular-nums">
                      Año {periodo.anio}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                    periodo.estado === 'Listo para cargue'
                      ? 'bg-emerald-100 text-emerald-800'
                      : periodo.estado === 'En revisión técnica'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {periodo.estado}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 py-3 border-y border-slate-100">
                  <div className="font-semibold text-slate-900 truncate">
                    {est?.nombre || 'Establecimiento'}
                  </div>
                  <div className="text-slate-500 truncate">
                    {emp?.razonSocial || 'Empresa'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Autoridad: {est?.autoridadAmbiental?.split('-')[0]}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="pt-4 pb-2">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
                    <span>Avance de Diligenciamiento</span>
                    <span className="font-bold font-mono text-slate-900">{periodo.progresoPorcentaje}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 rounded-full transition-all"
                      style={{ width: `${periodo.progresoPorcentaje}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>{periodo.totalFichasCompletadas} ficha(s) completada(s)</span>
                    <span>Límite: {periodo.fechaLimiteReporte}</span>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[11px] font-semibold text-slate-500">Cambiar estado:</label>
                  <select
                    value={periodo.estado}
                    onChange={(e) => onUpdatePeriodoStatus(periodo.id, e.target.value as PeriodStatus)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 font-medium text-slate-700"
                  >
                    <option value="Borrador">Borrador</option>
                    <option value="En diligenciamiento">En diligenciamiento</option>
                    <option value="En revisión técnica">En revisión técnica</option>
                    <option value="Listo para cargue">Listo para cargue</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectPeriodoId(periodo.id);
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-emerald-800 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? 'Período Activo' : 'Activar Período'}
                  </button>

                  <button
                    onClick={() => {
                      onSelectPeriodoId(periodo.id);
                      onNavigateToFichas();
                    }}
                    className="p-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
                    title="Diligenciar Fichas de este Período"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal New Period */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-fade-in">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-tight">
                Abrir Nuevo Período de Balance RUA
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
                <label className="block font-bold text-slate-700 mb-1">Año Fiscal de Balance *</label>
                <select
                  value={newAnio}
                  onChange={(e) => setNewAnio(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value={2026}>Año 2026 (Período en curso)</option>
                  <option value={2025}>Año 2025 (Período previo)</option>
                  <option value={2024}>Año 2024 (Consolidación)</option>
                  <option value={2023}>Año 2023 (Histórico)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Establecimiento / Sede *</label>
                <select
                  value={newEstablecimientoId}
                  onChange={(e) => setNewEstablecimientoId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {establecimientos.map(est => (
                    <option key={est.id} value={est.id}>
                      {est.nombre} ({est.codigoEstablecimiento})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
                <div><strong>Plazo legal de reporte estimado:</strong> 31 de mayo de {newAnio + 1}</div>
                <div><strong>Estructura generada:</strong> Registro de balance anual preparado para diligenciamiento</div>
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
                  Crear Período
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
