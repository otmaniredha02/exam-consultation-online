"use client";

import { consultationAtom } from "@/app/context/consultation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface Question {
  statement: string;
  points: number;
  question_index: number;
  parent_exercice_index: number;
}

interface Exercice {
  name: string;
  index: number;
  questions: Question[];
}

export default function Grading() {
    const [consultation,setConsultation] = useAtom(consultationAtom);
    const [exo, setExo] = useState<Exercice[]>([
        {
        index: 0,
        name: "Exercice 1",
        questions: [
            {
            parent_exercice_index: 0,
            question_index: 0,
            statement: "Question 1",
            points: 2,
            },
        ],
        },
        {
        index: 1,
        name: "Exercice 2",
        questions: [
            {
            parent_exercice_index: 1,
            question_index: 0,
            statement: "Question 1",
            points: 2,
            },
            {
            parent_exercice_index: 1,
            question_index: 1,
            statement: "Question 2",
            points: 3,
            },
        ],
        },
    ]);

    const [editing, setEditing] = useState<{
        exerciseIndex: number;
        questionIndex: number;
    } | null>(null);

     // =============================================
    // useEffect to update gradings in consulation form
    // ==============================================
    useEffect(()=>{
        setConsultation((consultation) => {
            let temp = consultation;
            temp.gradings = exo
            return temp;
        })
        console.log(consultation);
    },[exo]);
    // ===========================
    // Exercise Functions
    // ===========================

    const addExercise = (name: string) => {
        if (!name.trim()) return;

        setExo((prev) => {
        const nextIndex =
            prev.length === 0
            ? 0
            : Math.max(...prev.map((e) => e.index)) + 1;

        return [
            ...prev,
            {
            index: nextIndex,
            name,
            questions: [],
            },
        ];
        });
    };

    const deleteExercise = (exerciseIndex: number) => {
        setExo((prev) =>
        prev.filter((exercise) => exercise.index !== exerciseIndex)
        );
    };

    // ===========================
    // Question Functions
    // ===========================

    const addQuestion = (exerciseIndex: number, statement: string) => {
        if (!statement.trim()) return;

        setExo((prev) =>
        prev.map((exercise) => {
            if (exercise.index !== exerciseIndex) return exercise;

            const nextQuestionIndex =
            exercise.questions.length === 0
                ? 0
                : Math.max(
                    ...exercise.questions.map((q) => q.question_index)
                ) + 1;

            return {
            ...exercise,
            questions: [
                ...exercise.questions,
                {
                statement,
                points: 0,
                question_index: nextQuestionIndex,
                parent_exercice_index: exerciseIndex,
                },
            ],
            };
        })
        );
    };

    const deleteQuestion = (
        exerciseIndex: number,
        questionIndex: number
    ) => {
        setExo((prev) =>
        prev.map((exercise) =>
            exercise.index === exerciseIndex
            ? {
                ...exercise,
                questions: exercise.questions.filter(
                    (q) => q.question_index !== questionIndex
                ),
                }
            : exercise
        )
        );

        if (
        editing?.exerciseIndex === exerciseIndex &&
        editing.questionIndex === questionIndex
        ) {
        setEditing(null);
        }
    };

    const updateQuestion = (
        exerciseIndex: number,
        questionIndex: number,
        field: "statement" | "points",
        value: string
    ) => {
        setExo((prev) =>
        prev.map((exercise) =>
            exercise.index === exerciseIndex
            ? {
                ...exercise,
                questions: exercise.questions.map((question) =>
                    question.question_index === questionIndex
                    ? {
                        ...question,
                        [field]:
                            field === "points"
                            ? Number(value)
                            : value,
                        }
                    : question
                ),
                }
            : exercise
        )
        );
    };

    return (
        <div className="space-y-6 p-6">
        <Input
            placeholder="Add Exercise"
            onKeyDown={(e) => {
            if (e.key !== "Enter") return;

            e.preventDefault();

            addExercise(e.currentTarget.value);

            e.currentTarget.value = "";
            }}
        />

        {exo.map((exercise) => (
            <div
            key={exercise.index}
            className="border rounded-lg p-4 space-y-4"
            >
            <div className="flex justify-between items-center">
                <h2 className="font-bold">{exercise.name}</h2>

                <TrashIcon
                className="cursor-pointer"
                onClick={() => deleteExercise(exercise.index)}
                />
            </div>

            <Input
                placeholder="Add Question"
                onKeyDown={(e) => {
                if (e.key !== "Enter") return;

                e.preventDefault();

                addQuestion(
                    exercise.index,
                    e.currentTarget.value
                );

                e.currentTarget.value = "";
                }}
            />

            {exercise.questions.map((question) => {
                const isEditing =
                editing?.exerciseIndex === exercise.index &&
                editing.questionIndex === question.question_index;

                return (
                <div
                    key={question.question_index}
                    className="flex gap-3 items-center"
                >
                    {isEditing ? (
                    <>
                        <Input
                        value={question.statement}
                        onChange={(e) =>
                            updateQuestion(
                            exercise.index,
                            question.question_index,
                            "statement",
                            e.target.value
                            )
                        }
                        />

                        <Input
                        type="number"
                        className="w-24"
                        value={question.points}
                        onChange={(e) =>
                            updateQuestion(
                            exercise.index,
                            question.question_index,
                            "points",
                            e.target.value
                            )
                        }
                        />

                        <Button
                        onClick={() => setEditing(null)}
                        >
                        Save
                        </Button>
                    </>
                    ) : (
                    <>
                        <div className="flex-1">
                        {question.statement} ({question.points} pts)
                        </div>

                        <Button
                        onClick={() =>
                            setEditing({
                            exerciseIndex: exercise.index,
                            questionIndex:
                                question.question_index,
                            })
                        }
                        >
                        Edit
                        </Button>

                        <TrashIcon
                        className="cursor-pointer"
                        onClick={() =>
                            deleteQuestion(
                            exercise.index,
                            question.question_index
                            )
                        }
                        />
                    </>
                    )}
                </div>
                );
            })}
            </div>
        ))}
        </div>
    );
}