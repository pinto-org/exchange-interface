import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: 'src',
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  },
  define: {
    global: {} // fix "global is not defined" error for Wallet Connect
  }
});
