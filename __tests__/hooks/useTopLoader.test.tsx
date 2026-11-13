'use client'

import { render, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TopLoaderProvider } from '@/store'
import { useTopLoader } from '@/hooks'

const CustomComponent: React.FC = () => {
	const { playing, progress, start, tick, stop } = useTopLoader()

	return (
		<>
			<span data-testid='playing'>{playing.current.toString()}</span>
			<span data-testid='progress'>{progress.current.toString()}</span>
			<span data-testid='start'>{typeof start}</span>
			<span data-testid='tick'>{typeof tick}</span>
			<span data-testid='stop'>{typeof stop}</span>
		</>
	)
}

describe('useTopLoader', () => {
	it('returns TopLoaderContext if used inside TopLoaderProvider', () => {
		const { getByTestId } = render(
			<TopLoaderProvider>
				<CustomComponent />
			</TopLoaderProvider>,
		)

		expect(getByTestId('playing').textContent === 'true').toBe(false)
		expect(Number(getByTestId('progress').textContent)).toBe(0)
		expect(getByTestId('start').textContent).toBe('function')
		expect(getByTestId('tick').textContent).toBe('function')
		expect(getByTestId('stop').textContent).toBe('function')
	})

	it('throws a new Exception if used outside a TopLoaderProvider', () => {
		expect(() => renderHook(() => useTopLoader())).toThrow(
			'TopLoaderContext is not defined. `useTopLoader` is only available inside the TopLoader Component. Please wrap the application within the TopLoader Component.',
		)
	})
})
