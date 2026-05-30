import { HeroSection } from '../components/home/HeroSection'
import { ServicesSection } from '../components/home/ServicesSection'
import { TransformationSection } from '../components/home/TransformationSection'
import { TestimonialsSection } from '../components/home/TestimonialsSection'
import { PricingSection } from '../components/home/PricingSection'
import { QuoteFormSection } from '../components/home/QuoteFormSection'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <TransformationSection />
      <TestimonialsSection />
      <PricingSection />
      <QuoteFormSection />
    </>
  )
}
