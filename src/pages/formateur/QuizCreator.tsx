import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  TextField,
  MenuItem,
  IconButton,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Publish as PublishIcon,
} from "@mui/icons-material";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type QuizListItem = {
  id: number;
  titre: string;
  description?: string;
  duree?: number | string;
  niveau?: string;
  status?: string;
  nb_questions?: number;
};

type QuizQuestion = {
  id: number;
  question: string;
  type: string;
  reponses: { id?: number; reponse: string; correct: boolean }[];
};

type QuizDetail = {
  quiz: QuizListItem;
  questions: QuizQuestion[];
};

export default function QuizCreator() {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizDetail | null>(null); // Full quiz details
  const [viewQuestionsOpen, setViewQuestionsOpen] = useState(false);
  const [formations, setFormations] = useState([]);
  
  // New Quiz Form State
  const [newQuizData, setNewQuizData] = useState({
    titre: "",
    description: "",
    duree: 30,
    niveau: "debutant",
    formation_id: "",
  });

  // Question Form State
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    reponses: [
      { reponse: "", correct: false },
      { reponse: "", correct: false },
    ],
  });

  useEffect(() => {
    loadQuizzes();
    loadFormations();
  }, []);

  const loadQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/formateur/quizzes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = res.data?.data || res.data;
      setQuizzes(payload?.quizzes || payload || []);
    } catch (error) {
      console.error("Error loading quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFormations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/formateur/formations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = res.data?.data || res.data;
      setFormations(payload?.formations || payload?.data || payload || []);
    } catch (error) {
      console.error("Error loading formations:", error);
    }
  };

  const handleCreateQuiz = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/formateur/quizzes`, newQuizData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCreateDialogOpen(false);
      loadQuizzes();
      // Reset form
      setNewQuizData({
        titre: "",
        description: "",
        duree: 30,
        niveau: "debutant",
        formation_id: "",
      });
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  const handleOpenQuiz = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/formateur/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = res.data?.data || res.data;
      const quiz = payload?.quiz || payload;
      const questions = payload?.questions || quiz?.questions || [];
      setSelectedQuiz({ quiz, questions });
      setViewQuestionsOpen(true);
    } catch (error) {
      console.error("Error loading quiz details:", error);
    }
  };

  const handleDeleteQuiz = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce quiz ?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/formateur/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadQuizzes();
    } catch (error) {
      alert("Impossible de supprimer ce quiz (peut-être a-t-il des participations ?)");
    }
  };

  const handlePublishQuiz = async () => {
    if (!selectedQuiz) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/formateur/quizzes/${selectedQuiz.quiz.id}/publish`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setViewQuestionsOpen(false);
      loadQuizzes();
      alert("Quiz publié avec succès !");
    } catch (error) {
      alert("Erreur lors de la publication (vérifiez qu'il y a des questions)");
    }
  };

  const handleAddQuestion = async () => {
    if (!selectedQuiz) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/formateur/quizzes/${selectedQuiz.quiz.id}/questions`,
        {
          question: currentQuestion.text,
          type: "banque de mots", // aligné sur la payload Laravel existante
          reponses: currentQuestion.reponses,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestionDialogOpen(false);
      handleOpenQuiz(selectedQuiz.quiz.id); // Reload questions
      // Reset question form
      setCurrentQuestion({
        text: "",
        reponses: [
          { reponse: "", correct: false },
          { reponse: "", correct: false },
        ],
      });
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const updateReponse = (index: number, field: string, value: any) => {
    const newReponses = [...currentQuestion.reponses];
    // @ts-ignore
    newReponses[index][field] = value;
    setCurrentQuestion({ ...currentQuestion, reponses: newReponses });
  };

  const addReponseOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      reponses: [...currentQuestion.reponses, { reponse: "", correct: false }],
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Gestion des Quiz</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ bgcolor: "#F7931E" }}
        >
          Nouveau Quiz
        </Button>
      </Box>

      <Grid container spacing={3}>
        {quizzes.map((quiz) => (
          <Grid item xs={12} md={4} key={quiz.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {quiz.titre}
                </Typography>
                <Chip
                  label={quiz.status?.toUpperCase()}
                  size="small"
                  color={quiz.status === 'actif' ? 'success' : 'default'}
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {(quiz.nb_questions ?? 0)} questions • {quiz.niveau} • {quiz.duree} min
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
                  <IconButton onClick={() => handleOpenQuiz(quiz.id)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteQuiz(quiz.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Quiz Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Créer un nouveau quiz
          </Typography>
          <TextField
            fullWidth
            label="Titre"
            value={newQuizData.titre}
            onChange={(e) => setNewQuizData({ ...newQuizData, titre: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={2}
            value={newQuizData.description}
            onChange={(e) => setNewQuizData({ ...newQuizData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Durée (min)"
                type="number"
                value={newQuizData.duree}
                onChange={(e) => setNewQuizData({ ...newQuizData, duree: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Niveau"
                value={newQuizData.niveau}
                onChange={(e) => setNewQuizData({ ...newQuizData, niveau: e.target.value })}
              >
                <MenuItem value="debutant">Débutant</MenuItem>
                <MenuItem value="intermediaire">Intermédiaire</MenuItem>
                <MenuItem value="avance">Avancé</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <TextField
            select
            fullWidth
            label="Formation associée"
            value={newQuizData.formation_id}
            onChange={(e) => setNewQuizData({ ...newQuizData, formation_id: e.target.value })}
            sx={{ mt: 2 }}
          >
            {formations.map((f: any) => (
              <MenuItem key={f.id} value={f.id}>
                {f.nom}
              </MenuItem>
            ))}
          </TextField>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 1 }}>
            <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateQuiz} variant="contained" disabled={!newQuizData.titre}>
              Créer
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* View/Edit Questions Dialog */}
      <Dialog
        open={viewQuestionsOpen}
        onClose={() => setViewQuestionsOpen(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        {selectedQuiz && (
          <Box p={3}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h5">{selectedQuiz.quiz.titre}</Typography>
              {selectedQuiz.quiz.status !== "actif" && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<PublishIcon />}
                  onClick={handlePublishQuiz}
                >
                  Publier
                </Button>
              )}
            </Box>

            <List>
              {selectedQuiz.questions?.map((q: QuizQuestion, index: number) => (
                <Accordion key={q.id}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      {index + 1}. {q.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {q.reponses.map((r: any) => (
                        <ListItem key={r.id}>
                          <ListItemText
                            primary={r.reponse}
                            sx={{ color: r.correct ? "success.main" : "text.primary" }}
                          />
                          {r.correct && <Chip label="Correct" size="small" color="success" />}
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={async () => {
                          if (confirm("Supprimer cette question ?")) {
                            try {
                              const token = localStorage.getItem("token");
                              await axios.delete(
                                `${API_URL}/formateur/quizzes/${selectedQuiz.quiz.id}/questions/${q.id}`,
                                { headers: { Authorization: `Bearer ${token}` } }
                              );
                            } catch (err) {
                              console.error("Error deleting question:", err);
                              alert("Suppression impossible");
                            }
                            handleOpenQuiz(selectedQuiz.quiz.id); // Reload
                          }
                        }}
                      >
                        Supprimer
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setQuestionDialogOpen(true)}
              sx={{ mt: 2 }}
            >
              Ajouter une question
            </Button>
          </Box>
        )}
      </Dialog>

      {/* Add Question Dialog */}
      <Dialog open={questionDialogOpen} onClose={() => setQuestionDialogOpen(false)} maxWidth="md" fullWidth>
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Ajouter une question
          </Typography>
          <TextField
            fullWidth
            label="Intitulé de la question"
            value={currentQuestion.text}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" gutterBottom>
            Réponses
          </Typography>
          {currentQuestion.reponses.map((reponse, index) => (
            <Box key={index} sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
              <TextField
                fullWidth
                size="small"
                label={`Réponse ${index + 1}`}
                value={reponse.reponse}
                onChange={(e) => updateReponse(index, 'reponse', e.target.value)}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={reponse.correct}
                    onChange={(e) => updateReponse(index, 'correct', e.target.checked)}
                  />
                }
                label="Correct"
              />
            </Box>
          ))}
          <Button size="small" onClick={addReponseOption}>
            + Ajouter une option
          </Button>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 1 }}>
            <Button onClick={() => setQuestionDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleAddQuestion} variant="contained">
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
}
