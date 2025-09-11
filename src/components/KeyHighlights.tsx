import { Card, CardContent, CardHeader } from "./ui/card";
import { FileText, Brain, Globe, Volume2 } from "lucide-react";

export function KeyHighlights() {
  const highlights = [
    {
      icon: FileText,
      title: "Simplify Legal Language",
      description: "Convert complex legal jargon into plain English that anyone can understand",
      color: "bg-blue-500",
    },
    {
      icon: Brain,
      title: "Accurate AI Summaries",
      description: "Advanced AI technology provides precise summaries while maintaining legal accuracy",
      color: "bg-green-500",
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Access legal guidance in multiple languages for global accessibility",
      color: "bg-purple-500",
    },
    {
      icon: Volume2,
      title: "Audio & Voice Guidance",
      description: "Listen to your document summaries with our text-to-speech technology",
      color: "bg-orange-500",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose LegalAI?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to make legal documents accessible to everyone
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className={`${highlight.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">{highlight.title}</h3>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-gray-600 leading-relaxed">
                    {highlight.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}