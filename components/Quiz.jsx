import  {useEffect, useState} from "react";

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);


    useEffect(() => {
        fetch('/data/data.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => setQuestions(data))
        .catch((error) => console.error('Error fetching the data:', error));
    }, []);


    const handlerAnswerOptionClick = (isCorrent) => {
        if (isCorrent) {
            setScore(score + 1);
        }

    const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
        }else{
            setShowScore(true);
        }
    };

    const handleRestartQuiz = () => {
        setScore(0);
        setCurrentQuestion(0);
        setShowScore(false);
    };

    return (
        <div className="quiz-container">
            {showScore ? (
                <div className="score-section">
                    <p>You scored {score} out of {questions.length}</p>
                    <button onClick={handleRestartQuiz}>Újra</button>
                </div>
            ) : (
                <>
                    <div className="question-section">
                        <p>{questions[currentQuestion]?.question}</p>
                    </div>
                    <div className="answer-section">
                        {questions[currentQuestion]?.answers.map((answer, index) => (
                            <button
                                key={index}
                                onClick={() => handlerAnswerOptionClick(answer === questions[currentQuestion]?.correct)}
                            >
                                {answer}
                            </button>
                        ))}
                    </div>
                    <div className="question-number">
                        Question {currentQuestion + 1}/{questions.length}
                    </div>
                </>
            )}
        </div>
    );
};

export default Quiz;
