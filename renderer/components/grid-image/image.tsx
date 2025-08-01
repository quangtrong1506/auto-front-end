// src/components/custom-image.tsx
'use client'

import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { LoadingSpin } from '../loading-spin'
import Image from 'next/image'

interface CustomImageProps {
   className?: string
   src?: string
   onClick?: () => void
}

export function CustomImage({ src, className = '', onClick }: Readonly<CustomImageProps>) {
   const [loading, setLoading] = useState<boolean>(true)
   const [error, setError] = useState<boolean>(false)

   const { ref, inView } = useInView({
      triggerOnce: true,
      rootMargin: '300px',
   })

   return (
      <div ref={ref} className={`relative h-fit min-h-20 w-full ${className}`} onClick={onClick}>
         {inView && (
            <>
               {!error && (
                  <Image
                     className="object-contain"
                     src={src || ''}
                     alt={src || ''}
                     onLoad={() => setLoading(false)}
                     onError={() => setError(true)}
                     sizes="100vw"
                     quality={100}
                     width={500}
                     height={500}
                     priority
                  />
               )}
               {error && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                     src={src || ''}
                     alt={src || ''}
                     className="w-full object-contain"
                     onLoad={() => setLoading(false)}
                  />
               )}
               {loading && <LoadingSpin />}
            </>
         )}
      </div>
   )
}
