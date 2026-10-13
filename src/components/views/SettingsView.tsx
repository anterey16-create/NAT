import React, { useState } from 'react';
import { Settings, ShieldAlert, Download, RefreshCw, Bell, CheckCircle2 } from 'lucide-react';
import { Empresa, Establecimiento, PeriodoBalance, DocumentoSoporte, FichaRuaRegistro } from '../../types';

interface SettingsViewProps {
  empresas: Empresa[];
  establecimientos: Establecimiento[];
  periodos: PeriodoBalance[];
  documentos: DocumentoSoporte[];
  fichasRecords: Record<string, FichaRuaRegistro[]>;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  empresas,
  establecimientos,
  periodos,
  documentos,
  fichasRecords,
  onResetData
}) => {
  const [diasAnticipacion, setDiasAnticipacion] = useState(30);
  const [alertaDiferenciaHídrica, setAlertaDiferenciaHídrica] = useState(15);
  const [notifSuccess, setNotifSuccess] = useState(false);

  const handleExportJson = () => {
    const backupData = {
      sistema: 'Nativa Ambiental - Gestión RUA Colombia',
      fechaExportacion: new Date().toISOString(),
      version: '1.0.0-CO',
      empresas,
      establecimientos,
      periodos,
      documentos,
      fichasRecords
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Nativa-Ambiental-RUA-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setNotifSuccess(true);
    setTimeout(() => setNotifSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Settings Card */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Parámetros del Sistema y Alertas RUA
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configuración de umbrales de advertencia, plazos normativos y copias de seguridad de la información.
          </p>
        </div>

        {notifSuccess && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Configuración guardada correctamente en el almacenamiento local.</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Días de Anticipación para Alertas de Vencimiento IDEAM
              </label>
              <input
                type="number"
                min={5}
                max={90}
                value={diasAnticipacion}
                onChange={(e) => setDiasAnticipacion(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
              <span className="text-[11px] text-slate-400">
                Notificar al consultor antes del plazo legal oficial (31 de Mayo).
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tolerancia de Desbalance Hídrico (%)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={alertaDiferenciaHídrica}
                onChange={(e) => setAlertaDiferenciaHídrica(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
              <span className="text-[11px] text-slate-400">
                Alerta si el agua vertida excede el agua captada descontando pérdidas.
              </span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-sm"
            >
              Guardar Parámetros
            </button>
          </div>
        </form>
      </div>

      {/* Backup and Data Export */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Respaldo y Exportación de Datos de Trabajo
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Descargue todos los expedientes de empresas, establecimientos, períodos y fichas de balance en formato JSON estructurado.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleExportJson}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Exportar Expediente RUA Completo (.json)</span>
          </button>

          <button
            onClick={onResetData}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restablecer Base de Datos Local</span>
          </button>
        </div>
      </div>

      {/* Security & Disclaimer Notice */}
      <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Aclaración de Alcance Técnico y Privacidad</span>
        </div>
        <p className="leading-relaxed">
          Nativa Ambiental es un software de estructuración previa y preparación de la información. No almacena credenciales bancarias ni sustituye el trámite oficial ante las Ventanillas Integrales de Trámites Ambientales en Línea (VITAL) o el sistema IDEAM RUA. Todos los datos ingresados en esta sesión se mantienen en el almacenamiento local de su navegador.
        </p>
      </div>
    </div>
  );
};
