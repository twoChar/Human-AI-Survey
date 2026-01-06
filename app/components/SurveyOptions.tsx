'use client';

import { motion } from 'framer-motion';
import styles from './SurveyOptions.module.css';

interface Question {
    id: number;
    text: string;
}

interface SurveyOptionsProps {
    question: Question;
    userAnswer: 'human' | 'ai' | null;
    onAnswer: (type: 'human' | 'ai') => void;
}

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '100vw' : '-100vw',
        opacity: 0
    }),
    center: {
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => ({
        x: direction > 0 ? '-100vw' : '100vw',
        opacity: 0
    })
};

const KEYWORDS = ["trust", "emotions", "art", "learns", "lead", "mistakes", "adapts", "teach", "diagnose", "shapes", "decides", "creates", "future"];

export default function SurveyOptions({ question, onAnswer, direction, userAnswer }: SurveyOptionsProps & { direction: number }) {

    // Helper to get button style
    const getButtonStyle = (type: 'human' | 'ai') => {
        if (!userAnswer) return {}; // Default state

        const isSelected = userAnswer === type;
        const isCorrect = (question as any).correct === type;

        // If this button is the Correct one
        if (isCorrect) {
            return {
                borderColor: '#22c55e', // Green
                background: 'rgba(34, 197, 94, 0.2)',
                boxShadow: '0 0 30px rgba(34, 197, 94, 0.4)'
            };
        }

        // If this button was Selected but is Wrong
        if (isSelected && !isCorrect) {
            return {
                borderColor: '#ef4444', // Red
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444'
            };
        }

        // Unselected and Wrong (faded out)
        return { opacity: 0.3, transform: 'scale(0.95)' };
    };

    const renderTitle = (text: string) => {
        const words = text.split(" ");
        return (
            <>
                {words.map((word, i) => {
                    // Remove punctuation for matching
                    const cleanWord = word.replace(/[?.,]/g, "").toLowerCase();
                    const isKeyword = KEYWORDS.includes(cleanWord);

                    return (
                        <span key={i} style={{ display: 'inline-block', marginRight: '0.25em' }}>
                            {isKeyword ? (
                                <motion.span
                                    initial={{ opacity: 0.8, color: 'var(--text)' }}
                                    animate={{
                                        opacity: [0.8, 1, 0.8],
                                        color: ['var(--text)', '#fff', 'var(--text)'],
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    style={{
                                        display: 'inline-block',
                                    }}
                                >
                                    {word}
                                </motion.span>
                            ) : word}
                        </span>
                    );
                })}
            </>
        );
    };

    return (
        <motion.div
            className={styles.container}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
                x: { type: "tween", ease: "easeInOut", duration: 0.8 },
                opacity: { duration: 0.5 }
            }}
        >
            <h2 className={styles.question}>
                {renderTitle(question.text)}
            </h2>

            <div className={styles.buttons}>
                <motion.button
                    className={`${styles.btn} ${styles.btnHuman}`}
                    onClick={() => !userAnswer && onAnswer('human')}
                    animate={getButtonStyle('human')}
                    whileHover={!userAnswer ? { scale: 1.05, boxShadow: "0 0 20px var(--human-glow)" } : {}}
                    whileTap={!userAnswer ? { scale: 0.95 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    disabled={!!userAnswer}
                >
                    Human
                </motion.button>

                <motion.button
                    className={`${styles.btn} ${styles.btnAi}`}
                    onClick={() => !userAnswer && onAnswer('ai')}
                    animate={getButtonStyle('ai')}
                    whileHover={!userAnswer ? { scale: 1.05, boxShadow: "0 0 20px var(--robot-glow)" } : {}}
                    whileTap={!userAnswer ? { scale: 0.95 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    disabled={!!userAnswer}
                >
                    AI
                </motion.button>
            </div>
        </motion.div>
    );
}
