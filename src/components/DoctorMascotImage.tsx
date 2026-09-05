import { useState } from 'react'

interface DoctorMascotImageProps {
  className?: string
  src?: string
}

const DEFAULT_SRC = '/images/smartqueue-doctor-mascot.png'

/**
 * The SmartQueue assistant, supplied as a transparent PNG.
 *
 * If the asset is absent the component renders nothing at all — there is no
 * drawn fallback, because an approximated mascot reads as a broken asset
 * rather than as artwork.
 */
export function DoctorMascotImage({ className = '', src = DEFAULT_SRC }: DoctorMascotImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) return null

  return (
    <div className={`pointer-events-none ${className}`}>
      <img
        src={src}
        alt="SmartQueue assistant"
        onError={() => setFailed(true)}
        decoding="async"
        draggable={false}
        className="animate-idle-float h-auto w-full object-contain drop-mascot"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  )
}
