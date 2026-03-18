import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-white pt-24">
      <div className="max-w-md w-full text-center space-y-8 p-10 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-center">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        
        {searchParams.session_id ? (
          <>
            <h1 className="text-4xl font-black text-black">Payment Successful</h1>
            <p className="text-gray-600 text-lg">
              Thank you for your order! Your payment has been securely processed by Stripe.
              <br/><br/>
              We will send you a confirmation email with your order details and shipping updates.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-black text-black">Success!</h1>
            <p className="text-gray-600">Your action was completed successfully.</p>
          </>
        )}

        <div className="pt-6">
          <Button size="lg" className="w-full bg-black text-white hover:bg-black/80 font-bold uppercase tracking-wide rounded-sm py-6" asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
