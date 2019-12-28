This is an Azure echobot that plays hangman with the user. It's still in development, so it hasn't (yet) been exported to any platform
outside the emulator.

What it currently does:
Asks the user if they want to play hangman (yes/no). If yes, then it asks the user to choose a difficulty mode (easy/normal/hard).


The difference between easy and normal mode:
    In normal mode, the bot picks a word and the user has to guess it.

    In easy mode, the bot has a running list of possible words. All words without the users' guesses in them are removed. This way, the first guess can never be wrong.

    In hard mode, the bot has a running list of possible words. All words with the users' guesses in them are removed. This way, the first guess can never be right.

Future steps: 
- make it stop bugging out
- expand on existing difficulty modes
- make the code neater and more efficient
- MASSIVE code cleanup
- export it to another platform (like slack)

