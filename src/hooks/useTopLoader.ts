import { useContext } from 'react'
import { TopLoaderContext } from '../store/TopLoaderContext'

/**
 * Access to the TopLoader React Context API.
 * 
 * @returns The TopLoader React Context API.
 */
export const useTopLoader = () => {

	const context = useContext( TopLoaderContext )

	if ( ! context ) {
		throw new Error(
			'TopLoaderContext is not defined. `useTopLoader` is only available inside the TopLoader Component. Please wrap the application within the TopLoader Component.'
		)
	}

	return context

}