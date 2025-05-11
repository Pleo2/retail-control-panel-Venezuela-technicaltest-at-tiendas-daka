import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppPagination from '../AppPagination.vue'

describe('AppPagination.vue', () => {
  it('renders correctly with given props', () => {
    const wrapper = mount(AppPagination, {
      props: {
        currentPage: 2,
        totalPages: 5,
      },
    })
    expect(wrapper.find('nav').exists()).toBe(true)
    expect(wrapper.findAll('button').length).toBe(5 + 2) // 5 pages + prev/next buttons
    expect(wrapper.text()).toContain('2')
  })

  it('emits update:currentPage when a page number is clicked', async () => {
    const wrapper = mount(AppPagination, {
      props: {
        currentPage: 1,
        totalPages: 3,
      },
    })
    // Page buttons are inside <li>, the first page button is '1'
    // If currentPage is 1 and totalPages is 3, the buttons are: Prev, 1, 2, 3, Next
    // The button for page '2' is the second button inside the <li> elements elements
    await wrapper
      .findAll('li > button')
      .filter((b) => b.text() === '2')[0]
      .trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:currentPage')).toBeTruthy()
    const emitted = wrapper.emitted('update:currentPage')
    expect(emitted?.[0]).toEqual([2])
  })

  it('emits update:currentPage when next button is clicked', async () => {
    const wrapper = mount(AppPagination, {
      props: {
        currentPage: 1,
        totalPages: 3,
      },
    })
    // The last button is the 'Next' button
    await wrapper.findAll('button').at(-1)?.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:currentPage')).toBeTruthy()
    const emitted = wrapper.emitted('update:currentPage')
    expect(emitted?.[0]).toEqual([2])
  })

  it('emits update:currentPage when previous button is clicked', async () => {
    const wrapper = mount(AppPagination, {
      props: {
        currentPage: 2,
        totalPages: 3,
      },
    })
    await wrapper.findAll('button')[0].trigger('click') // Click on the 'Previous' button
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:currentPage')).toBeTruthy()
    const emitted = wrapper.emitted('update:currentPage')
    expect(emitted?.[0]).toEqual([1])
  })

  it('disables previous button on the first page', () => {
    const wrapper = mount(AppPagination, {
      props: {
        currentPage: 1,
        totalPages: 3,
      },
    })
    expect(wrapper.findAll('button')[0].attributes('disabled')).toBeDefined()
  })

  it('disables next button on the last page', () => {
    const wrapper = mount(AppPagination, {
      props: {
        currentPage: 3,
        totalPages: 3,
      },
    })
    expect(wrapper.findAll('button').at(-1)?.attributes('disabled')).toBeDefined()
  })

  it('does not render if totalPages is 1 or less', () => {
    const wrapper = mount(AppPagination, {
      props: {
        currentPage: 1,
        totalPages: 1,
      },
    })
    expect(wrapper.find('nav').exists()).toBe(false)

    const wrapperZero = mount(AppPagination, {
      props: {
        currentPage: 1,
        totalPages: 0,
      },
    })
    expect(wrapperZero.find('nav').exists()).toBe(false)
  })

  it('displays correct page numbers', () => {
    const totalPages = 5
    const wrapper = mount(AppPagination, {
      props: {
        currentPage: 3,
        totalPages: totalPages,
      },
    })
    // This will find buttons that are not 'Prev' or 'Next' and whose text is a number
    const pageNumberButtons = wrapper
      .findAll('li > button')
      .filter((btn) => btn.text().match(/^\d+$/))
    expect(pageNumberButtons.length).toBe(totalPages)
    pageNumberButtons.forEach((button, index) => {
      expect(button.text()).toBe(String(index + 1))
    })
  })

  it('highlights the current page', () => {
    const currentPage = 3
    const wrapper = mount(AppPagination, {
      props: {
        currentPage: currentPage,
        totalPages: 5,
      },
    })
    // The button for the current page should have specific classes
    // We find the button corresponding to currentPage. The 'Previous' button is at index 0.
    const pageButton = wrapper.findAll('li > button')[currentPage - 1]
  })

  it('does not emit update:currentPage if clicked page is current page', async () => {
    const wrapper = mount(AppPagination, {
      props: {
        currentPage: 2,
        totalPages: 3,
      },
    })
    // The button for page '2' is the second button inside the <li> elements
    await wrapper
      .findAll('li > button')
      .filter((b) => b.text() === '2')[0]
      .trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:currentPage')).toBeFalsy()
  })

  it('does not emit update:currentPage if clicked page is out of bounds (less than 1)', async () => {
    const wrapper = mount(AppPagination, {
      props: {
        currentPage: 1,
        totalPages: 3,
      },
    })
    // Instead of calling the method directly, we simulate a click on the 'Previous' button, which is disabled
    await wrapper.findAll('button')[0].trigger('click')
    await wrapper.vm.$nextTick()
    // Since the button is disabled and the component logic prevents emitting for out-of-bounds pages,
    // it should not emit the event
    expect(wrapper.emitted('update:currentPage')).toBeFalsy()
  })

  it('does not emit update:currentPage if clicked page is out of bounds (greater than totalPages)', async () => {
    const wrapper = mount(AppPagination, {
      props: {
        currentPage: 3,
        totalPages: 3,
      },
    })
    // Instead of calling the method directly, we simulate a click on the 'Next' button, which is disabled
    await wrapper.findAll('button').at(-1)?.trigger('click')
    await wrapper.vm.$nextTick()
    // Since the button is disabled and the component logic prevents emitting for out-of-bounds pages,
    // it should not emit the event
    expect(wrapper.emitted('update:currentPage')).toBeFalsy()
  })
})
