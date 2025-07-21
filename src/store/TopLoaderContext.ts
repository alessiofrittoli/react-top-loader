import { createContext } from 'react'
import type { UseTopLoaderApi } from '@/hooks'


export type TopLoaderCtx = UseTopLoaderApi


export const TopLoaderContext	= createContext<TopLoaderCtx | undefined>( undefined )
TopLoaderContext.displayName	= 'TopLoaderContext'