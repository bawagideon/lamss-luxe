export default function ShippingPage() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-background pt-40 pb-24 transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic drop-shadow-sm">Shipping & Returns</h1>
          <p className="text-lg md:text-xl text-muted-foreground uppercase tracking-[0.3em] font-black max-w-2xl mx-auto">
             Lamssé Luxe proudly ships directly to our Queens across Canada and the United States. 
          </p>
        </div>
        
        <div className="prose prose-lg dark:prose-invert mx-auto max-w-3xl">
          <div className="space-y-16">
             {/* Shipping Info Section */}
             <section>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-8 border-b-2 border-primary pb-4 inline-block">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-border">
                      <h3 className="text-[12px] font-black uppercase tracking-widest mb-4 text-primary">Canada</h3>
                      <ul className="space-y-4 text-[14px] font-bold text-zinc-600 dark:text-zinc-400">
                        <li>Standard (3-5 Days): <span className="text-foreground">Free Over $150</span></li>
                        <li>Express (1-2 Days): <span className="text-foreground">Flat $25</span></li>
                      </ul>
                   </div>
                   <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-border">
                      <h3 className="text-[12px] font-black uppercase tracking-widest mb-4 text-primary">United States</h3>
                      <ul className="space-y-4 text-[14px] font-bold text-zinc-600 dark:text-zinc-400">
                        <li>Standard (5-7 Days): <span className="text-foreground">Free Over $200</span></li>
                        <li>Express (2-3 Days): <span className="text-foreground">Flat $30</span></li>
                      </ul>
                   </div>
                </div>
                <p className="mt-8 text-[15px] font-bold text-zinc-500 dark:text-zinc-400 leading-relaxed italic">
                  Please allow 1-2 business days for processing before your order is dispatched. Once your order ships, you will receive a confirmation email with tracking information.
                </p>
             </section>

             {/* Return Policy Section */}
             <section>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-8 border-b-2 border-primary pb-4 inline-block">Return Policy</h2>
                <p className="text-[16px] font-bold text-foreground leading-relaxed mb-8">
                  We want you to love your Lamssé Luxe pieces. If an item doesn&apos;t work out, we accept returns within 14 days of delivery for store credit or for a full refund back to the original payment method, provided the item is unworn, unwashed, and still has all tags attached.
                </p>
                <div className="space-y-4">
                   {[
                     "Items marked 'Final Sale' cannot be returned or exchanged.",
                     "Return shipping costs are the responsibility of the customer.",
                     "To initiate a return, please visit our Contact page and provide your order number."
                   ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-border">
                         <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                         <p className="text-[14px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">{item}</p>
                      </div>
                   ))}
                </div>
             </section>
          </div>
        </div>
      </div>
    </main>
  );
}
