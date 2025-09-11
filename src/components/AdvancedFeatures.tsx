import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Zap, 
  Users, 
  BookOpen, 
  Download,
  Search,
  MessageSquare,
  BarChart3,
  Lock,
  Globe2,
  Smartphone
} from "lucide-react";

export function AdvancedFeatures() {
  const advancedFeatures = [
    {
      icon: Zap,
      title: "Lightning-Fast Processing",
      description: "Process documents up to 100 pages in under 30 seconds with our advanced AI algorithms",
      color: "bg-yellow-500",
      features: ["Batch processing", "Real-time analysis", "Cloud-powered speed"]
    },
    {
      icon: Search,
      title: "Smart Document Search",
      description: "Find specific clauses, terms, or sections instantly across all your uploaded documents",
      color: "bg-purple-500",
      features: ["Semantic search", "Cross-document queries", "Advanced filters"]
    },
    {
      icon: MessageSquare,
      title: "AI Chat Assistant",
      description: "Ask questions about your documents and get instant, contextual answers",
      color: "bg-green-500",
      features: ["Natural language queries", "Context awareness", "Legal expertise"]
    },
    {
      icon: BarChart3,
      title: "Document Analytics",
      description: "Get insights into document complexity, risk levels, and key metrics",
      color: "bg-blue-500",
      features: ["Risk assessment", "Complexity scoring", "Trend analysis"]
    },
    {
      icon: BookOpen,
      title: "Legal Knowledge Base",
      description: "Access integrated legal definitions, case law, and regulatory information",
      color: "bg-indigo-500",
      features: ["Legal precedents", "Regulatory updates", "Term definitions"]
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share documents, annotations, and insights with your team members securely",
      color: "bg-pink-500",
      features: ["Real-time collaboration", "Permission controls", "Version history"]
    }
  ];

  const technicalFeatures = [
    { icon: Lock, title: "256-bit Encryption", description: "Military-grade security" },
    { icon: Globe2, title: "50+ Languages", description: "Global accessibility" },
    { icon: Smartphone, title: "Mobile Optimized", description: "Works on any device" },
    { icon: Download, title: "Export Options", description: "Multiple file formats" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Advanced Features</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Powerful Tools for Legal Professionals
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Go beyond basic document reading with advanced AI-powered features designed 
            for modern legal workflows
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {advancedFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.features.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Technical Features */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Built for Enterprise
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enterprise-grade infrastructure with the reliability and security your business demands
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {technicalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Integration Section */}
        <div className="text-center mt-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Seamless Integrations
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect LegalAI with your existing tools and workflows
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="px-4 py-2">Slack</Badge>
            <Badge variant="outline" className="px-4 py-2">Microsoft Teams</Badge>
            <Badge variant="outline" className="px-4 py-2">Google Drive</Badge>
            <Badge variant="outline" className="px-4 py-2">Dropbox</Badge>
            <Badge variant="outline" className="px-4 py-2">SharePoint</Badge>
            <Badge variant="outline" className="px-4 py-2">Salesforce</Badge>
            <Badge variant="outline" className="px-4 py-2">Zapier</Badge>
            <Badge variant="outline" className="px-4 py-2">REST API</Badge>
          </div>
        </div>
      </div>
    </section>
  );
}