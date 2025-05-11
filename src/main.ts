import '@/global.css'

import { createApp } from 'vue'
import App from '@/App.vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

const app = createApp(App)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos de staleTime por defecto
      gcTime: 1000 * 60 * 10, // 10 minutos de garbage collection time
      retry: 1, // Reintentar una vez en caso de error
    },
  },
})

app.use(VueQueryPlugin, { queryClient }) // Pasar el cliente personalizado
// Si usas Vue Router: app.use(router)
app.mount('#app')
