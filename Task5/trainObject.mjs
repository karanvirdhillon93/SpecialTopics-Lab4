//--------------------------------------------------------------------------//
//--------------------------BONEYARD CLASS-----------------------------------//

export class Boneyard {
    constructor() {
        //console.log(TrainSet)
        //Empty array to hold dominos 
        this.TrainSet = [];
        for (var i = 0; i <= 12; i++) {
            for (var ii = i; ii <= 12; ii++) {
                //inserting all values into our array
                this.TrainSet.push(new Tile(i, ii));
            }
        }
    }
    drawTile() {
        return this.TrainSet.pop();
    }

    isEmpty() {
        let check = this.TrainSet.length == 0 ? true : false;
        return check;
    }
    /*
    NOTE: Not my function I found this online , and used it in my code
    //lInk to resource: https://javascript.info/array-methods#shuffle-an-array
    */
    shuffle() {
        this.TrainSet.sort(() => 0.5 - Math.random());
        console.log("shuffling dominos");
    }
    /*
    Add a drawDouble(tileNumber) method that, given a tileNumber removes and returns
    the matching double-tile from the boneyard. For example drawTile(12) will remove and
    return the [12, 12] tile*/

    drawDouble(tileNumber) {
        //create a tile object
        let tile = new Tile(tileNumber, tileNumber);
        //lets loop through our list of the tiles and see a double exists
        for (var i = 0; i < this.TrainSet.length; i++) {
            if (tile.toString() == this.TrainSet[i].toString()) {
                console.log(`for: ${tile} ${this.TrainSet[i]}`);
                //cool a tile should exist, lets return it here
                return this.TrainSet.splice(i, 1);
            }
        }
        //if nothing is found we can just return null for now
        return null;
    }
}

//--------------------------------------------------------------------------//
//--------------------------TILE CLASS-----------------------------------//

export class Tile {
    constructor(left, right) {

        this.right = right;
        this.left = left;
        try {
            if (left < 0 || left > 12) {
                throw `Left Domino: ${left} to low or to high \nConstructor takes a left value between 0 and 12`;

            } else if (right < 0 || right > 12) {
                throw `RIght Domino ${right} to low or to high \nConstructor takes a right value between 0 and 12`;
            }
        } catch (err) {
            console.log(err);
        }

    }
    reverse() {
        // deconstructive assignment
        [this.left, this.right] = [this.right, this.left];
    }
    toString() {
        return `[ ${this.left}, ${this.right} ]`;
    }
}
//--------------------------------------------------------------------------//
//--------------------------PLAYER CLASS-----------------------------------//
export class Player {
    //Instantiated by a constructor(name, boneyard) that takes a name and an initialized boneyard.
    constructor(name, boneyard) {
        this.name = name;
        this.boneyard = new Boneyard();
        //Added in extra step to shuffle boneyard created
        this.boneyard.shuffle();
        this.hand = [];
    }
    //Has a drawTiles() method that draws the initial 15 tiles from the boneyard
    drawTiles() {
        for (var i = 0; i < 15; i++) {
            this.hand.push(this.boneyard.drawTile());

        }
    }
    //Has a drawTile() method that draws a single tile from the boneyard.
    drawTile() {
        this.hand.push(this.boneyard.drawTile());
    }
    /*Contains a toString() method that returns the string representation of the player as
    follows:
    Player: John
    Tiles: 1. [4, 5], 2. [2, 1], 3. [6, 9], … (tiles currently in John’s hand, numbered)*/
    toString() {
        var handCount = "";
        for (var i = 1; i <= this.hand.length; i++) {
            handCount = `${handCount} ${i}. ${this.hand[i-1]}`;
        }

        return `Player: ${this.name} \n Tiles: ${handCount} `;
    }
}

/*
Instantiated by a constructor(startNumber, player) that takes a start number between
0 and 12 and a player.*/
export class Train {
    constructor(startNumber, player) {
        this.gameTiles = [];
        this.startNumber = startNumber;
        this.lastNumber = startNumber;
        this.player = player;

        try {
            if (this.startNumber < 0) {
                throw `${this.startNumber}:Too Small`;
            } else if (this.startNumber > 12) {
                throw `${this.startNumber}: Too Big`;
            }
        } catch (error) {
            console.log(error);
        }

    }
    placeTile(tile) {
        if (this.canPlaceTile(tile)) {
            if (tile.left == this.lastNumber) {
                this.gameTiles.push(tile);
            } else {
                tile.reverse();
                this.gameTiles.push(tile);

            }
            this.lastNumber = tile.right;

        } else {
            throw new Error(`cant place tile`);
        }


    }
    canPlaceTile(tile) {
        if ((tile.left === this.lastNumber) || (tile.right === this.lastNumber)) {
            return true;
        } else {
            return false;
        }

    }
    toString() {

        return `[start number:${this.startNumber} ${this.gameTiles}]`;
    }

}
//--------------------------------------------------------------------------//
//--------------------------BOARD CLASS-----------------------------------//
export class Board {
    constructor(players, startTile) {
        this.players = players;
        this.startTile = startTile;
        //create a train collection 
        this.trainCollections = [];
        //mexican train placed started by first player?
        this.Mexican = new Train(startTile, this.players);

        //Error checking
        if ((players == null) || (startTile == null)) {
            throw new Error(`Player `);
        } else if (players == null) {
            throw new Error(`Players, cannot be null `);
        } else if (startTile == null) {
            throw new Error(`StartTile, cannot be null `);
        } else if (players.length > 6) {
            throw new Error(`Too many players entered`);
        }

        //Logic below
        //1)each player should draw Tiles
        //2)each player has there own train object


        for (let i = 0; i < this.players.length; i++) {
            this.players[i].drawTiles();
            //create trains
            this.trainCollections.push(new Train(startTile, this.players[i]));

        }


    }
    toString() {
        //empty return for now

        let contents = `Board \n ---- \nCenter: ${this.startTile} \n`;
        for (var i = 0; i < this.players.length; i++) {
            contents = contents + `${i}: ${this.players[i].name} ${this.players[i].name}: \n`;
        }
        return contents;
    }


}

//--------------------------------------------------------------------------//
//--------------------------GAME CLASS-----------------------------------//

export class Game {
    constructor(names) {
        this.names = names;
        //6 different player objects
        this.playerObjects = [];
        this.boneYard;
        this.gameBoard;
        for (let i = 0; i < this.names.length; i++) {
            //create player object, and push into object array
            this.playerObjects.push(new Player(this.names[i], this.boneYard));
        }
    }
    playRound(tileNumber) {
        this.boneYard = new Boneyard();
        this.boneYard.shuffle();
        this.gameBoard = new Board(this.playerObjects, tileNumber);
        console.log(this.gameBoard.toString());
        //player.toString()
        console.log(`players tiles:\n------------`);
        for (let i = 0; i < this.playerObjects.length; i++) {
            console.log(`${this.playerObjects[i].toString()} \n`);
        }

        console.log(this.boneYard);
    }
}