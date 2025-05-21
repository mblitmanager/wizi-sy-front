import { useQuery } from "@tanstack/react-query";
import catalogueService from "@/services/catalogue/catalogueService";

export const useFormations = (page = 1) => {
  return useQuery({
    queryKey: ["formations", page],
    queryFn: () => catalogueService.getFormations(page),
  });
};
console.log("useFormations", useFormations);
export const useCategories = () => {
  return useQuery({
    queryKey: ["formation-categories"],
    queryFn: catalogueService.getCategories,
  });
};
