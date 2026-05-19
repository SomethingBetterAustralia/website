import * as React from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-sb-cream text-sb-text">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
