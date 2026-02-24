import { Hero } from '@/components/sections/Hero';
import { SocialProof } from '@/components/sections/SocialProof';
import { Stats } from '@/components/sections/Stats';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { MiniDemo } from '@/components/sections/MiniDemo';
import { Benefits } from '@/components/sections/Benefits';
import { Features } from '@/components/sections/Features';
import { DemoSection } from '@/components/sections/DemoSection';
import { Testimonials } from '@/components/sections/Testimonials';

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <Stats />
      <HowItWorks />
      <MiniDemo />
      <Benefits />
      <Features />
      <DemoSection />
      <Testimonials />
    </>
  );
}
