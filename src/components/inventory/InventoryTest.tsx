import React, { useState, useEffect } from 'react';
import { Search, Package, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { ProductCard } from './ProductCard';
// @ts-ignore
import { airtableService } from '../../services/airtableService';

const MOCK_PRODUCTS: any[] = [
  {
    id: '1',
    code: 'ALMP003',
    name: 'PROVETTO',
    category: 'BEBIDAS ALCOHOLICAS MP',
    unitCount: 'botella',
    unitMin: 'gramo',
    unitMax: 'kilogramo',
    equivalences: [
      { unit: 'botella', value: 0.771, baseUnit: 'kg' },
      { unit: 'envase', value: 0.574, baseUnit: 'kg' }
    ],
    classification: 'A',
    activeInRestaurants: ['chios', 'simon_bolon'],
    activeInWarehouses: ['bodega_principal']
  },
  {
    id: '2',
    code: 'ALMP021',
    name: 'QUESO MOZZARELLA',
    category: 'LACTEOS Y DERIVADOS',
    unitCount: 'kilogramo',
    unitMin: 'gramo',
    unitMax: 'kilogramo',
    equivalences: [
      { unit: 'kilogramo', value: 1, baseUnit: 'kg' },
      { unit: 'gramo', value: 0.001, baseUnit: 'kg' }
    ],
    classification: 'A',
    activeInRestaurants: ['chios', 'santo_cachon'],
    activeInWarehouses: ['bodega_principal', 'bodega_materia_prima']
  },
  {
    id: '3',
    code: 'LIMP015',
    name: 'DETERGENTE INDUSTRIAL',
    category: 'LIMPIEZA',
    unitCount: 'galón',
    unitMin: 'litro',
    unitMax: 'galón',
    equivalences: [
      { unit: 'galón', value: 3.785, baseUnit: 'litro' },
      { unit: 'litro', value: 1, baseUnit: 'litro' }
    ],
    classification: 'C',
    activeInRestaurants: ['chios', 'simon_bolon', 'santo_cachon'],
    activeInWarehouses: ['bodega_principal']
  }
];

export const InventoryTest: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [products, setProducts] = useState<any[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useRealData, setUseRealData] = useState(false);

  // Cargar productos cuando se selecciona una ubicación
  useEffect(() => {
    if (selectedLocation) {
      loadProducts();
    }
  }, [selectedLocation, useRealData]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (useRealData) {
        // Intentar cargar datos reales de Airtable
        const data = await airtableService.getProductsByLocation(selectedLocation);
        setProducts(data);
      } else {
        // Usar datos de prueba
        const filteredProducts = MOCK_PRODUCTS.filter(product => {
          const allLocations = [...product.activeInRestaurants, ...product.activeInWarehouses];
          return allLocations.includes(selectedLocation);
        });
        setProducts(filteredProducts);
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Error al cargar productos. Usando datos de prueba.');
      // Fallback a datos de prueba
      const filteredProducts = MOCK_PRODUCTS.filter(product => {
        const allLocations = [...product.activeInRestaurants, ...product.activeInWarehouses];
        return allLocations.includes(selectedLocation);
      });
      setProducts(filteredProducts);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el conteo
  const handleCountChange = (productId: string, count: any) => {
    setProductCounts(prev => ({
      ...prev,
      [productId]: count
    }));
  };

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular estadísticas
  const stats = {
    total: filteredProducts.length,
    counted: Object.keys(productCounts).filter(id => 
      productCounts[id] && productCounts[id].total > 0
    ).length,
    withZero: Object.keys(productCounts).filter(id => 
      productCounts[id] && productCounts[id].total === 0
    ).length
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Sistema de Inventario Foodix - Prueba
        </h1>
        
        {/* Selector de ubicación */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Seleccionar Ubicación
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Seleccionar --</option>
              <optgroup label="Restaurantes">
                <option value="chios">Chios</option>
                <option value="simon_bolon">Simón Bolón</option>
                <option value="santo_cachon">Santo Cachón</option>
              </optgroup>
              <optgroup label="Bodegas">
                <option value="bodega_principal">Bodega Principal</option>
                <option value="bodega_materia_prima">Bodega Materia Prima</option>
                <option value="bodega_produccion">Bodega Producción</option>
              </optgroup>
            </select>
          </div>

          {/* Toggle para datos reales */}
          <div className="flex items-end">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useRealData}
                onChange={(e) => setUseRealData(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Usar datos reales de Airtable
              </span>
            </label>
          </div>
        </div>

        {/* Barra de búsqueda */}
        {selectedLocation && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, código o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Estadísticas */}
      {selectedLocation && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Productos Total</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{stats.counted}</div>
            <div className="text-sm text-gray-600">Contados</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-600">{stats.withZero}</div>
            <div className="text-sm text-gray-600">En Cero</div>
          </div>
        </div>
      )}

      {/* Mensajes de estado */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Cargando productos...</p>
        </div>
      )}

      {/* Lista de productos */}
      {!loading && selectedLocation && (
        <div>
          {filteredProducts.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
              No se encontraron productos para esta ubicación
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map(product => (
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
        </div>
      )}

      {/* Información de prueba */}
      {!selectedLocation && (
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <Package className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Bienvenido al Sistema de Inventario
          </h3>
          <p className="text-gray-600">
            Selecciona una ubicación para comenzar el conteo de productos
          </p>
        </div>
      )}
    </div>
  );
};