import type {
	AppRouterInstance,
	NavigateOptions,
} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter as useNextRouter, usePathname } from 'next/navigation'
import { Url, type UrlInput } from '@alessiofrittoli/url-utils'
import { useTopLoader } from '@/hooks/useTopLoader'
import { useCallback, useMemo } from 'react'

/**
 * Extends the Next.js router with top loader integration.
 *
 * This hook wraps the Next.js router and triggers a top loader animation
 * whenever a navigation action (`push` or `replace`) changes the current pathname.
 *
 * It exposes the standard router methods (`back`, `forward`, `refresh`, `prefetch`)
 * along with the enhanced `push` and `replace` methods.
 *
 * @returns An object containing router navigation methods with top loader support.
 */
export const useRouter = (): AppRouterInstance => {
	const { start } = useTopLoader()
	const router = useNextRouter()
	const pathname = usePathname()

	const { bfcacheId, experimental_gesturePush, back, forward, refresh, prefetch } = router

	const push = useCallback(
		(href: UrlInput, options?: NavigateOptions) => {
			const url = Url.parse(href)

			if (url.pathname !== pathname) start()

			return router.push(Url.format(href), options)
		},
		[router, pathname, start],
	)

	const replace = useCallback(
		(href: UrlInput, options?: NavigateOptions) => {
			const url = Url.parse(href)

			if (url.pathname !== pathname) start()

			return router.replace(Url.format(href), options)
		},
		[router, pathname, start],
	)

	return useMemo(
		() => ({
			bfcacheId,
			back,
			forward,
			refresh,
			prefetch,
			push,
			replace,
			experimental_gesturePush,
		}),
		[bfcacheId, back, forward, refresh, prefetch, push, replace, experimental_gesturePush],
	)
}
