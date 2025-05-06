import { useQuery } from "@tanstack/react-query";
import { mediaService } from "@/services";
import { Media } from "@/types/media";

export const useMediaByFormation = (formationId: string | null) => {
  const isAll = !formationId;

  return useQuery<{ tutoriels: Media[]; astuces: Media[] }>({
    queryKey: ["medias", formationId ?? "all"],
    queryFn: async () => {
      if (isAll) {
        const [tutoRes, astuceRes] = await Promise.all([
          mediaService.getTutoriels(),
          mediaService.getAstuces(),
        ]);
        return {
          tutoriels: tutoRes.data?.data || [],
          astuces: astuceRes.data?.data || [],
        };
      } else {
        const [tutoRes, astuceRes] = await Promise.all([
          mediaService.getTutorielByFormationId(formationId),
          mediaService.getAstuceByFormationId(formationId),
        ]);
        return {
          tutoriels: tutoRes.data?.data || [],
          astuces: astuceRes.data?.data || [],
        };
      }
    },
    staleTime: 1000 * 60 * 5,
  });
};
