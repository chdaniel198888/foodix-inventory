import { ProductCard } from './ProductCard';

const InventoryTest = () => {
  const mockProduct = {
    id: '1',
    code: 'TEST001',
    name: 'Producto de Prueba',
    category: 'PRUEBA',
    unitCount: 'unidad',
    unitMin: 'unidad',
    unitMax: 'unidad',
    classification: 'A',
    equivalences: [],
    activeInRestaurants: ['chios'],
    activeInWarehouses: []
  };

  const handleCountChange = (productId: string, count: any) => {
    console.log('Producto:', productId, 'Conteo:', count);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sistema de Inventario Foodix - Prueba</h1>
      
      <div className="bg-blue-50 p-4 rounded mb-4">
        <p>Esta es una versión de prueba simplificada</p>
      </div>

      <ProductCard
        product={mockProduct}
        onCountChange={handleCountChange}
        showZeroAlert={true}
      />
    </div>
  );
};

export default InventoryTest;