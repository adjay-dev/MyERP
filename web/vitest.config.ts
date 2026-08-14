import type { Config } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

const config: Config = {
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};

export default config;
