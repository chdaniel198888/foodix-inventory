// src/services/airtableService.ts
// Servicio para conectar con la base de datos Airtable de Foodix

import axios from 'axios';
import { Product, AirtableRecord, ProductEquivalence, ProductClassification } from '../types';

// Configuración de Airtable
const AIRTABLE_CONFIG = {
  baseId: 'app5zYXr1GmF2bmVF',
  tableId: 'tbl8hyvwwfSnrspAt',
  token: 'patTAcuJ2tPjECEQM.1a60d9818fadd363088d86e405f30bd0bf7ab0ae443490efe17957102b7c0b2b',
  apiUrl: 'https://api.airtable.com/v0'
};

// Cliente HTTP configurado para Airtable
const airtableClient = axios.create({
  baseURL: `${AIRTABLE_CONFIG.apiUrl}/${AIRTABLE_CONFIG.baseId}`,
  headers: {
    'Authorization': `Bearer ${AIRTABLE_CONFIG.token}`,
    'Content-Type': 'application/json'
  }
});

// Clase principal del servicio Airtable
export class AirtableService {
  
  /**
   * Obtener todos los productos desde Airtable
   */
  static async getAllProducts(): Promise<Product[]> {
    try {
      console.log('🔄 Obteniendo productos desde Airtable...');
      
      const response = await airtableClient.get(`/${AIRTABLE_CONFIG.tableId}`);
      const records: AirtableRecord[] = response.data.records;
      
      console.log(`✅ ${records.length} registros obtenidos desde Airtable`);
      
      // Convertir registros de Airtable a formato Product
      const products: Product[] = records.map(record => this.mapAirtableToProduct(record));
      
      return products;
    } catch (error) {
      console.error('❌ Error obteniendo productos:', error);
      throw new Error('No se pudieron obtener los productos desde Airtable');
    }
  }

  /**
   * Obtener productos por ubicación específica
   */
  static async getProductsByLocation(locationId: string, locationType: 'restaurant' | 'warehouse'): Promise<Product[]> {
    try {
      console.log(`🔄 Obteniendo productos para ${locationType}: ${locationId}`);
      
      const allProducts = await this.getAllProducts();
      
      // Filtrar productos activos en la ubicación específica
      const filteredProducts = allProducts.filter(product => {
        if (locationType === 'restaurant') {
          return product.activeInRestaurants.includes(locationId);
        } else {
          return product.activeInWarehouses.includes(locationId);
        }
      });
      
      console.log(`✅ ${filteredProducts.length} productos activos en ${locationId}`);
      return filteredProducts;
      
    } catch (error) {
      console.error('❌ Error obteniendo productos por ubicación:', error);
      throw new Error(`No se pudieron obtener productos para ${locationId}`);
    }
  }

  /**
   * Obtener productos por clasificación (A, B, C)
   */
  static async getProductsByClassification(classification: ProductClassification): Promise<Product[]> {
    try {
      console.log(`🔄 Obteniendo productos clasificación ${classification}`);
      
      const allProducts = await this.getAllProducts();
      const filteredProducts = allProducts.filter(product => 
        product.classification === classification
      );
      
      console.log(`✅ ${filteredProducts.length} productos clasificación ${classification}`);
      return filteredProducts;
      
    } catch (error) {
      console.error('❌ Error obteniendo productos por clasificación:', error);
      throw new Error(`No se pudieron obtener productos clasificación ${classification}`);
    }
  }

  /**
   * Buscar productos por código o nombre
   */
  static async searchProducts(query: string): Promise<Product[]> {
    try {
      console.log(`🔍 Buscando productos: "${query}"`);
      
      const allProducts = await this.getAllProducts();
      const searchResults = allProducts.filter(product =>
        product.code.toLowerCase().includes(query.toLowerCase()) ||
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      
      console.log(`✅ ${searchResults.length} productos encontrados`);
      return searchResults;
      
    } catch (error) {
      console.error('❌ Error buscando productos:', error);
      throw new Error('Error en la búsqueda de productos');
    }
  }

  /**
   * Convertir registro de Airtable a formato Product
   */
  private static mapAirtableToProduct(record: AirtableRecord): Product {
    const fields = record.fields;
    
    // Parsear equivalencias desde Airtable
    const equivalences: ProductEquivalence[] = this.parseEquivalences(fields.equivalencias || '');
    
    // Parsear ubicaciones activas
    const activeInRestaurants = this.parseActiveLocations(fields.activo_restaurantes || '');
    const activeInWarehouses = this.parseActiveLocations(fields.activo_bodegas || '');
    
    return {
      id: record.id,
      code: fields.codigo || '',
      category: fields.categoria || '',
      name: fields.nombre || '',
      unitCount: fields.unidad_contifico || '',
      unitMin: fields.unidad_minima || '',
      unitMax: fields.unidad_maxima || '',
      classification: fields.clasificacion || 'C',
      equivalences,
      activeInRestaurants,
      activeInWarehouses
    };
  }

  /**
   * Parsear equivalencias desde texto
   * Formato esperado: "1 botella = 0.771 kg, 1 envase = 0.574 kg"
   */
  private static parseEquivalences(equivalencesText: string): ProductEquivalence[] {
    if (!equivalencesText) return [];
    
    try {
      const equivalences: ProductEquivalence[] = [];
      const parts = equivalencesText.split(',');
      
      parts.forEach(part => {
        const match = part.trim().match(/(\d+)\s*(\w+)\s*=\s*([\d.]+)\s*(\w+)/);
        if (match) {
          const [, quantity, unit, value, baseUnit] = match;
          equivalences.push({
            unit: unit.trim(),
            value: parseFloat(value) / parseInt(quantity),
            baseUnit: baseUnit.trim()
          });
        }
      });
      
      return equivalences;
    } catch (error) {
      console.warn('⚠️ Error parseando equivalencias:', equivalencesText);
      return [];
    }
  }

  /**
   * Parsear ubicaciones activas desde texto
   * Formato esperado: "chios,simon_bolon,santo_cachon"
   */
  private static parseActiveLocations(locationsText: string): string[] {
    if (!locationsText) return [];
    
    return locationsText
      .split(',')
      .map(loc => loc.trim().toLowerCase().replace(/\s+/g, '_'))
      .filter(loc => loc.length > 0);
  }

  /**
   * Verificar conexión con Airtable
   */
  static async testConnection(): Promise<boolean> {
    try {
      console.log('🔄 Probando conexión con Airtable...');
      
      const response = await airtableClient.get(`/${AIRTABLE_CONFIG.tableId}?maxRecords=1`);
      
      console.log('✅ Conexión con Airtable exitosa');
      return true;
    } catch (error) {
      console.error('❌ Error de conexión con Airtable:', error);
      return false;
    }
  }
}

export default AirtableService;
ls -la src/services/
