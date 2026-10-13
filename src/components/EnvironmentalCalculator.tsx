import React, { useState, useMemo } from 'react';
import { CalculatorInput, SectorType, ProjectCategory, BiomeType } from '../types';
import { BIOME_FACTORS } from '../data/content';
import { Calculator, ArrowRight, ShieldCheck, TreePine, Droplets, Mountain } from 'lucide-react';

interface EnvironmentalCalculatorProps {
  onTransferToQuote: (params: {
    category: ProjectCategory;
    sector: SectorType;
    estimatedArea: string;
    details: string;
  }) => void;
  lang: 'pt' | 'en';
}

export const EnvironmentalCalculator: React.FC<EnvironmentalCalculatorProps> = ({ onTransferToQuote, lang }) => {
  const [sector, setSector] = useState<SectorType>('infraestrutura');
  const [category, setCategory] = useState<ProjectCategory>('hidrossemeadura');
  const [areaSquareMeters, setAreaSquareMeters] = useState<number>(15000);
  const [slopeAngle, setSlopeAngle] = useState<'baixa' | 'moderada' | 'alta'>('moderada');
  const [biome, setBiome] = useState<BiomeType>('mata-atlantica');

  // Interactive calculations
  const results = useMemo(() => {
    const hectares = areaSquareMeters / 10000;
    const biomeConfig = BIOME_FACTORS[biome] || BIOME_FACTORS['mata-atlantica'];

    // Hydroseeding slurry calculation
    // Slurry density: ~0.35kg - 0.50kg mulch + fertilizer + seeds per m²
    const slopeMultiplier = slopeAngle === 'alta' ? 1.4 : slopeAngle === 'moderada' ? 1.15 : 1.0;
    const biomassKg = Math.round(areaSquareMeters * 0.42 * slopeMultiplier);
    const slurryLiters = Math.round(biomassKg * 4.5);

    // Native seedlings calculation for PRAD / Reforestation
    // Standard recommended density in Brazil: ~1.100 - 1.667 seedlings / ha
    const nativeSeedlings = Math.round(hectares * biomeConfig.seedlingDensityPerHa);

    // Coverage timeline
    const daysToCover = slopeAngle === 'alta' 
      ? biomeConfig.germinationDays + 25 
      : biomeConfig.germinationDays + 15;

    // Soil erosion reduction
    const erosionReduction = slopeAngle === 'alta' ? 97.5 : 99.1;

    // Carbon sequestration estimate (approx 6.8 tCO2e / ha / year for tropical native restoration)
    const carbonMitigation = Number((hectares * 7.2).toFixed(1));

    // Estimated cost range based on standard Brazilian environmental engineering tables (SINAPI / DER)
    let unitCostMin = 14.5;
    let unitCostMax = 22.0;

    if (category === 'reflorestamento') {
      unitCostMin = 18.0;
      unitCostMax = 32.0;
    } else if (category === 'supressao') {
      unitCostMin = 9.0;
      unitCostMax = 16.0;
    } else if (category === 'monitoramento' || category === 'licenciamento') {
      unitCostMin = 5.0;
      unitCostMax = 11.0;
    }

    if (slopeAngle === 'alta') {
      unitCostMin *= 1.35;
      unitCostMax *= 1.40;
    }

    const costMin = Math.round(areaSquareMeters * unitCostMin);
    const costMax = Math.round(areaSquareMeters * unitCostMax);

    return {
      hectares: Number(hectares.toFixed(2)),
      biomassKg,
      slurryLiters,
      nativeSeedlings,
      daysToCover,
      erosionReduction,
      carbonMitigation,
      costMin,
      costMax,
      speciesList: biomeConfig.typicalSpecies
    };
  }, [category, areaSquareMeters, slopeAngle, biome]);

  const handleApplyToQuote = () => {
    const details = `Simulação Técnica: Área de ${areaSquareMeters.toLocaleString('pt-BR')} m² (${results.hectares} ha), Bioma: ${biome}, Declividade: ${slopeAngle}, Estimativa de ${results.nativeSeedlings} mudas e ${results.biomassKg} kg de biomassa.`;
    onTransferToQuote({
      category,
      sector,
      estimatedArea: `${areaSquareMeters.toLocaleString('pt-BR')} m²`,
      details
    });
  };

  return (
    <section id="calculadora" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">
            {lang === 'pt' ? 'Dimensionamento Geotécnico e Florestal' : 'Engineering Estimator'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
            {lang === 'pt' ? (
              <>Simulador de Projeto e Recuperação Ambiental</>
            ) : (
              <>Environmental Impact and Bio-stabilization Calculator</>
            )}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {lang === 'pt' ? (
              <>Calcule parâmetros de biomassa, mudas florestais nativas, tempo de recobrimento vegetal e estimativa de mitigação erosiva para o seu empreendimento.</>
            ) : (
              <>Estimate biomass slurry volume, native seedling requirements, vegetation coverage timeline, and soil erosion reduction for your site.</>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-xl border border-slate-200 space-y-6">
            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                1. {lang === 'pt' ? 'Tipo de Intervenção Ambiental' : 'Intervention Type'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'hidrossemeadura', label: 'Hidrossemeadura' },
                  { id: 'reflorestamento', label: 'PRAD / Reflorestamento' },
                  { id: 'monitoramento', label: 'Monitoramento & Laudos' },
                  { id: 'licenciamento', label: 'Licenciamento / EIA' },
                  { id: 'supressao', label: 'Supressão & Resgate' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id as ProjectCategory)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all text-left whitespace-nowrap overflow-hidden text-ellipsis ${
                      category === item.id
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sector Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                2. {lang === 'pt' ? 'Segmento do Empreendimento' : 'Project Sector'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'infraestrutura', label: 'Rodovias / Obras' },
                  { id: 'mineracao', label: 'Mineração' },
                  { id: 'energia', label: 'Energia / PCH' },
                  { id: 'loteamentos', label: 'Loteamentos' },
                  { id: 'industria', label: 'Indústria' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSector(item.id as SectorType)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all text-center whitespace-nowrap overflow-hidden text-ellipsis ${
                      sector === item.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Area Slider & Quick Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  3. {lang === 'pt' ? 'Área de Intervenção' : 'Site Area'}
                </label>
                <span className="text-sm font-mono font-bold text-emerald-800 tabular-nums">
                  {areaSquareMeters.toLocaleString('pt-BR')} m² <span className="text-xs text-slate-500 font-normal">({results.hectares} ha)</span>
                </span>
              </div>

              <input
                type="range"
                min={1000}
                max={250000}
                step={1000}
                value={areaSquareMeters}
                onChange={(e) => setAreaSquareMeters(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
              />

              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-slate-500">{lang === 'pt' ? 'Atalhos:' : 'Presets:'}</span>
                {[5000, 15000, 50000, 120000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAreaSquareMeters(val)}
                    className="text-xs px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-600 hover:text-slate-900 tabular-nums"
                  >
                    {(val / 1000)}k m²
                  </button>
                ))}
              </div>
            </div>

            {/* Slope & Biome Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  4. {lang === 'pt' ? 'Declividade do Talude' : 'Slope Inclination'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'baixa', label: '< 20° (Plano)' },
                    { id: 'moderada', label: '20°-45°' },
                    { id: 'alta', label: '> 45° (Íngreme)' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSlopeAngle(item.id as 'baixa' | 'moderada' | 'alta')}
                      className={`px-2 py-1.5 text-xs font-medium rounded border text-center whitespace-nowrap ${
                        slopeAngle === item.id
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  5. {lang === 'pt' ? 'Bioma de Referência' : 'Target Biome'}
                </label>
                <select
                  value={biome}
                  onChange={(e) => setBiome(e.target.value as BiomeType)}
                  className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="mata-atlantica">Mata Atlântica (Sudeste/Sul/Litoral)</option>
                  <option value="cerrado">Cerrado (Centro-Oeste/Sudeste)</option>
                  <option value="caatinga">Caatinga (Nordeste)</option>
                  <option value="amazonia">Amazônia (Norte)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Column (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-8 rounded-xl shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white tracking-tight">
                  {lang === 'pt' ? 'Estimativa Técnica de Campo' : 'Engineered Output'}
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                NBR 11682 / IBAMA
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-800/80 rounded-lg border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'pt' ? 'Calda Hidráulica' : 'Slurry Volume'}</span>
                </div>
                <div className="text-xl font-bold text-white tabular-nums">
                  {results.slurryLiters.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-400">L</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {results.biomassKg.toLocaleString('pt-BR')} kg biomassa sólida
                </p>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-lg border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <TreePine className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'pt' ? 'Mudas Nativas (PRAD)' : 'Native Saplings'}</span>
                </div>
                <div className="text-xl font-bold text-emerald-400 tabular-nums">
                  {results.nativeSeedlings.toLocaleString('pt-BR')}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Diversidade sucessional
                </p>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-lg border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'pt' ? 'Redução de Erosão' : 'Erosion Mitigated'}</span>
                </div>
                <div className="text-xl font-bold text-white tabular-nums">
                  {results.erosionReduction}%
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Retenção de solo imediata
                </p>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-lg border border-slate-700/60">
                <div className="text-xs text-slate-400 mb-1">
                  {lang === 'pt' ? 'Mitigação de Carbono' : 'Carbon Offset'}
                </div>
                <div className="text-xl font-bold text-white tabular-nums">
                  ~{results.carbonMitigation} <span className="text-xs font-normal text-slate-400">tCO₂e</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Projeção anual de biomassa
                </p>
              </div>
            </div>

            {/* Botanical Mix */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                {lang === 'pt' ? 'Espécies Recomendadas no Bioma:' : 'Recommended Native Species:'}
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <ul className="text-xs text-slate-300 space-y-1">
                  {results.speciesList.map((sp, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="italic">{sp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Estimated Budget Range (Indicative) */}
            <div className="p-4 bg-emerald-950/40 rounded-lg border border-emerald-500/30">
              <div className="text-xs text-emerald-300 font-medium mb-1">
                {lang === 'pt' ? 'Estimativa Orçamentária Referencial' : 'Estimated Budget Range'}
              </div>
              <div className="text-lg font-bold text-white tabular-nums">
                R$ {results.costMin.toLocaleString('pt-BR')} a R$ {results.costMax.toLocaleString('pt-BR')}
              </div>
              <p className="text-[11px] text-emerald-200/70 mt-1">
                *Valores referenciais (SINAPI/DER). Inclui insumos, maquinário especializado e equipe técnica. Varia conforme topografia e acesso.
              </p>
            </div>

            <button
              onClick={handleApplyToQuote}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm"
            >
              <span>{lang === 'pt' ? 'Importar Simulação para Orçamento' : 'Generate Technical Proposal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
