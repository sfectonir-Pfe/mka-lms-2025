import React, { useEffect, useState } from "react";
import AddQuizForm from "./AddQuizForm"; // Reuse logic (or copy/paste structure if needed)
import axios from "axios";
import { useParams } from "react-router-dom";

const EditQuizForm = () => {
  const { contenuId } = useParams();
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/quizzes/by-contenu/${contenuId}`);
        setQuizData({
          timeLimitMinutes: res.data.timeLimit / 60,
          questions: res.data.questions,
        });
      } catch (err) {
        console.error("Erreur de chargement du quiz", err);
        alert("❌ Erreur lors du chargement du quiz.");
      }
    };

    fetchQuiz();
  }, [contenuId]);

  if (!quizData) return <p>⏳ Chargement du quiz...</p>;

  return (
    <AddQuizForm
      initialTimeLimit={quizData.timeLimitMinutes}
      initialQuestions={quizData.questions}
      contenuId={contenuId}
      editMode
    />
  );
};

export default EditQuizForm;
