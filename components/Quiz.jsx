import { useEffect, useState } from "react";

// A Quiz komponens, amely tartalmazza a kérdéseket és kezeli a kvíz logikáját
const Quiz = () => {
    // State (állapot) változók létrehozása
    const [questions, setQuestions] = useState([]); // Kérdések tárolására
    const [currentQuestion, setCurrentQuestion] = useState(0); // Az aktuális kérdés nyomkövetésére
    const [score, setScore] = useState(0); // A helyes válaszok számának nyilvántartására
    const [showScore, setShowScore] = useState(false); // A pontszám megjelenítésének irányítására
    const [feedback, setFeedback] = useState(""); // Visszajelzés a felhasználónak (helyes/helytelen válasz)
    const [isCorrect, setIsCorrect] = useState(false); // A válasz helyességének nyilvántartására

    // useEffect - Ez a hook a komponens életciklusához kapcsolódik
    useEffect(() => {
        // Kérdések betöltése a JSON fájlból
        fetch('/data/data.json')
            .then((response) => {
                // Ellenőrizzük, hogy a válasz sikeres volt-e
                if (!response.ok) {
                    throw new Error('Network response was not ok'); // Ha nem, hibaüzenet
                }
                return response.json(); // JSON formátumú válasz visszaadása
            })
            .then((data) => setQuestions(data)) // A kérdések beállítása a state-ben
            .catch((error) => console.error('Error fetching the data:', error)); // Hibaüzenet ha a betöltés nem sikerül
    }, []); // Az üres tömb azt jelenti, hogy ez csak egyszer fut le, a komponens első betöltésekor

    // Válasz gomb megnyomásának kezelése
    const handleAnswerOptionClick = (answer) => {
        const correctAnswer = questions[currentQuestion]?.correct; // Az aktuális kérdés helyes válasza
        const isCorrectAnswer = answer === correctAnswer; // Ellenőrizzük, hogy a választott válasz helyes-e

        // Válasz helyességének értékelése
        if (isCorrectAnswer) {
            setScore(score + 1); // Ha helyes, növeljük a pontszámot
            setFeedback("Helyes válasz!"); // Visszajelzés
            setIsCorrect(true); // Helyes válasz állapotának beállítása
        } else {
            setFeedback("Helytelen válasz!"); // Helytelen válasz esetén visszajelzés
            setIsCorrect(false); // Helytelen válasz állapotának beállítása
        }

        const nextQuestion = currentQuestion + 1; // Következő kérdés indexe
        // Ha van következő kérdés
        if (nextQuestion < questions.length) {
            // Várakozunk 1 másodpercet a következő kérdés előtt
            setTimeout(() => {
                setCurrentQuestion(nextQuestion); // Beállítjuk a következő kérdést
                setFeedback(""); // Visszajelzés törlése
            }, 1000);
        } else {
            setShowScore(true); // Ha nincs több kérdés, megmutatjuk a pontszámot
        }
    };

    // Kvíz újraindítása
    const handleRestartQuiz = () => {
        setShowScore(false); // A pontszám nem látható
        setScore(0); // A pontszám visszaállítása
        setCurrentQuestion(0); // Az aktuális kérdés visszaállítása az első kérdésre
        setFeedback(""); // Visszajelzés törlése
    };

    // A JSX rész, amely megjeleníti a kvíz tartalmát
    return (
        <div className="quiz-container">
            {showScore ? ( // Ha a pontszámot meg kell mutatni
                <div className="score-section">
                    <p>You scored {score} out of {questions.length}</p>
                    <button onClick={handleRestartQuiz}>Újra</button> {/* Újraindító gomb */}
                </div>
            ) : (
                <>
                    <div className="question-section">
                        <h2 style={{ margin: "0" }}>{questions[currentQuestion]?.question}</h2> {/* Jelenlegi kérdés megjelenítése */}
                        {feedback && ( // Ha van visszajelzés
                            <p style={{ 
                                color: isCorrect ? "green" : "red", // Visszajelzés színe a válasz helyességétől függ
                                textAlign: "center" 
                            }}>
                                {feedback} {/* Visszajelzés szövege */}
                            </p>
                        )}
                    </div>
                    <div className="answer-section">
                        {questions[currentQuestion]?.answers.map((answer, index) => (
                            <button
                                key={index} // Az egyedi kulcs minden válaszhoz
                                onClick={() => handleAnswerOptionClick(answer)} // Válasz megnyomásának kezelése
                            >
                                {answer} {/* Válasz szövege */}
                            </button>
                        ))}
                    </div>
                    <div className="question-number">
                        Question {currentQuestion + 1}/{questions.length} {/* Jelenlegi kérdés sorszáma */}
                    </div>
                </>
            )}
        </div>
    );
};

export default Quiz; // A Quiz komponens exportálása
