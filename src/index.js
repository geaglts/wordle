import { fromEvent, Subject } from 'rxjs';
import WORDS_LIST from './wordsList.json';

const letterRow = document.getElementsByClassName('letter-row');
const onKeyDown$ = fromEvent(document, 'keydown');
const onUserWinOrLose$ = new Subject();
let letterRowIndex = 0;
let letterIndex = 0;
let userAnswer = [];
const getRandomWord = () => {
  return WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
};
const rightWord = getRandomWord();

const insertLetter = {
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

const checkWord = {
  next: (event) => {
    if (event.key === 'Enter') {
      onUserWinOrLose$.next();
    }
  },
};

onKeyDown$.subscribe(insertLetter);
onKeyDown$.subscribe(checkWord);
onUserWinOrLose$.subscribe(() => {
  const currentLetterRow = Array.from(letterRow)[0];
  for (let i = 0; i < 5; i++) {
    currentLetterRow.children[i].classList.add('letter-green');
  }
});
