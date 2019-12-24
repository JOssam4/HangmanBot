This is an Azure echobot that plays hangman with the user. It's still in development, so it hasn't (yet) been exported to any platform
outside the emulator.

What it currently does:
Asks the user if they want to play hangman (yes/no). If yes, then it asks the user to choose a difficulty mode (easy/normal/hard).

At the time of this edit (12/23/19), hard mode has not been implemented. If the user selects hard mode, the bot will tell the user that. 

The difference between easy and normal mode:
    In normal mode, the bot picks a word and the user has to guess it.
    In easy mode, the bot has a running list of possible words. The users' guesses just narrow the list. This way, the first guess can never be wrong.

Future steps: 
- make it stop bugging out
- Add more difficulty modes (evil hangman)
- make the code neater and more efficient
- export it to another platform (like slack)

