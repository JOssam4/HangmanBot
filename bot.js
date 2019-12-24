// Author: James Ossam
// Date created: 12/5/2019
// Last updated: 12/23/2019

const { ActivityHandler } = require('botbuilder');
const Words = require("./NiceHangman");
const Helper = require("./HangmanHelper");

class EchoBot extends ActivityHandler {
    constructor() {
        let gameStarted = false;
        let difficulty = false;
        let word;
        let len;
        let mistakesMade = 0;
        let displayed; // the blanks that will be filled in.
        let guessed = [];
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            let text = context.activity.text;
            text = text.toLowerCase();
            if (text === "no") {
                if (gameStarted == false) {
                    await context.sendActivity('Come back if you want to play hangman.');
                }
                else {
                    await context.sendActivity('The game has started. Answers must be 1 character only.');
                }
            }
            else if (text === "yes") {
                if (!gameStarted && difficulty) {
                    gameStarted = true;
                    await context.sendActivity('Starting game.');
                    let wordFileLength = await Helper.getWordFileLength();
                    let lineNum = Helper.generateRandomNum(wordFileLength);
                    word = Helper.getWordFromLineNum(lineNum);
                    displayed = "_ ".repeat(word.length);
                    await context.sendActivity(Helper.drawEmptyHanger(displayed));

                }
                else if (!gameStarted && !difficulty) {
                    await context.sendActivity("Please choose a difficulty: (easy/normal/hard)");
                }
                else {
                    await context.sendActivity('The game has started. Please make your answers 1 character only.');
                }
            }
            else if (text === "easy" || text === "normal" || text === "hard") {
                if (gameStarted == false && !difficulty) {
                    difficulty = text;
                    gameStarted = true;
                    await context.sendActivity('Starting game.');
                    let wordFileLength = await Helper.getWordFileLength();
                    let lineNum = Helper.generateRandomNum(wordFileLength);
                    word = Helper.getWordFromLineNum(lineNum);
                    
                    if (text === "easy") {
                        len = word.length;
                        word = Words.getWordsByLength(len);
                        displayed = "_ ".repeat(len);
                    }

                    else if (text === "normal") {
                        displayed = "_ ".repeat(word.length);
                        len = word.length;
                        
                    }
                    await context.sendActivity(Helper.drawEmptyHanger(displayed));
                    
                }
                else if (gameStarted) {
                    await context.sendActivity("The game has already started. Please make your guesses only 1 character.");
                }
                else if (difficulty) {
                    await context.sendActivity("The difficulty has already been selected! The game has started. Please make your guesses only 1 character.");
                }
            }

            else {
                if (!gameStarted) {
                    await context.sendActivity('Please answer yes/no');
                    await context.sendActivity(`You said ${text}`);
                }
                else if (!difficulty) {
                    await context.sendActivity('Please answer easy/normal/hard');
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
                        if (difficulty === "easy") {
                            if (!Words.isValidGuess(word, text)) {
                                mistakesMade++;
                                guessed.push(text);
                                await context.sendActivity(Helper.guessMade(mistakesMade, displayed, word.keys()[0], guessed)); // instead of rewriting this function, just give it the first possible word.
                                if (mistakesMade == 7) {
                                    gameStarted = false;
                                    difficulty = false;
                                    word.clear();
                                    displayed = "";
                                    mistakesMade = 0;
                                    guessed = [];
                                    await context.sendActivity("Play again? (yes/no)");
                                }   
                            }
                            else {
                                if (!guessed.includes(text)) {
                                    guessed.push(text);
                                    let arr = displayed.split(" ");
                                    let pos = Words.findPosForLetter(word, len, text);
                                    arr[pos] = text.toUpperCase();
                                    displayed = arr.join(" ");
                                    word = Words.setLetterAtPos(word, pos, text);
                                    displayed = Words.fillInAllPossibleBlanks(word, guessed, displayed, len);
                                    if (!displayed.includes("_")) {
                                        await context.sendActivity("You win!");
                                        await context.sendActivity(`Your word was: ${displayed}`);
                                        gameStarted = false;
                                        word = "";
                                        mistakesMade = 0;
                                        guessed = [];
                                        len = -1;
                                        difficulty = false;
                                        await context.sendActivity("Play again? (yes/no)");
                                    }
                                    else {
                                        await context.sendActivity(Helper.guessMade(mistakesMade, displayed, word, guessed));
                                    }
                                }
                                else {
                                    await context.sendActivity("You already guessed that.");
                                }
                                
                            }
                        }
                        else if (!word.includes(text)) {
                            if (!guessed.includes(text)) {    
                                mistakesMade++;
                                guessed.push(text);
                                await context.sendActivity(Helper.guessMade(mistakesMade, displayed, word, guessed));
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
                                if (difficulty === "normal") {
                                    for (let i = 0; i < word.length; i++) { // basically uses fancy data type manipulation to check change the displayed text.
                                        if (word[i] == text) {
                                            let arr = displayed.split(" ");
                                            arr[i] = word[i].toUpperCase();
                                            displayed = arr.join(" ");
                                        }
                                    }
                                }
                                await context.sendActivity(Helper.guessMade(mistakesMade, displayed, word, guessed));
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
