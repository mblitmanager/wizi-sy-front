import React, { lazy, Suspense } from "react";
import { Layout } from "@/components/layout/Layout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { Button } from "@/components/ui/button";
// Optimisation du chargement des images avec le composant next/image
const logo = '/logons.png';
import { WifiOff } from "lucide-react";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import CategoriesSection from "@/components/landing/CategoriesSection";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};
const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

export default function LandingPage() {
  const isOnline = useOnlineStatus();

  return (
    <Layout>
      <div
        className="min-h-screen mt-[-10%]"
        style={{
          background:
            "linear-gradient(135deg, var(--brand-surface) 0%, rgba(255,248,224,0.6) 40%, rgba(250,245,240,0.9) 100%)",
        }}>
        {/* Offline Alert */}
        {!isOnline && (
          <Alert variant="destructive" className="mb-4 mx-4 mt-4">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>Vous êtes hors ligne</AlertTitle>
            <AlertDescription>
              Certaines fonctionnalités peuvent être limitées. Les données
              affichées peuvent ne pas être à jour.
            </AlertDescription>
          </Alert>
        )}

        {/* Hero Section */}
        <Hero logo={logo} />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Categories Section */}
        <CategoriesSection />
      </div>
    </Layout>
  );
}
