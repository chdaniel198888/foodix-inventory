// src/services/airtableService.ts
// Versión mínima funcional

export class AirtableService {
  static async testConnection(): Promise<boolean> {
    console.log('🔄 Conexión simulada con Airtable...');
    return true;
  }

  static async getAllProducts(): Promise<any[]> {
    // Datos de prueba básicos
    return [
      {
        id: 'mock1',
        code: 'ALMP003',
        name: 'PROVETTO',
        category: 'BEBIDAS ALCOHOLICAS MP',
        unitCount: 'botellas',
        unitMin: 'botellas',
        unitMax: 'kg',
        classification: 'A',
        equivalences: [],
        activeInRestaurants: ['chios'],
        activeInWarehouses: ['bodega_principal']
      }
    ];
  }
}

export default AirtableService;
