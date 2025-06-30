// Vite config. I just use the default. If you want to add more plugins, go for it!
// TODO: Try out some Vite plugins? Maybe. Or not.
// old way: module.exports = ...
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
