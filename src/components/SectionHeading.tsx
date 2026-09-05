import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow: string
  title: ReactNode
  lede?: string
  align?: 'left' | 'center'
}

/** Shared editorial section opener: quiet label, serif title, optional lede. */
export function SectionHeading({ eyebrow, title, lede, align = 'left' }: SectionHeadingProps) {
  const centered = align === 'center'
  return (
    <div className={centered ? 'mx-auto max-w-[42rem] text-center' : 'max-w-[42rem]'}>
      <p className="label">{eyebrow}</p>
      <h2 className="display mt-5 text-[clamp(1.9rem,3.6vw,2.9rem)] text-ivory">{title}</h2>
      {lede && (
        <p
          className={`mt-5 text-[15.5px] font-light leading-[1.75] text-muted ${
            centered ? 'mx-auto max-w-[34rem]' : 'max-w-[34rem]'
          }`}
        >
          {lede}
        </p>
      )}
    </div>
  )
}
