import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { SITE_URL } from './site.config.js'

// Inject the single SITE_URL source into index.html (%SITE_URL%) at dev + build.
const htmlSiteUrl = {
  name: 'html-site-url',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) => html.replaceAll('%SITE_URL%', SITE_URL),
  },
}

export default defineConfig({
  plugins: [react(), htmlSiteUrl],
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
