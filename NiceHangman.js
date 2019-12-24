// Author: James Ossam
// Last updated: 12/23/2019

// The purpose of this bot is to play hangman as normal, but
// to make the game as easy as possible for the player.
// Instead of the user simply guessing a word that the computer selected, the computer
// will select a word on the fly that best matches the user's input. Thus, this makes an
// easy hangman mode.

// Contents of this file are meant to be called from bot.js.

const HashMap = require("hashmap");
const lineByLine = require('n-readlines');



class Words {
    // should return a hashmap containing all words in text file of length len.
    
    /**
     * @param {Number} len an integer representing the length of the target word. 
     * @returns {HashMap} 
     */ 
    static getWordsByLength(len) {
        let map = new HashMap();
        const liner = new lineByLine('words_alpha.txt');
        let line;
        while (line = liner.next()) {
            if (line.toString().trim().length == len) {
                map.set(line.toString().trim(), "");
            }
        }
        return map;
    }
    /** 
     * @param {HashMap} map a hashmap of all words, independent of guess
     * @param {String} guess a single-character string containing the current guess
     * @returns {boolean} true if any of the words in @param map contain @param guess; false otherwise.
    */
    static isValidGuess(map, guess) {
        for (let i = 0; i < map.keys().length; i++) {
            if (map.keys()[i].includes(guess)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 
     * @param {HashMap} map a hashmap containing all words
     * @param {Number} pos the position at which to set the letter
     * @param {String} letter the letter to be set
     * @returns {HashMap} the new hashmap only containing words with @param letter at @param pos.
     */
    static setLetterAtPos(map, pos, letter) {
        let newMap = new HashMap();
        map.forEach((value, key) => {
            if (key.charAt(pos) === letter) {
                newMap.set(key, value);
            }
        }) 
        return newMap; 
    }
    /**
     * 
     * @param {HashMap} map a hashmap containing all words
     * @param {Number} len the length of the target words
     * @param {String} letter the letter to be set
     * @returns {Number} an index [0, @param len) that corresponds to the index where MOST of the words in @param map have the letter @param letter.
     */
    static findPosForLetter(map, len, letter) {
        let otherMap = new HashMap(); // each entry is position: (num of elements with that letter at that position.)
        for (let i = 0; i < len; i++) {
            otherMap.set(i,0);
        }
        map.forEach((value, key) => {
            for (let i = 0; i < len; i++) {
                if (key.charAt(i) === letter) {
                    otherMap.set(i, otherMap.get(i) + 1);
                }
            }
        });
        let maxPos = -1
        let maxVal = -1;
        otherMap.forEach((value, key) => {
            if (value > maxVal) {
                maxPos = key;
                maxVal = value;
            }
        })
        return maxPos;
        //return otherMap.get(maxPos); //returns the desired words instead.
    }

    /**
     * 
     * @param {HashMap} map Hashmap containing all valid words
     * @param {Array} guessed An array containing all previously guessed letters
     * @param {String} displayed The currently displayed string. Looks something like _ _ A _ _ I _
     * @param {Number} len The length of the target words
     * @returns {String} a new value for @param displayed where previously guessed repeat letters have been filled in.
     */
    static fillInAllPossibleBlanks(map, guessed, displayed, len) {
        // if all words left in hashmap have the same value at one of the blanks, fill in that blank with that value.
        let arr = displayed.split(" ");
        let indexesNeedingLetters = [];
        for (let i = 0; i < arr.length-1; i++) { // bound at arr.length - 1 b/c arr tends to look like ["_", "_", ... , "_", ""]
            if (arr[i] === "_") {
                indexesNeedingLetters.push(i);
            }
        }
        
        if (indexesNeedingLetters.length == 0) {
            return arr.join(" ");
        }

        for (let i = 0; i < indexesNeedingLetters.length; i++) {
            let currentLetter = map.keys()[0][indexesNeedingLetters[i]];
            let lettersMatch = true; // switch to false if even one letter doesn't match.
            for (let j = 0; j < map.keys().length; j++) {
                if (map.keys()[j][indexesNeedingLetters[i]] !== currentLetter) {
                    lettersMatch = false;
                    break;
                }
            }
            if (lettersMatch && guessed.includes(currentLetter)) {
                arr[indexesNeedingLetters[i]] = currentLetter.toUpperCase();
            }   
        }
        
        displayed = arr.join(" ");
        return displayed;

    }
}
   
module.exports = Words;