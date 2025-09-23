
import { Layout } from "@/components/layout/Layout";
import { Classement as ClassementComponent } from "@/components/quiz/Classement";
import AdCatalogueBlock from "@/components/FeatureHomePage/AdCatalogueBlock";
import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { CatalogueFormation } from "@/types/stagiaire";

const Classement = () => {
  const [formations, setFormations] = useState<CatalogueFormation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    apiClient
      .get("/catalogueFormations/formations")
      .then((res) => {
        if (!mounted) return;
        const d = res?.data;
        if (Array.isArray(d)) setFormations(d);
        else if (d && Array.isArray(d.data)) setFormations(d.data);
        else setFormations([]);
      })
      .catch(() => setFormations([]))
      .finally(() => setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Layout>
      <div>
        <ClassementComponent />
        {!isLoading && formations.length > 0 && (
          <div className="mt-8">
            <AdCatalogueBlock formations={formations.slice(0, 4)} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Classement;
