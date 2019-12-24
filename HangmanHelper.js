// Author: James Ossam
// Date created: 12/24/2019
// Last updated: 12/24/2019


const fs = require('fs');
const lineByLine = require('n-readlines');
const readline = require('readline');

class Helper {
    /**
     * @returns the word file length (it's hardcoded to be 370102).
     * @todo make this function work in case the word file is lengthened/shortened
     */
    static async getWordFileLength() {
        let promise = new Promise(function(resolve, reject) {
            const readInterface = readline.createInterface({
                input: fs.createReadStream('words_alpha.txt')
            });
            var fileLength = 370102;
            resolve(fileLength);
        })
        return promise;
    }

    /**
     * 
     * @param {Number} maximum the maximum value to generate a random number between (inclusive)
     * @returns {Number} a random number between 0 and @param maximum (inclusive)
     */
    static generateRandomNum(maximum) {
        return Math.floor(Math.random() * Math.floor(maximum + 1));
    }

    
    /**
     * @param {Number} lineNum the line number of the target word (for normal mode).
     * @returns {String} the word on line number @param lineNum
     */
    static getWordFromLineNum(lineNum) {
        const liner = new lineByLine('words_alpha.txt');
        let currentLineNum = 1;
        let line;
        
        while (line = liner.next()) {
            if (currentLineNum == lineNum) {
                return line.toString().trim();
            }
            else {
                currentLineNum++;
            }
        }
        throw "Ya Dun Goofed"; // hasn't been a problem thus far.
    }

    /**
     * 
     * @param {String} displayed A string representing the letters and '_'s.
     * @return {String} the below ascii art, mixed with @param displayed.
     */
    static drawEmptyHanger(displayed) {
        return `
            _____________
            |           |
                        |
                        |
                        |
                        |
                        |
                        |
                _______/_\\_______
        ${displayed}    
    `;
    }
    
    /**
     * 
     * @param {Number} mistakeNum the current mistake number
     * @param {String} displayed the string representing correct letters and '_'s
     * @param {} word 
     * @param {Array} guessed array containing previous guesses
     */
    static guessMade(mistakeNum, displayed, word, guessed=[]) { 
        if (mistakeNum == 0) {
            return `
    You've guessed: ${guessed}
            _____________
            |          \\|
                        |
                        |
                        |
                        |
                        |
                        |
                _______/_\\_______
        ${displayed}
    `;   
        }
        else if (mistakeNum == 1) {
            return `
    You've guessed: ${guessed}
            _____________
            |          \\|
           (_)          |
                        |
                        |
                        |
                        |
                        |
                _______/_\\_______
        ${displayed}
    `;   
        }
        else if (mistakeNum == 2) {
            return `
    You've guessed: ${guessed}
            _____________
            |          \\|
           (_)          |
            |           |
            |           |
            |           |
                        |
                        |
                _______/_\\_______
        ${displayed}
    `;       
        }
        else if (mistakeNum == 3) {
            return `
    You've guessed: ${guessed}
            _____________
            |          \\|
           (_)          |
           /|           |
          / |           |
            |           |
                        |
                        |
                _______/_\\_______
        ${displayed}
    `;       
        }
        else if (mistakeNum == 4) {
            return `
    You've guessed: ${guessed}
            _____________
            |          \\|
           (_)          |
           /|\\          |
          / | \\         |
            |           |
                        |
                        |
                _______/_\\_______
        ${displayed}    
    `;
        }
        else if (mistakeNum == 5) {
            return `
    You've guessed: ${guessed}
            _____________
            |          \\|
           (_)          |
           /|\\          |
          / | \\         |
            |           |
           /            |
          /             |
                _______/_\\_______
        ${displayed}
    `;
        }
        else if (mistakeNum == 6) {
            return `
    You've guessed: ${guessed}
            _____________
            |          \\|
           (_)          |
           /|\\          |
          / | \\         |
            |           |
           / \\          |
          /   \\         |
                _______/_\\_______
        ${displayed}
    `;
        }
        else if (mistakeNum == 7) {
            return `
    You've guessed: ${guessed}
            _____________
            |          \\|
           (xx)         |
           /|\\          |
          / | \\         |
            |           |
           / \\          |
          /   \\         |
                _______/_\\_______
            YOU LOSE!
        The word was ${word}
    `;
        }
    }
}

module.exports = Helper;