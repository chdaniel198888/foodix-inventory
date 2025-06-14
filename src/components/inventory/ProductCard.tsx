// src/components/inventory/ProductCard.tsx
// Componente para mostrar y contar un producto individual

import React, { useState, useEffect } from 'react';
import { Product, ProductCount } from '../../types';
import { Package, Calculator, AlertTriangle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onCountChange: (productId: string, count: ProductCount) => void;
  initialCount?: ProductCount;
  showZeroAlert?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onCountChange,
  initialCount,
  showZeroAlert = true
}) => {
  // Estados para los 3 espacios de conteo
  const [space1, setSpace1] = useState<number>(initialCount?.space1 || 0);
  const [space2, setSpace2] = useState<number>(initialCount?.space2 || 0);
  const [space3, setSpace3] = useState<number>(initialCount?.space3 || 0);
  const [requestQuantity, setRequestQuantity] = useState<number>(initialCount?.requestQuantity || 0);

  // Calcular total automáticamente
  const total = space1 + space2 + space3;

  // Verificar si el producto está en 0
  const isZero = total === 0;

  // Efecto para notificar cambios al componente padre
  useEffect(() => {
    const productCount: ProductCount = {
      productId: product.id,
      space1,
      space2,
      space3,
      total,
      requestQuantity,
      requestUnit: product.unitMin
    };

    onCountChange(product.id, productCount);
  }, [space1, space2, space3, requestQuantity, product.id, total, product.unitMin, onCountChange]);

  // Función para manejar cambios en inputs numéricos
  const handleNumberChange = (
    value: string, 
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const numValue = value === '' ? 0 : parseInt(value) || 0;
    if (numValue >= 0) {
      setter(numValue);
    }
  };

  return (
    <div className={`
      bg-white rounded-lg shadow-md border-2 p-4 mb-4 transition-all duration-200
      ${isZero && showZeroAlert ? 'border-red-300 bg-red-50' : 'border-gray-200'}
      hover:shadow-lg
    `}>
      
      {/* Header del producto */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-600">Código: {product.code}</p>
            <p className="text-xs text-gray-500">{product.category}</p>
          </div>
        </div>
        
        {/* Clasificación */}
        <div className={`
          px-3 py-1 rounded-full text-sm font-semibold
          ${product.classification === 'A' ? 'bg-red-100 text-red-800' : ''}
          ${product.classification === 'B' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${product.classification === 'C' ? 'bg-green-100 text-green-800' : ''}
        `}>
          Tipo {product.classification}
        </div>
      </div>

      {/* Alerta de producto en 0 */}
      {isZero && showZeroAlert && (
        <div className="flex items-center space-x-2 bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span className="text-sm text-red-700 font-medium">
            Producto sin inventario - Confirmar antes de guardar
          </span>
        </div>
      )}

      {/* Equivalencias */}
      {product.equivalences.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Equivalencias:</h4>
          <div className="text-xs text-blue-700 space-y-1">
            {product.equivalences.map((eq, index) => (
              <div key={index}>
                1 {eq.unit} = {eq.value} {eq.baseUnit}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campos de conteo - 3 espacios */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Espacio 1
          </label>
          <input
            type="number"
            min="0"
            value={space1 || ''}
            onChange={(e) => handleNumberChange(e.target.value, setSpace1)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Espacio 2
          </label>
          <input
            type="number"
            min="0"
            value={space2 || ''}
            onChange={(e) => handleNumberChange(e.target.value, setSpace2)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Espacio 3
          </label>
          <input
            type="number"
            min="0"
            value={space3 || ''}
            onChange={(e) => handleNumberChange(e.target.value, setSpace3)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
      </div>

      {/* Total automático */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">Total:</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-gray-800">{total}</span>
            <span className="text-sm text-gray-600 ml-2">{product.unitCount}</span>
          </div>
        </div>
      </div>

      {/* Cantidad a solicitar */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cantidad a Solicitar
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            min="0"
            value={requestQuantity || ''}
            onChange={(e) => handleNumberChange(e.target.value, setRequestQuantity)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0"
          />
          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-600 flex items-center">
            {product.unitMin}
          </div>
        </div>
      </div>

      {/* Unidades disponibles */}
      <div className="mt-3 text-xs text-gray-500">
        <span>Unidades: </span>
        <span className="font-medium">{product.unitMin}</span>
        {product.unitMax && product.unitMax !== product.unitMin && (
          <span> • {product.unitMax}</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
cat > src/components/inventory/ProductCard.tsx << 'EOF'
// src/components/inventory/ProductCard.tsx
// Componente para mostrar y contar un producto individual

import React, { useState, useEffect } from 'react';
import { Product, ProductCount } from '../../types';
import { Package, Calculator, AlertTriangle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onCountChange: (productId: string, count: ProductCount) => void;
  initialCount?: ProductCount;
  showZeroAlert?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onCountChange,
  initialCount,
  showZeroAlert = true
}) => {
  // Estados para los 3 espacios de conteo
  const [space1, setSpace1] = useState<number>(initialCount?.space1 || 0);
  const [space2, setSpace2] = useState<number>(initialCount?.space2 || 0);
  const [space3, setSpace3] = useState<number>(initialCount?.space3 || 0);
  const [requestQuantity, setRequestQuantity] = useState<number>(initialCount?.requestQuantity || 0);

  // Calcular total automáticamente
  const total = space1 + space2 + space3;

  // Verificar si el producto está en 0
  const isZero = total === 0;

  // Efecto para notificar cambios al componente padre
  useEffect(() => {
    const productCount: ProductCount = {
      productId: product.id,
      space1,
      space2,
      space3,
      total,
      requestQuantity,
      requestUnit: product.unitMin
    };

    onCountChange(product.id, productCount);
  }, [space1, space2, space3, requestQuantity, product.id, total, product.unitMin, onCountChange]);

  // Función para manejar cambios en inputs numéricos
  const handleNumberChange = (
    value: string, 
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const numValue = value === '' ? 0 : parseInt(value) || 0;
    if (numValue >= 0) {
      setter(numValue);
    }
  };

  return (
    <div className={`
      bg-white rounded-lg shadow-md border-2 p-4 mb-4 transition-all duration-200
      ${isZero && showZeroAlert ? 'border-red-300 bg-red-50' : 'border-gray-200'}
      hover:shadow-lg
    `}>
      
      {/* Header del producto */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-600">Código: {product.code}</p>
            <p className="text-xs text-gray-500">{product.category}</p>
          </div>
        </div>
        
        {/* Clasificación */}
        <div className={`
          px-3 py-1 rounded-full text-sm font-semibold
          ${product.classification === 'A' ? 'bg-red-100 text-red-800' : ''}
          ${product.classification === 'B' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${product.classification === 'C' ? 'bg-green-100 text-green-800' : ''}
        `}>
          Tipo {product.classification}
        </div>
      </div>

      {/* Alerta de producto en 0 */}
      {isZero && showZeroAlert && (
        <div className="flex items-center space-x-2 bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span className="text-sm text-red-700 font-medium">
            Producto sin inventario - Confirmar antes de guardar
          </span>
        </div>
      )}

      {/* Equivalencias */}
      {product.equivalences.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Equivalencias:</h4>
          <div className="text-xs text-blue-700 space-y-1">
            {product.equivalences.map((eq, index) => (
              <div key={index}>
                1 {eq.unit} = {eq.value} {eq.baseUnit}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campos de conteo - 3 espacios */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Espacio 1
          </label>
          <input
            type="number"
            min="0"
            value={space1 || ''}
            onChange={(e) => handleNumberChange(e.target.value, setSpace1)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Espacio 2
          </label>
          <input
            type="number"
            min="0"
            value={space2 || ''}
            onChange={(e) => handleNumberChange(e.target.value, setSpace2)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Espacio 3
          </label>
          <input
            type="number"
            min="0"
            value={space3 || ''}
            onChange={(e) => handleNumberChange(e.target.value, setSpace3)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
      </div>

      {/* Total automático */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">Total:</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-gray-800">{total}</span>
            <span className="text-sm text-gray-600 ml-2">{product.unitCount}</span>
          </div>
        </div>
      </div>

      {/* Cantidad a solicitar */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cantidad a Solicitar
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            min="0"
            value={requestQuantity || ''}
            onChange={(e) => handleNumberChange(e.target.value, setRequestQuantity)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0"
          />
          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-600 flex items-center">
            {product.unitMin}
          </div>
        </div>
      </div>

      {/* Unidades disponibles */}
      <div className="mt-3 text-xs text-gray-500">
        <span>Unidades: </span>
        <span className="font-medium">{product.unitMin}</span>
        {product.unitMax && product.unitMax !== product.unitMax && (
          <span> • {product.unitMax}</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
