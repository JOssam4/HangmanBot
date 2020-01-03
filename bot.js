// Author: James Ossam
// Date created: 12/5/2019
// Last updated: 12/27/2019

const { ActivityHandler } = require('botbuilder');
//const Words = require("./NiceHangman");
const Helper = require("./HangmanHelper");
const HashMap = require("hashmap");
//const Hard = require("./EvilHangman");
const Hangmen = require("./Hangmen");
const EasyHangman = Hangmen.EasyHangman;
const NormalHangman = Hangmen.NormalHangman;
const HardHangman = Hangmen.HardHangman;


class EchoBot extends ActivityHandler {
    constructor() {
        let gameStarted = false;
        let difficulty = false; 
        let game; // no matter the difficulty, this will represent the game object.
        super(); // given code.
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
                    // TBH I can't think of case where this code would run, but to prevent errors, I'm gonna keep it in for now.
                    gameStarted = true;
                    await context.sendActivity('Starting game.');
                    let wordFileLength = await Helper.getWordFileLength();
                    let lineNum = Helper.generateRandomNum(wordFileLength);
                    word = new HashMap();
                    word.set(Helper.getWordFromLineNum(lineNum), "");
                    //word = Helper.getWordFromLineNum(lineNum);
                    displayed = "_ ".repeat(word.keys()[0].length);
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
                if (!gameStarted && !difficulty) {
                    gameStarted = true;
                    await context.sendActivity("Starting game.");

                    if (text === "easy") {
                        game = new EasyHangman();
                    }
                    
                    else if (text === "hard") {
                        game = new HardHangman();
                    }

                    else {
                        game = new NormalHangman();
                    }
                    await context.sendActivity(Helper.drawEmptyHanger(game.displayed));
                    difficulty = game.difficulty; // making sure the game was initialized correctly.
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
                    else {
                        /**
                         * @todo there's a lot of similar code for all difficulty modes. See if they can be merged better.
                         */
                        if (difficulty === "easy" || difficulty === "normal") {
                            if (!game.isValidGuess(text)) {
                                game.mistakesMade += 1;
                                game.guessed.push(text);
                                await context.sendActivity(Helper.guessMade(game.mistakesMade, game.displayed, game.word, game.guessed)); // instead of rewriting this function, just give it the first possible word.
                                if (game.mistakesMade == 7) {
                                    gameStarted = false;
                                    difficulty = false;
                                    await context.sendActivity("Play again? (yes/no)");
                                }   
                            }
                            else {
                                if (!game.guessed.includes(text)) {
                                    game.dealWithCorrectGuess(text);
                                    if (!game.displayed.includes("_")) {
                                        await context.sendActivity("You win!");
                                        await context.sendActivity(`Your word was: ${game.displayed}`);
                                        gameStarted = false;
                                        difficulty = false;
                                        await context.sendActivity("Play again? (yes/no)");
                                    }
                                    else {
                                        await context.sendActivity(Helper.guessMade(game.mistakesMade, game.displayed, game.word, game.guessed));
                                    }
                                }
                                else {
                                    await context.sendActivity("You already guessed that.");
                                }
                                
                            }
                        }
                        else if (difficulty === "hard") {
                            if (!game.guessed.includes(text) && game.letterCanBeRemoved(text)) {
                                game.removeAllWithLetter(text);
                                game.mistakesMade++;
                                game.guessed.push(text);
                                await context.sendActivity(Helper.guessMade(game.mistakesMade, game.displayed, game.word, game.guessed));
                                if (game.mistakesMade == 7) {
                                    gameStarted = false;
                                    difficulty = false;
                                    await context.sendActivity("Play again? (yes/no)");
                                }
                            }
                            else {
                                if (!game.guessed.includes(text)) {
                                    game.dealWithCorrectGuess(text);
                                    if (!game.displayed.includes("_")) {
                                        gameStarted = false;
                                        difficulty = false;
                                        await context.sendActivity("You win!");
                                        await context.sendActivity(`Your word was: ${game.displayed}`);
                                        
                                        await context.sendActivity("Play again? (yes/no)");
                                    }
                                    else {
                                        await context.sendActivity(Helper.guessMade(game.mistakesMade, game.displayed, game.word, game.guessed));
                                    }
                                }
                                else {
                                    await context.sendActivity("You already guessed that!");
                                }
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
            gameStarted = false;
            difficulty = false;
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
         
    }
}

module.exports.EchoBot = EchoBot;
