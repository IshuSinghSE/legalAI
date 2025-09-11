"use client";
import { useState } from "react";
import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { KeyHighlights } from "../components/KeyHighlights";
import { HowItWorks } from "../components/HowItWorks";
import { AdvancedFeatures } from "../components/AdvancedFeatures";
import { Testimonials } from "../components/Testimonials";
import { PricingPreview } from "../components/PricingPreview";
import { FAQ } from "../components/FAQ";
import { DocumentUpload } from "../components/DocumentUpload";
import { FeaturesPage } from "../components/FeaturesPage";
import { AboutPage } from "../components/AboutPage";
import { TeamPage } from "../components/TeamPage";
import { Footer } from "../components/Footer";

function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{title}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{description}</p>
        <div className="mt-12 p-8 bg-gray-50 rounded-2xl max-w-2xl mx-auto">
          <p className="text-gray-500">This page is under construction. Check back soon!</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState("home");

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGetStarted = () => {
    setCurrentPage("document-upload");
  };

  const handleLearnMore = () => {
    setCurrentPage("how-it-works");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <>
            <HeroSection onGetStarted={handleGetStarted} onLearnMore={handleLearnMore} />
            <KeyHighlights />
            <HowItWorks />
            <AdvancedFeatures />
            <Testimonials />
            <PricingPreview onGetStarted={handleGetStarted} />
            <FAQ />
          </>
        );
      case "how-it-works":
        return (
          <div className="min-h-screen bg-white py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">How LegalAI Works</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">Transform your legal documents in three simple steps</p>
              </div>
            </div>
            <HowItWorks />
            <div className="text-center py-16">
              <button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">Try It Now</button>
            </div>
          </div>
        );
      case "features":
        return <FeaturesPage />;
      case "about":
        return <AboutPage />;
      case "document-upload":
        return <DocumentUpload onBack={() => handlePageChange("home")} />;
      case "pricing":
        return <PlaceholderPage title="Pricing Plans" description="Choose the perfect plan for your legal document needs. Transparent pricing with no hidden fees." />;
      case "contact":
        return <PlaceholderPage title="Contact Us" description="Get in touch with our team. We're here to help you with any questions about LegalAI." />;
      case "privacy":
        return <PlaceholderPage title="Privacy Policy" description="Learn how we protect your data and maintain the highest standards of privacy and security." />;
      case "terms":
        return <PlaceholderPage title="Terms & Conditions" description="Review our terms of service and understand your rights and responsibilities when using LegalAI." />;
      case "team":
        return <TeamPage onBack={() => handlePageChange("home")} />;
      default:
        return <PlaceholderPage title="Page Not Found" description="The page you're looking for doesn't exist or is under construction." />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onPageChange={handlePageChange} />
      <main>{renderPage()}</main>
      <Footer onPageChange={handlePageChange} />
    </div>
  );
}
