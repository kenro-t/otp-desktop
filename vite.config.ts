import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  // build: {
  //   // 出力先を指定 (ここでは `dist` ディレクトリ)
  //   outDir: 'dist',
  //   // `preload.mjs` を含むビルドの設定
  //   rollupOptions: {
  //     input: {
  //       main: 'index.html',
  //       preload: 'preload.mjs', // preloadスクリプトを指定
  //     },
  //   },
  // },
})
