import { Logo } from './Logo'

const links = [
  { label: 'Privacy', href: '#' },
  { label: 'Accessibility', href: '#access' },
  { label: 'Support', href: '#faqs' },
]

export function Footer() {
  return (
    <footer id="contact" className="border-t border-line">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-8 px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <Logo />
          <p className="mt-4 max-w-[30rem] text-[12.5px] font-light leading-relaxed text-muted-2">
            Prototype concept for improving government hospital OPD waiting experiences.
          </p>
        </div>

        <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-[13px] font-light text-muted transition-colors duration-300 hover:text-ivory"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
