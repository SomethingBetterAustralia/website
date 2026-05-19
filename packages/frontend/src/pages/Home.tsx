import { Hero } from '@/components/home/Hero';
import { KeyPrinciples } from '@/components/home/KeyPrinciples';
import { SignupCTA } from '@/components/home/SignupCTA';
import { SignupForm } from '@/components/home/SignupForm';
import { Vision } from '@/components/home/Vision';

export function Home() {
  return (
    <>
      <Hero />
      <Vision />
      <KeyPrinciples />
      <section className="px-6 py-20 min-[880px]:px-12">
        <div className="mx-auto grid max-w-5xl gap-10 min-[880px]:grid-cols-[3fr_2fr] min-[880px]:items-start min-[880px]:gap-16">
          <SignupCTA />
          <SignupForm />
        </div>
      </section>
    </>
  );
}
