export interface TopLoaderProgressBarProps extends React.ComponentProps<'div'>
{
	progressBarRef: React.RefObject<HTMLDivElement | null>
}


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