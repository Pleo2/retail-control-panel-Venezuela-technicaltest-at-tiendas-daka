import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'

import AppPagination from '@/components/AppPagination.vue'

describe('AppPagination.vue', () => {
  let wrapper: VueWrapper<any>

  // Helper function to mount the component
  const createWrapper = (currentPage: number, totalPages: number) => {
    return mount(AppPagination, {
      props: {
        currentPage,
        totalPages,
      },
    })
  }

  // Test Suite 1: Rendering based on totalPages
  describe('Rendering based on totalPages', () => {
    it('does not render if totalPages is 1 or less', () => {
      wrapper = createWrapper(1, 1)
      expect(wrapper.find('nav').exists()).toBe(false)

      wrapper = createWrapper(1, 0)
      expect(wrapper.find('nav').exists()).toBe(false)
    })

    it('renders if totalPages is greater than 1', () => {
      wrapper = createWrapper(1, 2)
      expect(wrapper.find('nav').exists()).toBe(true)
    })
  })

  // Test Suite 2: With multiple pages
  describe('With multiple pages (e.g., 5 total pages)', () => {
    const totalPages = 5

    beforeEach(() => {
      // Default to current page 1 for these tests unless specified
      wrapper = createWrapper(1, totalPages)
    })

    it('renders the correct number of page buttons', () => {
      const pageButtons = wrapper
        .findAll('ul > li > button')
        .filter((btn) => !isNaN(Number(btn.text())))
      expect(pageButtons.length).toBe(totalPages)
      pageButtons.forEach((button, index) => {
        expect(button.text()).toBe(String(index + 1))
      })
    })

    it('renders "Previous" and "Next" buttons', () => {
      const prevButton = wrapper.find('[data-testid="prev-button"]')
      const nextButton = wrapper.find('[data-testid="next-button"]')
      expect(prevButton.exists()).toBe(true)
      expect(nextButton.exists()).toBe(true)
    })

    // Test sub-suite for "Previous" button behavior
    describe('"Previous" button', () => {
      it('is disabled on the first page', () => {
        wrapper = createWrapper(1, totalPages)
        const prevButton = wrapper.find('[data-testid="prev-button"]')
        expect(prevButton.exists()).toBe(true)
        expect((prevButton.element as HTMLButtonElement).disabled).toBe(true)
      })

      it('is enabled on subsequent pages', () => {
        wrapper = createWrapper(2, totalPages)
        const prevButton = wrapper.find('[data-testid="prev-button"]')
        expect(prevButton.exists()).toBe(true)
        expect((prevButton.element as HTMLButtonElement).disabled).toBe(false)
      })

      it('emits "update:currentPage" with currentPage - 1 when clicked and not on first page', async () => {
        wrapper = createWrapper(3, totalPages)
        const prevButton = wrapper.find('[data-testid="prev-button"]')
        expect(prevButton.exists()).toBe(true)

        await prevButton.trigger('click')
        expect(wrapper.emitted('update:currentPage')).toBeTruthy()
        expect(wrapper.emitted('update:currentPage')![0]).toEqual([2])
      })
    })

    // Test sub-suite for "Next" button behavior
    describe('"Next" button', () => {
      it('is disabled on the last page', () => {
        wrapper = createWrapper(totalPages, totalPages)
        const nextButton = wrapper.find('[data-testid="next-button"]')
        expect(nextButton.exists()).toBe(true)
        expect((nextButton.element as HTMLButtonElement).disabled).toBe(true)
      })

      it('is enabled on preceding pages', () => {
        wrapper = createWrapper(totalPages - 1, totalPages)
        const nextButton = wrapper.find('[data-testid="next-button"]')
        expect(nextButton.exists()).toBe(true)
        expect((nextButton.element as HTMLButtonElement).disabled).toBe(false)
      })

      it('emits "update:currentPage" with currentPage + 1 when clicked and not on last page', async () => {
        wrapper = createWrapper(2, totalPages)
        const nextButton = wrapper.find('[data-testid="next-button"]')
        expect(nextButton.exists()).toBe(true)

        await nextButton.trigger('click')
        expect(wrapper.emitted('update:currentPage')).toBeTruthy()
        expect(wrapper.emitted('update:currentPage')![0]).toEqual([3])
      })
    })

    // Test sub-suite for Page Number buttons
    describe('Page Number buttons', () => {
      it('highlights the current page button', () => {
        const currentPage = 3
        wrapper = createWrapper(currentPage, totalPages)
        const pageButtons = wrapper
          .findAll('ul > li > button')
          .filter((btn) => !isNaN(Number(btn.text())))
        const activeButton = pageButtons.find((btn) => btn.text() === String(currentPage))
        const inactiveButton = pageButtons.find((btn) => btn.text() === String(currentPage - 1))

        expect(activeButton?.exists()).toBe(true) // Check if active button was found
        expect(inactiveButton?.exists()).toBe(true) // Check if inactive button was found

        // Check for a specific class that indicates active state
        // Based on your classes: 'text-dark-blue bg-white/80'
        expect(activeButton?.classes()).toContain('bg-white/80')
        expect(activeButton?.classes()).toContain('text-dark-blue')

        // And an inactive button should not have it (or have the default ones)
        expect(inactiveButton?.classes()).toContain('bg-white')
        expect(inactiveButton?.classes()).toContain('text-gray-500')
      })

      it('emits "update:currentPage" with the page number when a page button is clicked', async () => {
        const targetPage = 3
        wrapper = createWrapper(1, totalPages) // Start on page 1
        const pageButtonToClick = wrapper
          .findAll('ul > li > button')
          .find((btn) => btn.text() === String(targetPage))
        expect(pageButtonToClick?.exists()).toBe(true)

        await pageButtonToClick?.trigger('click')
        expect(wrapper.emitted('update:currentPage')).toBeTruthy()
        expect(wrapper.emitted('update:currentPage')![0]).toEqual([targetPage])
      })

      it('does not emit "update:currentPage" if the clicked page is the current page', async () => {
        const currentPage = 2
        wrapper = createWrapper(currentPage, totalPages)
        const pageButtonToClick = wrapper
          .findAll('ul > li > button')
          .find((btn) => btn.text() === String(currentPage))
        expect(pageButtonToClick?.exists()).toBe(true)

        await pageButtonToClick?.trigger('click')
        expect(wrapper.emitted('update:currentPage')).toBeFalsy() // Should not emit
      })
    })
  })

  // Test Suite 3: Ellipsis (if implemented - current code does not have it)
  // describe('With many pages and ellipsis', () => {
  //   it('renders ellipsis when there are many pages', () => {
  //     wrapper = createWrapper(10, 20); // Potentially add maxVisibleButtons prop if you implement it
  //     const ellipsis = wrapper.findAll('ul > li > span').find(span => span.text() === '...');
  //     expect(ellipsis?.exists()).toBe(true); // Use optional chaining or check existence first
  //   });
  // });
})
