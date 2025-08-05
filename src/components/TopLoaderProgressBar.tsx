export interface TopLoaderProgressBarProps extends React.ComponentProps<'div'>
{
	/**
	 * The React.RefObject attached to the HTMLDivElement which is then used to update styles based on the current progress value.
	 * 
	 */
	progressBarRef: React.RefObject<HTMLDivElement | null>
}


/**
 * Simple TopLoader progress bar.
 * 
 * It requires a React.RefObject through the `progressBarRef` prop which
 * will be used to update the progress bar styles based on the current progress value.
 */
export const TopLoaderProgressBar: React.FC<TopLoaderProgressBarProps> = ( {
	progressBarRef, style, children, ...props
} ) => (
	<>
		{ children }
		<div
			ref={ progressBarRef }
			style={ { ...style, width: '0%' } }
			aria-hidden
			{ ...props }
		/>
	</>
)