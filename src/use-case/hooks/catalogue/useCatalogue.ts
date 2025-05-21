import { useQuery, keepPreviousData } from "@tanstack/react-query";
import catalogueService from "@/services/catalogue/catalogueService";

export const useFormations = () => {
  return useQuery({
    queryKey: ["formations"],
    queryFn: () => catalogueService.getFormations(),
    placeholderData: keepPreviousData,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["formation-categories"],
    queryFn: catalogueService.getCategories,
  });
};
