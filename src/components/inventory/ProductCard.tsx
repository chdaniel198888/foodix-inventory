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

  // Calcular el total
  const total = space1 + space2 + space3;

  // Actualizar el conteo cuando cambie cualquier espacio
  useEffect(() => {
    const count: ProductCount = {
      productId: product.code,
      space1,
      space2,
      space3,
      total,
      requestQuantity,
      unit: product.unitMin,
      timestamp: new Date().toISOString()
    };
    onCountChange(product.code, count);
  }, [space1, space2, space3, requestQuantity, product.code, product.unitMin, onCountChange]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
      {/* Header del producto */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <span className={`px-2 py-1 text-xs rounded-full font-medium
            ${product.classification === 'A' ? 'bg-red-100 text-red-700' : ''}
            ${product.classification === 'B' ? 'bg-yellow-100 text-yellow-700' : ''}
            ${product.classification === 'C' ? 'bg-green-100 text-green-700' : ''}
          `}>
            Tipo {product.classification}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Package className="w-4 h-4" />
            Código: {product.code}
          </span>
          <span>Categoría: {product.category}</span>
        </div>

        {/* Información de equivalencias */}
        {product.equivalences && product.equivalences.length > 0 && (
          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
            <p className="font-medium text-blue-700">Equivalencias:</p>
            <ul className="text-blue-600">
              {product.equivalences.map((eq, index) => (
                <li key={index}>{eq}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Campos de conteo */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Espacio 1
          </label>
          <input
            type="number"
            value={space1}
            onChange={(e) => setSpace1(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Espacio 2
          </label>
          <input
            type="number"
            value={space2}
            onChange={(e) => setSpace2(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Espacio 3
          </label>
          <input
            type="number"
            value={space3}
            onChange={(e) => setSpace3(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Total y cantidad a solicitar */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="bg-gray-100 p-3 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Total:</span>
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-gray-500" />
              <span className="text-lg font-bold text-gray-800">
                {total.toFixed(2)} {product.unitMin}
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad a Solicitar
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={requestQuantity}
              onChange={(e) => setRequestQuantity(Number(e.target.value) || 0)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              min="0"
              step="0.01"
            />
            <span className="px-3 py-2 bg-gray-100 rounded-md text-sm">
              {product.unitMax}
            </span>
          </div>
        </div>
      </div>

      {/* Alerta de producto en 0 */}
      {showZeroAlert && total === 0 && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <span className="text-sm text-yellow-700">
            Este producto está registrado en 0. Por favor confirma si es correcto.
          </span>
        </div>
      )}

      {/* Información de unidades */}
      <div className="mt-3 text-xs text-gray-500 border-t pt-2">
        <p>Unidad mínima: {product.unitMin} | Unidad máxima: {product.unitMax}</p>
        {product.unitContifico && <p>Unidad Contifico: {product.unitContifico}</p>}
      </div>
    </div>
  );
};

export default ProductCard;