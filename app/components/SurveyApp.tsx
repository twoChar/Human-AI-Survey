'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Check } from 'lucide-react';
import Hero from './Hero';
import SurveyOptions from './SurveyOptions';
import Result from './Result';
import styles from './SurveyApp.module.css';


const QUESTIONS = [
    { id: 1, text: "Who do you trust more with decisions?" },
    { id: 2, text: "Who understands emotions better?" },
    { id: 3, text: "Who should create art?" },
    { id: 4, text: "Who learns faster?" },
    { id: 5, text: "Who should lead teams?" },
    { id: 6, text: "Who makes fewer mistakes?" },
    { id: 7, text: "Who adapts better to change?" },
    { id: 8, text: "Who should teach children?" },
    { id: 9, text: "Who should diagnose problems?" },
    { id: 10, text: "Who shapes the future?" },
];

// Insights removed

export default function SurveyApp() {
    // Store answers as an array of 'human' | 'ai' | null
    const [answers, setAnswers] = useState<('human' | 'ai' | null)[]>(Array(QUESTIONS.length).fill(null));
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(0);

    // Calculate scores derived from answers
    const humanScore = answers.filter(a => a === 'human').length;
    const aiScore = answers.filter(a => a === 'ai').length;

    const handleAnswer = (choice: 'human' | 'ai') => {
        setDirection(1);
        const newAnswers = [...answers];
        newAnswers[step] = choice;
        setAnswers(newAnswers);

        // Auto-advance
        if (step < QUESTIONS.length) {
            setTimeout(() => {
                setStep(prev => Math.min(prev + 1, QUESTIONS.length));
            }, 300);
        }
    };

    const handleManualNav = (dir: 'next' | 'prev') => {
        if (dir === 'prev') {
            setDirection(-1);
            setStep(prev => Math.max(0, prev - 1));
        } else {
            setDirection(1);
            // Allow next only if current step is answered or it's not the end
            setStep(prev => Math.min(QUESTIONS.length, prev + 1));
        }
    };

    const jumpToStep = (index: number) => {
        setDirection(index > step ? 1 : -1);
        setStep(index);
    };

    const restart = () => {
        setAnswers(Array(QUESTIONS.length).fill(null));
        setStep(0);
    };

    const isResult = step >= QUESTIONS.length;

    // Keyboard navigation support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isResult) return;

            switch (e.key) {
                case 'ArrowLeft':
                    handleManualNav('prev');
                    break;
                case 'ArrowRight':
                    handleManualNav('next');
                    break;
                case '1':
                case 'h':
                case 'H':
                    handleAnswer('human');
                    break;
                case '2':
                case 'a':
                case 'A':
                    handleAnswer('ai');
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [step, answers, isResult]);
    const canGoNext = step < QUESTIONS.length && (step < QUESTIONS.length - 1 || answers[step]);

    return (
        <div className={styles.container}>
            {/* Ambient Background */}
            <div className={styles.ambientBackground}>
                {/* Patterns */}
                <div className={styles.patternHuman} />
                <div className={styles.patternAi} />

                <div className={styles.ambientOrbHuman} />
                <div className={styles.ambientOrbAi} />
                <div className={styles.bottomGlow} />
                <div className={styles.particles} />
            </div>

            <div className={styles.heroSection}>
                <Hero
                    humanScore={humanScore}
                    aiScore={aiScore}
                    total={isResult && (humanScore + aiScore) > 0 ? (humanScore + aiScore) : QUESTIONS.length}
                />
            </div>

            {/* 30% Height Section: Interaction Controls */}
            <div className={styles.controlsSection}>
                <AnimatePresence mode="popLayout" custom={direction}>
                    {!isResult ? (
                        <div className={styles.contentWrapper}>
                            {/* Question & Options */}
                            <div className={styles.questionViewport}>
                                <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                                    <SurveyOptions
                                        key={step}
                                        question={QUESTIONS[step]}
                                        onAnswer={handleAnswer}
                                        direction={direction}
                                    />
                                </AnimatePresence>
                            </div>

                            {/* Progress & Navigation */}
                            <div className={styles.bottomNav}>
                                <button
                                    onClick={restart}
                                    className={styles.resetButton}
                                    title="Reset Survey"
                                >
                                    <RotateCcw size={20} />
                                </button>

                                <div className={styles.navGroup}>
                                    <button
                                        onClick={() => handleManualNav('prev')}
                                        disabled={step === 0}
                                        className={styles.bottomNavButton}
                                    >
                                        <ChevronLeft size={24} />
                                    </button>

                                    <button
                                        onClick={() => handleManualNav('next')}
                                        disabled={step === QUESTIONS.length - 1 && !answers[step]} // Only disable if on last q and unanswered? Or if physically at end?
                                    // User said "keep arrow close", usually Prev/Next are pair.
                                    // If we are at the end, Next should probably do nothing or be disabled?
                                    // Let's disable if at the very end (step === QUESTIONS.length, which is result) - wait, this view isn't shown at result.
                                    // So disable if step === QUESTIONS.length - 1 (last question) OR if current not answered?
                                    // Actually, if we have a Submit button always, Next can just go to next question.
                                    // If at last question, Next is disabled.
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => setStep(QUESTIONS.length)}
                                    className={styles.submitButton}
                                    title="Submit Survey"
                                // Always visible, maybe disabled if no answers? 
                                // User requests "keep submit button also, not only on last one"
                                >
                                    <Check size={24} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={styles.resultWrapper}
                        >
                            <Result
                                humanScore={humanScore}
                                aiScore={aiScore}
                                onRestart={restart}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
