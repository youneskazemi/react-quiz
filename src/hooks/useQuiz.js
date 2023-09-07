import { useEffect, useReducer } from "react";
const initialState = {
  questions: [],
  // loading , ready , active , error , finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

const initialFunc = (initialState) => {
  const storedData = localStorage.getItem("quiz");

  return storedData ? JSON.parse(storedData) : initialState;
};

const SECS_PER_QUIESTION = 30;
const reducer = (state, action) => {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
        secondsRemaining: state.questions.length * SECS_PER_QUIESTION,
      };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "next":
      return { ...state, index: state.index + 1 };

    case "newAnswer":
      const question = state.questions[state.index];

      const correctAnswer = question.correctOption === action.payload;

      return {
        ...state,
        answer: action.payload,
        points: correctAnswer ? state.points + question.points : state.points,
      };

    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        highscore: state.highscore,
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Unknown action!");
  }
};
function useQuiz() {
  const [state, dispatch] = useReducer(reducer, initialState, initialFunc);

  useEffect(() => {
    localStorage.setItem("quiz", JSON.stringify(state));
  }, [state]);
  return [state, dispatch];
}

export default useQuiz;
