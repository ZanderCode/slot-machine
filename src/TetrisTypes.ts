// This will be useful for when we create a value table for the slot machine
// results. Checking combinations of types and their frequencies will help
// us generate a score value each roll.


export enum TetrisTypes{
    L,
    J, 
    S, 
    Z,
    O,
    I,
    T
}

// A function that helps determine the frequency at which certain
// blocks should appear. The total number of frequencies should
// add up to 50. This can help us create prize values as well.
//
//      ex: (1/50) probability to get a single Tetris.I Piece
//      This means that to get 5 in a row = (1/50)^5 = 0.0000000032% probability
//      The number of times we will have to try in order to get this is: 1/0.0000000032 = 312,500,000
//      so reward the player with 312,500,000 upon getting the 5 in a row (or less).
//
// Note: these frequencies count for a single slot "column" which is 
// why if we have 5 columns, our probability would be 5 frequiencies 
// multiplied together. The lower the total frequency value is, or the
// higher the odds, then we can reward the player big money points.
export function frequencies(type:TetrisTypes):number{
    
    let freq = 0;
    
    switch(type){
        case TetrisTypes.L:
            freq = 16;
            break;
        case TetrisTypes.J:
            freq =  16;
            break;
        case TetrisTypes.S:
            freq = 5;
            break;
        case TetrisTypes.Z:
            freq =  5;
            break;
        case TetrisTypes.O:
            freq =  5;
            break;
        case TetrisTypes.T:
            freq =  2;
            break;
        case TetrisTypes.I:
            freq =  1;
            break;
    }

    return freq/50;
}

export function getListOfTypes():TetrisTypes[]{

    return [];

}