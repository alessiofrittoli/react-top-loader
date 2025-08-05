'use client'

import { useCallback, useRef } from 'react'

import type { OnTickHandler } from '@/hooks'
import { TopLoaderProvider, type TopLoaderProviderProps } from '@/store'
import { TopLoaderProgressBar, type TopLoaderProgressBarProps } from './TopLoaderProgressBar'


export interface TopLoaderProps extends TopLoaderProviderProps, Omit<TopLoaderProgressBarProps, 'progressBarRef'>
{
	/**
	 * A React Component which renders a custom progress bar. It must accepts {@linkcode TopLoaderProgressBarProps} as props.
	 * 
	 */
	Component?: React.FC<TopLoaderProgressBarProps>
}


/**
 * Displays a top loader progress while navigating on a different page.
 * 
 * ⚠️ This Component should be mounted one single time
 * preferably in the root layout of your application and shouldn't be unmounted when navigating on a different page.
 * 
 * This Component internally use the {@linkcode TopLoaderProvider} Component in order to expose the `useTopLoaderApi` widely in your app.
 * 
 * @example
 * 
 * ```tsx
 * export const RootLayout: React.FC = () => (
 * 	<TopLoader>
 * 		...
 * 	</TopLoader>
 * )
 * ```
 */
export const TopLoader: React.FC<TopLoaderProps> = ( {
	Component = TopLoaderProgressBar, onStart, onTick, onStop, ...props
} ) => {
	
	const progressBarRef = useRef<HTMLDivElement>( null )

	return (
		<TopLoaderProvider
			onStart={ useCallback( () => {
				progressBarRef.current?.style.setProperty( 'opacity', '1' )
				onStart?.()
			}, [ onStart ] ) }
			onTick={ useCallback<OnTickHandler>( progress => {
				progressBarRef.current?.style.setProperty( 'width', `${ progress }%` )
				onTick?.( progress )
			}, [ onTick ] ) }
			onStop={ useCallback( () => {
				progressBarRef.current?.style.setProperty( 'opacity', '0' )
				onStop?.()
			}, [ onStop ] ) }
		>
			<Component
				progressBarRef={ progressBarRef }
				{ ...props }
			/>
		</TopLoaderProvider>
	)

}