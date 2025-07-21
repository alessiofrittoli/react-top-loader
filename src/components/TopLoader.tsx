'use client'

import { useCallback, useRef } from 'react'

import type { OnTickHandler } from '@/hooks'
import { TopLoaderProvider, type TopLoaderProviderProps } from '@/store'
import { TopLoaderProgressBar, type TopLoaderProgressBarProps } from './TopLoaderProgressBar'


export interface TopLoaderProps extends TopLoaderProviderProps, Omit<TopLoaderProgressBarProps, 'progressBarRef'>
{
	Component?: React.FC<TopLoaderProgressBarProps>
}


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