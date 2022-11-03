import { fromEvent } from 'rxjs';

const letterRow = document.getElementsByClassName('letter-row');
const onKeyDown$ = fromEvent(document, 'keydown');
let letterRowIndex = 0;
let letterIndex = 0;

const insertLetter = {
  next: (event) => {
    if (event.key === 'Backspace') {
      letterIndex--;
      if (letterIndex < 0) letterIndex = 0;
      if (letterIndex >= 0) {
        const box = Array.from(letterRow)[letterRowIndex].children[letterIndex];
        box.textContent = '';
        box.classList.remove('filled-letter');
      }
    }
    if (event.code.includes('Key')) {
      if (letterIndex <= 4) {
        const box = Array.from(letterRow)[letterRowIndex].children[letterIndex];
        box.textContent = event.key;
        box.classList.add('filled-letter');
        letterIndex++;
      }
    }
  },
};

onKeyDown$.subscribe(insertLetter);
