// src/components/inventory/InventoryTest.tsx
// Página de prueba para ver la interfaz de conteo funcionando

import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { Product, ProductCount } from '../../types';
import { AirtableService } from '../../services/airtableService';
import { Loader2, MapPin, Package, AlertCircle } from 'lucide-react';

export const InventoryTest: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productCounts, setProductCounts] = useState<{[key: string]: ProductCount}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('chios');

  // Datos de prueba si Airtable no funciona
  const mockProducts: Product[] = [
    {
      id: 'mock1',
      code: 'ALMP003',
      category: 'BEBIDAS ALCOHOLICAS MP',
      name: 'PROVETTO',
      unitCount: 'botellas',
      unitMin: 'botellas',
      unitMax: 'kg',
      classification: 'A',
      equivalences: [
        { unit: 'botella', value: 0.771, baseUnit: 'kg' },
        { unit: 'envase', value: 0.574, baseUnit: 'kg' }
      ],
      activeInRestaurants: ['chios', 'simon_bolon'],
      activeInWarehouses: ['bodega_principal']
    },
    {
      id: 'mock2',
      code: 'ALI004',
      category: 'ALIMENTOS FRESCOS',
      name: 'QUESO MOZZARELLA',
      unitCount: 'kg',
      unitMin: 'kg',
      unitMax: 'gramos',
      classification: 'B',
      equivalences: [
        { unit: 'paquete', value: 0.5, baseUnit: 'kg' }
      ],
      activeInRestaurants: ['chios', 'santo_cachon'],
      activeInWarehouses: ['bodega_materia_prima']
    },
    {
      id: 'mock3',
      code: 'LIM001',
      category: 'PRODUCTOS DE LIMPIEZA',
      name: 'DETERGENTE INDUSTRIAL',
      unitCount: 'litros',
      unitMin: 'litros',
      unitMax: 'ml',
      classification: 'C',
      equivalences: [],
      activeInRestaurants: ['chios'],
      activeInWarehouses: ['bodega_principal']
    }
  ];

  // Cargar productos al iniciar
  useEffect(() => {
    loadProducts();
  }, [selectedLocation]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Cargando productos para:', selectedLocation);
      
      // Intentar cargar desde Airtable
      const airtableProducts = await AirtableService.getProductsByLocation(selectedLocation, 'restaurant');
      
      if (airtableProducts.length > 0) {
        setProducts(airtableProducts);
        console.log('✅ Productos cargados desde Airtable:', airtableProducts.length);
      } else {
        // Usar datos de prueba si no hay productos en Airtable
        setProducts(mockProducts);
        console.log('⚠️ Usando datos de prueba');
      }
      
    } catch (err) {
      console.warn('⚠️ Error cargando desde Airtable, usando datos de prueba:', err);
      setProducts(mockProducts);
      setError('Conectando con datos de prueba (Airtable no disponible)');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el conteo de productos
  const handleCountChange = (productId: string, count: ProductCount) => {
    setProductCounts(prev => ({
      ...prev,
      [productId]: count
    }));
  };

  // Calcular productos con stock cero
  const productsWithZero = Object.values(productCounts).filter(count => count.total === 0);

  // Calcular total de productos contados
  const totalProducts = products.length;
  const countedProducts = Object.keys(productCounts).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Sistema de Conteo Foodix</h1>
                <p className="text-gray-600">Interfaz de prueba - Conteo de inventario</p>
              </div>
            </div>
          </div>

          {/* Selector de ubicación */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Ubicación:
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="chios">Chios</option>
              <option value="simon_bolon">Simon Bolón</option>
              <option value="santo_cachon">Santo Cachón</option>
            </select>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalProducts}</div>
              <div className="text-sm text-blue-800">Productos Total</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{countedProducts}</div>
              <div className="text-sm text-green-800">Contados</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{productsWithZero.length}</div>
              <div className="text-sm text-red-800">En Cero</div>
            </div>
          </div>
        </div>

        {/* Estado de error */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800">{error}</span>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Cargando productos...</span>
          </div>
        )}

        {/* Lista de productos */}
        {!loading && (
          <div className="space-y-4">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onCountChange={handleCountChange}
                initialCount={productCounts[product.id]}
                showZeroAlert={true}
              />
            ))}
          </div>
        )}

        {/* Resumen de conteo */}
        {!loading && countedProducts > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de Conteo</h3>
            <div className="space-y-2">
              {Object.entries(productCounts).map(([productId, count]) => {
                const product = products.find(p => p.id === productId);
                if (!product) return null;
                
                return (
                  <div key={productId} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">{product.name} ({product.code})</span>
                    <div className="text-right">
                      <span className="font-semibold">{count.total} {product.unitCount}</span>
                      {count.requestQuantity > 0 && (
                        <span className="text-sm text-green-600 ml-2">
                          (Solicitar: {count.requestQuantity} {count.requestUnit})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default InventoryTest;
cat > src/App.tsx << 'EOF'
import React from 'react'
import InventoryTest from './components/inventory/InventoryTest'
import './App.css'

function App() {
  return (
    <div className="App">
      <InventoryTest />
    </div>
  )
}

export default App
