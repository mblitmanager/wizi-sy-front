import { useEffect, useState } from "react";
import { userService } from "@/services/userServiceA";
import { User } from "@/types/index";
import { Stagiaire } from "@/types/stagiaire";

const mapStagiaireToUser = (stagiaire: Stagiaire): User => ({
  id: stagiaire.id.toString(),
  name: stagiaire.prenom,
  email: "",
  role: "stagiaire",
  level: 1,
  points: 0,
});

export const useLoadProfile = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    userService.getProfile().then((res) => {
      if (res?.stagiaire) {
        setUser(mapStagiaireToUser(res.stagiaire));
      }
    });
  }, []);

  return user;
};
