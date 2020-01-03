// Author: James Ossam
// Date Created: 12/27/2019
// Last Updated: 12/27/2019

// The purpose of this file is to aid in code cleanup and possibly help get rid of the other files (NiceHangman.js, HangmanHelper.js, EvilHangman.js)
// By basically creating one big class for all that stuff

const HashMap = require("hashmap");
const Helper = require("./HangmanHelper")
const lineByLine = require('n-readlines');



class Hangman {
    constructor() {
        this._gameStarted = false;
        this._difficulty = false;
        this._mistakesMade = 0;
        this._guessed = [];
        this._displayed = "";
        this._word = new HashMap(); // Each subclass will deal with how to assign this differently.
    }
    get gameStarted() {
        return this._gameStarted;
    }
    get difficulty() {
        return this._difficulty;
    }
    get mistakesMade() {
        return this._mistakesMade;
    }
    get guessed() {
        return this._guessed;
    }
    get word() {
        return this._word;
    }
    get displayed() {
        return this._displayed;
    }

    set gameStarted(started) {
        this._gameStarted = started;
    }

    set difficulty(difficulty) {
        this._difficulty = difficulty;
    }

    set mistakesMade(num) {
        this._mistakesMade = num;
    }

    set guessed(arr) {
        this._guessed = arr;
    } 
    
    set displayed(str) {
        this._displayed = str;
    }
    /**
     * reads the textfile, and puts all words of length this._len into this._word.
     */
    getWordsByLength() {
        const liner = new lineByLine('words_alpha.txt');
        let line;
        while (line = liner.next()) {
            if (line.toString().trim().length == this._len) {
                this._word.set(line.toString().trim(), "");
            }
        }
    }

    fillInAllPossibleBlanks() {
        let arr = this._displayed.split(" ");
        let indexesNeedingLetters = [];
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] === "_") {
                indexesNeedingLetters.push(i);
            }
        }
        if (indexesNeedingLetters.length == 0) {
            this._displayed = arr.join(" ");
        }

        for (let i = 0; i < indexesNeedingLetters.length; i++) {
            let currentLetter = this._word.keys()[0][indexesNeedingLetters[i]];
            let lettersMatch = true;
            for (let j = 0; j < this._word.keys().length; j++) {
                if (this._word.keys()[j][indexesNeedingLetters[i]] !== currentLetter) {
                    lettersMatch = false;
                    break;
                }
            }
            if (lettersMatch && this._guessed.includes(currentLetter)) {
                arr[indexesNeedingLetters[i]] = currentLetter.toUpperCase();
            }
        }
        this._displayed = arr.join(" ");
    }

}

class EasyHangman extends Hangman {
    constructor() {
        super();
        let wordFileLength = 370102;
        let lineNum = Helper.generateRandomNum(wordFileLength);
        let wfln = Helper.getWordFromLineNum(lineNum); // wfln = word from line number
        this._len = wfln.length;
        super.getWordsByLength();
        this._displayed = "_ ".repeat(this._len);
        this._difficulty = "easy";
    }

    /**
     * 
     * @param {String} guess a single character string containing the current guess
     * @returns true if any of the words in this._word contain @param guess; false otherwise. 
     */
    isValidGuess(guess) {
        if (this.guessed.includes(guess)) {
            return true; // idk it just makes the code easier to deal with
        }
        for (let i = 0; i < this._word.keys().length; i++) {
            if (this._word.keys()[i].includes(guess)) {
                return true
            }
        }
        return false;
    }

    /**
     * 
     * @param {Number} pos the position at which to set the letter
     * @param {String} letter the letter to be set
     */
    setLetterAtPos(pos, letter) {
        let newMap = new HashMap();
        this._word.forEach((value, key) => {
            if (key.charAt(pos) === letter) {
                newMap.set(key, value);
            }
        })
        this._word = newMap;
    }
    /**     
     * @param {String} letter the letter to be set
     * @returns {Number} an index [0, this._len) that corresponds to the index where MOST of the words in this._word have the letter @param letter.
     */
    findPosForLetter(letter) {
        let otherMap = new HashMap();
        for (let i = 0; i < this._len; i++) {
            otherMap.set(i, 0);
        }
        this._word.forEach((value, key) => {
            for (let i = 0; i < this._len; i++) {
                if (key.charAt(i) === letter) {
                    otherMap.set(i, otherMap.get(i) + 1);
                }
            }
        });
        let maxPos = -1;
        let maxVal = -1;
        otherMap.forEach((value, key) => {
            if (value > maxVal) {
                maxPos = key;
                maxVal = value;
            }
        })
        return maxPos;
    }

    dealWithCorrectGuess(guess) {
        this._guessed.push(guess);
        let arr = this._displayed.split(" ");
        let pos = this.findPosForLetter(guess);
        arr[pos] = guess.toUpperCase();
        this._displayed = arr.join(" ");
        this.setLetterAtPos(pos, guess);
        super.fillInAllPossibleBlanks();
    }
}

class NormalHangman extends Hangman {
    constructor() {
        super();
        let wordFileLength = 370102;
        let lineNum = Helper.generateRandomNum(wordFileLength);
        this._word.set(Helper.getWordFromLineNum(lineNum), "");
        this._displayed = "_ ".repeat(this._word.keys()[0].length);
        this._len = this._word.keys()[0].length;
        this._difficulty = "normal";

    }


    isValidGuess(guess) {
        if (this._guessed.includes(guess)) {
            return true;
        }
        return (this._word.keys()[0].includes(guess));
    }

    dealWithCorrectGuess(guess) {
        this._guessed.push(guess);
        for (let i = 0; i < this._word.keys()[0].length; i++) {
            if (this._word.keys()[0][i] === guess) {
                let arr = this._displayed.split(" ");
                arr[i] = this._word.keys()[0][i].toUpperCase();
                this._displayed = arr.join(" ");
            }
        }
    }



}

class HardHangman extends Hangman {
    constructor() {
        super();
        let wordFileLength = 370102;
        let lineNum = Helper.generateRandomNum(wordFileLength);
        let wfln = Helper.getWordFromLineNum(lineNum);
        this._len = wfln.length;
        //this._word = super.getWordsByLength();
        super.getWordsByLength();
        this._displayed = "_ ".repeat(this._len);
        this._difficulty = "hard";
    }
    /**
    * 
    * @param {String} letter the invalid letter
    */
    removeAllWithLetter(letter) {
        let newMap = new HashMap();
        this._word.forEach((value, key) => {
            if (!key.includes(letter)) {
                newMap.set(key, value);
            }
        })
        this._word = newMap;
    }
    /**
     * 
     * @param {String} letter the letter to remove
     * @returns {boolean} true if at least one word in this._word does not contain @param letter, false otherwise 
     */
    letterCanBeRemoved(letter) {
        let originalWord = this._word;
        this.removeAllWithLetter(letter);
        if (this._word.size > 0) {
            this._word = originalWord;
            return true;
        }
        else {
            this._word = originalWord;
            return false;
        }
    }

    findPosForLetter(letter) {
        let otherMap = new HashMap();
        for (let i = 0; i < this._len; i++) {
            otherMap.set(i, 0);
        }
        this._word.forEach((value, key) => {
            for (let i = 0; i < this._len; i++) {
                if (key.charAt(i) === letter) {
                    otherMap.set(i, otherMap.get(i) + 1);
                }
            }
        });
        let minPos = -1;
        let minVal = -1
        otherMap.forEach((value, key) => {
            if (value > minVal) {
                minPos = key;
                minVal = value;
            }
        });
        return minPos; 
    }
    setLetterAtPos(pos, letter) {
        let newMap = new HashMap();
        this._word.forEach((value, key) => {
            if (key.charAt(pos) === letter) {
                newMap.set(key, value);
            }
        })
        this._word = newMap;
    }
    
    dealWithCorrectGuess(guess) {
        this._guessed.push(guess);
        let pos = this.findPosForLetter(guess);
        let arr = this._displayed.split(" ");
        arr[pos] = guess.toUpperCase();
        this._displayed = arr.join(" ");
        this.setLetterAtPos(pos, guess);
        super.fillInAllPossibleBlanks();
    }
}

module.exports.EasyHangman = EasyHangman;
module.exports.NormalHangman = NormalHangman;
module.exports.HardHangman = HardHangman;