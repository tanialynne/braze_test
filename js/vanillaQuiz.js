var myQuestions = [
	{
		question: "If a user qualifies for every audience group in your audience paths component, they will proceed down:",
		answers: {
      0: "A random path.",
      1: "The path of Audience Group 1, since this group is ranked highest.",
      2: "The \"Everyone Else\" path.",
      3: "The path with the most associated message components."
		},
		correctAnswer: 1
	}
];

var quizContainer = document.getElementById('quiz');
var resultsContainer = document.getElementById('results');
var submitButton = document.getElementById('submit');
var retryButton = document.getElementById('retry');

retryButton.disabled = true;

function generateQuiz(questions, quizContainer, resultsContainer, submitButton){

	function showQuestions(questions, quizContainer){
		//store the output and the answer choices
		var output = [];
		var answers;

		// for each question...
		for(var i=0; i<questions.length; i++){
			// first reset the list of answers
			answers = [];

			// for each available answer...
			for(number in questions[i].answers){

				// ...add an html radio button
				answers.push(
					'<label>'
						+ '<input class="distractor" type="radio" name="question'+i+'" value="'+number+'">'
						+ questions[i].answers[number]
					+ '</label>'
				);
			}

			// add this question and its answers to the output
			output.push(
				'<div class="question">' + questions[i].question + '</div>'
				+ '<div class="answers">' + answers.join('') + '</div>'
			);
		}

		//combine our output list into one string of html and put it on the page
		quizContainer.innerHTML = output.join('');
	}

	function showResults(questions, quizContainer, resultsContainer){
		// gather answer containers from our quiz
		var answerContainers = quizContainer.querySelectorAll('.answers');

		//loop through all distractors and disable them
		var distractors = quizContainer.getElementsByClassName('distractor');
		for(var i = 0; i < distractors.length; i++) {
		    distractors[i].disabled = true;
		}

		// keep track of user's answers
		var userAnswer = '';

		// for each question...
		for(var i=0; i<questions.length; i++){
			// find selected answer
			userAnswer = (answerContainers[i].querySelector('input[name=question'+i+']:checked')||{}).value;
			// if answer is correct
			if(userAnswer==questions[i].correctAnswer){
				responseText = "That's right!"
				resultsContainer.classList.add('correct');
			}
			// if answer is wrong or blank
			else{
				responseText = "That's not right!"
				resultsContainer.classList.add('incorrect');
				//show retry button
				retryButton.disabled = false;
			}
		}
		// show number of correct answers out of total
		resultsContainer.innerHTML = responseText;
	}

	function resetResults(quizContainer, resultsContainer){
		//loop through all distractors; clear checked and re-enable them
		var distractors = quizContainer.getElementsByClassName('distractor');
		for(var i = 0; i < distractors.length; i++) {
		    distractors[i].disabled = false;
				distractors[i].checked = false;
		}
		resultsContainer.innerHTML = "Choose the best answer, then select Check Answer."
		//remove color from results
		resultsContainer.classList.remove('correct');
		resultsContainer.classList.remove('incorrect');
		//enable submit
		submitButton.disabled = false;
	}

	// show questions right away
	showQuestions(questions, quizContainer);

	// on submit, show results
	submitButton.onclick = function(){
		showResults(questions, quizContainer, resultsContainer);
		submitButton.disabled = true;
	}

	// on retry, reset question
	retryButton.onclick = function(){
		resetResults(quizContainer, resultsContainer);
		retryButton.disabled = true;
	}

}

generateQuiz(myQuestions, quizContainer, resultsContainer, submitButton);
