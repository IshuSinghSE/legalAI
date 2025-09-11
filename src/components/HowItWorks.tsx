import { Card, CardContent } from "./ui/card";
import { Upload, Settings, CheckCircle } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: Upload,
      title: "Upload Document",
      description: "Simply drag and drop your legal document or browse to upload any PDF, Word, or text file",
      color: "bg-blue-500",
    },
    {
      step: "02",
      icon: Settings,
      title: "AI Reads & Simplifies",
      description: "Our advanced AI analyzes your document and breaks down complex legal language into understandable terms",
      color: "bg-green-500",
    },
    {
      step: "03",
      icon: CheckCircle,
      title: "Get Easy-to-Understand Guidance",
      description: "Receive clear summaries, highlighted key points, and actionable insights you can trust",
      color: "bg-purple-500",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your legal documents in just three simple steps
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="border-0 shadow-lg h-full bg-white hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8 text-center">
                    {/* Step Number */}
                    <div className="text-6xl font-bold text-gray-100 mb-4">
                      {step.step}
                    </div>
                    
                    {/* Icon */}
                    <div className={`${step.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 -mt-16 relative z-10`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-xl text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Connector Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <div className="w-8 h-0.5 bg-gray-300"></div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-300 border-y-2 border-y-transparent"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}