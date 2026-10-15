import { useEffect, useState } from 'react';

type Product = {
  id: string;
  sku: string;
  name: string;
  currentStock: number;
  minimumStock: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json.success) setProducts(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produtos</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {loading && <p>Carregando...</p>}
        {!loading && !products && <p>Nenhum produto encontrado.</p>}
        {!loading && products && (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="pb-2">SKU</th>
                <th className="pb-2">Nome</th>
                <th className="pb-2">Estoque</th>
                <th className="pb-2">Mínimo</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-2">{p.sku}</td>
                  <td className="py-2">{p.name}</td>
                  <td className="py-2">{p.currentStock}</td>
                  <td className="py-2">{p.minimumStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
