import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle, Shield, Users, Award } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Trustworthy",
      description: "Built with enterprise-grade security and compliance standards to protect your sensitive legal documents"
    },
    {
      icon: CheckCircle,
      title: "Secure",
      description: "End-to-end encryption and zero data retention policy ensure your information remains confidential"
    },
    {
      icon: Award,
      title: "Reliable",
      description: "99.7% accuracy rate backed by advanced AI technology and continuous improvement"
    }
  ];

  const stats = [
    { number: "100K+", label: "Documents Processed" },
    { number: "50+", label: "Languages Supported" },
    { number: "99.7%", label: "Accuracy Rate" },
    { number: "24/7", label: "Availability" }
  ];

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">About Us</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Making Legal Knowledge <span className="text-blue-600">Accessible</span> to Everyone
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            At LegalAI, we believe that understanding legal documents shouldn&apos;t require a law degree. 
            Our mission is to democratize legal knowledge through innovative AI technology, making 
            complex legal language accessible to individuals and businesses worldwide.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We&apos;re on a mission to bridge the gap between complex legal language and everyday understanding. 
              Legal documents shouldn&apos;t be barriers to informed decision-making. Through cutting-edge AI 
              technology, we transform intimidating legal jargon into clear, actionable guidance.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Founded by a team of legal experts and AI researchers, LegalAI combines deep legal knowledge 
              with advanced machine learning to deliver unprecedented accuracy and clarity in document analysis.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">AI-Powered</Badge>
              <Badge variant="outline">Legal Expertise</Badge>
              <Badge variant="outline">Global Access</Badge>
              <Badge variant="outline">Privacy First</Badge>
            </div>
          </div>
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1659869764315-dc3d188141fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBsZWdhbCUyMGRvY3VtZW50c3xlbnwxfHx8fDE3NTcwNzY3NDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Professional legal documents and technology"
              className="w-full h-96 object-cover rounded-2xl shadow-xl"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-blue-600 rounded-3xl p-12 mb-20 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Our platform has helped individuals and organizations across the globe understand 
              their legal documents with confidence
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose LegalAI?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;re not just another document reader. We&apos;re your trusted partner in legal understanding.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-0 shadow-lg text-center p-8">
                  <CardContent className="space-y-4">
                    <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gray-50 rounded-3xl p-12 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Commitment</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We&apos;re committed to maintaining the highest standards of accuracy, security, and user experience. 
              Our team continuously improves our AI models to serve you better.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Continuous Innovation</h3>
              <p className="text-gray-600 text-sm">Regular updates and improvements to our AI technology</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Customer First</h3>
              <p className="text-gray-600 text-sm">Your feedback drives our product development</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Privacy Protection</h3>
              <p className="text-gray-600 text-sm">Your documents are processed securely and deleted immediately</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Experience Legal Clarity?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust LegalAI to make their legal documents understandable
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Get Started Today
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors">
              Contact Our Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}