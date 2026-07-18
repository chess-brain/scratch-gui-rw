import React, {useEffect, useState} from 'react';
import {
    ACHIEVEMENTS,
    getUnlockedAchievementIds,
    UNLOCK_EVENT,
    unlockAchievement
} from '../../lib/achievements.js';
import styles from './achievements.css';

const Achievements = ({inMenu = false}) => {
    const [unlockedIds, setUnlockedIds] = useState(() => getUnlockedAchievementIds());
    const [notice, setNotice] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleUnlock = event => {
            const {achievement, unlockedIds: nextIds} = event.detail;
            setUnlockedIds(nextIds);
            setNotice(achievement);
        };

        window.addEventListener(UNLOCK_EVENT, handleUnlock);
        return () => window.removeEventListener(UNLOCK_EVENT, handleUnlock);
    }, []);

    useEffect(() => {
        if (!notice) return undefined;
        const timeout = setTimeout(() => setNotice(null), 4500);
        return () => clearTimeout(timeout);
    }, [notice]);

    const openAchievements = () => {
        unlockAchievement('achievement-hunter');
        setIsOpen(true);
    };

    return (
        <div className={inMenu ? styles.menuRoot : styles.root}>
            {notice && (
                <button
                    className={styles.notice}
                    onClick={openAchievements}
                    type="button"
                >
                    <span className={styles.noticeIcon}>🏆</span>
                    <span>
                        <strong>成就解锁：{notice.name}</strong>
                        <small>{notice.description}</small>
                    </span>
                </button>
            )}
            <button
                className={styles.trigger}
                onClick={openAchievements}
                title="成就"
                type="button"
            >
                🏆
            </button>
            {isOpen && (
                <div className={styles.backdrop} onClick={() => setIsOpen(false)}>
                    <section
                        aria-label="成就"
                        className={styles.panel}
                        onClick={event => event.stopPropagation()}
                    >
                        <header>
                            <div>
                                <h2>成就</h2>
                                <p>{unlockedIds.length} / {ACHIEVEMENTS.length} 已解锁</p>
                            </div>
                            <button
                                aria-label="关闭成就"
                                onClick={() => setIsOpen(false)}
                                type="button"
                            >
                                ×
                            </button>
                        </header>
                        <div className={styles.list}>
                            {ACHIEVEMENTS.map(achievement => {
                                const unlocked = unlockedIds.includes(achievement.id);
                                return (
                                    <article
                                        className={unlocked ? styles.unlocked : styles.locked}
                                        key={achievement.id}
                                    >
                                        <span className={styles.icon}>{unlocked ? '🏆' : '🔒'}</span>
                                        <div>
                                            <small>{achievement.type}{' · '}{achievement.difficulty}</small>
                                            <h3>{achievement.name}</h3>
                                            <p>{achievement.description}</p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default Achievements;
