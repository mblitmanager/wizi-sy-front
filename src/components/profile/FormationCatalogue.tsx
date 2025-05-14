import React from "react";
import { Link } from "react-router-dom";

interface FormationCatalogueProps {
  formations: any[];
}

const FormationCatalogue: React.FC<FormationCatalogueProps> = ({
  formations,
}) => {
  console.log("formations", formations);
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold font-montserrat mb-4">
        Catalogue des formations
      </h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {formations && formations.length > 0 ? (
          formations.map((formation) => (
            <Link
              to={`/catalogue_formation/${formation?.id || ""}`}
              key={formation?.id || Math.random().toString()}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h3 className="font-medium font-nunito">
                {formation?.titre || "Sans titre"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {formation?.description || "Pas de description"}
              </p>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Aucune formation disponible
          </div>
        )}
      </div>
    </div>
  );
};

export default FormationCatalogue;
