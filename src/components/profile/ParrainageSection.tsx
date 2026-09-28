import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Gift,
  User,
  Mail,
  Phone,
  CheckCircle2,
  ClipboardList,
  Headset,
  BadgeCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { isAxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import image from "../../assets/plan.png";
import { useUser } from "@/hooks/useAuth";
import { FORMATIONMETADATA } from "@/utils/constants";
import { getUserAccount } from "@/utils/userAccount";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface FormData {
  civilite: string;
  prenom: string;
  nom: string;
  telephone: string;
  statut: string;
  parrain_id: string;
  lien_parrainage: string;
  motif?: string;
  date_demande?: string;
  date_inscription?: string;
}

const REWARD = `50 ${FORMATIONMETADATA.euros}`;

const STEPS = [
  { icon: ClipboardList, title: "Remplissez le formulaire", text: "Inscrivez la personne avec ses coordonnées." },
  { icon: Headset, title: "Contact commercial", text: "Un conseiller la contacte pour choisir sa formation." },
  { icon: BadgeCheck, title: "Validation", text: "Le commercial valide les formations choisies." },
  { icon: Gift, title: `Récompense de ${REWARD}`, text: "Vous recevez une carte cadeau pour chaque inscription validée." },
];

// Fenêtre de confirmation après l'inscription d'un filleul
interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  filleulName: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, filleulName }) => (
  <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="max-w-md rounded-2xl">
      <DialogHeader className="items-center text-center sm:text-center">
        <span className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <DialogTitle className="text-xl">Filleul inscrit avec succès !</DialogTitle>
        <DialogDescription>
          <span className="font-semibold text-foreground">{filleulName}</span> sera contacté(e) par un conseiller.
        </DialogDescription>
      </DialogHeader>
      <p className="rounded-xl bg-gold-soft px-4 py-3 text-center text-sm text-foreground">
        Vous recevrez <span className="font-semibold">{REWARD}</span> en carte cadeau une fois son inscription validée.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" asChild className="flex-1">
          <Link to="/suivi-parrainage">Suivre mes parrainages</Link>
        </Button>
        <Button onClick={onClose} className="flex-1">
          Parrainer une autre personne
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

/** Champ de formulaire avec libellé et message d'erreur renvoyé par le backend. */
function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

const EMPTY_FORM: Omit<FormData, "parrain_id"> = {
  civilite: "M",
  prenom: "",
  nom: "",
  telephone: "",
  statut: "1",
  lien_parrainage: "",
};

interface ParrainageSectionProps {
  /** Appelé après l'inscription réussie d'un filleul. */
  onParrainageSuccess?: () => void;
}

const ParrainageSection = ({ onParrainageSuccess }: ParrainageSectionProps) => {
  const { toast } = useToast();
  const { user } = useUser();

  // Compte du parrain : `parrain_id` doit être un users.id (validation backend `exists:users,id`),
  // quelle que soit la forme de l'objet utilisateur (réponse de /login ou de /me).
  const account = getUserAccount(user);

  const [formData, setFormData] = useState<FormData>({ ...EMPTY_FORM, parrain_id: account.id });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  // États pour le modal de succès
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [filleulName, setFilleulName] = useState("");

  // Pré-remplir le parrain_id avec l'ID de l'utilisateur connecté
  useEffect(() => {
    if (account.id) {
      setFormData((prev) => ({ ...prev, parrain_id: account.id }));
    }
  }, [account.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Une correction efface l'erreur du champ concerné
    if (errors[name]) {
      setErrors(({ [name]: _removed, ...rest }) => rest);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Préparer les données avec le motif par défaut
      const payload = {
        ...formData,
        date_inscription: new Date().toISOString().split("T")[0],
        motif: "Soumission d'une demande d'inscription par parrainage",
        date_demande: new Date().toISOString(),
      };

      try {
        await api.post("/parrainage/register-filleul", payload);
      } catch (err) {
        const data = isAxiosError(err) ? err.response?.data : undefined;
        if (data?.errors) {
          setErrors(data.errors);
          throw new Error("Veuillez corriger les erreurs dans le formulaire");
        }
        throw new Error(data?.message || "Erreur lors de l'inscription");
      }

      // Stocker le nom du filleul pour le modal, puis réinitialiser le formulaire
      setFilleulName(`${formData.prenom} ${formData.nom}`);
      setFormData({ ...EMPTY_FORM, parrain_id: account.id });
      setErrors({});

      setShowSuccessModal(true);
      onParrainageSuccess?.();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : typeof error === "string" ? error : "Une erreur est survenue";

      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setFilleulName("");
  };

  const inputClass = (field: string) =>
    cn("h-11 rounded-lg bg-card", errors[field] && "border-red-400 focus-visible:ring-red-400");

  const parrainName = [user?.stagiaire?.prenom, account.name.toLocaleUpperCase()].filter(Boolean).join(" ");

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,38%)] lg:gap-8">
        {/* ── Colonne principale ── */}
        <div className="min-w-0 space-y-5">
          <header>
            <h2 className="font-poppins text-2xl font-bold text-foreground md:text-3xl">Programme de parrainage</h2>
            <p className="mt-1.5 text-muted-foreground">
              Recommandez Wizi Learn à vos proches et collègues : gagnez{" "}
              <span className="font-semibold text-foreground">{REWARD}</span> en carte cadeau pour chaque
              inscription validée.
            </p>
          </header>

          <div className="flex items-center gap-3 rounded-2xl border border-gold/40 bg-gold-soft p-4">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gold text-navy">
              <Gift className="h-5 w-5" />
            </span>
            <p className="text-sm font-medium text-foreground">
              Aucune limite : plus vous parrainez, plus vous cumulez de cartes cadeaux.
            </p>
          </div>

          {/* Formulaire */}
          <section
            className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-sm)] md:p-6"
            aria-labelledby="filleul-title"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <UserPlus className="h-5 w-5" />
              </span>
              <div>
                <h3 id="filleul-title" className="text-lg font-semibold text-foreground">
                  Inscrire un filleul
                </h3>
                <p className="text-sm text-muted-foreground">Un conseiller le contactera rapidement.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="parrain_id" value={formData.parrain_id} />
              <input type="hidden" name="statut" value={formData.statut} />

              <fieldset>
                <legend className="mb-1.5 text-sm font-medium text-foreground">Civilité</legend>
                <div className="inline-flex rounded-lg bg-secondary p-1">
                  {[
                    { value: "M", label: "Monsieur" },
                    { value: "Mme", label: "Madame" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        "cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-colors focus-within:ring-2 focus-within:ring-ring",
                        formData.civilite === option.value
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <input
                        type="radio"
                        name="civilite"
                        value={option.value}
                        checked={formData.civilite === option.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
                {errors.civilite && <p className="mt-1.5 text-sm text-red-600">{errors.civilite[0]}</p>}
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="prenom" label="Prénom" error={errors.prenom?.[0]}>
                  <Input
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    autoComplete="off"
                    aria-invalid={!!errors.prenom}
                    className={inputClass("prenom")}
                    required
                  />
                </Field>
                <Field id="nom" label="Nom" error={errors.nom?.[0]}>
                  <Input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    autoComplete="off"
                    aria-invalid={!!errors.nom}
                    className={inputClass("nom")}
                    required
                  />
                </Field>
              </div>

              <Field id="telephone" label="Téléphone" error={errors.telephone?.[0]}>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="06 12 34 56 78"
                    inputMode="tel"
                    aria-invalid={!!errors.telephone}
                    className={cn(inputClass("telephone"), "pl-9")}
                    required
                  />
                </div>
              </Field>

              {errors.parrain_id && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errors.parrain_id[0]}</p>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="h-11 w-full rounded-lg font-semibold sm:w-auto sm:px-8"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Inscription en cours…
                  </>
                ) : (
                  <>
                    Inscrire mon filleul
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Parrain */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-sm">
              <span className="text-muted-foreground">Parrain :</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <User className="h-4 w-4 text-muted-foreground" />
                {parrainName || "—"}
              </span>
              {account.email && (
                <span className="inline-flex min-w-0 items-center gap-1.5 text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{account.email}</span>
                </span>
              )}
            </div>
          </section>

          {/* Étapes */}
          <section aria-labelledby="steps-title">
            <h3 id="steps-title" className="mb-3 text-lg font-semibold text-foreground">
              Comment ça marche ?
            </h3>
            <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {STEPS.map((step, i) => (
                <li key={step.title} className="rounded-2xl border border-border bg-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-primary">
                      <step.icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="font-poppins text-2xl font-bold text-border">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* ── Visuel : occupe toute la largeur de sa colonne ── */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <figure className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-sm)]">
            <img
              src={image}
              alt="Parrainez et gagnez 50 € : une carte cadeau pour toute formation validée"
              className="block h-auto w-full"
              width={1241}
              height={1754}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <Button variant="outline" asChild className="mt-3 h-11 w-full rounded-lg">
            <Link to="/suivi-parrainage">
              Suivre mes parrainages
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </aside>
      </div>

      <SuccessModal isOpen={showSuccessModal} onClose={handleCloseSuccessModal} filleulName={filleulName} />
    </>
  );
};

export default ParrainageSection;
