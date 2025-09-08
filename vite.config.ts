import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Replace 'nci-academic-writer' with your GitHub repository name if it's different.
  base: '/nci-academic-writer/',
  define: {
    // This makes the API_KEY environment variable available to the client-side code.
    // The value is injected at build time, so it's not exposed in your source code.
    // Ensure your build environment (e.g., GitHub Actions secrets) has the API_KEY variable set.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
