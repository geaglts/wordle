import { fromEvent, Subject } from 'rxjs';
import WORDS_LIST from './wordsList.json';

const letterRow = document.getElementsByClassName('letter-row');
const message = document.getElementById('message-text');
const onKeyDown$ = fromEvent(document, 'keydown');
const onUserWinOrLose$ = new Subject();
let letterColor = '';
let letterRowIndex = 0;
let letterIndex = 0;
let userAnswer = [];
const getRandomWord = () => {
  return WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
};
const rightWord = getRandomWord();

const insertLetter = {
  next: (event) => {
    if (letterRowIndex === 6 && letterIndex <= 4) {
      return;
    }
    if (event.code.includes('Key')) {
      if (letterIndex <= 4) {
        const box = Array.from(letterRow)[letterRowIndex].children[letterIndex];
        box.textContent = event.key;
        box.classList.add('filled-letter');
        userAnswer.push(event.key.toUpperCase());
        letterIndex++;
      }
    }
  },
};

const deleteLetter = {
  next: (event) => {
    if (event.key === 'Backspace') {
      letterIndex--;
      if (letterIndex < 0) letterIndex = 0;
      if (letterIndex >= 0) {
        const box = Array.from(letterRow)[letterRowIndex].children[letterIndex];
        box.textContent = '';
        box.classList.remove('filled-letter');
        userAnswer.pop();
      }
    }
  },
};

const checkWord = {
  next: (event) => {
    if (event.key === 'Enter') {
      if (letterRowIndex === 6) return;

      if (userAnswer.length !== 5) {
        message.textContent = `Te faltan ${5 - userAnswer.length} letras`;
        setTimeout(() => {
          message.textContent = '';
        }, 2000);
        return;
      }

      const correctAnswer = userAnswer.join('') === rightWord;
      if (correctAnswer) {
        onUserWinOrLose$.next();
        message.textContent = '¡Felicidades 🎉🎉!';
        return;
      }

      for (let i = 0; i < 5; i++) {
        // letterBox
        const letter = Array.from(letterRow)[letterRowIndex].children[i];
        // index of word
        const index = rightWord.indexOf(userAnswer[i]);
        if (index < 0) {
          letterColor = 'letter-grey';
        } else {
          const wordInSamePlace = rightWord[i] === userAnswer[i];
          if (wordInSamePlace) {
            letterColor = 'letter-green';
          } else {
            letterColor = 'letter-yellow';
          }
        }
        letter.classList.add(letterColor);
      }

      letterIndex = 0;
      userAnswer = [];
      letterRowIndex++;

      if (letterRowIndex === 6) {
        message.textContent = `La palabra era ${rightWord}`;
      }
    }
  },
};

onKeyDown$.subscribe(insertLetter);
onKeyDown$.subscribe(deleteLetter);
onKeyDown$.subscribe(checkWord);

onUserWinOrLose$.subscribe(() => {
  const currentLetterRow = Array.from(letterRow)[letterRowIndex];
  for (let i = 0; i < 5; i++) {
    currentLetterRow.children[i].classList.add('letter-green');
  }
});
