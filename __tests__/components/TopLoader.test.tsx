import type { TopLoaderProgressBarProps } from '@/components/TopLoaderProgressBar'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { TopLoader } from '@/components/TopLoader'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@alessiofrittoli/react-hooks', () => ({
	useDeferCallback: (fn: () => void) => fn, // do not defer callback so we are not required to use fake timers.
}))

const MockProgressBar: React.FC<TopLoaderProgressBarProps> = ({
	progressBarRef,
	style,
	children,
	...props
}) => (
	<>
		{children}
		<div
			ref={progressBarRef}
			style={{ ...style, width: '0%' }}
			aria-hidden
			data-testid='progress'
			{...props}
		>
			ProgressBar
		</div>
	</>
)

describe('TopLoader', () => {
	it('renders the default TopLoaderProgressBar component', () => {
		render(<TopLoader />)

		const progressBar = document.querySelector('[aria-hidden]')

		expect(progressBar).toBeInTheDocument()
		expect(progressBar).toHaveStyle('width: 0%')
	})

	it('renders a custom Component if provided', () => {
		render(<TopLoader Component={MockProgressBar} />)

		expect(screen.getByTestId('progress')).toHaveTextContent('ProgressBar')
	})

	it('calls onStart when starting progress', () => {
		const onStart = vi.fn()

		const { container } = render(
			<TopLoader onStart={onStart}>
				<a href='/other'>Link</a>
			</TopLoader>,
		)

		const anchor = container.querySelector('a')!

		act(() => {
			fireEvent.click(anchor)
		})

		expect(onStart).toHaveBeenCalled()
	})

	it('calls onTick when ticking progress', () => {
		vi.useFakeTimers()

		const onTick = vi.fn()

		const { container } = render(
			<TopLoader onTick={onTick}>
				<a href='/other'>Link</a>
			</TopLoader>,
		)

		const anchor = container.querySelector('a')!

		act(() => {
			fireEvent.click(anchor)
		})

		vi.runAllTimers()

		expect(onTick).toHaveBeenLastCalledWith(expect.any(Number))

		vi.useRealTimers()
	})

	it('calls onStop when stopping progress', () => {
		vi.useFakeTimers()

		const onStop = vi.fn()

		const { container } = render(
			<TopLoader onStop={onStop}>
				<a href='/other'>Link</a>
			</TopLoader>,
		)

		const anchor = container.querySelector('a')!

		act(() => {
			fireEvent.click(anchor)
			window.history.pushState({}, '', '/other') // push state so immediately calls `stop` method instead of ticking
		})

		vi.runAllTimers()

		expect(onStop).toHaveBeenCalled()

		vi.useRealTimers()
	})
})
