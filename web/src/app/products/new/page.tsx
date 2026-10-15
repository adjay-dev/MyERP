'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // call API when implemented
    alert('Salvar produto (API não implementada no cliente neste commit)');
    router.push('/products');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Criar Produto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Nome</label>
          <input className="border rounded w-full p-2" value={name} onChange={(e)=>setName(e.target.value)} />
        </div>
        <div>
          <button className="px-4 py-2 bg-primary-600 text-white rounded">Salvar</button>
        </div>
      </form>
    </div>
  );
}
