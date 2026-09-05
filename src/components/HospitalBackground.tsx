interface HospitalBackgroundProps {
  className?: string
  /**
   * `cover` — the full-bleed hero layer on desktop.
   * `card`  — the standalone image block used once the hero is stacked.
   */
  mode?: 'cover' | 'card'
}

const WEBP = '/images/smartqueue-hospital-hero.webp'
const PNG = '/images/smartqueue-hospital-hero.png'

/**
 * The OPD photograph: elderly patient checking his phone, family attendant
 * beside him, doctor alongside, OPD Department sign behind.
 *
 * Served as WebP with the original PNG as fallback — the source file is 1.8 MB,
 * which is far too heavy to sit behind a hero, and the WebP is 108 KB for the
 * same pixels.
 *
 * The photograph carries all the human context in the hero; nothing is drawn
 * on top of it.
 */
export function HospitalBackground({ className = '', mode = 'cover' }: HospitalBackgroundProps) {
  const isCard = mode === 'card'

  return (
    <div className={`${className} ${isCard ? '' : 'overflow-hidden'}`}>
      <picture>
        <source srcSet={WEBP} type="image/webp" />
        <img
          src={PNG}
          alt=""
          decoding="async"
          draggable={false}
          className={
            isCard
              ? 'photo-grade h-full w-full object-cover'
              : // Wider than the frame and pinned right: this walks the group
                // leftward out of the phone's footprint, so the patient's face
                // lands in the gap between the copy and the device while the
                // OPD sign stays in shot on the right.
                'photo-grade absolute right-0 top-0 h-full w-[112%] max-w-none object-cover object-[65%_38%]'
          }
          // The grade is a theme token: cinematic in dark, brighter but still
          // soft in light. Never blurred — the people stay sharp.
          style={{ objectPosition: isCard ? '62% 42%' : undefined }}
        />
      </picture>
    </div>
  )
}
