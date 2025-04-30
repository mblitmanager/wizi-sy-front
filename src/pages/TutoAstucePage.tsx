import { useEffect, useState } from "react";
import { mediaService } from "@/services";
import { Media } from "@/types/media";
import { MediaList, MediaPlayer, MediaTabs } from "@/components/Media";
import HeaderSection from "@/components/features/HeaderSection";

export default function TutoAstucePage() {
  const [tutoriels, setTutoriels] = useState<Media[]>([]);
  const [astuces, setAstuces] = useState<Media[]>([]);
  const [activeCategory, setActiveCategory] = useState<"tutoriel" | "astuce">(
    "tutoriel"
  );
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tutoRes, astuceRes] = await Promise.all([
          mediaService.getTutoriels(),
          mediaService.getAstuces(),
        ]);
        setTutoriels(tutoRes.data.data);
        setAstuces(astuceRes.data);
      } catch (error) {
        console.error("Erreur lors du chargement des médias :", error);
      }
    };
    fetchData();
  }, []);

  const medias = activeCategory === "tutoriel" ? tutoriels : astuces;

  useEffect(() => {
    if (medias.length > 0) {
      setSelectedMedia(medias[0]);
    } else {
      setSelectedMedia(null);
    }
  }, [activeCategory, tutoriels, astuces, medias]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <HeaderSection titre="Tutoriels & Astuces" buttonText="Retour" />

      <MediaTabs active={activeCategory} onChange={setActiveCategory} />

      <div className="grid bg-white rounded-2xl shadow-lg grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="rounded-2xl p-4 overflow-y-auto max-h-[100vh]">
          <MediaList
            medias={medias}
            selectedMedia={selectedMedia}
            onSelect={setSelectedMedia}
          />
        </div>

        <div className=" p-4">
          <MediaPlayer media={selectedMedia} />
        </div>
      </div>
    </div>
  );
}
