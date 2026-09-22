import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ---------------------------------------------------------------------------
// BASE PATH CONFIGURATION
// ---------------------------------------------------------------------------
// This project is deployed as a *project page* at rimon-babu.github.io, which
// (because the repo is the "<user>.github.io" repo itself) is served from the
// domain root, so base stays "/".
//
// If you ever deploy this same build under a *different* repo name, e.g.
// rimon-babu.github.io/some-other-repo, set VITE_BASE_PATH="/some-other-repo/"
// when building. When you move to a custom domain (see README → "Connecting
// a custom domain"), base should stay "/" — nothing here needs to change.
// ---------------------------------------------------------------------------
const base = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
