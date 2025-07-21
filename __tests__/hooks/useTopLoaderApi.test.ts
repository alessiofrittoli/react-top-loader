import { renderHook, act } from '@testing-library/react'
import { useTopLoaderApi, type UseTopLoaderApiOptions } from '@/hooks/useTopLoaderApi'


describe( 'useTopLoaderApi', () => {

	beforeAll( () => {
		jest.useFakeTimers()
	} )


	afterAll( () => {
		jest.useRealTimers()
	} )

	let onStart: jest.Mock
	let onTick: jest.Mock
	let onStop: jest.Mock
	let options: UseTopLoaderApiOptions

	beforeEach( () => {
		onStart	= jest.fn()
		onTick	= jest.fn()
		onStop	= jest.fn()
		options	= { onStart, onTick, onStop }
	} )


	it( 'initializes refs correctly', () => {

		const { result } = renderHook( () => useTopLoaderApi() )

		expect( result.current.playing.current )
			.toBe( false )
		expect( result.current.progress.current )
			.toBe( 0 )

	} )


	it( 'calls onStart when start is called', () => {

		const { result } = renderHook( () => useTopLoaderApi( options ) )
		
		act( () => {
			result.current.start()
		} )

		expect( onStart ).toHaveBeenCalled()
		expect( result.current.playing.current )
			.toBe( true )

	} )


	it( 'ticks progress and call onTick', () => {

		const { result } = renderHook( () => useTopLoaderApi( options ) )

		act( () => {
			result.current.start()
		} )

		act( () => {
			result.current.tick()
		} )

		expect( onTick ).toHaveBeenCalled()
		expect( result.current.progress.current ).toBeGreaterThan( 0 )

	} )


	it( 'clamps progress between 0 and 100', () => {

		const { result } = renderHook( () => useTopLoaderApi( options ) )

		act( () => {

			result.current.start()
			result.current.tick( -10 )

		} )

		expect( result.current.progress.current ).toBe( 0 )

		act( () => {
			result.current.tick( 150 )
		} )

		expect( result.current.progress.current ).toBe( 100 )

	} )


	it( 'increases progress by 2 when progress is greather than or equal to 50 and less than or equal to 80', () => {

		const { result } = renderHook( () => useTopLoaderApi( options ) )

		act( () => {
			result.current.start()
			result.current.tick( 50 )
			result.current.tick()
		} )

		expect( result.current.progress.current ).toBe( 52 )

		act( () => {
			result.current.tick()
		} )

		expect( result.current.progress.current ).toBe( 54 )
		
		act( () => {
			result.current.tick( 80 )
		} )

		expect( result.current.progress.current ).not.toBe( 82 )

	} )


	it( 'stops and resets progress', () => {

		const { result } = renderHook( () => useTopLoaderApi() )

		act( () => {
			result.current.start()
			result.current.tick( 50 )
			result.current.stop()
		} )

		expect( result.current.playing.current ).toBe( false )
		expect( result.current.progress.current ).toBe( 100 )

		jest.advanceTimersByTime( 500 )

		expect( result.current.progress.current ).toBe( 0 )

	} )
	
	
	it( 'stops and calls onStop if given', () => {

		const { result } = renderHook( () => useTopLoaderApi( options ) )

		act( () => {
			result.current.start()
			result.current.tick( 50 )
			result.current.stop()
		} )

		expect( result.current.playing.current ).toBe( false )
		expect( result.current.progress.current ).toBe( 100 )

		jest.advanceTimersByTime( 400 )

		expect( onStop ).toHaveBeenCalled()

	} )


	it( 'doesn\'t tick if not playing', () => {
		
		const { result } = renderHook( () => useTopLoaderApi( options ) )

		act( () => {
			result.current.tick()
		} )

		expect( result.current.progress.current ).toBe( 0 )
		expect( result.current.tick() ).toBe( false )

	} )


	it( 'doesn\'t stop if not playing', () => {
		
		const { result } = renderHook( () => useTopLoaderApi( options ) )

		act( () => {
			result.current.stop()
		} )

		expect( onStop ).not.toHaveBeenCalled()

	} )


	it( 'stops loop when progress reaches 100', () => {
		
		const { result } = renderHook( () => useTopLoaderApi( options ) )

		act( () => {
			result.current.start()
			result.current.tick( 99 )
			result.current.tick()
		} )

		expect( result.current.progress.current ).toBe( 100 )
		expect( result.current.tick() ).toBe( false )

	} )

} )