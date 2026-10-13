import { ServiceItem, CaseStudy } from '../types';

export const HERO_IMAGE = '/src/assets/images/hero_hydroseeding_nature_1791761389314.jpg';
export const REFORESTATION_IMAGE = '/src/assets/images/reforestation_native_forest_1791761399869.jpg';
export const BIOENGINEERING_IMAGE = '/src/assets/images/slope_stabilization_bioengineering_1791761408143.jpg';
export const SURVEY_IMAGE = '/src/assets/images/environmental_survey_field_1791761417716.jpg';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'hidrossemeadura',
    order: '01',
    title: 'Hidrossemeadura & Bioengenharia de Solos',
    subtitle: 'Estabilização geotécnica e revegetação acelerada de taludes',
    description: 'Aplicação mecanizada de biomassa líquida sob alta pressão contendo sementes selecionadas, fertilizantes de liberação lenta, mulch de fibra de madeira e fixadores poliméricos biodegradáveis. Indicada para encostas íngremes, cortes rodoviários e aterros.',
    image: BIOENGINEERING_IMAGE,
    highlights: [
      'Controle imediato do arraste de sedimentos e assoreamento',
      'Germinação homogênea a partir do 5º dia pós-aplicação',
      'Compatível com mantas antierosivas sintéticas e de fibra de coco'
    ],
    equipment: [
      'Caminhões Hidrossemeadores FINN T120 (4.500L)',
      'Canhões de longo alcance (alcance de até 65 metros)',
      'Bombas centrífugas de alta viscosidade'
    ],
    regulations: [
      'ABNT NBR 11682 (Estabilidade de Encostas)',
      'DNIT 074/2006-ES (Proteção Vegetal de Taludes)',
      'Resoluções CONAMA aplicáveis'
    ],
    metrics: '+1.200.000 m² executados'
  },
  {
    id: 'reflorestamento',
    order: '02',
    title: 'Recuperação de Áreas Degradadas (PRAD) & Reflorestamento',
    subtitle: 'Restauração ecológica e compensação florestal com espécies nativas',
    description: 'Planejamento e execução de PRADs em biomas brasileiros com plantio em módulos de sucessão ecológica (espécies pioneiras, secundárias e climácicas). Foco em recomposição de mata ciliar, reservas legais e áreas de preservação permanente (APP).',
    image: REFORESTATION_IMAGE,
    highlights: [
      'Viveiro próprio de mudas nativas com diversidade genética controlada',
      'Manejo integrado de formigas cortadeiras e irrigação técnica',
      'Monitoramento de pegamento com taxa de reposição inferior a 4%'
    ],
    equipment: [
      'Sistemas de georreferenciamento GNSS RTK de alta precisão',
      'Perfuratrizes de solo motorizadas para covas profundas',
      'Caminhões pipa equipados com bicos nebulizadores'
    ],
    regulations: [
      'Lei Federal nº 12.651/2012 (Código Florestal)',
      'Instruções Normativas do IBAMA sobre PRAD',
      'Critérios de Restauração Ecológica do Pacto Mata Atlântica'
    ],
    metrics: '+480.000 mudas plantadas'
  },
  {
    id: 'monitoramento',
    order: '03',
    title: 'Monitoramento de Fauna, Flora & Recursos Hídricos',
    subtitle: 'Acompanhamento limnológico, inventários florestais e bioindicadores',
    description: 'Campanhas contínuas de campo para validação de condicionantes de Licenças de Operação (LO). Coletas periódicas de qualidade de água superficial e subterrânea, censo de avifauna, herpetofauna e mastofauna com laudos assinados por biólogos e engenheiros.',
    image: SURVEY_IMAGE,
    highlights: [
      'Laboratórios parceiros acreditados pela norma ISO/IEC 17025',
      'Mapeamento aéreo por drones com sensores RGB e multiespectrais (NDVI)',
      'Emissão de relatórios técnicos com ART (Anotação de Responsabilidade Técnica)'
    ],
    equipment: [
      'Sondas multiparâmetros de qualidade de água (pH, OD, turbidez, condutividade)',
      'Drones profissionais DJI Matrice com câmera multiespectral',
      'Armadilhas fotográficas para monitoramento faunístico noturno'
    ],
    regulations: [
      'Resolução CONAMA nº 357/2005 (Águas)',
      'Portaria GM/MS nº 888/2021 (Potabilidade)',
      'Diretrizes Estaduais IEMA / CETESB'
    ],
    metrics: '98 relatórios aprovados'
  },
  {
    id: 'licenciamento',
    order: '04',
    title: 'Licenciamento Ambiental & Gestão de Condicionantes',
    subtitle: 'Estudos de impacto e interlocução técnica junto aos órgãos ambientais',
    description: 'Assessoria estratégica completa para obtenção de Licença Prévia (LP), Licença de Instalação (LI) e Licença de Operação (LO). Elaboração de EIA/RIMA, PCA/RCA, Planos de Emergência Individual (PEI) e auditorias de conformidade legal.',
    highlights: [
      'Redução média de 35% no tempo de tramitação processual',
      'Matriz de risco ambiental preventiva para blindagem jurídica',
      'Acompanhamento de TAC (Termo de Ajustamento de Conduta)'
    ],
    equipment: [
      'Software GIS avançado (QGIS / ArcGIS Enterprise)',
      'Bancos de dados geoespaciais integrados ao SiCAR e SIGMINE',
      'Plataforma própria de gestão de prazos de condicionantes'
    ],
    regulations: [
      'Lei Complementar nº 140/2011',
      'Resoluções CONAMA 001/86 e 237/97',
      'Normativas Municipais e Estaduais'
    ],
    metrics: '100% deferimento de licenças'
  },
  {
    id: 'supressao',
    order: '05',
    title: 'Supressão Vegetal Controlada & Resgate de Germoplasma',
    subtitle: 'Intervenção florestal autorizada com transplante e aproveitamento de biomassa',
    description: 'Execução de corte de vegetação com Autorização de Supressão de Vegetação (ASV), equipe treinada com NR-12 e NR-35, resgate botânico prévio (orquídeas, bromélias e plântulas) e trituração de resíduos lenhosos para uso como mulch.',
    highlights: [
      'Resgate de sementes e matrizes raras para bancos de germoplasma',
      'Trituração in situ com emissão zero de descarte em aterro',
      'Equipe de afugentamento de fauna ativa em tempo integral'
    ],
    equipment: [
      'Trituradores florestais industriais sobre esteiras',
      'Caminhões munck para transplante seguro de espécimes arbóreos',
      'Equipamentos de proteção individual (EPIs) de padrão petroquímico e minerário'
    ],
    regulations: [
      'Decreto Federal nº 6.514/2008',
      'Portarias IBAMA sobre ASV',
      'Normas Regulamentadoras NR-10, NR-12 e NR-35'
    ],
    metrics: 'Zero autuações em operações'
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'rodovia-br101',
    title: 'Estabilização de Taludes Críticos em Concessão Rodoviária',
    clientSector: 'infraestrutura',
    sectorLabel: 'Infraestrutura Viária',
    location: 'Trecho Serra do Mar / BR-101',
    area: '215.000 m²',
    timeline: '6 meses',
    year: '2024',
    challenge: 'Taludes rochosos com declividade superior a 55°, alto risco de desmoronamento em época de chuvas torrenciais e restrição de interrupção de tráfego na pista.',
    solution: 'Aplicação combinada de biomanta antierosiva de fibra vegetal associada a hidrossemeadura com mix botânico de gramíneas de enraizamento profundo (Vetiver e Brachiaria) e leguminosas fixadoras de nitrogênio.',
    results: [
      { label: 'Erosão Contida', value: '99.4%' },
      { label: 'Germinação Homogênea', value: '14 dias' },
      { label: 'Deslizamentos no Período Chuvoso', value: 'Zero ocorrências' }
    ],
    regulatoryCompliance: 'Homologado pelo DNIT e ANTT sem notificações.',
    image: BIOENGINEERING_IMAGE
  },
  {
    id: 'mineracao-carajas',
    title: 'Recuperação Ecológica de Pilha de Estéril e Dique de Contenção',
    clientSector: 'mineracao',
    sectorLabel: 'Mineração e Geotecnia',
    location: 'Quadrilátero Ferrífero / MG',
    area: '340.000 m²',
    timeline: '14 meses',
    year: '2023 - 2024',
    challenge: 'Solo com baixa fertilidade natural e pH ácido, exposto à lixiviação intensa, exigindo reintegração visual e ambiental ao bioma nativo.',
    solution: 'Biofortificação química e microbiológica prévia, hidrossemeadura de alto rendimento com inoculantes micorrízicos e plantio de 85.000 mudas de espécies pioneiras da Mata Atlântica.',
    results: [
      { label: 'Mudas Fixadas', value: '85.000 unid.' },
      { label: 'Taxa de Sobrevivência', value: '96.2%' },
      { label: 'Sequestro Estimado', value: '2.400 tCO₂e' }
    ],
    regulatoryCompliance: 'Aprovado pelo IEF e Ministério Público com emissão de atestado de cumprimento de TAC.',
    image: REFORESTATION_IMAGE
  },
  {
    id: 'parque-eolico-nordeste',
    title: 'Supressão Autorizada e Resgate Faunístico em Parque Eólico',
    clientSector: 'energia',
    sectorLabel: 'Energia Renovável',
    location: 'Complexo Eólico / RN',
    area: '180 hectares',
    timeline: '8 meses',
    year: '2023',
    challenge: 'Intervenção em vegetação de Caatinga preservada para implantação de 42 aerogeradores e subestações, com rigorosa exigência de salvamento de fauna endêmica.',
    solution: 'Equipe multidisciplinar com biólogos de campo para resgate de répteis e aves antes do avanço do maquinário, transplante de cactáceas centenárias e aproveitamento integral da madeira abatida.',
    results: [
      { label: 'Animais Resgatados e Soltos', value: '1.420 espécimes' },
      { label: 'Cactos Transplantados', value: '3.800 unidades' },
      { label: 'Autuações Registradas', value: 'Zero' }
    ],
    regulatoryCompliance: 'Relatórios quinzenais deferidos pelo IDEMA.',
    image: SURVEY_IMAGE
  },
  {
    id: 'loteamento-sustentavel',
    title: 'Recuperação de Mata Ciliar e Compensação para Empreendimento Residencial',
    clientSector: 'loteamentos',
    sectorLabel: 'Desenvolvimento Imobiliário',
    location: 'Piracicaba / SP',
    area: '65.000 m²',
    timeline: '5 meses',
    year: '2024',
    challenge: 'Adequação ambiental de área de preservação permanente (APP) degradada para viabilizar liberação do Termo de Vistoria de Obras (TVO).',
    solution: 'Recomposição florística em modelo adensado com 52 espécies nativas, coroamento e adubação orgânica, instalação de cerca viva e placas educativas.',
    results: [
      { label: 'Área Ciliar Recuperada', value: '100% da APP' },
      { label: 'TVO Liberado', value: '45 dias antes do prazo' },
      { label: 'Avifauna Retornada', value: '+34 espécies catalogadas' }
    ],
    regulatoryCompliance: 'Certificado de Conformidade emitido pela CETESB.',
    image: HERO_IMAGE
  }
];

export const BIOME_FACTORS: Record<string, { label: string; seedlingDensityPerHa: number; germinationDays: number; typicalSpecies: string[] }> = {
  'mata-atlantica': {
    label: 'Mata Atlântica',
    seedlingDensityPerHa: 1667,
    germinationDays: 7,
    typicalSpecies: ['Aroeira-mansa (Schinus terebinthifolia)', 'Mutamba (Guazuma ulmifolia)', 'Ingá (Inga edulis)', 'Palmito-juçara (Euterpe edulis)']
  },
  'cerrado': {
    label: 'Cerrado',
    seedlingDensityPerHa: 1333,
    germinationDays: 9,
    typicalSpecies: ['Baru (Dipteryx alata)', 'Pequi (Caryocar brasiliense)', 'Ipê-amarelo (Handroanthus chrysotrichus)', 'Jatobá-do-cerrado (Hymenaea stigonocarpa)']
  },
  'caatinga': {
    label: 'Caatinga',
    seedlingDensityPerHa: 1100,
    germinationDays: 12,
    typicalSpecies: ['Juazeiro (Sarcomphalus joazeiro)', 'Umbuzeiro (Spondias tuberosa)', 'Aroeira-do-sertão (Myracrodruon urundeuva)', 'Mandacaru (Cereus jamacaru)']
  },
  'amazonia': {
    label: 'Amazônia',
    seedlingDensityPerHa: 2000,
    germinationDays: 6,
    typicalSpecies: ['Castanheira (Bertholletia excelsa)', 'Andiroba (Carapa guianensis)', 'Açaí (Euterpe oleracea)', 'Sumaúma (Ceiba pentandra)']
  }
};
