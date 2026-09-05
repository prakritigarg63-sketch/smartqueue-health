import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { ImpactStrip } from '../components/ImpactStrip'
import { WhySmartQueue } from '../components/WhySmartQueue'
import { HowItWorks } from '../components/HowItWorks'
import { QueueStates } from '../components/QueueStates'
import { PatientBenefits } from '../components/PatientBenefits'
import { HospitalBenefits } from '../components/HospitalBenefits'
import { GovernmentHealthcare } from '../components/GovernmentHealthcare'
import { AccessibilitySection } from '../components/AccessibilitySection'
import { Faqs } from '../components/Faqs'
import { FinalCTA } from '../components/FinalCTA'
import { Footer } from '../components/Footer'
import { Reveal } from '../components/Reveal'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ImpactStrip />
        <WhySmartQueue />
        <HowItWorks />
        <QueueStates />

        <section className="mx-auto max-w-[1320px] px-6 lg:px-10">
          <Reveal className="border-t border-line py-24 lg:py-32">
            <PatientBenefits />
          </Reveal>
          <Reveal className="border-t border-line py-24 lg:py-32">
            <HospitalBenefits />
          </Reveal>
        </section>

        <GovernmentHealthcare />
        <AccessibilitySection />
        <Faqs />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
