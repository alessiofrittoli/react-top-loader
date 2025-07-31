import { renderHook, act } from '@testing-library/react'
import { Url } from '@alessiofrittoli/url-utils'
import { useRouter } from '@/next/useRouter'


const mockStart			= jest.fn()
const mockPush			= jest.fn()
const mockReplace		= jest.fn()
const mockBack			= jest.fn()
const mockForward		= jest.fn()
const mockRefresh		= jest.fn()
const mockPrefetch		= jest.fn()
const mockUseNextRouter	= jest.fn( () => ( {
	push		: mockPush,
	replace		: mockReplace,
	back		: mockBack,
	forward		: mockForward,
	refresh		: mockRefresh,
	prefetch	: mockPrefetch,
} ) )

const mockUsePathname = jest.fn()


jest.mock( 'next/navigation', () => ( {
	useRouter	: () => mockUseNextRouter(),
	usePathname	: () => mockUsePathname(),
} ) )


jest.mock( '@/hooks/useTopLoader', () => ({
	useTopLoader: () => ( { start: mockStart } ),
} ) )


jest.mock( '@alessiofrittoli/url-utils', () => ( {
	Url: {
		parse	: jest.fn(),
		format	: jest.fn(),
	},
} ) )


const mockUrlParse	= Url.parse as jest.Mock
const mockUrlFormat	= Url.format as jest.Mock


describe( 'useRouter', () => {

	beforeEach( () => {

		jest.clearAllMocks()
		mockUsePathname.mockReturnValue( '/current' )
		mockUrlFormat.mockImplementation( input => input )

	} )


	it( 'exposes router methods', () => {

		mockUrlParse
			.mockReturnValue( { pathname: '/current' } )
		
		const { result } = renderHook( () => useRouter() )

		expect( result.current.back ).toBe( mockBack )
		expect( result.current.forward ).toBe( mockForward )
		expect( result.current.refresh ).toBe( mockRefresh )
		expect( result.current.prefetch ).toBe( mockPrefetch )
		expect( typeof result.current.push ).toBe( 'function' )
		expect( typeof result.current.replace ).toBe( 'function' )
		
	} )


	describe( 'push', () => {
		
		it( 'calls start when pushing to a different pathname', () => {
	
			mockUrlParse
				.mockReturnValue( { pathname: '/other' } )
	
			const { result } = renderHook( () => useRouter() )
	
			act( () => {
				result.current.push( '/other' )
			} )
	
			expect( mockStart ).toHaveBeenCalled()
			expect( mockPush ).toHaveBeenCalledWith( '/other', undefined )
	
		} )
	
		
		it( 'doesn\'t call start when pushing to the same pathname', () => {
			
			mockUrlParse
				.mockReturnValue( { pathname: '/current' } )
	
			const { result } = renderHook( () => useRouter() )
	
			act( () => {
				result.current.push( '/current' )
			} )
	
			expect( mockStart ).not.toHaveBeenCalled()
			expect( mockPush ).toHaveBeenCalledWith( '/current', undefined )
	
		} )
		
	} )
	
	
	describe( 'replace', () => {
		
		it( 'calls start when replacing to a different pathname', () => {
	
			mockUrlParse
				.mockReturnValue( { pathname: '/other' } )
	
			const { result } = renderHook( () => useRouter() )
	
			act( () => {
				result.current.replace( '/other' )
			} )
	
			expect( mockStart ).toHaveBeenCalled()
			expect( mockReplace ).toHaveBeenCalledWith( '/other', undefined )
	
		} )
	
		
		it( 'doesn\'t call start when replacing to the same pathname', () => {
			
			mockUrlParse
				.mockReturnValue( { pathname: '/current' } )
	
			const { result } = renderHook( () => useRouter() )
	
			act( () => {
				result.current.replace( '/current' )
			} )
	
			expect( mockStart ).not.toHaveBeenCalled()
			expect( mockReplace ).toHaveBeenCalledWith( '/current', undefined )
	
		} )

	} )


	it( 'passes options to push and replace', () => {

		mockUrlParse
			.mockReturnValue( { pathname: '/other' } )
		
		const { result } = renderHook( () => useRouter() )

		const options = { scroll: false }

		act( () => {
			result.current.push( '/other', options )
			result.current.replace( '/other', options )
		} )
		
		expect( mockPush ).toHaveBeenCalledWith( '/other', options )
		expect( mockReplace ).toHaveBeenCalledWith( '/other', options )

	} )

} )