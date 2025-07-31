import { TopLoaderContext } from '@/store/TopLoaderContext'


describe( 'TopLoaderContext', () => {	

	it( 'should be defined', () => {
		expect( TopLoaderContext ).toBeDefined()
	} )

	
	it( 'should have the correct displayName', () => {
		expect( TopLoaderContext.displayName )
			.toBe( 'TopLoaderContext' )
	} )


	it( 'should have undefined as default value', () => {
		// @ts-expect-error: _currentValue is internal
		expect( TopLoaderContext._currentValue )
			.toBeUndefined()
	} )
	
} )