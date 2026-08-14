'use client';

import { Card } from '@/components/ui/Card';
import { BarChart, TrendingUp, Users, Package } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Faturamento',
      value: 'AOA 125.400',
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Vendas',
      value: '24',
      icon: BarChart,
      color: 'bg-blue-500',
    },
    {
      title: 'Clientes',
      value: '18',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Produtos',
      value: '42',
      icon: Package,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <Icon size={24} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Welcome Message */}
      <Card>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Bem-vindo ao MyERP 👋
          </h2>
          <p className="text-slate-600 mb-6">
            Sua plataforma de gestão empresarial está pronta. Comece explorando os módulos disponíveis.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Criar Produto
            </button>
            <button className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors">
              Ver Documentação
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
