'use client'

import type { PropsWithChildren } from 'react'
import { useState } from 'react'

import createCache, { type Options as CacheOptions } from '@emotion/cache'
import { CacheProvider as DefaultCacheProvider } from '@emotion/react'
import { useServerInsertedHTML } from 'next/navigation'

type ExtraCacheOptions = CacheOptions & {
  enableCssLayer?: boolean
}

type AppRouterCacheProviderProps = PropsWithChildren<{
  options?: ExtraCacheOptions
  CacheProvider?: typeof DefaultCacheProvider
}>

type InsertedStyle = {
  name: string
  isGlobal: boolean
}

const AppRouterCacheProvider = ({
  options,
  CacheProvider = DefaultCacheProvider,
  children
}: AppRouterCacheProviderProps) => {
  const [registry] = useState(() => {
    const cache = createCache({
      ...options,
      key: options?.key ?? 'mui'
    })

    cache.compat = true

    const prevInsert = cache.insert
    let inserted: InsertedStyle[] = []

    cache.insert = (...args) => {
      if (options?.enableCssLayer && args[1]) {
        args[1].styles = `@layer mui {${args[1].styles}}`
      }

      const [selector, serialized] = args

      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({
          name: serialized.name,
          isGlobal: !selector
        })
      }

      return prevInsert(...args)
    }

    const flush = () => {
      const prevInserted = inserted
      inserted = []

      return prevInserted
    }

    return {
      cache,
      flush
    }
  })

  useServerInsertedHTML(() => {
    const inserted = registry.flush()

    if (inserted.length === 0) {
      return null
    }

    let styles = ''
    let dataEmotionAttribute = registry.cache.key
    const globals: Array<{ name: string; style: string }> = []

    inserted.forEach(({ name, isGlobal }) => {
      const style = registry.cache.inserted[name]

      if (typeof style === 'string') {
        if (isGlobal) {
          globals.push({ name, style })
        } else {
          styles += style
          dataEmotionAttribute += ` ${name}`
        }
      }
    })

    return (
      <>
        {globals.map(({ name, style }) => (
          <style
            key={name}
            nonce={options?.nonce}
            data-emotion={`${registry.cache.key}-global ${name}`}
            dangerouslySetInnerHTML={{ __html: style }}
          />
        ))}
        {styles && (
          <style
            nonce={options?.nonce}
            data-emotion={dataEmotionAttribute}
            dangerouslySetInnerHTML={{ __html: styles }}
          />
        )}
      </>
    )
  })

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>
}

export default AppRouterCacheProvider


