const { Board } = require('./Game.js');

class chessMoves {
  constructor() {
    
  }

  static getValidMoves(board,isFen = false) {

    let boardObj;
    if (isFen)
      boardObj = new Board(board, isFen);
    else
      boardObj = new Board(board);
    return {
      algebraicMoves :Array.from(boardObj.algebraicMoves),
      isCheck: boardObj.isCheck()
    };
  }
}
module.exports = {chessMove};

global = chessMove;



