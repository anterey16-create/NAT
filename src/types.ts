export type UserRole = 'admin' | 'empresa';

export type NavigationModule = 
  | 'dashboard'
  | 'panel_admin'
  | 'panel_empresas'
  | 'bitacora_residuos'
  | 'informes'
  | 'gestores_catalogos'
  | 'empresas'
  | 'establecimientos'
  | 'periodos'
  | 'fichas'
  | 'documentos'
  | 'guia'
  | 'configuracion';

export type FichaRuaStatus = 'sin_iniciar' | 'en_progreso' | 'completada';

export type PeriodStatus = 'Borrador' | 'En diligenciamiento' | 'En revisión técnica' | 'Listo para cargue';

export interface Empresa {
  id: string;
  nit: string;
  razonSocial: string;
  representanteLegal: string;
  correoContacto: string;
  telefono: string;
  direccionPrincipal: string;
  ciudad: string;
  departamento: string;
  sectorCIIU: string;
  estado: 'Activa' | 'Inactiva';
}

export interface Establecimiento {
  id: string;
  empresaId: string;
  nombre: string;
  codigoEstablecimiento: string;
  autoridadAmbiental: string;
  departamento: string;
  municipio: string;
  direccion: string;
  coordenadasLat: string;
  coordenadasLng: string;
  ciiuPrincipal: string;
  descripcionActividad: string;
}

export interface PeriodoBalance {
  id: string;
  establecimientoId: string;
  empresaId: string;
  anio: number;
  fechaInicio: string;
  fechaFin: string;
  estado: PeriodStatus;
  fechaLimiteReporte: string;
  progresoPorcentaje: number;
  ultimaModificacion: string;
  totalFichasCompletadas: number;
}

export interface DocumentoSoporte {
  id: string;
  periodoId: string;
  establecimientoId: string;
  fichaNumero: number;
  nombre: string;
  tipoDocumento: 
    | 'Acta o certificado técnico' 
    | 'Factura de servicio público' 
    | 'Caracterización o análisis de laboratorio' 
    | 'Permiso o acto administrativo' 
    | 'Manifiesto de transporte' 
    | 'Certificado de calibración' 
    | 'Plan de contingencia ambiental'
    | 'Otro soporte documental';
  fechaEmision: string;
  tamano: string;
  estadoValidacion: 'Pendiente de revisión' | 'Aprobado' | 'Requiere subsanación';
  observaciones: string;
}

export interface FichaRuaDef {
  numero: number;
  codigo: string;
  titulo: string;
  descripcion: string;
  objetivo: string;
  confirmadaOficial: boolean;
  normativa: string;
  seccionesSugeridas: string[];
}

export interface FichaRuaRegistro {
  id: string;
  periodoId: string;
  fichaNumero: number;
  estado: FichaRuaStatus;
  ultimaActualizacion: string;
  responsableDiligenciamiento: string;
  observacionesTecnicas: string;
  datos: Record<string, any>;
  documentosIds: string[];
}

// Tipos para el Sistema de Gestión y Trazabilidad de Residuos (Colombia)
export type TipoPeligrosidad = 'No Peligroso' | 'Peligroso (RESPEL)' | 'Especial' | 'RCD';

export type SubcategoriaResiduo = 
  | 'Aprovechable' 
  | 'Orgánico' 
  | 'Ordinario/No aprovechable' 
  | 'RESPEL Químico' 
  | 'RESPEL Biológico/Infeccioso' 
  | 'RESPEL RAEE' 
  | 'Aceites Usados' 
  | 'RCD';

export type EstadoGestionResiduo = 'En acopio temporal' | 'Entregado a gestor' | 'Gestionado internamente';

export type TipoManejoTratamiento = 
  | 'Aprovechamiento / Reciclaje'
  | 'Compostaje / Biotransformación'
  | 'Coprocesamiento'
  | 'Tratamiento térmico / Incineración'
  | 'Tratamiento físico-químico'
  | 'Celda de seguridad'
  | 'Disposición final (Relleno Sanitario)'
  | 'Otro';

export interface RegistroResiduo {
  id: string;
  empresaId: string;
  establecimientoId: string;
  periodoId?: string;
  fechaGeneracion: string; // AAAA-MM-DD
  nombreResiduo: string;
  peligrosidad: TipoPeligrosidad;
  subcategoria: SubcategoriaResiduo;
  corrienteRespel?: string; // Ej: Y8, A3020, Y1, A4070
  cantidadGeneradaKg: number;
  areaOrigen: string; // Ej: Taller de mantenimiento, Producción, Oficinas
  tipoEmbalaje: string; // Ej: Caneca 55 gal, Bolsa roja, Big bag
  estadoGestion: EstadoGestionResiduo;
  
  // Datos de salida / entrega a gestor
  fechaEntrega?: string;
  gestorId?: string;
  gestorNombre?: string;
  gestorNit?: string;
  numeroManifiesto?: string;
  tipoTratamiento?: TipoManejoTratamiento;
  cantidadEntregadaKg?: number;
  documentoSoporteId?: string;
  numeroCertificadoDisposicion?: string;
  
  // Auditoría y revisión técnica
  observacionesAdmin?: string;
  estadoRevision?: 'Borrador' | 'Registrado' | 'Validado' | 'Requiere corrección';
  fechaCreacion: string;
}

export interface GestorAmbiental {
  id: string;
  nombre: string;
  nit: string;
  autoridadAmbiental: string;
  numeroLicencia: string;
  vigenciaLicencia: string;
  lineasAutorizadas: string[];
  contacto: string;
  telefono: string;
  direccion?: string;
  estado: 'Activo' | 'Inactivo';
}

export interface CatalogoResiduo {
  id: string;
  nombre: string;
  peligrosidad: TipoPeligrosidad;
  subcategoria: SubcategoriaResiduo;
  corrienteRespel?: string;
  descripcion: string;
  tratamientoSugerido: TipoManejoTratamiento;
}

// Backward compatibility types for legacy components
export type BiomeType = 'mata-atlantica' | 'cerrado' | 'caatinga' | 'amazonia';

export type ProjectCategory = 
  | 'hidrossemeadura' 
  | 'reflorestamento' 
  | 'licenciamento' 
  | 'supressao'
  | 'monitoramento';

export type SectorType = 'infraestrutura' | 'mineracao' | 'energia' | 'loteamentos' | 'industria';

export interface ServiceItem {
  id: string;
  order: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  highlights: string[];
  equipment: string[];
  regulations: string[];
  metrics: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  clientSector: SectorType;
  sectorLabel: string;
  location: string;
  area: string;
  timeline: string;
  year: string;
  challenge: string;
  solution: string;
  results: { label: string; value: string }[];
  regulatoryCompliance: string;
  image: string;
}

export interface CalculatorInput {
  sector: SectorType;
  category: ProjectCategory;
  areaSquareMeters: number;
  slopeAngle: 'baixa' | 'moderada' | 'alta';
  biome: BiomeType;
  urgency: 'padrao' | 'emergencial';
}

export interface QuoteFormData {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  sector: SectorType;
  category: ProjectCategory;
  estimatedArea: string;
  location: string;
  projectDetails: string;
  urgency: string;
}
