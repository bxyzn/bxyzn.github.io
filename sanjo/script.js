async function loadQuestions() {
    try {
        const response = await fetch('/q.txt');
        const data = await response.text();
        const questions = data.trim().split('\n\n'); // Split questions

        const container = document.getElementById('questions-container');
        container.innerHTML = '';

        questions.forEach((questionBlock, index) => {
            const [question, ...answers] = questionBlock.split('\n');
            const questionCard = document.createElement('div');
            questionCard.classList.add('question-card');
            
            questionCard.innerHTML = `
                <h2>QUESTION ${index + 1}</h2>
                <h3>${question}</h3>
                <ul>
                    ${answers.map((answer, index) => `
                        <li class="answer" data-index="${index}" data-selected="0">
                            ${answer} <span class="vote-count">(0)</span>
                        </li>
                    `).join('')}
                </ul>
            `;
            container.appendChild(questionCard);
        });

        document.querySelectorAll('.answer').forEach(answer => {
            answer.addEventListener('click', function() {
                const isLocked = this.classList.contains('locked');
                if (isLocked) return;

                const parent = this.parentElement;
                const selectedIndex = this.dataset.index;

                parent.querySelectorAll('.answer').forEach(a => {
                    if (a !== this) a.classList.remove('correct', 'incorrect');
                });

                const isCorrect = selectedIndex === '1'; // Update logic based on your data
                this.classList.add(isCorrect ? 'correct' : 'incorrect');
                this.classList.add('locked');

                // Increment vote count for the selected answer
                const voteCountElem = this.querySelector('.vote-count');
                const currentCount = parseInt(voteCountElem.textContent.match(/\d+/)[0]);
                voteCountElem.textContent = `(${currentCount + 1})`;
            });
        });
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}
