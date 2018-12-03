const { Chess } = require('./Chess');
//const initialBoard = `00000000000rnbqkbnr00pppppppp00--------00--------00--------00--------00PPPPPPPP00RNBQKBNR0000000000000000000000`;
const initialBoard = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNRR b KQkq -';
const results = Chess.getValidMoves(initialBoard,true);


// chessground posible moves format.
moves ={};
results.algebraicMoves.forEach(function (el) {
    let move = Object.entries(el)[0];
    if(!Array.isArray(moves[move[0]]))
        moves[move[0]] = [];
    moves[move[0]].push(move[1])
});

console.log(moves);
module.exports = moves;