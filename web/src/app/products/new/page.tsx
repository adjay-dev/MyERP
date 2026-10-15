'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ sku, name, salePrice: Number(salePrice), costPrice: Number(costPrice) }),
      });
      const json = await res.json();
      if (json.success) {
        router.push('/products');
      } else {
        alert(json.error || 'Erro ao criar produto');
      }
    } catch (err) {
      alert('Erro ao conectar com API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Criar Produto</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm">SKU</label>
          <input className="border rounded w-full p-2" value={sku} onChange={(e)=>setSku(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Nome</label>
          <input className="border rounded w-full p-2" value={name} onChange={(e)=>setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Preço de Venda</label>
          <input type="number" step="0.01" className="border rounded w-full p-2" value={salePrice} onChange={(e)=>setSalePrice(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Preço de Custo</label>
          <input type="number" step="0.01" className="border rounded w-full p-2" value={costPrice} onChange={(e)=>setCostPrice(e.target.value)} />
        </div>
        <div>
          <button disabled={loading} className="px-4 py-2 bg-primary-600 text-white rounded">{loading ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </form>
    </div>
  );
}
