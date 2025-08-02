import '@testing-library/jest-dom'
import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { TopLoaderProgressBar } from '@/components/TopLoaderProgressBar'

describe( 'TopLoaderProgressBar', () => {

	it( 'renders children', () => {

		render(
			<TopLoaderProgressBar progressBarRef={ createRef() }>
				<span>Child Content</span>
			</TopLoaderProgressBar>
		)

		expect( screen.getByText( 'Child Content' ) )
			.toBeInTheDocument()
		
	} )


	it( 'renders a div with React ref and default width style', () => {

		const ref = createRef<HTMLDivElement>()

		render(
			<TopLoaderProgressBar
				data-testid='progress'
				progressBarRef={ ref }
			/>
		)

		const progressBar = screen.getByTestId( 'progress' )

		expect( progressBar ).toBeInTheDocument()
		expect( progressBar ).toHaveStyle( 'width: 0%' )
		expect( ref.current ).toBe( progressBar )

	} )


	it( 'applies additional styles and props', () => {

		render(
			<TopLoaderProgressBar
				data-testid='progress'
				progressBarRef={ createRef() }
				className='custom-class'
				style={ { background: 'red' } }
			/>
		)

		const progressBar = screen.getByTestId( 'progress' )

		expect( progressBar ).toHaveStyle( 'width: 0%' )
		expect( progressBar ).toHaveStyle( 'background: red' )
		expect( progressBar ).toHaveClass( 'custom-class' )

	} )

} )