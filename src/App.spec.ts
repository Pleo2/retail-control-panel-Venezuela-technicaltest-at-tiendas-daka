import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

describe('App.vue', () => {
  it('renders without crashing', () => {
    const queryClient = new QueryClient()
    const wrapper = mount(App, {
      global: {
        plugins: [[VueQueryPlugin, { queryClient }]],
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
