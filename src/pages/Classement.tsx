import { Layout } from "@/components/layout/Layout";
import { Classement as ClassementComponent } from "@/components/quiz/Classement";
import AdCatalogueBlock from "@/components/FeatureHomePage/AdCatalogueBlock";
import { useCatalogueFormations } from "@/hooks/queries/useCatalogueQueries";

const Classement = () => {
  const { data: formations = [] } = useCatalogueFormations();

  return (
    <Layout>
      <div>
        <ClassementComponent />
        {formations.length > 0 && (
          <div className="mt-8">
            <AdCatalogueBlock formations={formations.slice(0, 4)} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Classement;
