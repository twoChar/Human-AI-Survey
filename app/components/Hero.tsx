'use client';

import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import styles from './Hero.module.css';

interface HeroProps {
    humanScore: number;
    aiScore: number;
    total: number;
}

export default function Hero({ humanScore, aiScore, total }: HeroProps) {
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

        // Calculate normalized position (-0.5 to 0.5)
        const mouseXPos = (event.clientX - rect.left) / width - 0.5;
        const mouseYPos = (event.clientY - rect.top) / height - 0.5;

        x.set(mouseXPos);
        y.set(mouseYPos);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    // Calculate fill percentage
    // Ensure meaningful visual even at 0 (start dry)
    const humanHeight = (humanScore / total) * 100;
    const aiHeight = (aiScore / total) * 100;

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
                {/* The new high-res 3D Image */}
                <Image
                    src="/Human-AI-Survey/hero-face-3d.png"
                    alt="Human vs AI"
                    fill
                    className={styles.faceImage}
                    priority
                />


                {/* The fill overlay - now with liquid-like spring physics */}
                <div className={styles.fillLayer}>
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
                </div>
            </motion.div>
        </div>
    );
}
