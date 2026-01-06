'use client';

import styles from './Result.module.css';
import { motion } from 'framer-motion';

interface ResultProps {
    humanScore: number;
    aiScore: number;
    onRestart: () => void;
}

export default function Result({ humanScore, aiScore, onRestart }: ResultProps) {
    const total = humanScore + aiScore;
    const humanPercent = Math.round((humanScore / total) * 100);
    const aiPercent = Math.round((aiScore / total) * 100);

    const dominant = humanScore > aiScore ? 'Human' : aiScore > humanScore ? 'AI' : 'Balanced';

    return (
        <div className={styles.container}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h1 className={styles.title}>
                    Your balance leans toward <span className={dominant === 'Human' ? styles.humanText : dominant === 'AI' ? styles.aiText : styles.hybridText}>{dominant}</span>
                </h1>
                <p className={styles.subtitle}>
                    {humanPercent}% Human &nbsp;•&nbsp; {aiPercent}% AI
                </p>

                <div className={styles.actions}>
                    <button onClick={onRestart} className={styles.restartBtn}>
                        Restart Journey
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
