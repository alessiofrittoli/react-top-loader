import { useCallback, useRef } from 'react'

/**
 * Clamp the given `input` with the given `min` and `max` value.
 * 
 * @param	input	The `input` value to clamp.
 * @param	min		(Optional) The minimum value. Default `0`.
 * @param	max		(Optional) The maximum value. Default `100`.
 * @returns	The clamped value.
 */
const clamp = ( input: number, min: number = 0, max: number = 100 ) => (
	Math.max( min, Math.min( max, input ) )
)


/**
 * Update progress value based on the given `progress`.
 * 
 * @param progress The current progress which will be increased.
 * @returns The updated progress.
 */
const updateProgress = ( progress: number ) => {

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

/**
 * Defines accepted properties in `useTopLoaderApi` options.
 * 
 */
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
	start: () => void
	/**
	 * Tick TopLoader progress.
	 * 
	 * @param amount (Optional) A custom progress value.
	 * @returns `false` if progress has been stopped, `true` if progress has been correctly ticked.
	 */
    tick: ( amount?: number ) => boolean
	/**
	 * Set progress to `100` and stop the TopLoader work.
	 * 
	 */
    stop: () => void
}


/**
 * TopLoader base API React hook.
 * 
 * It provides status and methods needed to easly handle continuous progress update.
 * 
 * @param options (Optional) An object defining custom options. See {@linkcode UseTopLoaderApiOptions} for more info.
 * @returns An object defining progress status and methods. See {@linkcode UseTopLoaderApi} for more info.
 */
export const useTopLoaderApi = ( options: UseTopLoaderApiOptions = {} ): UseTopLoaderApi => {

	const { onStart, onTick, onStop } = options

	const playing		= useRef( false )
	const progress		= useRef( 0 )
	const loopTimeout	= useRef<NodeJS.Timeout | number | null>( null )

	const setProgressValue = useCallback( ( value: number ) => {

		const clamped		= clamp( value )
		progress.current	= clamped

		onTick?.( clamped )

	}, [ onTick ] )


	const tick = useCallback<UseTopLoaderApi[ 'tick' ]>( ( amount?: number ) => {

		if ( ! playing.current || progress.current >= 100 ) {
			return false
		}

		setProgressValue( amount ?? updateProgress( progress.current ) )

		return true

	}, [ setProgressValue ] )


	const start = useCallback<UseTopLoaderApi[ 'start' ]>( () => {

		playing.current = true
		onStart?.()

		const loop = () => {

			loopTimeout.current = setTimeout( () => {

				if ( ! tick() ) return
				
				loop()

			}, 200 )

		}

		loop()

	}, [ tick, onStart ] )


	const stop = useCallback<UseTopLoaderApi[ 'stop' ]>( () => {

		if ( ! playing.current ) return

		playing.current = false

		if ( loopTimeout.current ) {
			clearTimeout( loopTimeout.current )
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
		playing, progress, start, tick, stop,
	}
	
}