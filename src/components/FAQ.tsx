import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Badge } from "./ui/badge";

export function FAQ() {
  const faqs = [
    {
      question: "How accurate is LegalAI's document analysis?",
      answer: "LegalAI maintains a 99.7% accuracy rate in document analysis, validated through extensive testing with legal professionals. Our AI is continuously trained on legal precedents and updated regulations to ensure precision. However, we always recommend consulting with qualified legal counsel for critical decisions."
    },
    {
      question: "What types of legal documents can LegalAI process?",
      answer: "LegalAI can process a wide range of legal documents including contracts, agreements, leases, employment documents, privacy policies, terms of service, corporate filings, legal briefs, and regulatory documents. We support PDF, Word, and plain text formats up to 500 pages per document."
    },
    {
      question: "Is my data secure and confidential?",
      answer: "Absolutely. We use enterprise-grade 256-bit encryption for all data transmission and storage. Your documents are processed securely in the cloud and automatically deleted after analysis unless you choose to save them. We're SOC 2 compliant and follow strict data privacy regulations including GDPR."
    },
    {
      question: "How long does it take to analyze a document?",
      answer: "Most documents are processed within 30 seconds to 2 minutes, depending on length and complexity. Simple contracts (1-10 pages) typically take under 30 seconds, while complex multi-page agreements may take 2-3 minutes. Our cloud infrastructure ensures fast, reliable processing."
    },
    {
      question: "Can I collaborate with my team on documents?",
      answer: "Yes! LegalAI offers robust collaboration features including shared workspaces, real-time annotations, comment threads, and permission controls. Team members can review, highlight, and discuss documents together while maintaining security and version control."
    },
    {
      question: "What languages does LegalAI support?",
      answer: "LegalAI supports over 50 languages including English, Spanish, French, German, Chinese, Japanese, Korean, Portuguese, Italian, Dutch, Russian, Arabic, and many more. Our AI maintains legal accuracy across different language legal systems and jurisdictions."
    },
    {
      question: "Do I need legal training to use LegalAI?",
      answer: "Not at all! LegalAI is designed for everyone, from legal professionals to business owners and individuals. The AI translates complex legal language into plain English explanations, making legal documents accessible to anyone regardless of legal background."
    },
    {
      question: "Can I export or download the analysis results?",
      answer: "Yes, you can export your analysis results in multiple formats including PDF summaries, Word documents, plain text, and structured data (JSON/CSV). You can also download highlighted versions of your original documents with annotations."
    },
    {
      question: "How does pricing work?",
      answer: "We offer flexible pricing plans including a free tier for basic use, professional plans for individuals and small teams, and enterprise solutions for large organizations. Pricing is based on document processing volume and advanced features needed. View our pricing page for detailed information."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We provide comprehensive support including 24/7 chat support, email assistance, video tutorials, documentation, and for enterprise clients, dedicated account managers. Our legal experts are available to help you get the most out of LegalAI."
    },
    {
      question: "Can LegalAI integrate with other tools?",
      answer: "Yes! LegalAI integrates with popular tools including Slack, Microsoft Teams, Google Drive, Dropbox, SharePoint, Salesforce, and more. We also provide REST APIs for custom integrations and workflow automation."
    },
    {
      question: "Is there a mobile app?",
      answer: "LegalAI is fully optimized for mobile browsers and works seamlessly on smartphones and tablets. We're currently developing native mobile apps for iOS and Android, which will be available soon with offline capabilities and enhanced mobile features."
    }
  ];

  const categories = [
    { name: "Security & Privacy", count: 2 },
    { name: "Features & Functionality", count: 4 },
    { name: "Pricing & Plans", count: 2 },
    { name: "Technical & Integration", count: 4 }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">FAQ</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get answers to common questions about LegalAI features, security, pricing, and more
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{category.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {category.count}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Still have questions?</p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className="border border-gray-200 rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <span className="font-medium text-gray-900 pr-4">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Contact CTA */}
            <div className="mt-12 text-center bg-blue-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Didn't find what you were looking for?
              </h3>
              <p className="text-gray-600 mb-6">
                Our support team is here to help you with any questions or concerns
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Contact Support
                </button>
                <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}