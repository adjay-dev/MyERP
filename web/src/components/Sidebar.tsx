'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

const menuItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/products', icon: Package, label: 'Produtos' },
  { href: '/customers', icon: Users, label: 'Clientes' },
  { href: '/sales', icon: ShoppingCart, label: 'Vendas' },
  { href: '/invoices', icon: FileText, label: 'Faturas' },
  { href: '/settings', icon: Settings, label: 'Configurações' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-slate-900 text-white p-6 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-400">MyERP</h1>
        <p className="text-sm text-slate-400 mt-1">Gestão Empresarial</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-slate-300 hover:bg-slate-800 transition-colors"
      >
        <LogOut size={20} />
        <span>Sair</span>
      </button>
    </aside>
  );
}
