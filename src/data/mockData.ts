import { 
  Empresa, 
  Establecimiento, 
  PeriodoBalance, 
  DocumentoSoporte, 
  FichaRuaRegistro,
  RegistroResiduo,
  GestorAmbiental,
  CatalogoResiduo
} from '../types';

// Colecciones iniciales limpias sin datos ficticios de demostración
export const INITIAL_EMPRESAS: Empresa[] = [];

export const INITIAL_ESTABLECIMIENTOS: Establecimiento[] = [];

export const INITIAL_PERIODOS: PeriodoBalance[] = [];

export const INITIAL_DOCUMENTOS: DocumentoSoporte[] = [];

export const INITIAL_FICHAS_RECORDS: Record<string, FichaRuaRegistro[]> = {};

export const INITIAL_RESIDUOS: RegistroResiduo[] = [];

// Catálogo base de referencia técnica normativa colombiana (Decreto 1076/2015, Convenio de Basilea)
export const INITIAL_CATALOGO_RESIDUOS: CatalogoResiduo[] = [
  {
    id: 'cat-01',
    nombre: 'Aceite lubricante usado',
    peligrosidad: 'Peligroso (RESPEL)',
    subcategoria: 'Aceites Usados',
    corrienteRespel: 'Y8 / A3020',
    descripcion: 'Aceites de motor, transmisiones y sistemas hidráulicos usados generados en mantenimiento.',
    tratamientoSugerido: 'Coprocesamiento'
  },
  {
    id: 'cat-02',
    nombre: 'Baterías plomo-ácido usadas',
    peligrosidad: 'Peligroso (RESPEL)',
    subcategoria: 'RESPEL Químico',
    corrienteRespel: 'Y31 / A1020',
    descripcion: 'Baterías automotrices e industriales que contienen plomo y ácido sulfúrico.',
    tratamientoSugerido: 'Aprovechamiento / Reciclaje'
  },
  {
    id: 'cat-03',
    nombre: 'Luminarias y tubos fluorescentes (Mercurio)',
    peligrosidad: 'Peligroso (RESPEL)',
    subcategoria: 'RESPEL Químico',
    corrienteRespel: 'Y29 / A1030',
    descripcion: 'Lámparas fluorescentes y de descarga con vapor de mercurio.',
    tratamientoSugerido: 'Celda de seguridad'
  },
  {
    id: 'cat-04',
    nombre: 'Sólidos y trapos contaminados con hidrocarburos',
    peligrosidad: 'Peligroso (RESPEL)',
    subcategoria: 'RESPEL Químico',
    corrienteRespel: 'Y8 / A4070',
    descripcion: 'Waypes, telas, aserrín o trapos impregnados de aceites, combustibles o grasas.',
    tratamientoSugerido: 'Tratamiento térmico / Incineración'
  },
  {
    id: 'cat-05',
    nombre: 'Envases plásticos o metálicos contaminados con químicos',
    peligrosidad: 'Peligroso (RESPEL)',
    subcategoria: 'RESPEL Químico',
    corrienteRespel: 'Y12 / A4070',
    descripcion: 'Canecas, tarros y recipientes que contuvieron solventes, pinturas o reactivos.',
    tratamientoSugerido: 'Tratamiento térmico / Incineración'
  },
  {
    id: 'cat-06',
    nombre: 'Residuos biosanitarios e infecciosos',
    peligrosidad: 'Peligroso (RESPEL)',
    subcategoria: 'RESPEL Biológico/Infeccioso',
    corrienteRespel: 'Y1 / A4020',
    descripcion: 'Material de enfermería, primeros auxilios o consultorio médico expuesto a fluidos.',
    tratamientoSugerido: 'Tratamiento térmico / Incineración'
  },
  {
    id: 'cat-07',
    nombre: 'Residuos de aparatos eléctricos y electrónicos (RAEE)',
    peligrosidad: 'Peligroso (RESPEL)',
    subcategoria: 'RESPEL RAEE',
    corrienteRespel: 'A1180',
    descripcion: 'Computadores, impresoras, tarjetas electrónicas y periféricos en desuso.',
    tratamientoSugerido: 'Aprovechamiento / Reciclaje'
  },
  {
    id: 'cat-08',
    nombre: 'Cartón y papel de archivo limpio',
    peligrosidad: 'No Peligroso',
    subcategoria: 'Aprovechable',
    descripcion: 'Cajas de cartón corrugado, papel bond y plegadiza limpios y secos.',
    tratamientoSugerido: 'Aprovechamiento / Reciclaje'
  },
  {
    id: 'cat-09',
    nombre: 'Plásticos reciclables (PET, PEAD, Polipropileno)',
    peligrosidad: 'No Peligroso',
    subcategoria: 'Aprovechable',
    descripcion: 'Botellas, películas plásticas y empaques posconsumo limpios.',
    tratamientoSugerido: 'Aprovechamiento / Reciclaje'
  },
  {
    id: 'cat-10',
    nombre: 'Chatarra metálica ferrosa y no ferrosa',
    peligrosidad: 'No Peligroso',
    subcategoria: 'Aprovechable',
    descripcion: 'Recortes metálicos, piezas de acero, aluminio y cobre no contaminadas.',
    tratamientoSugerido: 'Aprovechamiento / Reciclaje'
  },
  {
    id: 'cat-11',
    nombre: 'Residuos orgánicos biodegradables de cafetería',
    peligrosidad: 'No Peligroso',
    subcategoria: 'Orgánico',
    descripcion: 'Restos de comida y cáscaras provenientes de preparación en casino.',
    tratamientoSugerido: 'Compostaje / Biotransformación'
  },
  {
    id: 'cat-12',
    nombre: 'Residuos ordinarios e inertes no aprovechables',
    peligrosidad: 'No Peligroso',
    subcategoria: 'Ordinario/No aprovechable',
    descripcion: 'Papel higiénico, servilletas usadas, barrido y empaques metalizados no reciclables.',
    tratamientoSugerido: 'Disposición final (Relleno Sanitario)'
  },
  {
    id: 'cat-13',
    nombre: 'Residuos de construcción y demolición (RCD limpios)',
    peligrosidad: 'RCD',
    subcategoria: 'RCD',
    descripcion: 'Escombros de concreto, mampostería, ladrillo y arenas sin contaminantes.',
    tratamientoSugerido: 'Aprovechamiento / Reciclaje'
  }
];

// Gestores ambientales iniciales autorizados en Colombia con licencias de referencia
export const INITIAL_GESTORES: GestorAmbiental[] = [
  {
    id: 'ges-01',
    nombre: 'Ecoeficiencia Soluciones Ambientales S.A.S.',
    nit: '900.852.147-3',
    autoridadAmbiental: 'Corporación Autónoma Regional de Cundinamarca (CAR)',
    numeroLicencia: 'Resolución CAR No. 1845 de 2021',
    vigenciaLicencia: '2029-12-31',
    lineasAutorizadas: ['Aceites lubricantes usados', 'Coprocesamiento térmico', 'Baterías plomo-ácido', 'Solventes industriales'],
    contacto: 'operaciones@ecoeficiencia.com.co',
    telefono: '(601) 745 2200',
    direccion: 'Parque Industrial Cota, Vía Siberia Km 2.5, Cundinamarca',
    estado: 'Activo'
  },
  {
    id: 'ges-02',
    nombre: 'Lito S.A.S. - Gestión Integral de Residuos',
    nit: '811.032.654-1',
    autoridadAmbiental: 'Secretaría Distrital de Ambiente (SDA) - Bogotá D.C.',
    numeroLicencia: 'Resolución SDA No. 0321 de 2020',
    vigenciaLicencia: '2030-06-30',
    lineasAutorizadas: ['RAEE (Electrónicos)', 'Luminarias y Mercurio', 'Pilas y Baterías', 'Metales pesados'],
    contacto: 'servicioalcliente@lito.com.co',
    telefono: '(601) 368 4400',
    direccion: 'Calle 17 No. 68-45, Zona Industrial Montevideo, Bogotá D.C.',
    estado: 'Activo'
  },
  {
    id: 'ges-03',
    nombre: 'Bioresiduos & Tratamientos Especiales S.A.S.',
    nit: '901.442.889-5',
    autoridadAmbiental: 'Corporación Autónoma Regional de las Cuencas de los Ríos Negro y Nare (Cornare)',
    numeroLicencia: 'Resolución Cornare No. 4421 de 2019',
    vigenciaLicencia: '2028-11-15',
    lineasAutorizadas: ['Residuos biosanitarios e infecciosos', 'Medicamentos vencidos', 'Incineración técnica'],
    contacto: 'ambiental@bioresiduos.co',
    telefono: '(604) 520 9000',
    direccion: 'Zona Franca Rionegro, Antioquia',
    estado: 'Activo'
  },
  {
    id: 'ges-04',
    nombre: 'Asociación Red Verde de Recicladores de Oficio',
    nit: '900.321.789-0',
    autoridadAmbiental: 'Superintendencia de Servicios Públicos Domiciliarios (SSPD)',
    numeroLicencia: 'Registro RUPS No. 2022-REC-0089',
    vigenciaLicencia: '2027-12-31',
    lineasAutorizadas: ['Cartón y papel', 'Plásticos (PET, PEAD)', 'Chatarra ferrosa y no ferrosa', 'Vidrio'],
    contacto: 'contacto@redverdereciclaje.org',
    telefono: '310 456 7890',
    direccion: 'Bodega de Acopio Central Cra 30 # 22-15, Bogotá D.C.',
    estado: 'Activo'
  }
];

/**
 * Filtros de seguridad para sanear datos huérfanos de demostración que pudieran
 * haber quedado en el localStorage del navegador en versiones anteriores,
 * conservando estrictamente los registros legítimos creados por el usuario.
 */
export const isDemoEmpresa = (e: Empresa): boolean => {
  if (!e || !e.id) return true;
  return (
    e.id === 'emp-01' ||
    e.id === 'emp-02' ||
    e.id.startsWith('demo-') ||
    e.nit === '900.123.456-7' ||
    e.nit === '901.789.012-3' ||
    e.razonSocial?.toLowerCase().includes('bioingeniería') ||
    e.razonSocial?.toLowerCase().includes('bioingenieria') ||
    e.razonSocial?.toLowerCase().includes('empresa demo')
  );
};

export const isDemoEstablecimiento = (est: Establecimiento): boolean => {
  if (!est || !est.id) return true;
  return (
    est.id === 'est-01' ||
    est.id === 'est-02' ||
    est.id === 'est-03' ||
    est.id.startsWith('demo-') ||
    est.codigoEstablecimiento === 'RUA-BOG-2024-089' ||
    est.codigoEstablecimiento === 'RUA-MOS-2024-012' ||
    est.nombre?.toLowerCase().includes('fontibón') ||
    est.nombre?.toLowerCase().includes('fontibon')
  );
};

export const isDemoPeriodo = (p: PeriodoBalance): boolean => {
  if (!p || !p.id) return true;
  return (
    p.id === 'per-01' ||
    p.id === 'per-02' ||
    p.id === 'per-03' ||
    p.id.startsWith('demo-') ||
    (p.progresoPorcentaje === 57 && p.totalFichasCompletadas === 8)
  );
};

export const isDemoDocumento = (doc: DocumentoSoporte): boolean => {
  if (!doc || !doc.id) return true;
  return (
    doc.id === 'doc-01' ||
    doc.id === 'doc-02' ||
    doc.id === 'doc-03' ||
    doc.id === 'doc-04' ||
    doc.id === 'doc-05' ||
    doc.id.startsWith('demo-') ||
    doc.nombre?.toLowerCase().includes('respel-') ||
    doc.nombre?.toLowerCase().includes('vertimientos-')
  );
};

export const isDemoResiduo = (res: RegistroResiduo): boolean => {
  if (!res || !res.id) return true;
  return res.id.startsWith('demo-');
};

export const isDemoGestor = (ges: GestorAmbiental): boolean => {
  if (!ges || !ges.id) return true;
  return ges.id.startsWith('demo-');
};

export const isDemoCatalogo = (cat: CatalogoResiduo): boolean => {
  if (!cat || !cat.id) return true;
  return cat.id.startsWith('demo-');
};

export const sanitizeStoredRecords = <T>(
  raw: string | null,
  isDemoCheck: (item: T) => boolean,
  fallback: T[]
): T[] => {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;
    const sanitized = parsed.filter((item: T) => !isDemoCheck(item));
    return sanitized.length > 0 ? sanitized : fallback;
  } catch {
    return fallback;
  }
};

export const sanitizeFichasMap = (
  raw: string | null
): Record<string, FichaRuaRegistro[]> => {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};
    const sanitized: Record<string, FichaRuaRegistro[]> = {};
    for (const [periodId, records] of Object.entries(parsed)) {
      if (
        periodId !== 'per-01' &&
        periodId !== 'per-02' &&
        !periodId.startsWith('demo-') &&
        Array.isArray(records)
      ) {
        sanitized[periodId] = (records as FichaRuaRegistro[]).filter(r => {
          return r && !r.id?.startsWith('frec-demo-') && !r.id?.includes('per-01');
        });
      }
    }
    return sanitized;
  } catch {
    return {};
  }
};
