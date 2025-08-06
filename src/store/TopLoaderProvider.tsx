'use client'

import { useEffect } from 'react'
import { useDeferCallback } from '@alessiofrittoli/react-hooks'
import { Url } from '@alessiofrittoli/url-utils'
import { isExternalUrl } from '@alessiofrittoli/url-utils/check'
import { getCurrentLocationURL } from '@alessiofrittoli/url-utils/lib'

import { TopLoaderContext } from './TopLoaderContext'
import { useTopLoaderApi, type UseTopLoaderApiOptions } from '@/hooks'


/**
 * Find the closest anchor to trigger.
 * 
 * @param element The `HTMLElement` to start seeking from.
 * @returns The found `HTMLAnchorElement` if any, `null` otherwise.
 */
const findClosestAnchor = ( element: HTMLElement | null ): HTMLAnchorElement | null => {
	let _element = element

	while ( _element && _element.tagName.toLowerCase() !== 'a' ) {
		_element = _element.parentElement
	}

	return _element as HTMLAnchorElement | null
}


export type TopLoaderProviderProps = React.PropsWithChildren<UseTopLoaderApiOptions>


/**
 * TopLoader React Context Provider.
 * 
 * Uses and exposes {@linkcode useTopLoaderApi} state and functions.
 */
export const TopLoaderProvider: React.FC<TopLoaderProviderProps> = ( { children, ...props } ) => {
	
	const topLoader			= useTopLoaderApi( props )
	const { start, stop }	= topLoader

	const clickHandler = useDeferCallback( ( event: DocumentEventMap[ 'click' ] ) => {

		const target			= event.target as HTMLElement
		const anchor			= findClosestAnchor( target )
		const navigationHref	= anchor?.href
		const anchorTarget		= anchor?.target as React.HTMLAttributeAnchorTarget | undefined
		
		if ( ! navigationHref ) return
		
		const isSecondaryKeyPressed = (
			event.ctrlKey ||
			event.metaKey ||
			event.shiftKey ||
			event.altKey
		)

		if ( isSecondaryKeyPressed ) return

		const isExternal = (
			isExternalUrl( navigationHref ) ||
			anchorTarget === '_blank'
		)			

		if ( isExternal ) return
		
		const currentUrl	= getCurrentLocationURL()
		const navigationUrl	= Url.parse( navigationHref )
		const isSamePathname= navigationUrl.pathname === currentUrl?.pathname		

		if ( isSamePathname ) return

		start()

	}, [ start ] )


	useEffect( () => {

		const { pushState, replaceState } = window.history

		window.history.pushState = ( ...args: Parameters<typeof pushState> ) => {
			start()
			stop()
			pushState.apply( window.history, args )
		}

		window.history.replaceState = ( ...args: Parameters<typeof replaceState> ) => {
			start()
			stop()
			replaceState.apply( window.history, args )
		}

	}, [ start, stop ] )


	useEffect( () => {

		window.addEventListener( 'popstate', stop )
		window.addEventListener( 'pagehide', stop )
		document.addEventListener( 'click', clickHandler )

		return () => {
			window.removeEventListener( 'popstate', stop )
			window.removeEventListener( 'pagehide', stop )
			document.removeEventListener( 'click', clickHandler )
		}

	}, [ clickHandler, stop ] )


	return (
		<TopLoaderContext.Provider value={ topLoader }>
			{ children }
		</TopLoaderContext.Provider>
	)
}