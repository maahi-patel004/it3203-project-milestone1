/* IT 3203 Project Milestone #2
   This script grades the HTTP self-assessment quiz, displays detailed
   feedback, and resets the form for another attempt. */

const quizForm = document.querySelector("#http-quiz");
const resetButton = document.querySelector("#reset-quiz");
const summary = document.querySelector("#quiz-summary");

// Normalize fill-in answers so capitalization and extra spaces do not matter.
function normalizeText(value) {
    return value.trim().toLowerCase().replace(/\s+/g, " ");
}

// Compare two arrays without depending on the order of selected answers.
function sameAnswers(userAnswers, correctAnswers) {
    const sortedUserAnswers = [...userAnswers].sort();
    const sortedCorrectAnswers = [...correctAnswers].sort();

    return sortedUserAnswers.length === sortedCorrectAnswers.length &&
        sortedUserAnswers.every((answer, index) => answer === sortedCorrectAnswers[index]);
}

// Display the score and answer feedback for one question.
function showQuestionFeedback(questionNumber, isCorrect, userAnswer, correctAnswer) {
    const questionCard = document.querySelector(`#question-${questionNumber}`);
    const feedback = document.querySelector(`#feedback-q${questionNumber}`);
    const resultLabel = isCorrect ? "Correct" : "Incorrect";
    const userDisplay = userAnswer || "No answer provided";

    questionCard.classList.remove("correct-answer", "incorrect-answer");
    questionCard.classList.add(isCorrect ? "correct-answer" : "incorrect-answer");

    feedback.innerHTML = `
        <p class="feedback-status">${isCorrect ? "✓" : "✗"} ${resultLabel} — ${isCorrect ? "1/1 point" : "0/1 points"}</p>
        <p><strong>Your answer:</strong> ${userDisplay}</p>
        <p><strong>Correct answer:</strong> ${correctAnswer}</p>
    `;
}

// Check every answer, calculate the total score, and display results immediately.
quizForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let score = 0;

    const q1Answer = document.querySelector("#q1").value;
    const acceptedQ1Answers = ["hypertext transfer protocol", "hyper text transfer protocol"];
    const q1Correct = acceptedQ1Answers.includes(normalizeText(q1Answer));
    score += q1Correct ? 1 : 0;
    showQuestionFeedback(1, q1Correct, q1Answer.trim(), "Hypertext Transfer Protocol");

    const q2Selected = document.querySelector('input[name="q2"]:checked');
    const q2Answer = q2Selected ? q2Selected.value : "";
    const q2Correct = q2Answer === "HTTPS";
    score += q2Correct ? 1 : 0;
    showQuestionFeedback(2, q2Correct, q2Answer, "HTTPS");

    const q3Selected = document.querySelector('input[name="q3"]:checked');
    const q3Answer = q3Selected ? q3Selected.value : "";
    const q3Correct = q3Answer === "GET";
    score += q3Correct ? 1 : 0;
    showQuestionFeedback(3, q3Correct, q3Answer, "GET");

    const q4Selected = document.querySelector('input[name="q4"]:checked');
    const q4Answer = q4Selected ? q4Selected.value : "";
    const q4Correct = q4Answer === "404";
    score += q4Correct ? 1 : 0;
    showQuestionFeedback(4, q4Correct, q4Answer, "404");

    const q5Answers = [...document.querySelectorAll('input[name="q5"]:checked')]
        .map((checkbox) => checkbox.value);
    const q5CorrectAnswers = ["GET", "POST", "PUT", "DELETE"];
    const q5Correct = sameAnswers(q5Answers, q5CorrectAnswers);
    score += q5Correct ? 1 : 0;
    showQuestionFeedback(
        5,
        q5Correct,
        q5Answers.length ? q5Answers.join(", ") : "",
        q5CorrectAnswers.join(", ")
    );

    const totalQuestions = 5;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = score >= 4;

    summary.hidden = false;
    summary.className = `quiz-summary ${passed ? "pass-summary" : "fail-summary"}`;
    summary.innerHTML = `
        <h2>${passed ? "PASS" : "FAIL"}</h2>
        <p class="total-score">Total score: <strong>${score} / ${totalQuestions}</strong> (${percentage}%)</p>
        <p>${passed
            ? "Great work! You demonstrated a strong understanding of the HTTP concepts covered on this site."
            : "Review the detailed feedback below each question, revisit the website content, and try again."}</p>
    `;

    // Move keyboard and screen-reader focus to the overall result.
    summary.focus();
});

// Clear all inputs, feedback, colors, and the overall result for a retake.
resetButton.addEventListener("click", function () {
    quizForm.reset();

    document.querySelectorAll(".question-card").forEach((card) => {
        card.classList.remove("correct-answer", "incorrect-answer");
    });

    document.querySelectorAll(".question-feedback").forEach((feedback) => {
        feedback.innerHTML = "";
    });

    summary.hidden = true;
    summary.className = "quiz-summary";
    summary.innerHTML = "";
    document.querySelector("#q1").focus();
});
