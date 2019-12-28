// Author: James Ossam
// Date Created: 12/24/2019
// Last Updated: 12/27/2019

// The purpose of this bot is to play hangman as normal, but
// to make the game as hard as possible for the player.
// Instead of the user simply guessing a word that the computer selected, the computer
// will eleminate words based on the the user's input. Thus, this makes a
// difficult hangman mode.

// Contents of this file are meant to be called from bot.js.
// This file is based on NiceHangman.js, but many of the important functions will return
// the opposite of what they do in that file.

const HashMap = require("hashmap");

class Hard {
    
    /**
     * 
     * @param {HashMap} map the hashmap of all valid words
     * @param {String} letter the letter to remove
     * @returns {boolean} true if at least one word in @param map does not contain @param letter, false otherwise
     */
    static letterCanBeRemoved(map, letter) {
        /*
        let atLeastOneContains = false; // in order to make sure at least one, but not all words in wordlist contain the letter
        let atLeastOneDoesntContain = false;
        for (let i = 0; i < map.keys().length; i++) {
            if (map.keys()[i].includes(letter)) {
                atLeastOneContains = true;
            }
            else {
                atLeastOneDoesntContain = true;
            }
            if (atLeastOneDoesntContain && atLeastOneContains) {
                return true;
            }
        }
        return (atLeastOneContains && atLeastOneDoesntContain);
    */
        let otherMap = this.removeAllWithLetter(map, letter);
        return (otherMap.size > 0);

    }
    
    /**
     * 
     * @param {HashMap} map the map of all valid words 
     * @param {String} letter the invalid letter
     */
    static removeAllWithLetter(map, letter) {
        let newMap = new HashMap();
        map.forEach((value, key) => {
            if (!key.includes(letter)) {
                newMap.set(key, value);
            }
        })
        return newMap;
    }

    /**
     * @param {HashMap} map a hashmap containing all words
     * @param {Number} len the length of the target words
     * @param {String} letter the letter to be set
     * @returns {Number} an index [0, @param len) that corresponds to the index where most of the words in @param map DO NOT have the letter @param letter.
     */
    static findPosForLetter(map, len, letter) {
        let otherMap = new HashMap(); // each entry is position: (number of elements with that letter at that position.)
        for (let i = 0; i < len; i++) {
            otherMap.set(i, 0);
        }
        map.forEach((value, key) => {
            for (let i = 0; i < len; i++) {
                if (key.charAt(i) === letter) {
                    otherMap.set(i, otherMap.get(i) + 1);
                }
            }
        });
        let minPos = -1;
        let minVal = -1;
        otherMap.forEach((value, key) => {
            if (value > minVal) {
                minPos = key;
                minVal = value;
            }
        });
        return minPos;
    }

}

module.exports = Hard;