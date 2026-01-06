'use client';

import { motion } from 'framer-motion';
import styles from './SurveyOptions.module.css';

interface Question {
    id: number;
    text: string;
}

interface SurveyOptionsProps {
    question: Question;
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

export default function SurveyOptions({ question, onAnswer, direction }: SurveyOptionsProps & { direction: number }) {

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
                                        textDecoration: 'underline',
                                        textDecorationColor: 'rgba(255,255,255,0.3)',
                                        textUnderlineOffset: '4px'
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
                    onClick={() => onAnswer('human')}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px var(--human-glow)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    Human
                </motion.button>

                <motion.button
                    className={`${styles.btn} ${styles.btnAi}`}
                    onClick={() => onAnswer('ai')}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px var(--robot-glow)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    AI
                </motion.button>
            </div>
        </motion.div>
    );
}
