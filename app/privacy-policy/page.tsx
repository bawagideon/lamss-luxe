export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-background pt-40 pb-24 transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter uppercase italic drop-shadow-sm">Privacy Policy</h1>
          <p className="text-lg md:text-xl text-muted-foreground uppercase tracking-[0.4em] font-black max-w-2xl mx-auto border-y border-zinc-100 dark:border-zinc-800 py-6">
             Your data, protected with Luxe excellence.
          </p>
        </div>
        
        <div className="mx-auto max-w-3xl">
          <p className="breadcrumb mb-12 text-center opacity-60">Effective as of 2025.</p>

          <div className="space-y-12 text-[16px] font-bold leading-relaxed text-zinc-600 dark:text-zinc-400">
            <div className="p-8 md:p-10 border-l-4 border-primary bg-zinc-50 dark:bg-zinc-900 shadow-sm rounded-r-3xl">
               <p className="text-foreground dark:text-white font-black uppercase tracking-tight text-lg md:text-xl leading-tight">
                 At Lamssé Luxe, preserving the trust of our community is a top priority. This policy outlines how we collect, use, and protect your personal data with the highest standards.
               </p>
            </div>

            <section>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-6 text-foreground italic border-b border-border pb-4">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us when you make a purchase, join the Luxe Network inner circle, sign up for our newsletter, or contact customer support. This may include your name, email address, shipping address, and payment information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-6 text-foreground italic border-b border-border pb-4">2. How We Use Your Information</h2>
              <p>
                We use your information to process transactions, send order confirmations and updates, communicate regarding Lamssé Luxe community events in your city, and send promotional marketing content if you have opted in.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-6 text-foreground italic border-b border-border pb-4">3. Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to outside parties except to trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
              </p>
            </section>

            <div className="pt-16 border-t border-border text-center">
              <p className="text-[12px] font-black uppercase tracking-widest text-zinc-400 mb-6">
                For questions regarding this policy, please contact our support team.
              </p>
              <a href="/contact" className="inline-block px-10 py-4 bg-foreground text-background font-black uppercase tracking-[0.2em] text-[11px] rounded-full hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
