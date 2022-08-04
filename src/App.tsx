import { Level1 } from "./levels/Level1";
import { LevelEditor } from "./components/LevelEditor";
import styles from './app.module.css';
import { useState } from "react";

export function App() {


    return (
        <div className={styles.app}>
            <LevelEditor/>
            {/*<Level1/>*/}
        </div>
    );
}

