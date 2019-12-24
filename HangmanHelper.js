// Author: James Ossam
// Date created: 12/24/2019
// Last updated: 12/24/2019


const fs = require('fs');
const lineByLine = require('n-readlines');
const readline = require('readline');

class Helper {
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

    static generateRandomNum(maximum) {
        return Math.floor(Math.random() * Math.floor(maximum + 1));
    }

    

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
        throw "Ya Dun Goofed";
        return 'Error: I somehow failed.';
    }

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