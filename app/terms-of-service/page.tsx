export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-background pt-40 pb-24 transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter uppercase italic drop-shadow-sm">Terms of Service</h1>
          <p className="text-lg md:text-xl text-muted-foreground uppercase tracking-[0.4em] font-black max-w-2xl mx-auto border-y border-zinc-100 dark:border-zinc-800 py-6">
             The legal framework of the Luxe experience.
          </p>
        </div>
        
        <div className="mx-auto max-w-3xl">
          <p className="breadcrumb mb-12 text-center opacity-60">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-12 text-[16px] font-bold leading-relaxed text-zinc-600 dark:text-zinc-400">
            <div className="p-8 md:p-10 border-l-4 border-primary bg-zinc-50 dark:bg-zinc-900 shadow-sm rounded-r-3xl">
               <p className="text-foreground dark:text-white font-black uppercase tracking-tight text-lg md:text-xl leading-tight">
                 By accessing or using the Lamssé Luxe website and engaging with our products or services, you agree to be bound by these Terms.
               </p>
            </div>

            <section>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-6 text-foreground italic border-b border-border pb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using the Lamssé Luxe website (the &quot;Site&quot;) and engaging with our products or services, you agree to be bound by these Terms of Service. If you do not agree to all of the terms and conditions, then you may not access the website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-6 text-foreground italic border-b border-border pb-4">2. Intellectual Property</h2>
              <p>
                The Site and its original content, features, and functionality (including but not limited to brand identity, logo, imagery, apparel designs) are owned by Lamssé Luxe and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-6 text-foreground italic border-b border-border pb-4">3. Products and Pricing</h2>
              <p>
                All descriptions of products or product pricing are subject to change at any time without notice, at the sole discretion of Lamssé Luxe. We reserve the right to discontinue any product or service at any time. We make every effort to display as accurately as possible the colors and images of our products.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-6 text-foreground italic border-b border-border pb-4">4. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of Canada, without regard to its conflict of law provisions.
              </p>
            </section>

            <div className="pt-16 border-t border-border text-center">
              <p className="text-[12px] font-black uppercase tracking-widest text-zinc-400 mb-6">
                Continued use of our site constitutes acceptance of our terms.
              </p>
              <a href="/shop" className="inline-block px-10 py-4 bg-foreground text-background font-black uppercase tracking-[0.2em] text-[11px] rounded-full hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95">
                Back to Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
