// src/types/index.ts
// Interfaces TypeScript para el sistema de inventario Foodix

// Ubicaciones disponibles en Foodix
export type LocationType = 'restaurant' | 'warehouse';

export interface Location {
  id: string;
  name: string;
  type: LocationType;
}

// Restaurantes
export const RESTAURANTS: Location[] = [
  { id: 'chios', name: 'Chios', type: 'restaurant' },
  { id: 'simon_bolon', name: 'Simon Bolón', type: 'restaurant' },
  { id: 'santo_cachon', name: 'Santo Cachón', type: 'restaurant' }
];

// Bodegas
export const WAREHOUSES: Location[] = [
  { id: 'bodega_principal', name: 'Bodega Principal', type: 'warehouse' },
  { id: 'bodega_materia_prima', name: 'Bodega Materia Prima', type: 'warehouse' },
  { id: 'bodega_produccion', name: 'Bodega Producción', type: 'warehouse' }
];

// Clasificación de productos
export type ProductClassification = 'A' | 'B' | 'C';

// Producto desde Airtable
export interface Product {
  id: string;
  code: string; // ej: ALMP003
  category: string; // ej: BEBIDAS ALCOHOLICAS MP
  name: string; // ej: PROVETTO
  unitCount: string; // Unidad Contifico
  unitMin: string; // Unidad Mínima
  unitMax: string; // Unidad Máxima
  classification: ProductClassification; // A, B, C
  equivalences: ProductEquivalence[];
  activeInRestaurants: string[]; // IDs de restaurantes donde está activo
  activeInWarehouses: string[]; // IDs de bodegas donde está activo
}

// Equivalencias de productos
export interface ProductEquivalence {
  unit: string; // ej: "botella"
  value: number; // ej: 0.771
  baseUnit: string; // ej: "kg"
}

// Conteo de producto (3 espacios de almacenamiento)
export interface ProductCount {
  productId: string;
  space1: number; // Primer espacio
  space2: number; // Segundo espacio  
  space3: number; // Tercer espacio
  total: number; // Suma automática
  requestQuantity: number; // Cantidad a solicitar
  requestUnit: string; // Unidad de solicitud
}

// Sesión de conteo completa
export interface CountSession {
  id: string;
  locationId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  status: 'in_progress' | 'completed' | 'approved' | 'rejected';
  products: ProductCount[];
  productsWithZero: string[]; // IDs de productos en 0 para confirmación
}

// Usuario del sistema
export interface User {
  id: string;
  name: string;
  role: 'counter' | 'supervisor' | 'financial' | 'operations' | 'admin';
  assignedLocations: string[]; // IDs de ubicaciones asignadas
}

// Respuesta de la API de Airtable
export interface AirtableRecord {
  id: string;
  fields: {
    [key: string]: any;
  };
  createdTime: string;
}

// Configuración de Airtable
export interface AirtableConfig {
  baseId: string;
  tableId: string;
  token: string;
}

// Estados de la aplicación
export interface AppState {
  currentUser: User | null;
  selectedLocation: Location | null;
  currentSession: CountSession | null;
  products: Product[];
  loading: boolean;
  error: string | null;
}
