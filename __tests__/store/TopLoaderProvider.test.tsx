/**
 * @jest-environment-options { "url": "http://localhost:3000/current" }
 */

import '@testing-library/jest-dom'
import { fireEvent } from '@testing-library/dom'
import { act, render } from '@testing-library/react'
import { TopLoaderProvider } from '@/store/TopLoaderProvider'
import { useTopLoaderApi as _useTopLoaderApi } from '@/hooks/useTopLoaderApi'


jest.mock( '@alessiofrittoli/react-hooks', () => ( {
	useDeferCallback: ( fn: () => void ) => fn, // do not defer callback so we are not required to use Jest fake timers.
} ) )


jest.mock( '@/hooks/useTopLoaderApi', () => ( {
	useTopLoaderApi: jest.fn( () => ( {
		start	: jest.fn(),
		stop	: jest.fn(),
	} ) )
} ) )

const useTopLoaderApi = _useTopLoaderApi as jest.Mock


describe( 'TopLoaderProvider', () => {

	let start	: jest.Mock
	let stop	: jest.Mock

	beforeEach( () => {
		
		start	= jest.fn()
		stop	= jest.fn()

		useTopLoaderApi
			.mockReturnValue( { start, stop } )

	} )


	it( 'renders children', () => {

		const { getByText } = render(
			<TopLoaderProvider>
				<div>Child</div>
			</TopLoaderProvider>
		)

		expect( getByText( 'Child' ) )
			.toBeInTheDocument()
	} )


	it( 'calls start on navigation to a different internal URL', () => {

		const { container } = render(
			<TopLoaderProvider>
				<a href='/other'><span>Link</span></a>
			</TopLoaderProvider>
		)

		const anchor = container.querySelector( 'a' )!.querySelector( 'span' )!

		act( () => {
			fireEvent.click( anchor )
		} )

		expect( start ).toHaveBeenCalled()

	} )


	it( 'doesn\'t call start if navigating to the same pathname', () => {

		const { container } = render(
			<TopLoaderProvider>
				<a href='/current'>Link</a>
			</TopLoaderProvider>
		)
		
		const anchor = container.querySelector( 'a' )!

		act( () => {
			fireEvent.click( anchor )
		} )

		expect( start ).not.toHaveBeenCalled()

	} )


	it( 'doesn\' call start if clicked link has no href attribute', () => {

		const { container } = render(
			<TopLoaderProvider>
				<a>Link</a>
			</TopLoaderProvider>
		)
		
		const anchor = container.querySelector( 'a' )!

		act( () => {
			fireEvent.click( anchor )
		} )

		expect( start ).not.toHaveBeenCalled()

	} )
	
	
	it( 'doesn\' call start if clicked a link with a secondary key', () => {

		const { container } = render(
			<TopLoaderProvider>
				<a href='/other'>Link</a>
			</TopLoaderProvider>
		)
		
		const anchor = container.querySelector( 'a' )!

		act( () => {
			fireEvent.click( anchor, { ctrlKey: true } )
			fireEvent.click( anchor, { metaKey: true } )
			fireEvent.click( anchor, { shiftKey: true } )
			fireEvent.click( anchor, { altKey: true } )
		} )

		expect( start ).not.toHaveBeenCalled()

	} )


	it( 'doesn\'t call start if navigating to an external URL', () => {

		const { container } = render(
			<TopLoaderProvider>
				<a href='https://external-url.com'>External link</a>
			</TopLoaderProvider>
		)
		
		const anchor = container.querySelector( 'a' )!

		act( () => {
			fireEvent.click( anchor )
		} )

		expect( start ).not.toHaveBeenCalled()

	} )


	it( 'calls stop on popstate and pagehide events', () => {

		render( <TopLoaderProvider /> )

		act( () => {
			fireEvent( window, new Event( 'popstate' ) )
			fireEvent( window, new Event( 'pagehide' ) )
		} )
		
		expect( stop ).toHaveBeenCalledTimes( 2 )

	} )


	it( 'calls start and stop on history pushState and replaceState', () => {

		render( <TopLoaderProvider /> )
		
		act( () => {
			window.history.pushState( {}, '', '/new' )
			window.history.replaceState( {}, '', '/new2' )	
		} )

		expect( start ).toHaveBeenCalledTimes( 2 )
		expect( stop ).toHaveBeenCalledTimes( 2 )

	} )

} )