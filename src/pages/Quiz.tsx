import React from "react";
import { Layout } from "@/components/layout/Layout";
import { QuizPlay } from "@/components/quiz/QuizPlay";

const Quiz = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <QuizPlay />
      </div>
    </Layout>
  );
};

export default Quiz;
