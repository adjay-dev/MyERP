'use client';

import Link from 'next/link';

export default function ProductsPage() {
  // This page is a placeholder that will fetch from /api/products in a full implementation
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Link href="/products/new" className="px-4 py-2 bg-primary-600 text-white rounded-lg">Criar Produto</Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">Lista de produtos (implementar fetch)</div>
    </div>
  );
}
