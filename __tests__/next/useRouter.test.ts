import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { Url } from '@alessiofrittoli/url-utils'
import { useRouter } from '@/next/useRouter'

const mockStart = vi.fn()
const mockPush = vi.fn()
const mockReplace = vi.fn()
const mockBack = vi.fn()
const mockForward = vi.fn()
const mockRefresh = vi.fn()
const mockPrefetch = vi.fn()
const mockUseNextRouter = vi.fn(() => ({
	push: mockPush,
	replace: mockReplace,
	back: mockBack,
	forward: mockForward,
	refresh: mockRefresh,
	prefetch: mockPrefetch,
}))

const mockUsePathname = vi.fn()

vi.mock('next/navigation', () => ({
	useRouter: () => mockUseNextRouter(),
	usePathname: () => mockUsePathname(),
}))

vi.mock('@/hooks/useTopLoader', () => ({
	useTopLoader: () => ({ start: mockStart }),
}))

vi.mock('@alessiofrittoli/url-utils', () => ({
	Url: {
		parse: vi.fn(),
		format: vi.fn(),
	},
}))

const mockUrlParse = Url.parse as Mock<typeof Url.parse>
const mockUrlFormat = Url.format as Mock<typeof Url.format>

describe('useRouter', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mockUsePathname.mockReturnValue('/current')
		mockUrlFormat.mockImplementation(input => input as ReturnType<typeof Url.format>)
	})

	it('exposes router methods', () => {
		mockUrlParse.mockReturnValue({ pathname: '/current' } as ReturnType<typeof Url.parse>)

		const { result } = renderHook(() => useRouter())

		expect(result.current.back).toBe(mockBack)
		expect(result.current.forward).toBe(mockForward)
		expect(result.current.refresh).toBe(mockRefresh)
		expect(result.current.prefetch).toBe(mockPrefetch)
		expect(typeof result.current.push).toBe('function')
		expect(typeof result.current.replace).toBe('function')
	})

	describe('push', () => {
		it('calls start when pushing to a different pathname', () => {
			mockUrlParse.mockReturnValue({ pathname: '/other' } as ReturnType<typeof Url.parse>)

			const { result } = renderHook(() => useRouter())

			act(() => {
				result.current.push('/other')
			})

			expect(mockStart).toHaveBeenCalled()
			expect(mockPush).toHaveBeenCalledWith('/other', undefined)
		})

		it("doesn't call start when pushing to the same pathname", () => {
			mockUrlParse.mockReturnValue({ pathname: '/current' } as ReturnType<typeof Url.parse>)

			const { result } = renderHook(() => useRouter())

			act(() => {
				result.current.push('/current')
			})

			expect(mockStart).not.toHaveBeenCalled()
			expect(mockPush).toHaveBeenCalledWith('/current', undefined)
		})
	})

	describe('replace', () => {
		it('calls start when replacing to a different pathname', () => {
			mockUrlParse.mockReturnValue({ pathname: '/other' } as ReturnType<typeof Url.parse>)

			const { result } = renderHook(() => useRouter())

			act(() => {
				result.current.replace('/other')
			})

			expect(mockStart).toHaveBeenCalled()
			expect(mockReplace).toHaveBeenCalledWith('/other', undefined)
		})

		it("doesn't call start when replacing to the same pathname", () => {
			mockUrlParse.mockReturnValue({ pathname: '/current' } as ReturnType<typeof Url.parse>)

			const { result } = renderHook(() => useRouter())

			act(() => {
				result.current.replace('/current')
			})

			expect(mockStart).not.toHaveBeenCalled()
			expect(mockReplace).toHaveBeenCalledWith('/current', undefined)
		})
	})

	it('passes options to push and replace', () => {
		mockUrlParse.mockReturnValue({ pathname: '/other' } as ReturnType<typeof Url.parse>)

		const { result } = renderHook(() => useRouter())

		const options = { scroll: false }

		act(() => {
			result.current.push('/other', options)
			result.current.replace('/other', options)
		})

		expect(mockPush).toHaveBeenCalledWith('/other', options)
		expect(mockReplace).toHaveBeenCalledWith('/other', options)
	})
})
