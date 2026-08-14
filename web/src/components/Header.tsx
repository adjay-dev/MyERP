'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, User, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <User size={18} className="text-slate-700 dark:text-slate-300" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {user?.name}
            </span>
            <ChevronDown size={16} className="text-slate-700 dark:text-slate-300" />
          </button>

          {/* Dropdown Menu */}
          {openDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
              <Link
                href="/profile"
                className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Perfil
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Configurações
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
