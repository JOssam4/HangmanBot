// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
const fs = require('fs');
const readline = require('readline');
//const stream = require('stream');
//const LineByLineReader = require('line-by-line');
const lineByLine = require('n-readlines');



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
        //let ret;
        let line;
        
        while (line = liner.next()) {
            if (currentLineNum == lineNum) {
                return line.toString().trim();
            }
            else {
                currentLineNum++;
            }
        }
        return 'shit.';
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
    
    static guessMade(mistakeNum, displayed, word) { 
        if (mistakeNum == 0) {
            return `
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




class EchoBot extends ActivityHandler {
    constructor() {
        let gameStarted = false;
        let word;
        let mistakesMade = 0;
        let displayed; // the blanks that will be filled in.
        let guessed = [];
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            let text = context.activity.text;
            text = text.toLowerCase();
            //await context.sendActivity(`typeof text = ${typeof text}`);
            //await context.sendActivity(`You said ${text}`);
            if (text === "no") {
                if (gameStarted == false) {
                    await context.sendActivity('Come back if you want to play hangman.');
                }
                else {
                    await context.sendActivity('The game has started. Answers must be 1 character only.');
                }
            }
            else if (text === "yes") {
                if (gameStarted == false ) {
                    gameStarted = true;
                    await context.sendActivity('Starting game.');
                    let wordFileLength = await Helper.getWordFileLength();
                    let lineNum = Helper.generateRandomNum(wordFileLength);
                    word = Helper.getWordFromLineNum(lineNum);
                    displayed = "_ ".repeat(word.length);
                    //await context.sendActivity(`${word}`);
                    await context.sendActivity(Helper.drawEmptyHanger(displayed));

                }
                else {
                    await context.sendActivity('The game has started. Please make your answers 1 character only.');
                }
            }
            else {
                if (gameStarted == false) {
                    await context.sendActivity('please answer yes/no');
                    await context.sendActivity(`You said ${text}`);
                }
                else {
                    if (text.length > 1) {
                        await context.sendActivity('Please limit your answer to one character only.');
                    }
                    else if (text.length == 0) {
                        await context.sendActivity('What?');
                    }
                    else {
                        if (!word.includes(text)) {
                            if (!guessed.includes(text)) {    
                                mistakesMade++;
                                guessed.push(text);
                                await context.sendActivity(Helper.guessMade(mistakesMade, displayed, word));
                                if (mistakesMade == 7) {
                                    gameStarted = false; // these next few lines reset the game
                                    word = "";
                                    displayed = "";
                                    mistakesMade = 0;
                                    guessed = [];
                                    await context.sendActivity("Play again? (yes/no)");
                                }
                            }
                            else {
                                await context.sendActivity("You already guessed that.");
                            }
                        }
                        else {
                            if (!guessed.includes(text)) {
                                guessed.push(text);
                                for (let i = 0; i < word.length; i++) { // basically uses fancy data type manipulation to check change the displayed text.
                                    if (word[i] == text) {
                                        let arr = displayed.split(" ");
                                        arr[i] = word[i].toUpperCase();
                                        displayed = arr.join(" ");
                                    }
                                }
                                await context.sendActivity(Helper.guessMade(mistakesMade, displayed, word));
                                if (displayed.split(" ").join("").toLowerCase() === word) {
                                    await context.sendActivity("You win!!!");
                                    gameStarted = false;
                                    word = "";
                                    displayed = "";
                                    mistakesMade = 0;
                                    guessed = [];
                                    await context.sendActivity("Would you like to play again? (yes/no)");
                                }
                            }
                            else {
                                await context.sendActivity("You already guessed that.");
                            }
                        }
                    }
                }
            }


            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('Ready to play Hangman? (yes/no)');
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
         
    }
}

module.exports.EchoBot = EchoBot;
