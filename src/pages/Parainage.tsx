import { Layout } from "@/components/layout/Layout";
import ParrainageSection from "@/components/profile/ParrainageSection";

export default function Parainage() {
  return (
    <Layout>
      <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 lg:py-8 space-y-6 sm:space-y-8">
        <ParrainageSection />
      </div>
    </Layout>
  );
}
