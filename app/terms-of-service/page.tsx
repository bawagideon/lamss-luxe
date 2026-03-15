export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-white pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-black mb-12 tracking-tight">Terms of Service</h1>
        
        <div className="prose prose-lg mx-auto text-gray-600">
          <p className="mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-2xl mt-8 mb-4 text-black font-bold">1. Agreement to Terms</h2>
          <p className="mb-6">
            By accessing or using the Lamssé Luxe website (the &quot;Site&quot;) and engaging with our products or services, you agree to be bound by these Terms of Service. If you do not agree to all of the generated terms and conditions, then you may not access the website.
          </p>

          <h2 className="text-2xl mt-8 mb-4 text-black font-bold">2. Intellectual Property</h2>
          <p className="mb-6">
            The Site and its original content, features, and functionality (including but not limited to brand identity, logo, imagery, apparel designs) are owned by Lamssé Luxe and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>

          <h2 className="text-2xl mt-8 mb-4 text-black font-bold">3. Products and Pricing</h2>
          <p className="mb-6">
            All descriptions of products or product pricing are subject to change at any time without notice, at the sole discretion of Lamssé Luxe. We reserve the right to discontinue any product or service at any time. We make every effort to display as accurately as possible the colors and images of our products.
          </p>

          <h2 className="text-2xl mt-8 mb-4 text-black font-bold">4. Governing Law</h2>
          <p className="mb-6">
            These Terms shall be governed and construed in accordance with the laws of Canada, without regard to its conflict of law provisions.
          </p>
        </div>
      </div>
    </main>
  );
}
