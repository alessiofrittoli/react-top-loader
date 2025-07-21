import { useCallback, useRef } from 'react'


const clamp = ( input: number, min: number, max: number ) => (
	Math.max( min, Math.min( max, input ) )
)


const getIncreaseAmount = ( progress: number ) => {

	if ( progress >= 0 && progress < 20 ) {
		return progress + 5
	}

	if ( progress >= 20 && progress < 50 ) {
		return progress + 4
	}

	if ( progress >= 50 && progress < 80 ) {
		return progress + 2
	}
	
	if ( progress >= 80 && progress < 99 ) {
		return progress + 0.5
	}

	return 100
	
}


/**
 * A custom callback executed when the `start` method is called.
 * 
 */
export type OnStartHandler = () => void


/**
 * A custom callback executed when the progress value is updated.
 * 
 * @param progress The progress value number from `0` to `100`.
 */
export type OnTickHandler = ( progress: number ) => void


/**
 * A custom callback executed when the `stop` method is called.
 * 
 */
export type OnStopHandler = () => void


export interface UseTopLoaderApiOptions
{
	/**
	 * A custom callback executed when the `start` method is called.
	 * 
	 */
	onStart?: OnStartHandler
	/**
	 * A custom callback executed when the progress value is updated.
	 * 
	 * @param progress The progress value number from `0` to `100`.
	 */
	onTick?: OnTickHandler
	/**
	 * A custom callback executed when the `stop` method is called.
	 * 
	 */
	onStop?: OnStopHandler
}


export interface UseTopLoaderApi
{
	/**
	 * A React.RefObject indicating whether the work is currently playing or not.
	 * 
	 */
	playing: React.RefObject<boolean>
	/**
	 * A React.RefObject indicating the current progress value.
	 * 
	 */
	progress: React.RefObject<number>
	/**
	 * Start the TopLoader work.
	 * 
	 */
	start: () => void;
	/**
	 * Tick TopLoader progress.
	 * 
	 * @param progress (Optional) A custom progress value.
	 * @returns `false` if progress has been stopped, `true` if progress has been correctly ticked.
	 */
    tick: ( progress?: number ) => boolean
	/**
	 * Set progress to `100` and stop the TopLoader work.
	 * 
	 */
    stop: () => void
}


export const useTopLoaderApi = ( options: UseTopLoaderApiOptions = {} ): UseTopLoaderApi => {

	const { onStart, onTick, onStop } = options

	const playingRef	= useRef( false )
	const progressRef	= useRef( 0 )
	const loopTimeoutRef= useRef<NodeJS.Timeout | number | null>( null )

	const setProgressValue = useCallback( ( value: number ) => {

		const clamped		= clamp( value, 0, 100 )
		progressRef.current	= clamped

		onTick?.( clamped )

	}, [ onTick ] )


	const tick = useCallback<UseTopLoaderApi[ 'tick' ]>( ( progress?: number ) => {

		if ( ! playingRef.current || progressRef.current >= 100 ) {
			return false
		}

		setProgressValue( progress ?? getIncreaseAmount( progressRef.current ) )

		return true

	}, [ setProgressValue ] )


	const start = useCallback<UseTopLoaderApi[ 'start' ]>( () => {

		playingRef.current = true
		onStart?.()

		const loop = () => {

			loopTimeoutRef.current = setTimeout( () => {

				if ( ! tick() ) return
				
				loop()

			}, 200 )

		}

		loop()

	}, [ tick, onStart ] )


	const stop = useCallback<UseTopLoaderApi[ 'stop' ]>( () => {

		if ( ! playingRef.current ) return

		playingRef.current = false

		if ( loopTimeoutRef.current ) {
			clearTimeout( loopTimeoutRef.current )
		}

		setProgressValue( 100 )

		if ( onStop ) {
			setTimeout( onStop, 400 )
		}

		setTimeout( () => {
			setProgressValue( 0 )
		}, 500 )

	}, [ setProgressValue, onStop ] )


	return {
		playing: playingRef, progress: progressRef, start, tick, stop,
	}
	
}