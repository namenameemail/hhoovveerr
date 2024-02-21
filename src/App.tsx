import { LevelEditor } from "./LevelEditor";
import styles from './app.module.css';
import "./LevelEditor/services/db";

export function App() {


    return (
        <div className={styles.app}>
            <LevelEditor/>
        </div>
    );
}

