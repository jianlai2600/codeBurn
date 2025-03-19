import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',  // 让 Vite 监听所有网络地址
    port: 5173       // 可选，Vite 默认端口
  },
  preview: {
    port: 4173,  // Heroku 会自动覆盖这个端口
    allowedHosts: ['burncode-frontend-86c9eaa8c89d.herokuapp.com'] // 允许 Heroku 访问
  }
})