'use client';

import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import styles from './Hero.module.css';

interface HeroProps {
    humanScore: number;
    aiScore: number;
    total: number;
    winner?: 'human' | 'ai' | null;
}

export default function Hero({ humanScore, aiScore, total, winner }: HeroProps) {
    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseXPos = (event.clientX - rect.left) / width - 0.5;
        const mouseYPos = (event.clientY - rect.top) / height - 0.5;

        x.set(mouseXPos);
        y.set(mouseYPos);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const humanHeight = total > 0 ? (humanScore / total) * 100 : 0;
    const aiHeight = total > 0 ? (aiScore / total) * 100 : 0;

    return (
        <div
            className={styles.heroWrapper}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                className={styles.innerContainer}
                style={{ rotateX, rotateY }}
            >
                {/* Base Split Image */}
                <motion.div
                    animate={{ opacity: winner ? 0 : 1 }}
                    transition={{ duration: 1.5 }}
                    style={{ position: 'relative', width: '100%', height: '100%' }}
                >
                    <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/hero-face-3d.png`}
                        alt="Human vs AI"
                        fill
                        className={styles.faceImage}
                        priority
                    />

                    {/* Fill Layers (Bars) - Fade out if winner decided */}
                    <motion.div
                        className={styles.fillLayer}
                        animate={{ opacity: winner ? 0 : 1 }}
                        transition={{ duration: 1 }}
                    >
                        <div className={styles.humanCol}>
                            <motion.div
                                className={styles.humanFill}
                                initial={{ height: 0 }}
                                animate={{ height: `${humanHeight}%` }}
                                transition={{ type: "spring", stiffness: 40, damping: 15, mass: 1.2 }}
                            />
                            <div className={styles.blurSegment} />
                        </div>
                        <div className={styles.aiCol}>
                            <motion.div
                                className={styles.aiFill}
                                initial={{ height: 0 }}
                                animate={{ height: `${aiHeight}%` }}
                                transition={{ type: "spring", stiffness: 40, damping: 15, mass: 1.2 }}
                            />
                            <div className={styles.blurSegment} />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Winner Reveal Overlays */}
                <AnimatePresence>
                    {winner === 'human' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 3, ease: "easeInOut" }}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 50 }}
                        >
                            <Image
                                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/human-winner.png`}
                                alt="Human Winner"
                                fill
                                className={styles.faceImage}
                                priority
                            />
                        </motion.div>
                    )}
                    {winner === 'ai' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 3, ease: "easeInOut" }}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 50 }}
                        >
                            <Image
                                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/ai-winner.png`}
                                alt="AI Winner"
                                fill
                                className={styles.faceImage}
                                priority
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
