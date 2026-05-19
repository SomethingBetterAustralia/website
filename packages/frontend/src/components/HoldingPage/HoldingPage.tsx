import logoUrl from '../../assets/logo.png';
import { Hero } from './Hero';
import { Vision } from './Vision';
import { SignupCTA } from './SignupCTA';
import { SignupForm } from './SignupForm';
import { KeyPrinciples } from './KeyPrinciples';
import { Footer } from './Footer';

export function HoldingPage() {
  return (
    <main className="sb-page">
      <header className="sb-topbar">
        <img className="sb-topbar__logo" src={logoUrl} alt="Something Better Australia" />
      </header>
      <div className="sb-columns">
        <section className="sb-col sb-col--left">
          <Hero />
          <Vision />
          <KeyPrinciples />
        </section>
        <section className="sb-col sb-col--right">
          <SignupCTA />
          <SignupForm />
        </section>
      </div>
      <Footer />
    </main>
  );
}
