import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  FileText, 
  Brain, 
  Highlighter, 
  Globe, 
  Volume2, 
  Shield, 
  CheckCircle,
  Zap,
  Clock,
  Users
} from "lucide-react";

export function FeaturesPage() {
  const mainFeatures = [
    {
      icon: Brain,
      title: "AI Summarizer",
      description: "Transform complex legal documents into simple summaries",
      details: [
        "Advanced natural language processing",
        "Maintains legal accuracy and context",
        "Highlights critical information",
        "Customizable summary length"
      ],
      color: "bg-blue-500"
    },
    {
      icon: FileText,
      title: "AI Explanations",
      description: "Get clear explanations of difficult legal terms and concepts",
      details: [
        "Plain English translations",
        "Contextual definitions",
        "Legal precedent references",
        "Interactive term glossary"
      ],
      color: "bg-green-500"
    },
    {
      icon: Highlighter,
      title: "Mark & Highlight",
      description: "Highlight and annotate important sections across document pages",
      details: [
        "Multi-color highlighting system",
        "Collaborative annotations",
        "Section bookmarking",
        "Export highlighted content"
      ],
      color: "bg-yellow-500"
    },
    {
      icon: Globe,
      title: "Multi-language Translation",
      description: "Access legal guidance in multiple languages for global reach",
      details: [
        "50+ language support",
        "Legal terminology accuracy",
        "Cultural context adaptation",
        "Real-time translation"
      ],
      color: "bg-purple-500"
    },
    {
      icon: Volume2,
      title: "Audio Narration",
      description: "Listen to document summaries with advanced text-to-speech",
      details: [
        "Natural voice synthesis",
        "Adjustable reading speed",
        "Multiple voice options",
        "Downloadable audio files"
      ],
      color: "bg-orange-500"
    },
    {
      icon: Shield,
      title: "Data Security & Confidentiality",
      description: "Enterprise-grade security protects your sensitive documents",
      details: [
        "End-to-end encryption",
        "GDPR & SOC 2 compliance",
        "Automatic data deletion",
        "Zero data retention policy"
      ],
      color: "bg-red-500"
    }
  ];

  const additionalFeatures = [
    { icon: Zap, title: "Lightning Fast", description: "Process documents in seconds" },
    { icon: Clock, title: "24/7 Availability", description: "Access your documents anytime" },
    { icon: Users, title: "Team Collaboration", description: "Share and collaborate with colleagues" },
    { icon: CheckCircle, title: "99.7% Accuracy", description: "AI-powered precision you can trust" }
  ];

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Features</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for <span className="text-blue-600">Legal Clarity</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools designed to make legal documents accessible, understandable, 
            and actionable for everyone.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="bg-gray-50 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose LegalAI?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Beyond powerful features, we provide the reliability and performance you need
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Legal Documents?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust LegalAI to simplify their legal workflows
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Start Free Trial
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}