import { defineConfig } from "vite";
import externalize from "vite-plugin-externalize-dependencies";

export default defineConfig({
  build: {
    rollupOptions: {
      external: ["socket:crypto", "socket:network"],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  resolve: {
    alias: {
      buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6.js",
    },
  },
  plugins: [
    externalize({
      externals: ["socket:crypto", "socket:network"],
    }),
  ],
});
