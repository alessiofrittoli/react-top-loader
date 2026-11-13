import type { UseTopLoaderApi } from '@/hooks/useTopLoaderApi'
import { createContext } from 'react'

export type TopLoaderCtx = UseTopLoaderApi

/**
 * TopLoader React Context API.
 *
 */
export const TopLoaderContext = createContext<TopLoaderCtx | undefined>(undefined)

TopLoaderContext.displayName = 'TopLoaderContext'
