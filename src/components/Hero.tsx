import { HeroContent } from './HeroContent'
import { SmartQueuePhone } from './SmartQueuePhone'
import { DoctorMascotImage } from './DoctorMascotImage'
import { HospitalBackground } from './HospitalBackground'

/**
 * The hero reads left to right: proposition, assistant, product, people.
 *
 * Layers, back to front: photograph (0), readability overlay (1), the halo
 * that separates the phone from the scene (2), copy (3), phone (5), mascot (6).
 * The navbar sits above all of it.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative -mt-[88px] overflow-hidden pt-[88px] lg:min-h-[860px]"
    >
      {/* 0 — the photograph */}
      <HospitalBackground className="absolute inset-0 z-0 hidden lg:block" />

      {/* 1 — hold the left side dark enough for the copy to stay readable.
             This grades the photograph rather than fading it out: the right
             side stays at full strength. */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] hidden lg:block hero-wash"
      />

      {/* 2 — a soft pool behind the device so it reads as a separate object
             against the people. The photograph itself is never blurred. */}
      <div
        aria-hidden
        className="absolute inset-0 z-[2] hidden lg:block hero-halo"
      />

      {/* bottom fade — no visible edge where the photograph meets the strip */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-[2] hidden h-80 lg:block hero-foot"
      />

      {/* 3 — copy, with the phone and mascot riding above the scene */}
      <div className="relative z-[3] mx-auto flex max-w-[1400px] flex-col justify-center px-6 lg:min-h-[772px] lg:px-8">
        {/* The third column is the window onto the people. It widens with the
            viewport; below xl there is no room for it and the copy needs the
            width more, or the CTA row wraps. */}
        <div className="grid items-center gap-12 pb-14 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-8 lg:pb-16 lg:pt-12 xl:grid-cols-[minmax(0,1fr)_460px_180px] 2xl:grid-cols-[minmax(0,1fr)_480px_300px]">
          <HeroContent />

          <div className="flex justify-center lg:justify-end">
            {/* 5 — the phone stays the product hero */}
            <div className="relative z-[5]">
              <SmartQueuePhone live />

              {/* 6 — mascot, anchored to the phone so it can never collide
                     with it or with the copy as the width changes */}
              <DoctorMascotImage className="absolute bottom-[64px] right-full z-[6] mr-5 hidden w-[130px] lg:block 2xl:mr-7 2xl:w-[158px]" />
            </div>
          </div>

          {/* the people occupy this column */}
          <div aria-hidden className="hidden xl:block" />
        </div>

        {/* Stacked below the desktop composition: copy, CTA, phone, then the
            photograph as its own block. */}
        <div className="flex flex-col items-center pb-12 lg:hidden">
          <div className="relative w-full max-w-[520px] overflow-hidden rounded-2xl">
            <HospitalBackground mode="card" className="aspect-[4/3] w-full" />
            {/* soften every edge so the block belongs to the dark page */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_52%,var(--color-ink)_100%)]"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink to-transparent"
            />
          </div>

          {/* the mascot straddles the phone / photograph transition */}
          <DoctorMascotImage className="relative z-[6] -mt-10 w-[96px] md:w-[112px]" />
        </div>
      </div>
    </section>
  )
}
