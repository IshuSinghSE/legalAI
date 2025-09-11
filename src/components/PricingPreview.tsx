import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Check, Star, Zap } from "lucide-react";

interface PricingPreviewProps {
  onGetStarted: () => void;
}

export function PricingPreview({ onGetStarted }: PricingPreviewProps) {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "",
      description: "Perfect for individuals getting started with legal document analysis",
      features: [
        "5 documents per month",
        "Basic AI summaries",
        "Standard support",
        "Mobile-optimized interface",
        "Export to PDF"
      ],
      limitations: [
        "Single user only",
        "No collaboration features"
      ],
      popular: false,
      cta: "Get Started Free",
      color: "border-gray-200"
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Ideal for professionals and small teams who need advanced features",
      features: [
        "Unlimited documents",
        "Advanced AI analysis",
        "Priority support",
        "Team collaboration",
        "All export formats",
        "Document highlighting",
        "Multi-language support",
        "API access"
      ],
      limitations: [],
      popular: true,
      cta: "Start Free Trial",
      color: "border-blue-500"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Scalable solution for large organizations with custom requirements",
      features: [
        "Everything in Professional",
        "Custom integrations",
        "Advanced security",
        "Dedicated support",
        "Training & onboarding",
        "SLA guarantees",
        "Custom AI models",
        "White-label options"
      ],
      limitations: [],
      popular: false,
      cta: "Contact Sales",
      color: "border-purple-500"
    }
  ];

  const additionalFeatures = [
    { name: "99.7% AI Accuracy", included: true },
    { name: "SOC 2 Compliance", included: true },
    { name: "24/7 Availability", included: true },
    { name: "Mobile Optimized", included: true },
    { name: "Regular Updates", included: true }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your needs. All plans include our core AI-powered 
            document analysis with no hidden fees.
          </p>

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-gray-600">Monthly</span>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                id="pricing-toggle"
              />
              <div className="w-12 h-6 bg-gray-300 rounded-full cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform translate-x-0.5 translate-y-0.5"></div>
              </div>
            </div>
            <span className="text-gray-600">Yearly</span>
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
              Save 20%
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.color} ${plan.popular ? 'shadow-xl scale-105 bg-white' : 'shadow-lg'} transition-all duration-300 hover:shadow-xl`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-xl font-bold text-gray-900">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-500">{plan.period}</span>}
                </div>
                <p className="text-gray-600 mt-4">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">Limitations:</p>
                    <div className="space-y-2">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          </div>
                          <span className="text-sm text-gray-600">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <div className="pt-4">
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                    onClick={onGetStarted}
                  >
                    {plan.popular && <Zap className="w-4 h-4 mr-2" />}
                    {plan.cta}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            What's included in all plans
          </h3>
          <div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">{feature.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Questions about our pricing? 
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              View detailed comparison
            </button>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Contact our sales team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}