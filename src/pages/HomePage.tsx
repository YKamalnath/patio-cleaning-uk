import { HeroSection } from '../components/home/HeroSection'
import { ServicesSection } from '../components/home/ServicesSection'
import { TransformationSection } from '../components/home/TransformationSection'
import { ProcessSection } from '../components/home/ProcessSection'
import { TestimonialsSection } from '../components/home/TestimonialsSection'
import { PricingSection } from '../components/home/PricingSection'
import { FaqSection } from '../components/home/FaqSection'
import { QuoteFormSection } from '../components/home/QuoteFormSection'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <TransformationSection />
      <ProcessSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <QuoteFormSection />
    </>
  )
}
