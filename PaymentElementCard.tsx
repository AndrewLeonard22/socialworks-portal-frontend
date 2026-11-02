"use client";

import { useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store";
import { showError, showSuccess } from "@/store/notifications/reducer";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export function isStripeConfigured() {
  // Mock build: always "configured" so the plan picker's Continue button
  // is enabled and the checkout design flow is reachable.
  return true;
}

/** Design-only card form used when no real Stripe key exists. Fields are
 *  decorative; Pay now fires onPaid like a successful confirmPayment. */
function MockPaymentForm({ onPaid }: { onPaid: () => void }) {
  const dispatch = useAppDispatch();
  const [isPaying, setIsPaying] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsPaying(true);
    setTimeout(() => {
      dispatch(showSuccess({ message: "Payment received" }));
      onPaid();
    }, 800);
  };

  const fieldCls =
    "h-[46px] w-full rounded-lg border border-[#d5d9e0] bg-white px-4 font-inter text-sm text-swa-ink outline-none focus:border-accent";

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[733px] flex-col gap-6">
      <div className="flex flex-col gap-3">
        <input className={fieldCls} placeholder="Card number" inputMode="numeric" defaultValue="4242 4242 4242 4242" />
        <div className="flex gap-3">
          <input className={fieldCls} placeholder="MM / YY" defaultValue="12 / 28" />
          <input className={fieldCls} placeholder="CVC" inputMode="numeric" defaultValue="424" />
        </div>
      </div>
      <Button
        type="submit"
        isLoading={isPaying}
        className="h-[46px] w-full rounded-lg bg-accent font-manjari text-lg font-bold hover:bg-accent/90"
      >
        Pay now
      </Button>
      <p className="-mt-1 text-center font-inter text-xs font-normal leading-5 text-[#626978] dark:text-text-tertiary">
        Mock checkout - no real payment is processed
      </p>
    </form>
  );
}

function PaymentForm({ onPaid }: { onPaid: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [isPaying, setIsPaying] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsPaying(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
      redirect: "if_required",
    });
    setIsPaying(false);
    if (error) {
      dispatch(showError({ message: error.message ?? "Payment failed" }));
      return;
    }
    dispatch(showSuccess({ message: "Payment received" }));
    onPaid();
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[733px] flex-col gap-6">
      {/* defaultValues prefill billing details from the session - the
          Stripe Customer's email only feeds receipts, never the form;
          without this Link's browser autofill wins and shows whatever
          email was saved on this device. */}
      <PaymentElement
        options={{
          defaultValues: {
            billingDetails: {
              ...(user?.email ? { email: user.email } : {}),
              ...(user?.name ? { name: user.name } : {}),
            },
          },
        }}
      />
      <Button
        type="submit"
        isLoading={isPaying}
        className="h-[46px] w-full rounded-lg bg-accent font-manjari text-lg font-bold hover:bg-accent/90"
      >
        Pay now
      </Button>
      <p className="-mt-1 text-center font-inter text-xs font-normal leading-5 text-[#626978] dark:text-text-tertiary">
        Secured by Stripe
      </p>
    </form>
  );
}

export function PaymentElementCard({
  clientSecret,
  onPaid,
}: {
  clientSecret: string;
  onPaid: () => void;
}) {
  if (!stripePromise) {
    return <MockPaymentForm onPaid={onPaid} />;
  }
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm onPaid={onPaid} />
    </Elements>
  );
}
