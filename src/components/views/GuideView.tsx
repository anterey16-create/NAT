import React from 'react';
import { BookOpen, ShieldAlert, CheckCircle2, ExternalLink, FileText, Scale } from 'lucide-react';
import { FICHAS_RUA_DEFINICIONES } from '../../data/ruaDefinitions';

export const GuideView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Intro Header */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Manual Técnico Operativo RUA Colombia</span>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Guía Integral para la Preparación del Registro Único Ambiental (RUA)
        </h2>

        <p className="text-xs text-slate-600 leading-relaxed">
          El Registro Único Ambiental (RUA) es el instrumento oficial establecido por el Ministerio de Ambiente y Desarrollo Sostenible (MADS) y operado técnicamente por el Instituto de Hidrología, Meteorología y Estudios Ambientales (IDEAM) para consolidar la información sobre el uso, aprovechamiento y afectación de los recursos naturales renovables por parte de los establecimientos industriales y de servicios en Colombia.
        </p>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Aviso de Radicación Oficial:</strong> Esta plataforma <strong>Nativa Ambiental</strong> funciona como entorno interno de acopio, validación cruzada y precarga documental. El cargue oficial vinculante ante la autoridad ambiental se efectúa exclusivamente en los servidores oficiales del IDEAM mediante las credenciales asignadas a su establecimiento.
          </div>
        </div>
      </div>

      {/* Normative Framework */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
          <Scale className="w-4 h-4 text-emerald-700" />
          <span>Marco Jurídico y Normativo Aplicable en Colombia</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900">Decreto 1076 de 2015</div>
            <div className="text-[11px] text-emerald-700 font-semibold">Decreto Único Reglamentario del Sector Ambiente</div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Compila las disposiciones sobre licenciamiento, concesiones de aguas, permisos de vertimientos, emisiones atmosféricas y gestión de residuos peligrosos (RESPEL).
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900">Resolución 1023 de 2010 (MADS)</div>
            <div className="text-[11px] text-emerald-700 font-semibold">Adopción del Registro Único Ambiental (RUA)</div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Establece la obligatoriedad del diligenciamiento del RUA para el sector manufacturero y reglamenta el protocolo de captura anual de datos ambientales.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900">Resolución 1362 de 2007 (IDEAM / MAVDT)</div>
            <div className="text-[11px] text-emerald-700 font-semibold">Registro de Generadores de Residuos Peligrosos</div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Regula el reporte anual de cantidades, corrientes y gestores autorizados para los generadores de RESPEL antes del 31 de marzo / mayo de cada vigencia.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900">Resolución 0631 de 2015 (MADS)</div>
            <div className="text-[11px] text-emerald-700 font-semibold">Parámetros de Vertimientos Puntuales</div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Fija los valores límites máximos permisibles para descargas de aguas residuales domésticas (ARD) y no domésticas (ARnD) a cuerpos de agua y alcantarillado.
            </p>
          </div>
        </div>
      </div>

      {/* Estructura Modular de Diligenciamiento */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Estructura Modular de Diligenciamiento RUA
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Espacios preparados para incorporar los nombres de capítulos, variables y reglas de balance ambiental una vez se verifique el manual oficial del RUA.
          </p>
        </div>

        {FICHAS_RUA_DEFINICIONES.length > 0 ? (
          <div className="space-y-4">
            {FICHAS_RUA_DEFINICIONES.map((def) => (
              <div
                key={def.numero}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {def.titulo}
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-emerald-700">
                    {def.codigo}
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed">
                  {def.descripcion}
                </p>

                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  <strong>Soportes requeridos:</strong> {def.seccionesSugeridas.join(' · ')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-600 space-y-2">
            <p className="font-bold text-slate-800">
              Estructura documental en proceso de consolidación
            </p>
            <p className="text-slate-500 leading-relaxed">
              Para garantizar el cumplimiento riguroso de la normativa colombiana sin inventar campos oficiales ni reglas de obligatoriedad inexistentes, la asignación de capítulos definitivos se activará tras cotejar el manual oficial RUA del IDEAM.
            </p>
          </div>
        )}
      </div>

      {/* Step by Step Workflow */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Flujo de Trabajo Recomendado
        </h3>

        <ol className="space-y-3 text-xs text-slate-700">
          <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
            <div>
              <strong>Recopilación Documental:</strong> Reunir las 12 facturas de energía, los 6 bimestres de acueducto, las actas de entrega de RESPEL y los informes de laboratorio acreditado del año inmediatamente anterior.
            </div>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
            <div>
              <strong>Diligenciamiento y Balance de Masa:</strong> Ingresar los valores consolidados en las fichas correspondientes dentro de Nativa Ambiental, verificando que los balances de agua, energía y materias primas guarden coherencia con la producción reportada.
            </div>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
            <div>
              <strong>Revisión Técnica de Auditoría:</strong> El consultor o director ambiental revisa los soportes vinculados y aprueba el período cambiando su estado a "Listo para cargue".
            </div>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">4</span>
            <div>
              <strong>Cargue y Radicación Oficial ante el IDEAM:</strong> Con la información consolidada y prevalidada, el usuario ingresa al aplicativo del IDEAM, replica los datos verificados y genera el número de radicado oficial con firma digital.
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
};
