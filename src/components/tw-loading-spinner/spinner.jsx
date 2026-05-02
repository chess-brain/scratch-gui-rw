import React, {useState, useEffect} from 'react';
import styles from './spinner.css';

const Loading = () => {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        const fullText = '[""^*/';
        let index = 0;
        
        const typeInterval = setInterval(() => {
            if (index <= fullText.length) {
                setDisplayText(fullText.substring(0, index));
                index++;
            } else {
                setTimeout(() => {
                    setDisplayText('');
                    index = 0;
                }, 500);
            }
        }, 100);

        return () => clearInterval(typeInterval);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.typingText}>{displayText}</div>
            <div className={styles.spinner} />
        </div>
    );
};

export default Loading;