// src/services/airtableService.ts
// Servicio para conectar con Airtable - Versión simplificada

import axios from 'axios';
import { Product, AirtableRecord } from '../types';

// Configuración básica
const AIRTABLE_CONFIG = {
  baseId: 'app5zYXr1GmF2bmVF',
  tableId: 'tbl8hyvwwfSnrspAt',
  token: 'patTAcuJ2tPjECEQM.1a60d9818fadd363088d86e405f30bd0bf7ab0ae443490efe17957102b7c0b2b',
  apiUrl: 'https://api.airtable.com/v0'
};

export class AirtableService {
  static async testConnection(): Promise<boolean> {
    try {
      console.log('🔄 Probando conexión con Airtable...');
      return true;
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      return false;
    }
  }

  static async getAllProducts(): Promise<Product[]> {
    // Datos de prueba por ahora
    return [];
  }
}

export default AirtableService;
