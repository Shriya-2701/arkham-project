import React, { useState } from "react";
import {
  Coins,
  Zap,
  Crown,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";

// Type definitions
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

interface VerificationResult {
  verified: boolean;
  payment_id?: string;
  error?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 2,
    tokens: 100,
    features: [
      "Basic AI responses",
      "Standard chat features",
      "Public servers access",
      "10 Deepface tokens",
      "20 Text-to-Video tokens",
      "15 Text-to-Podcast tokens",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    price: 5,
    tokens: 300,
    features: [
      "Advanced AI capabilities",
      "Priority support",
      "Private servers access",
      "Custom themes",
      "30 Deepface tokens",
      "50 Text-to-Video tokens",
      "45 Text-to-Podcast tokens",
      "20 Text-to-Mindmap tokens",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 10,
    tokens: 1000,
    features: [
      "Premium AI features",
      "24/7 priority support",
      "Unlimited server access",
      "Custom branding",
      "API access",
      "Unlimited Deepface tokens",
      "Unlimited Text-to-Video tokens",
      "Unlimited Text-to-Podcast tokens",
      "Unlimited Text-to-Mindmap tokens",
      "Unlimited Text-to-Image tokens",
      "Unlimited Text-to-Music tokens",
    ],
  },
];

// Mock token store hook for demo
const useTokenStore = () => {
  const [tokens, setTokens] = useState(50);

  const addTokens = (amount: number) => {
    setTokens((prev) => prev + amount);
  };

  return { tokens, addTokens };
};

export default function SubscriptionPlans() {
  const { tokens, addTokens } = useTokenStore();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async (
    amount: number,
    planName: string
  ): Promise<RazorpayOrder> => {
    try {
      const response = await fetch(
        "https://arkhamrazorpay.onrender.com/api/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amount,
            currency: "INR",
            receipt: `receipt_${planName}_${Date.now()}`,
            notes: {
              plan_name: planName,
              plan_id: selectedPlan,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Create order error:", errorData);
        throw new Error(
          `Failed to create order: ${response.status} ${errorData}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const verifyPayment = async (
    paymentData: RazorpayResponse
  ): Promise<VerificationResult> => {
    try {
      const response = await fetch(
        "https://arkhamrazorpay.onrender.com/api/verify-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_order_id: paymentData.razorpay_order_id,
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_signature: paymentData.razorpay_signature,
          }),
        }
      );

      return await response.json();
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  };

  const handleSubscribe = async (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    setIsLoading(true);
    setSelectedPlan(planId);
    setPaymentStatus("");

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay script");
      }

      // Create order
      const order = await createOrder(plan.price, plan.name);
      console.log("Order created:", order);
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

      // Razorpay options
      const options = {
        key: razorpayKey, // Your Razorpay key_id
        amount: order.amount,
        currency: order.currency,
        name: "AI Token Subscription",
        description: `${plan.name} Plan - ${plan.tokens} tokens`,
        order_id: order.id,
        prefill: {
          name: "Your Name",
          email: "your.email@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#000000",
        },
        handler: async (response: RazorpayResponse) => {
          try {
            setPaymentStatus("verifying");

            // Verify payment
            const verificationResult = await verifyPayment(response);

            if (verificationResult.verified) {
              // Add tokens to user account
              addTokens(plan.tokens);
              setPaymentStatus("success");

              // Reset after 3 seconds
              setTimeout(() => {
                setPaymentStatus("");
                setSelectedPlan("");
              }, 3000);
            } else {
              setPaymentStatus("failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setPaymentStatus("failed");
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            setSelectedPlan("");
            setPaymentStatus("cancelled");
            setTimeout(() => setPaymentStatus(""), 2000);
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        setPaymentStatus("failed");
        setIsLoading(false);
        setSelectedPlan("");
      });

      razorpay.open();
    } catch (error) {
      console.error("Subscription error:", error);
      setPaymentStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonContent = (planId: string) => {
    if (isLoading && selectedPlan === planId) {
      return (
        <div className="flex items-center justify-center space-x-2">
          <Loader className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </div>
      );
    }

    if (paymentStatus === "verifying" && selectedPlan === planId) {
      return (
        <div className="flex items-center justify-center space-x-2">
          <Loader className="w-4 h-4 animate-spin" />
          <span>Verifying...</span>
        </div>
      );
    }

    if (paymentStatus === "success" && selectedPlan === planId) {
      return (
        <div className="flex items-center justify-center space-x-2 text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span>Success!</span>
        </div>
      );
    }

    return "Subscribe";
  };

  const getButtonDisabled = (planId: string) => {
    return (
      isLoading || (selectedPlan === planId && paymentStatus === "verifying")
    );
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Choose Your Plan
          </h1>
          <p className="text-white/60">
            Unlock premium AI features with our subscription plans
          </p>
        </div>

        {/* Payment Status Messages */}
        {paymentStatus === "failed" && (
          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">
              Payment verification failed. Please try again.
            </span>
          </div>
        )}

        {paymentStatus === "cancelled" && (
          <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400">Payment was cancelled.</span>
          </div>
        )}

        {paymentStatus === "error" && (
          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">
              An error occurred. Please try again.
            </span>
          </div>
        )}

        {/* Token Usage */}
        <div className="bg-black rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Coins className="w-6 h-6 text-white" />
              <h2 className="text-xl text-white">Your Tokens</h2>
            </div>
            <span className="text-2xl font-bold text-white">{tokens}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${Math.min((tokens / 1000) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-black rounded-lg p-6 border transition-all ${
                selectedPlan === plan.id && paymentStatus === "success"
                  ? "border-green-500/50 bg-green-900/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl text-white">{plan.name}</h3>
                <div className="flex items-center space-x-1">
                  <span className="text-2xl font-bold text-white">
                    ${plan.price}
                  </span>
                  <span className="text-white/40">/mo</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <Zap className="w-5 h-5 text-white" />
                <span className="text-white">{plan.tokens} tokens/month</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-2 text-white/60"
                  >
                    <Crown className="w-4 h-4 text-white" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={getButtonDisabled(plan.id)}
                className={`w-full py-3 rounded-lg transition-colors ${
                  selectedPlan === plan.id && paymentStatus === "success"
                    ? "bg-green-600 text-white"
                    : getButtonDisabled(plan.id)
                    ? "bg-white/20 text-white/40 cursor-not-allowed"
                    : "bg-white text-black hover:bg-white/90"
                }`}
              >
                {getButtonContent(plan.id)}
              </button>
            </div>
          ))}
        </div>

        {/* Instructions for integration */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">
            Integration Notes:
          </h3>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>
              • Make sure your Express server is running on the same domain or
              configure CORS
            </li>
            <li>• Replace the Razorpay key_id with your actual key</li>
            <li>
              • The payment flow will create orders and verify payments through
              your backend
            </li>
            <li>
              • Tokens are added to the user's account after successful payment
              verification
            </li>
            <li>
              • All payment data is handled securely through Razorpay's servers
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
