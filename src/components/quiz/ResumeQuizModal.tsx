import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from "@mui/material";
import { Quiz as QuizIcon, Close as CloseIcon } from "@mui/icons-material";

interface ResumeQuizModalProps {
    open: boolean;
    quizTitle: string;
    questionCount: number;
    currentProgress: number;
    onResume: () => void;
    onDismiss: () => void;
}

export const ResumeQuizModal = ({
    open,
    quizTitle,
    questionCount,
    currentProgress,
    onResume,
    onDismiss,
}: ResumeQuizModalProps) => {
    const progressPercentage = questionCount > 0
        ? Math.round((currentProgress / questionCount) * 100)
        : 0;

    return (
        <Dialog
            open={open}
            onClose={onDismiss}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    p: 1,
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    pb: 1,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        color: "white",
                    }}
                >
                    <QuizIcon />
                </Box>
                <Typography variant="h6" component="div" sx={{ flex: 1 }}>
                    Quiz en cours
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ pb: 2 }}>
                <Typography variant="body1" gutterBottom>
                    Vous avez un quiz non terminé :
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: "primary.main",
                        mb: 2,
                        mt: 1,
                    }}
                >
                    {quizTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Progression : {currentProgress} / {questionCount} questions ({progressPercentage}%)
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Voulez-vous reprendre où vous vous étiez arrêté ?
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                <Button
                    onClick={onDismiss}
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    sx={{ flex: { xs: 1, sm: 0 } }}
                >
                    Ignorer
                </Button>
                <Button
                    onClick={onResume}
                    variant="contained"
                    startIcon={<QuizIcon />}
                    sx={{ flex: { xs: 1, sm: 0 } }}
                >
                    Reprendre le quiz
                </Button>
            </DialogActions>
        </Dialog>
    );
};
