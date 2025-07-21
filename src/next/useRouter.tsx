import { useCallback, useMemo } from 'react'
import { useRouter as useNextRouter, usePathname } from 'next/navigation'
import type { AppRouterInstance, NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { Url, type UrlInput } from '@alessiofrittoli/url-utils'

import { useTopLoader } from '@/hooks'


export const useRouter = (): AppRouterInstance => {

	const { start }	= useTopLoader()
	const router	= useNextRouter()
	const pathname	= usePathname()

	const {
		back, forward, refresh, prefetch
	} = router


	const push = useCallback( ( href: UrlInput, options?: NavigateOptions ) => {
		const url = Url.parse( href )
		if ( url.pathname !== pathname ) start()

		return router.push( Url.format( href ), options )
	}, [ router, pathname, start ] )
	

	const replace = useCallback( ( href: UrlInput, options?: NavigateOptions ) => {
		const url = Url.parse( href )
		if ( url.pathname !== pathname ) start()

		return router.replace( Url.format( href ), options )
	}, [ router, pathname, start ] )	

	
	return useMemo( () => ( {
		back, forward, refresh, prefetch, push, replace
	} ), [ back, forward, refresh, prefetch, push, replace ] )
	
}