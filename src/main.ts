import '@/global.css'

import { createApp } from 'vue'
import App from '@/App.vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

const app = createApp(App)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 60 minutes of staleTime by default
      gcTime: 1000 * 60 * 60, // 60 minutes of garbage collection time
      retry: 1, // Retry once in case of error
    },
  },
})

app.use(VueQueryPlugin, { queryClient }) // Pass custom client
// Si usas Vue Router: app.use(router)
app.mount('#app')
