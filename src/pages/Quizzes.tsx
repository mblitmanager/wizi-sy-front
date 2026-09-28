import { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, GraduationCap, List, Route, WifiOff } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { useResumeQuiz } from "@/hooks/useResumeQuiz";
import { readQuizViewPreference, useQuizPreferences } from "@/hooks/useQuizPreferences";
import { useQuizOverview, type QuizItem } from "@/hooks/quiz/useQuizOverview";
import { useStagiaireQuizzes } from "@/hooks/queries/useQuizQueries";
import { getQuizFormationId } from "@/components/quiz/quizUtils";
import { QuizHistoryModal } from "@/components/quiz/QuizHistoryModal";
import { QuizPathView } from "@/components/quiz/overview/QuizPathView";
import { QuizListView } from "@/components/quiz/overview/QuizListView";
import { QuizProgressPanel } from "@/components/quiz/overview/QuizProgressPanel";
import { ResumeQuizBanner } from "@/components/quiz/overview/ResumeQuizBanner";
import { EmptyState } from "@/components/quiz/overview/EmptyState";

const FORMATION_KEY = "last_selected_formation_id";

/** Valeurs de `?toggle=` conservées pour la compatibilité des liens existants. */
const VIEW_PARAM = { adventure: "adventure", list: "mes-quizzes" } as const;
type View = keyof typeof VIEW_PARAM;

function readStoredFormation() {
  try {
    return localStorage.getItem(FORMATION_KEY);
  } catch {
    return null;
  }
}

function QuizzesSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-live="polite">
      <span className="sr-only">Chargement des quiz…</span>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="mt-4 h-10 w-10 flex-shrink-0 rounded-full" />
          <Skeleton className="h-24 flex-1 rounded-2xl" />
        </div>
      ))}
    </div>
  );
}

export default function Quizzes() {
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const [searchParams, setSearchParams] = useSearchParams();
  const { savePreference } = useQuizPreferences();
  const { unfinishedQuiz, hideModal: hideResume, isModalHidden: isResumeHidden } = useResumeQuiz();

  // Vue : paramètre d'URL, sinon préférence enregistrée
  const param = searchParams.get("toggle");
  const view: View =
    param === VIEW_PARAM.list ? "list" : param === VIEW_PARAM.adventure ? "adventure" : readQuizViewPreference();

  const setView = useCallback(
    (next: View) => {
      savePreference(next);
      setSearchParams({ toggle: VIEW_PARAM[next] }, { replace: true });
    },
    [savePreference, setSearchParams]
  );

  const [storedFormationId, setStoredFormationId] = useState<string | null>(readStoredFormation);
  const selectFormation = (id: string) => {
    setStoredFormationId(id);
    try {
      localStorage.setItem(FORMATION_KEY, id);
    } catch {
      // stockage indisponible : le choix reste valable pour la session
    }
  };

  // Quiz en cours : titre et formation complétés depuis la liste des quiz (même cache)
  const { data: allQuizzes } = useStagiaireQuizzes();
  const resumeSource = useMemo(
    () => (unfinishedQuiz ? allQuizzes?.find((q) => String(q.id) === String(unfinishedQuiz.quizId)) : undefined),
    [unfinishedQuiz, allQuizzes]
  );

  const overview = useQuizOverview({
    preferredFormationId: storedFormationId,
    fallbackFormationId:
      unfinishedQuiz?.formationId != null
        ? String(unfinishedQuiz.formationId)
        : resumeSource
          ? getQuizFormationId(resumeSource)
          : null,
  });

  const resumeQuiz = unfinishedQuiz
    ? {
        id: unfinishedQuiz.quizId,
        title: resumeSource?.titre || unfinishedQuiz.quizTitle || "Quiz",
        answered: unfinishedQuiz.currentIndex || 0,
        total: unfinishedQuiz.questionIds?.length || resumeSource?.questions?.length || 0,
      }
    : null;

  const [historyItem, setHistoryItem] = useState<QuizItem | null>(null);
  const openHistory = useCallback((item: QuizItem) => setHistoryItem(item), []);

  const currentFormation = overview.formations.find((f) => f.id === overview.formationId);
  const hasQuizzes = (allQuizzes?.length ?? 0) > 0;

  return (
    <Layout>
      <div className="space-y-5">
        {/* En-tête */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-poppins text-2xl font-bold text-foreground">Mes quiz</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Testez vos connaissances, gagnez des points et débloquez de nouveaux niveaux.
            </p>
          </div>

          <div className="inline-flex self-start rounded-xl bg-secondary p-1 sm:self-auto" role="tablist" aria-label="Affichage">
            {(
              [
                ["adventure", "Parcours", Route],
                ["list", "Liste", List],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                role="tab"
                aria-selected={view === key}
                onClick={() => setView(key)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                  view === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </header>

        {!isOnline && (
          <div className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
            <WifiOff className="h-4 w-4 flex-shrink-0" />
            Vous êtes hors ligne : les données affichées peuvent ne pas être à jour.
          </div>
        )}

        {resumeQuiz && !isResumeHidden && (
          <ResumeQuizBanner
            title={resumeQuiz.title}
            answered={resumeQuiz.answered}
            total={resumeQuiz.total}
            onResume={() => navigate(`/quiz/${resumeQuiz.id}`)}
            onDismiss={hideResume}
          />
        )}

        {overview.isError ? (
          <EmptyState
            icon={<AlertCircle className="h-6 w-6" />}
            title="Impossible de charger vos quiz"
            description="Vérifiez votre connexion puis réessayez."
            action={<Button onClick={overview.refetch}>Réessayer</Button>}
          />
        ) : !overview.isLoading && !hasQuizzes ? (
          <EmptyState
            icon={<GraduationCap className="h-6 w-6" />}
            title="Aucun quiz disponible"
            description="Les quiz apparaissent dès que vous êtes inscrit à une formation."
            action={<Button onClick={() => navigate("/catalogue")}>Voir le catalogue</Button>}
          />
        ) : (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]">
            {/* Colonne latérale : progression (au-dessus du contenu sur mobile) */}
            <aside className="lg:order-2">
              <div className="lg:sticky lg:top-24">
                {overview.isLoading ? (
                  <Skeleton className="h-64 w-full rounded-2xl" />
                ) : (
                  <QuizProgressPanel
                    points={overview.points}
                    doneCount={overview.done.length}
                    totalCount={currentFormation?.quizCount ?? 0}
                    lockedByLevelCount={overview.lockedByLevelCount}
                  />
                )}
              </div>
            </aside>

            <section className="min-w-0 space-y-4 lg:order-1">
              {/* Formation */}
              {overview.formations.length > 0 && (
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                  <label htmlFor="quiz-formation" className="text-sm font-medium text-muted-foreground">
                    Formation
                  </label>
                  <Select value={overview.formationId ?? undefined} onValueChange={selectFormation}>
                    <SelectTrigger id="quiz-formation" className="h-10 w-full rounded-lg bg-card sm:w-80">
                      <GraduationCap className="mr-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <SelectValue placeholder="Choisir une formation" />
                    </SelectTrigger>
                    <SelectContent>
                      {overview.formations.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.titre}
                          <span className="ml-2 text-xs text-muted-foreground">
                            {f.quizCount} quiz
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {overview.isLoading ? (
                <QuizzesSkeleton />
              ) : view === "adventure" ? (
                overview.path.length > 0 ? (
                  <QuizPathView items={overview.path} onHistory={openHistory} />
                ) : (
                  <EmptyState
                    title="Aucun quiz accessible pour le moment"
                    description="Les quiz de cette formation se débloqueront quand vous aurez gagné plus de points."
                  />
                )
              ) : (
                <QuizListView
                  key={overview.formationId ?? "none"}
                  todo={overview.todo}
                  done={overview.done}
                  onHistory={openHistory}
                />
              )}
            </section>
          </div>
        )}
      </div>

      <QuizHistoryModal
        quizId={historyItem ? Number(historyItem.id) : null}
        quizTitle={historyItem?.title}
        quizHistory={overview.history}
        onClose={() => setHistoryItem(null)}
      />
    </Layout>
  );
}
