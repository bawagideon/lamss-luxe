export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-white pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-black mb-12 tracking-tight">Privacy Policy</h1>
        
        <div className="prose prose-lg mx-auto prose-headings:font-bold text-gray-600">
          <p className="mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <p className="mb-8 border-l-4 border-primary pl-4 text-black font-medium">
            At Lamssé Luxe, preserving the trust of our community is a top priority. This policy outlines how we collect, use, and protect your personal data.
          </p>

          <h2 className="text-2xl mt-8 mb-4 border-none text-black">1. Information We Collect</h2>
          <p className="mb-6">
            We collect information you provide directly to us when you make a purchase, join the Soft Life Queens Network, sign up for our newsletter, or contact customer support. This may include your name, email address, shipping address, and payment information.
          </p>

          <h2 className="text-2xl mt-8 mb-4 text-black">2. How We Use Your Information</h2>
          <p className="mb-6">
            We use your information to process transactions, send order confirmations and updates, communicate regarding Lamssé Luxe community events in your city, and send promotional marketing content if you have opted in.
          </p>

          <h2 className="text-2xl mt-8 mb-4 text-black">3. Information Sharing</h2>
          <p className="mb-6">
            We do not sell, trade, or otherwise transfer your personal information to outside parties except to trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
          </p>

          <p className="mt-12 text-sm text-center">
            For questions regarding this policy, please <a href="/contact" className="text-primary hover:underline">Contact Us</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
