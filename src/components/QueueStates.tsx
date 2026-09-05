import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const states = [
  {
    tone: 'ok',
    title: 'Queue Moving Normally',
    metric: '21 patients ahead',
    guidance: 'You can wait elsewhere for now.',
  },
  {
    tone: 'warn',
    title: 'Turn Approaching',
    metric: '5 patients ahead',
    guidance: 'Please start returning to Room 12.',
  },
  {
    tone: 'urgent',
    title: "You're Almost Next",
    metric: '2 patients ahead',
    guidance: 'Please remain near the consultation room.',
  },
  {
    tone: 'idle',
    title: 'Queue Temporarily Paused',
    metric: 'Doctor temporarily unavailable',
    guidance: "We'll notify you when consultations resume.",
  },
] as const

const toneClasses = {
  ok: { rule: 'bg-state-ok', text: 'text-state-ok' },
  warn: { rule: 'bg-state-warn', text: 'text-state-warn' },
  urgent: { rule: 'bg-state-urgent', text: 'text-state-urgent' },
  idle: { rule: 'bg-state-idle', text: 'text-state-idle' },
} as const

export function QueueStates() {
  return (
    <section className="mx-auto max-w-[1320px] px-6 py-24 lg:px-10 lg:py-32">
      <Reveal>
        <SectionHeading
          eyebrow="Queue states"
          title="Always know what's happening."
          lede="A token number on its own does not tell you what to do next. SmartQueue always pairs your position with a clear instruction."
        />
      </Reveal>

      <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {states.map((state, i) => {
          const tone = toneClasses[state.tone]
          return (
            <Reveal key={state.title} delay={i * 80}>
              <article>
                {/* colour appears only as a hairline: it is information, not decoration */}
                <span className={`block h-px w-10 ${tone.rule}`} />
                <h3 className="display mt-6 text-[19px] text-ivory">{state.title}</h3>
                <p className={`mt-2 text-[13px] font-medium tracking-[0.01em] ${tone.text}`}>
                  {state.metric}
                </p>
                <p className="mt-4 border-l border-line pl-4 text-[13.5px] font-light italic leading-[1.65] text-muted">
                  {state.guidance}
                </p>
              </article>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
