'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Check } from 'lucide-react';
import Hero from './Hero';
import SurveyOptions from './SurveyOptions';
import Result from './Result';
import styles from './SurveyApp.module.css';


const QUESTIONS: { id: number; text: string; correct: 'human' | 'ai'; explanation: string }[] = [
    {
        id: 1,
        text: "Who will identify and mitigate business risks from chip shortages, export bans?",
        correct: 'ai',
        explanation: "Predictive AI models and Large Language Models are much better at identifying trends and produce forecasts due to large processing capabilities and access to large data."
    },
    {
        id: 2,
        text: "Who benefits more from experience learning and improves performance over time?",
        correct: 'ai',
        explanation: "Deep Learning AI is highly efficient at experience learning and improving performance over time."
    },
    {
        id: 3,
        text: "Who should have the last word on an ethically grey but very profitable deal?",
        correct: 'human',
        explanation: "An analysis of ethical guidelines and identifying appropriate guidance is a creative activity limited to humans."
    },
    {
        id: 4,
        text: "Who should take the final call when data and your gut completely disagree on big capex?",
        correct: 'ai',
        explanation: "Objective data analysis is part of any efficient decision-making process. Gut feeling and other subjective inputs potentially introduce bias."
    },
    {
        id: 5,
        text: "Who would be a better observer member of committee and board meetings?",
        correct: 'human',
        explanation: "Key managerial decisions require a keen understanding of human psychology to fully understand their impacts. AI can analyse objective data, however, it may prove ineffective in considering and incorporating human elements in its decisions."
    },
    {
        id: 6,
        text: "Who is more dramatic during month end?",
        correct: 'human',
        explanation: "While working with AI may have its own peculiarities, Humans are driven by subjective thought and actions much more than AI. As such, Humans are more dramatic."
    },
    {
        id: 7,
        text: "Who would identify shop floor secrets faster?",
        correct: 'human',
        explanation: "Pattern recognition in context of problems and solutions are a highly human sense. An AI would likely struggle with identifying the same."
    }
];

// Insights removed

export default function SurveyApp() {
    const [answers, setAnswers] = useState<('human' | 'ai' | null)[]>(Array(QUESTIONS.length).fill(null));
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(0);

    // Intro Flow States
    const [gameStatus, setGameStatus] = useState<'intro' | 'scanning' | 'playing'>('intro');

    // Calculate scores: "Increase the bar for the correct option"
    // As the user answers, simply fill the bar corresponding to the 'Correct' answer.
    // The visual effectively reveals the "True" balance as they progress.
    let humanScoreRaw = 0;
    let aiScoreRaw = 0;

    answers.forEach((ans) => {
        if (ans === 'human') {
            humanScoreRaw += 1;
        } else if (ans === 'ai') {
            aiScoreRaw += 1;
        }
    });

    // Derived props for Hero to handle animations
    let heroHumanScore = humanScoreRaw;
    let heroAiScore = aiScoreRaw;
    // Total should probably be the max possible score for relative sizing? 
    // Or just the number of questions relevant to that side?
    // Let's keep Total as "Questions Length" for now so 100% is all correct.
    let heroTotal = QUESTIONS.length;

    if (gameStatus === 'intro') {
        // Fully filled (Clear)
        heroHumanScore = 1;
        heroAiScore = 1;
        heroTotal = 1;
    } else if (gameStatus === 'scanning') {
        // Target state for scan: 0 (Fully Blurred)
        heroHumanScore = 0;
        heroAiScore = 0;
        heroTotal = 1;
    }

    const handleStart = () => {
        setGameStatus('scanning');
        // Allow time for the "down to up" blur animation (spring) to visually complete
        setTimeout(() => {
            setGameStatus('playing');
        }, 2000);
    };

    const handleAnswer = useCallback((choice: 'human' | 'ai') => {
        setDirection(1);
        setAnswers(prevAnswers => {
            const newAnswers = [...prevAnswers];
            newAnswers[step] = choice;
            return newAnswers;
        });

        // Auto-advance - we need to see the latest step here, but step is in dependency if we use it directly.
        // using function form for setStep is better, but the condition `if (step < QUESTIONS.length)` uses current step.
        // Actually, let's just allow `handleAnswer` to depend on `step`.

        if (step < QUESTIONS.length) {
            setTimeout(() => {
                setStep(prev => Math.min(prev + 1, QUESTIONS.length));
            }, 1500);
        }
    }, [step]);

    const handleManualNav = useCallback((dir: 'next' | 'prev') => {
        if (dir === 'prev') {
            setDirection(-1);
            setStep(prev => Math.max(0, prev - 1));
        } else {
            setDirection(1);
            // Allow next only if current step is answered or it's not the end
            setStep(prev => Math.min(QUESTIONS.length, prev + 1));
        }
    }, []);



    const restart = () => {
        setAnswers(Array(QUESTIONS.length).fill(null));
        setStep(0);
        setGameStatus('intro');
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
    }, [isResult, handleManualNav, handleAnswer]);

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
                    humanScore={heroHumanScore}
                    aiScore={heroAiScore}
                    total={isResult && (humanScoreRaw + aiScoreRaw) > 0 ? (humanScoreRaw + aiScoreRaw) : heroTotal}
                    winner={isResult ? (humanScoreRaw > aiScoreRaw ? 'human' : aiScoreRaw > humanScoreRaw ? 'ai' : null) : null}
                />
            </div>

            {/* 30% Height Section: Interaction Controls */}
            <div className={styles.controlsSection}>
                <AnimatePresence mode="popLayout" custom={direction}>
                    {gameStatus === 'intro' ? (
                        <motion.div
                            className={styles.startOverlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <button onClick={handleStart} className={styles.startButton}>
                                Start Journey
                            </button>
                        </motion.div>
                    ) : null}

                    {gameStatus === 'playing' && !isResult ? (
                        <div className={styles.contentWrapper}>
                            {/* Question & Options */}
                            <div className={styles.questionViewport}>
                                <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                                    <SurveyOptions
                                        key={step}
                                        question={QUESTIONS[step]}
                                        userAnswer={answers[step]}
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
                                        disabled={step === QUESTIONS.length - 1 && !answers[step]}
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => setStep(QUESTIONS.length)}
                                    className={styles.submitButton}
                                    title="Submit Survey"
                                >
                                    <Check size={24} />
                                </button>
                            </div>
                        </div>
                    ) : null}

                    {isResult && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={styles.resultWrapper}
                        >
                            <Result
                                humanScore={humanScoreRaw}
                                aiScore={aiScoreRaw}
                                onRestart={restart}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
