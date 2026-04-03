export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-white pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="mb-8">Privacy Policy</h1>
        
        <div className="mx-auto max-w-3xl">
          <p className="breadcrumb mb-12">Effective as of 2025.</p>

          <div className="space-y-8 text-[15px] font-medium leading-relaxed text-zinc-700 dark:text-zinc-400">
            <p className="border-l-4 border-black dark:border-white pl-6 py-2 text-black dark:text-white font-black uppercase tracking-tight text-base md:text-lg">
              At Lamssé Luxe, preserving the trust of our community is a top priority. This policy outlines how we collect, use, and protect your personal data.
            </p>

            <div>
              <h2 className="text-xl md:text-2xl mt-12 mb-4 text-black dark:text-white">1. Information We Collect</h2>
              <p className="mb-6">
                We collect information you provide directly to us when you make a purchase, join the Luxe Network inner circle, sign up for our newsletter, or contact customer support. This may include your name, email address, shipping address, and payment information.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl mt-8 mb-4 text-black dark:text-white">2. How We Use Your Information</h2>
              <p className="mb-6">
                We use your information to process transactions, send order confirmations and updates, communicate regarding Lamssé Luxe community events in your city, and send promotional marketing content if you have opted in.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl mt-8 mb-4 text-black dark:text-white">3. Information Sharing</h2>
              <p className="mb-6">
                We do not sell, trade, or otherwise transfer your personal information to outside parties except to trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
              </p>
            </div>

            <p className="mt-12 text-sm text-center">
              For questions regarding this policy, please <a href="/contact" className="text-primary hover:underline">Contact Us</a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
