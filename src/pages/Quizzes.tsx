
import { Layout } from "@/components/layout/Layout";
import { QuizList } from "@/components/quiz/QuizList";
import { StagiaireQuizList } from "@/components/quiz/StagiaireQuizList";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/quiz/CategoryService";
import { Loader2, WifiOff, BookOpen, Medal, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function Quizzes() {
  const isOnline = useOnlineStatus();
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["quiz-categories"],
    queryFn: () => categoryService.getCategories(),
    enabled: !!localStorage.getItem('token') && isOnline
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const features = [
    {
      title: "2 points par bonne réponse",
      description: "Gagnez des points à chaque bonne réponse donnée",
      icon: Star,
      color: "bg-amber-100 text-amber-600"
    },
    {
      title: "Bonus de combo",
      description: "Répondez correctement à plusieurs questions d'affilée pour des points bonus",
      icon: Medal,
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      title: "Quiz thématiques",
      description: "Testez vos connaissances sur différents sujets",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {!isOnline && (
          <Alert variant="destructive" className="mb-4">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>Vous êtes hors ligne</AlertTitle>
            <AlertDescription>
              Certaines fonctionnalités peuvent être limitées. Vous pourrez toujours accéder aux quiz que vous avez déjà chargés.
            </AlertDescription>
          </Alert>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4">Quiz disponibles</h1>
          <p className="text-gray-600 mb-6">
            Découvrez nos quiz interactifs pour tester vos connaissances et améliorer vos compétences
          </p>
        </motion.div>

        {/* New feature highlight section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className={`${feature.color} p-3 rounded-lg`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {categoriesLoading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="tous-quizzes" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mes-quizzes">Mes Quiz</TabsTrigger>
              <TabsTrigger value="tous-quizzes">Tous les Quiz</TabsTrigger>
            </TabsList>
            <TabsContent value="mes-quizzes" className="animate-in fade-in-50">
              <StagiaireQuizList />
            </TabsContent>
            <TabsContent value="tous-quizzes" className="animate-in fade-in-50">
              <QuizList />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
