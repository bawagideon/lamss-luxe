export default function ShippingPage() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-white pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-black mb-12 tracking-tight">Shipping & Returns</h1>
        
        <div className="prose prose-lg mx-auto prose-headings:font-bold">
          <p className="text-lg text-muted-foreground mb-12">
            Lamssé Luxe proudly ships directly to our Queens across Canada and the United States. 
          </p>

          <h2 className="text-2xl mt-8 mb-4 border-b pb-2">Shipping Information</h2>
          <ul className="mb-8 space-y-3">
            <li><strong>Standard Shipping (Canada):</strong> 3-5 business days. Free on orders over $150.</li>
            <li><strong>Express Shipping (Canada):</strong> 1-2 business days. Flat rate $25.</li>
            <li><strong>Standard Shipping (US):</strong> 5-7 business days. Free on orders over $200.</li>
            <li><strong>Express Shipping (US):</strong> 2-3 business days. Flat rate $30.</li>
          </ul>

          <p className="mb-8 text-gray-600">
            Please allow 1-2 business days for processing before your order is dispatched. Once your order ships, you will receive a confirmation email with tracking information.
          </p>

          <h2 className="text-2xl mt-8 mb-4 border-b pb-2">Return Policy</h2>
          <p className="mb-4 text-gray-600">
            We want you to love your Lamssé Luxe pieces. If an item doesn&apos;t work out, we accept returns within 14 days of delivery for store credit or for a full refund back to the original payment method, provided the item is unworn, unwashed, and still has all tags attached.
          </p>
          <ul className="mb-8 space-y-3">
            <li>Items marked &quot;Final Sale&quot; cannot be returned or exchanged.</li>
            <li>Return shipping costs are the responsibility of the customer.</li>
            <li>To initiate a return, please visit our <a href="/contact" className="text-primary hover:underline">Contact page</a> and provide your order number.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
