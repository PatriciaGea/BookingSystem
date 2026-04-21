import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function resolveBasePath(command) {
  if (command === 'serve') {
    return '/'
  }

  const explicitBasePath = process.env.VITE_BASE_PATH?.trim()
  if (explicitBasePath) {
    return explicitBasePath.endsWith('/') ? explicitBasePath : `${explicitBasePath}/`
  }

  const repositoryName = process.env.GITHUB_REPOSITORY?.split('/').pop()
  if (!repositoryName || repositoryName.endsWith('.github.io')) {
    return '/'
  }

  return `/${repositoryName}/`
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: resolveBasePath(command)
}))
