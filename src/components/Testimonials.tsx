import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Testimonials() {
  const testimonials = [
    {
      name: "Rajesh Sharma",
      role: "Corporate Lawyer",
      company: "Delhi Legal Associates",
      avatar: "RS",
      rating: 5,
      content: "LegalAI has revolutionized how I review contracts in the Delhi market. What used to take hours now takes minutes, and the accuracy is incredible. The AI explanations help me identify potential issues I might have missed."
    },
    {
      name: "Priya Gupta",
      role: "Small Business Owner", 
      company: "Gupta Enterprises, Delhi",
      avatar: "PG",
      rating: 5,
      content: "As a Delhi-based entrepreneur, legal documents always intimidated me. LegalAI breaks everything down into plain Hindi and English, giving me confidence in my business decisions. It's like having a legal advisor on demand."
    },
    {
      name: "Dr. Arjun Singh",
      role: "Legal Researcher",
      company: "Delhi University",
      avatar: "AS",
      rating: 5,
      content: "The multi-language support including Hindi is outstanding. I use LegalAI for research on Indian legal systems, and it accurately captures nuances across different jurisdictions including Delhi High Court cases."
    },
    {
      name: "Amit Kumar",
      role: "Paralegal",
      company: "Kumar & Associates, Delhi",
      avatar: "AK",
      rating: 5,
      content: "The document highlighting and annotation features have streamlined our case preparation process. Our Delhi-based firm can now collaborate more effectively, and we process discovery documents much faster."
    },
    {
      name: "Neha Agarwal",
      role: "Startup Founder",
      company: "TechStart Delhi",
      avatar: "NA",
      rating: 5,
      content: "LegalAI helped me understand complex investment agreements and employment contracts for my Delhi startup. The cost savings compared to constant lawyer consultations have been substantial for our business."
    },
    {
      name: "Vikram Singh",
      role: "Compliance Officer",
      company: "IndiaFinance Corp",
      avatar: "VS",
      rating: 5,
      content: "The risk assessment features are game-changing for compliance reviews in the Indian market. LegalAI identifies potential regulatory issues and explains them in context, helping us stay compliant across jurisdictions."
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Users", sublabel: "Professionals worldwide" },
    { number: "4.9/5", label: "User Rating", sublabel: "Based on 12,000+ reviews" },
    { number: "99.7%", label: "Accuracy Rate", sublabel: "AI processing precision" },
    { number: "2M+", label: "Documents Processed", sublabel: "And counting every day" }
  ];

  const companies = [
    "Tata Consultancy", "Infosys", "Wipro", "Reliance Industries", "HDFC Bank", 
    "Khaitan & Co", "AZB & Partners", "Shardul Amarchand Mangaldas"
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Customer Reviews</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Legal Professionals Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what lawyers, business owners, and legal professionals say about LegalAI
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg text-center p-6">
              <CardContent className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">{stat.number}</div>
                <div className="font-semibold text-gray-900">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.sublabel}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <Quote className="w-8 h-8 text-blue-100 absolute -top-2 -left-2" />
                  <p className="text-gray-700 leading-relaxed relative z-10">
                    "{testimonial.content}"
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-blue-600">{testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Companies Section */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-8">
            Trusted by leading organizations
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {companies.map((company, index) => (
              <div key={index} className="text-lg font-medium text-gray-400 hover:text-gray-600 transition-colors">
                {company}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-blue-600 rounded-3xl p-12 text-white">
          <h3 className="text-2xl font-bold mb-4">Join Thousands of Satisfied Users</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Experience the power of AI-driven legal document analysis. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-colors">
              Start Free Trial
            </button>
            <button className="border border-blue-300 hover:border-blue-200 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}