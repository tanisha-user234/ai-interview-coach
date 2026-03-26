"use client";

import QuizInterface from "../components/QuizInterface";

const mockQuestions = [
    {
        id: 1,
        question: "If A can do a piece of work in 10 days and B in 15 days, how long will they take to finish it together?",
        options: ["5 days", "6 days", "8 days", "12 days"],
        correctAnswer: 1, // 6 days
    },
    {
        id: 2,
        question: "Which data structure uses LIFO (Last In First Out) principle?",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        correctAnswer: 1,
    },
    {
        id: 3,
        question: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?",
        options: ["(1/3)", "(1/8)", "(2/8)", "(1/16)"],
        correctAnswer: 1,
    },
];

export default function FundamentalsRound() {
    return (
        <div className="min-h-screen py-12">
            <QuizInterface
                title="Fundamentals: Aptitude & Logic"
                questions={mockQuestions}
                onComplete={(score) => console.log("Done", score)}
            />
        </div>
    );
}
