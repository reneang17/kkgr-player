import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Two pages: the landing page (index.html) and the player (watch.html). Vite
// only builds index.html unless told otherwise, so without this the build would
// silently omit the player.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        watch: resolve(__dirname, 'watch.html')
      }
    }
  }
});
