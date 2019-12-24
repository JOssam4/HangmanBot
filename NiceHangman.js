// Author: James Ossam

// The purpose of this bot is to play hangman as normal, but
// to make the game as easy as possible for the player.
// Instead of the user simply guessing a word that the computer selected, the computer
// will select a word on the fly that best matches the user's input. Thus, this makes an
// easy hangman mode.

// Contents of this file are meant to be called from bot.js.

const HashMap = require("hashmap");
const lineByLine = require('n-readlines');



class Words {
    // len = length the target word.
    // should return a hashmap containing all words in text file of length len.
    
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

    // deletes every word in the hashmap that does not contain the letter guessed. (making it easy)
    // returns the hashmap.
    static removeInvalid(map, letterGuessed) {
        map.forEach((value, key) => {
            if (!key.includes(letterGuessed)) {
                map.delete(key);
            }
        })
        return map;
    }

    // checks if there would be words left if all without the guessed letter in them are removed
    // returns true or false.
    static isValidGuess(map, guess) {
        /*
        map.forEach((value, key) => {
            if (key.includes(guess)) {
                ret = true;
            }
        })
        */
        
        for (let i = 0; i < map.keys().length; i++) {
            if (map.keys()[i].includes(guess)) {
                return true;
            }
        }
        return false;
    }

    // returns the number of possible words
    static possibleWords(map) {
        return map.size();
    }


    // remove from hashmap all words where letter not at position.
    static setLetterAtPos(map, pos, letter) {
        let newMap = new HashMap();
        map.forEach((value, key) => {
            if (key.charAt(pos) === letter) {
                newMap.set(key, value);
            }
        }) 
        return newMap; 
    }

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