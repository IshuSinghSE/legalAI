import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HeroSectionProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

export function HeroSection({ onGetStarted, onLearnMore }: HeroSectionProps) {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Legal Documents Made{" "}
              <span className="text-blue-600">Simple</span> with AI
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Upload, Summarize, and Understand Legal Content Effortlessly.
              Transform complex legal jargon into clear, actionable guidance
              that empowers you to make informed decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 px-8"
                onClick={onGetStarted}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8"
                onClick={onLearnMore}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative">
            <div className="aspect-square max-w-lg mx-auto">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1591696331111-ef9586a5b17a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwbGVnYWwlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1NzA3NjczNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="AI-powered legal technology"
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
              />
            </div>
            {/* Floating elements */}
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm shadow-lg">
              AI Powered
            </div>
            <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg border">
              <div className="text-xs text-gray-500">Document Simplified</div>
              <div className="text-sm font-medium">99.7% Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}