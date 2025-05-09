import { Layout } from "@/components/layout/Layout";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, PenTool, FileText, MessageSquare, Globe, WifiOff, BookOpen } from "lucide-react";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { CategoryCard } from "@/components/dashboard/CategoryCard";
import { AgendaCard } from "@/components/dashboard/AgendaCard";
import { useLoadQuizData } from "@/use-case/hooks/profile/useLoadQuizData";
import { useLoadRankings } from "@/use-case/hooks/profile/useLoadRankings";
import { categories, agendaEvents } from "@/data/mockData";
import StatsSummary from "@/components/profile/StatsSummary";
import ContactsSection  from "@/components/profile/ContactsSection";
import ParrainageSection  from "@/components/profile/ParrainageSection";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Index() {
  const { user } = useUser();
  const { userProgress } = useLoadRankings();
  const isOnline = useOnlineStatus();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  const featuredFormations = [
    {
      id: "f1",
      title: "Bureautique avancée",
      description: "Maîtrisez les outils bureautiques modernes",
      image: "/placeholder.svg",
      category: "Bureautique",
      color: "bg-bureautique",
      icon: FileText
    },
    {
      id: "f2",
      title: "Communication professionnelle",
      description: "Améliorez vos compétences en langues étrangères",
      image: "/placeholder.svg",
      category: "Langues",
      color: "bg-langues",
      icon: MessageSquare
    },
    {
      id: "f3",
      title: "Design graphique",
      description: "Apprenez les bases de la création visuelle",
      image: "/placeholder.svg",
      category: "Création",
      color: "bg-creation",
      icon: PenTool
    }
  ];

  if (!user) {
    return (
      <Layout>
        {!isOnline && (
          <Alert variant="destructive" className="mb-4 mx-4 mt-4">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>Vous êtes hors ligne</AlertTitle>
            <AlertDescription>
              Certaines fonctionnalités peuvent être limitées. Les données affichées peuvent ne pas être à jour.
            </AlertDescription>
          </Alert>
        )}
        <div className="bg-gradient-to-b from-white to-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold font-astria leading-tight">
                  Apprenez de façon interactive et ludique
                </h1>
                <p className="text-lg text-gray-600">
                  Bienvenue sur Wizi Learn, la plateforme de quiz éducatifs pour nos stagiaires. Testez vos connaissances, suivez votre progression et développez vos compétences professionnelles.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link to="/login">
                      Commencer maintenant
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-64 h-64 bg-bureautique/20 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-creation/20 rounded-full blur-3xl"></div>
                  <div className="relative bg-white p-6 rounded-xl shadow-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-bureautique/10 p-4 rounded-lg flex items-center gap-3">
                        <div className="bg-bureautique text-white p-2 rounded-md">
                          <FileText className="h-5 w-5" />
                        </div>
                        <span className="font-medium">Bureautique</span>
                      </div>
                      <div className="bg-langues/10 p-4 rounded-lg flex items-center gap-3">
                        <div className="bg-langues text-white p-2 rounded-md">
                          <MessageSquare className="h-5 w-5" />
                        </div>
                        <span className="font-medium">Langues</span>
                      </div>
                      <div className="bg-internet/10 p-4 rounded-lg flex items-center gap-3">
                        <div className="bg-internet text-black p-2 rounded-md">
                          <Globe className="h-5 w-5" />
                        </div>
                        <span className="font-medium">Internet</span>
                      </div>
                      <div className="bg-creation/10 p-4 rounded-lg flex items-center gap-3">
                        <div className="bg-creation text-white p-2 rounded-md">
                          <PenTool className="h-5 w-5" />
                        </div>
                        <span className="font-medium">Création</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nos catégories de formations</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Découvrez notre large éventail de formations pour développer vos compétences professionnelles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Comment ça marche</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Une approche simple et efficace pour améliorer vos compétences grâce à notre plateforme de quiz.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-bureautique/10 text-bureautique rounded-full flex items-center justify-center mb-4">
                  <span className="font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Choisissez un quiz</h3>
                <p className="text-gray-600">
                  Sélectionnez parmi nos quiz, suivant votre formation.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-langues/10 text-langues rounded-full flex items-center justify-center mb-4">
                  <span className="font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Testez vos connaissances</h3>
                <p className="text-gray-600">
                  Répondez aux questions dans différents formats: QCM, vrai/faux, remplir les blancs et plus encore.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-creation/10 text-creation rounded-full flex items-center justify-center mb-4">
                  <span className="font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Suivez votre progression</h3>
                <p className="text-gray-600">
                  Consultez vos statistiques, comparez vos performances et remportez des défis pour gagner des points.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // User dashboard
  return (
    <Layout>
      {!isOnline && (
        <Alert variant="destructive" className="mb-4 mx-4 mt-4">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Vous êtes hors ligne</AlertTitle>
          <AlertDescription>
            Certaines fonctionnalités peuvent être limitées. Les données affichées peuvent ne pas être à jour.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold"
          >
            Tableau de bord
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button asChild>
              <Link to="/quizzes">
                Voir les quiz
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Stats summary */}
        {userProgress && 
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mt-8"
          >
            <StatsSummary userProgress={userProgress} />
          </motion.div>
        }
        
        {/* Featured catalog as embedded promotion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="my-10"
        >
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Formations à découvrir</h2>
            <Button variant="outline" asChild size="sm">
              <Link to="/catalogue">
                Voir tout
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredFormations.map((formation) => (
              <motion.div 
                key={formation.id}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group"
              >
                <Card className="overflow-hidden h-full hover:shadow-md transition-shadow duration-200">
                  <div className="relative h-40">
                    <img
                      src={formation.image}
                      alt={formation.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className={`${formation.color} text-white`}>
                        {formation.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`${formation.color} p-2 rounded-md text-white mt-1`}>
                        <formation.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                          {formation.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formation.description}
                        </p>
                        <Link 
                          to="/catalogue" 
                          className="text-sm mt-3 inline-block text-primary hover:underline"
                        >
                          En savoir plus
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ProgressCard user={user} />
          <AgendaCard events={agendaEvents} />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <ContactsSection />
        </div>
        
        <ParrainageSection />
      </div>
    </Layout>
  );
}
