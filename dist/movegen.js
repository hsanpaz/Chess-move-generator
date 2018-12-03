(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.moveGenerator = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { Board } = require('./Game.js');

class chessMove {
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




},{"./Game.js":2}],2:[function(require,module,exports){
const EMPTY_SQUARE = '-';
const BLACK_ROOK = 'r';
const BLACK_BISHOP = 'b';
const BLACK_KNIGHT = 'n';
const BLACK_QUEEN = 'q';
const BLACK_KING = 'k';
const BLACK_PAWN = 'p';
const WHITE_ROOK = 'R';
const WHITE_BISHOP = 'B';
const WHITE_KNIGHT = 'N';
const WHITE_QUEEN = 'Q';
const WHITE_KING = 'K';
const WHITE_PAWN = 'P';
const WHITE = 'w';
const BLACK = 'b';
const BISHOP_MOVE_DIRECTIONS = [9, 11, -9, -11];
const KNIGHT_MOVE_DIRECTIONS = [-12, -21, -19, -8, 12, 21, 19, 8];
const KING_QUEEN_MOVE_DIRECTIONS = [-1, -11, -10, -9, 1, 11, 10, 9];
const ROOK_MOVE_DIRECTIONS = [-1, 1, -10, 10];
const WHITE_PAWN_STARTING_MOVE_DIRECTIONS = [-10, -20];
const BLACK_PAWN_STARTING_MOVE_DIRECTIONS = [10, 20];
const WHITE_PAWN_MOVED_MOVE_DIRECTIONS = [-10];
const BLACK_PAWN_MOVED_MOVE_DIRECTIONS = [10];
const whitePieces = new Set([WHITE_ROOK, WHITE_BISHOP, WHITE_KNIGHT, WHITE_QUEEN, WHITE_KING, WHITE_PAWN]);
const blackPieces = new Set([BLACK_ROOK, BLACK_BISHOP, BLACK_KNIGHT, BLACK_QUEEN, BLACK_KING, BLACK_PAWN]);
const isWhite = piece => whitePieces.has(piece);
const isBlack = piece => blackPieces.has(piece);
const BIT_ON = '1';
const BIT_OFF = '0';
const CURRENT_TURN_BLACK_BIT = 100;
////////////////////////////////////////////////castling
const WHITE_QUEENSIDE_ROOK_MOVED_BIT = 101;
const WHITE_KINGSIDE_ROOK_MOVED_BIT = 102;
const BLACK_QUEENSIDE_ROOK_MOVED_BIT = 103;
const BLACK_KINGSIDE_ROOK_MOVED_BIT = 104;
const WHITE_KING_MOVED_BIT = 105;
const BLACK_KING_MOVED_BIT = 106;
////////////////////////////////////////////////castling
const LAST_MOVE_FROM_TENS = 107;
const LAST_MOVE_FROM_ONES = 108;
const LAST_MOVE_TO_TENS = 109;
const LAST_MOVE_TO_ONES = 110;
const START_POSITION = '00000000000rnbqkbnr00pppppppp00--------00--------00--------00--------00PPPPPPPP00RNBQKBNR0000000000001111000000';
const positionString = (from, to) => `${from}-${to}`;
const movedToPositionFromString = move => Number(move.split(EMPTY_SQUARE)[1]);
const movedFromPositionFromString = move => Number(move.split(EMPTY_SQUARE)[0]);

//Does not check for castling through check. That is handled in getKingMoves.
const canCastleKingSide = (position, board, color) => {
  const emptySpaceBetween = board[position + 1] === EMPTY_SQUARE && board[position + 2] === EMPTY_SQUARE;
  if (emptySpaceBetween) {
    if (color === WHITE) {
      const whiteKingHasMoved = board[WHITE_KING_MOVED_BIT] === BIT_ON;
      const whiteKingSideRookHasMoved = board[WHITE_KINGSIDE_ROOK_MOVED_BIT] === BIT_ON;
      return !(whiteKingHasMoved || whiteKingSideRookHasMoved);
    } else {
      const blackKingHasMoved = board[BLACK_KING_MOVED_BIT] === BIT_ON;
      const blackKingSideRookHasMoved = board[BLACK_KINGSIDE_ROOK_MOVED_BIT] === BIT_ON;
      return !(blackKingHasMoved || blackKingSideRookHasMoved);
    }
  }
  return false;
};
const canCastleQueenSide = (position, board, color) => {
  const emptySpaceBetween = board[position - 1] === EMPTY_SQUARE && board[position - 2] === EMPTY_SQUARE && board[position - 3] === EMPTY_SQUARE;
  if (emptySpaceBetween) {
    if (color === WHITE) {
      const whiteKingHasMoved = board[WHITE_KING_MOVED_BIT] === BIT_ON;
      const whiteQueenSideRookHasMoved = board[WHITE_QUEENSIDE_ROOK_MOVED_BIT] === BIT_ON;
      return !(whiteKingHasMoved || whiteQueenSideRookHasMoved);
    } else {
      const blackKingHasMoved = board[BLACK_KING_MOVED_BIT] === BIT_ON;
      const blackQueenSideRookHasMoved = board[BLACK_QUEENSIDE_ROOK_MOVED_BIT] === BIT_ON;
      return !(blackKingHasMoved || blackQueenSideRookHasMoved);
    }
  }
  return false;
};
const getNextBoardPosition = (board, pos, replacement) => {
  return board.substr(0, parseInt(pos)) + replacement + board.substr(parseInt(pos) + 1);
};

const testMove = (move, board, withLastMove) => {
  let from = movedFromPositionFromString(move);
  let to = movedToPositionFromString(move);
  let placePiece = getNextBoardPosition(board, to, board[from]);
  let removePiece = getNextBoardPosition(placePiece, from, EMPTY_SQUARE);
  let changedTurn = getNextBoardPosition(removePiece, CURRENT_TURN_BLACK_BIT, board[CURRENT_TURN_BLACK_BIT] === BIT_ON ? BIT_OFF : BIT_ON);
  if (withLastMove) {
    let board = changedTurn;
    const fromTens = String(from)[0];
    const fromOnes = String(from)[1];
    const toTens = String(to)[0];
    const toOnes = String(to)[1];
    board = getNextBoardPosition(board, LAST_MOVE_FROM_TENS, fromTens);
    board = getNextBoardPosition(board, LAST_MOVE_FROM_ONES, fromOnes);
    board = getNextBoardPosition(board, LAST_MOVE_TO_TENS, toTens);
    board = getNextBoardPosition(board, LAST_MOVE_TO_ONES, toOnes);
    return board;
  }
  return changedTurn;
};

class Board {
  constructor(board = START_POSITION, isFen) {
    this.board = board;
    this.enPassant = '';
    if(isFen)
      this.board = this.getFromFen(board);    
    this.currentTurn = this.board[CURRENT_TURN_BLACK_BIT] === BIT_ON ? BLACK : WHITE;    
    this.legalMoves = this.findLegalMoves(this.board, this.currentTurn);
    this.algebraicMoves = this.getAlgebraicMoves(this.legalMoves); //LAN (Long algebraic notacion) e2-e4
  }

  getFromFen(fen){
    //fen satrt position example:  
    var fenFields = fen.split(' ');
    var rows = fenFields[0].split('/');
    var board = '';
    var boardRow = '0';
    rows.forEach(function(row){
        for (let j = 0; j < row.length; j++) {
          let piece = row[j];
          if ('12345678'.indexOf(piece) !== -1) {
            boardRow += EMPTY_SQUARE.repeat(piece)
          }else{
            boardRow += piece;
          }
        }
        boardRow+='0';
        board += boardRow;
        boardRow ='0'; 
    });

    board = '0000000000'+board+'0000000000';
    var flags = '';//Flags for castling an current turn.
    flags += fenFields[1] == BLACK ? BIT_ON:BIT_OFF;//current turn       
    flags += fenFields[2].indexOf(WHITE_KING) != -1 ? BIT_ON : BIT_OFF; //king side white
    flags += fenFields[2].indexOf(BLACK_KING) != -1 ? BIT_ON : BIT_OFF; //king side black
    flags += fenFields[2].indexOf(WHITE_QUEEN) != -1 ? BIT_ON : BIT_OFF; //queen side white
    flags += fenFields[2].indexOf(BLACK_QUEEN) != -1 ? BIT_ON : BIT_OFF; //queen side black
    flags += '0'.repeat(6);
    board += flags;
    this.enPassant = fenFields[3] != EMPTY_SQUARE ? BOARD_EQUIVALENT_SQUARES.indexOf(fenFields[3]):EMPTY_SQUARE;
    return board;
  }

   
  getAlgebraicMoves(legalMoves){
     let algebraicMoves = [];
     let from,fromStr,to,toStr='';
     legalMoves.forEach(element => {
       
       [fromStr,toStr]=element.split('-');
       from = BOARD_EQUIVALENT_SQUARES[parseInt(fromStr)];
       to   = BOARD_EQUIVALENT_SQUARES[parseInt(toStr)];
       let obj={};
       obj[from]=to;
       
       algebraicMoves.push(obj);
     });     
     return algebraicMoves;
  }



  castle(from, to) {
    if (from > to) {
      this.board = getNextBoardPosition(this.board, to + 1, this.board[from - 4]);
      this.board = getNextBoardPosition(this.board, from - 4, EMPTY_SQUARE);
    } else {
      this.board = getNextBoardPosition(this.board, to - 1, this.board[from + 3]);
      this.board = getNextBoardPosition(this.board, from + 3, EMPTY_SQUARE);
    }
  }

  findLegalMoves(board = this.board, currentTurn = this.currentTurn) {
    let legalMoves = [];
    for (let i = 0; i < board.length; i++) {
      switch (board[i]) {

      case BLACK_ROOK:
        if (currentTurn === BLACK) {
          legalMoves = legalMoves.concat(this.getRookMoves(i, board, currentTurn));
        }
        break;

      case BLACK_KNIGHT:
        if (currentTurn === BLACK) {
          legalMoves = legalMoves.concat(this.getKnightMoves(i, board, currentTurn));
        }
        break;

      case BLACK_BISHOP:
        if (currentTurn === BLACK) {
          legalMoves = legalMoves.concat(this.getBishopMoves(i, board, currentTurn));
        }
        break;

      case BLACK_QUEEN:
        if (currentTurn === BLACK) {
          legalMoves = legalMoves.concat(this.getQueenMoves(i, board, currentTurn));
        }
        break;

      case BLACK_KING:
        if (currentTurn === BLACK) {
          legalMoves = legalMoves.concat(this.getKingMoves(i, board, currentTurn));
        }
        break;

      case BLACK_PAWN:
        if (currentTurn === BLACK) {
          legalMoves = legalMoves.concat(this.getPawnMoves(i, board, currentTurn));
        }
        break;

      case WHITE_ROOK:
        if (currentTurn === WHITE) {
          legalMoves = legalMoves.concat(this.getRookMoves(i, board, currentTurn));
        }
        break;
      
      case WHITE_KNIGHT:
        if (currentTurn === WHITE) {
          legalMoves = legalMoves.concat(this.getKnightMoves(i, board, currentTurn));
        }
        break;

      case WHITE_BISHOP:
        if (currentTurn === WHITE) {
          legalMoves = legalMoves.concat(this.getBishopMoves(i, board, currentTurn));
        }
        break;
      
      case WHITE_QUEEN:
        if (currentTurn === WHITE) {
          legalMoves = legalMoves.concat(this.getQueenMoves(i, board, currentTurn));
        }
        break;

      case WHITE_KING:
        if (currentTurn === WHITE) {
          legalMoves = legalMoves.concat(this.getKingMoves(i, board, currentTurn));
        }
        break;

      case WHITE_PAWN:
        if (currentTurn === WHITE) {
          legalMoves = legalMoves.concat(this.getPawnMoves(i, board, currentTurn));
        }
        break;

      default:
        break;
      }
    }

    const legalMovesWithoutBeingInCheck = legalMoves.filter( el => {
      return !this.isCheck(currentTurn, testMove(el, board));
    });

    return legalMovesWithoutBeingInCheck;
  }

  getBishopMoves(position, board, color) {
    return this.getSlidingPiecesMovements(position, board, color, BISHOP_MOVE_DIRECTIONS); 
  }

  getColor(position, board = this.board) {
    const square = board[position];
    return isWhite(square) ? WHITE : isBlack(square) ? BLACK : false;
  }

  getKnightMoves(position, board, color) {
    return this.getSteppingPiecesMovements(position, board, color, KNIGHT_MOVE_DIRECTIONS); 
  }

  getKingMoves(position, board, color, checkCastle = true) {
    let legalMoves = [];
    if (checkCastle && canCastleKingSide(position, board, color)) {
      if ((this.squareHasAttackers(position, board, color) === false) && this.squareHasAttackers(position + 1, board, color) === false) {
        legalMoves.push(positionString(position, position + 2));
      }
    }
    
    if (checkCastle && canCastleQueenSide(position, board, color)) {
      if ((this.squareHasAttackers(position, board, color) === false) && this.squareHasAttackers(position - 1, board, color) === false) {
        legalMoves.push(positionString(position, position - 2));
      }
    }
    
    return legalMoves.concat(this.getSteppingPiecesMovements(position, board, color, KING_QUEEN_MOVE_DIRECTIONS));
  }

  
  getPawnMovements(position, board, color, increments) {
    let legalMoves = [];
    for (let i = 0; i < increments.length; i++) {
      let pointer = position + increments[i];
      if (board[pointer] === EMPTY_SQUARE) {
        legalMoves.push(positionString(position, pointer));
      } else {
        break;
      }
    }

    let leftCapture = this.getColor(position + increments[0] - 1, board);
    let rightCapture = this.getColor(position + increments[0] + 1, board);
    
    if (leftCapture && leftCapture !== color) {
      legalMoves.push(positionString(position, position + increments[0] - 1));
    }
    if (rightCapture && rightCapture !== color) {
      legalMoves.push(positionString(position, position + increments[0] + 1));
    }
    //enpassant implementation
    if(this.enPassant != EMPTY_SQUARE){
      let pawn = color == WHITE ? WHITE_PAWN:BLACK_PAWN;
      if(board[this.enPassant - increments[0] - 1]==pawn){
        legalMoves.push(positionString(this.enPassant - increments[0] - 1, this.enPassant));
      }
      if(board[this.enPassant - increments[0] + 1]==pawn){
        legalMoves.push(positionString(this.enPassant - increments[0] + 1, this.enPassant));
      }
      this.enPassant=EMPTY_SQUARE;
    }

    return legalMoves;
  }

  getPawnMoves(position, board, color) {
    if (color === WHITE && position > 70 && position < 79) {
      return this.getPawnMovements(position, board, color, WHITE_PAWN_STARTING_MOVE_DIRECTIONS);
    } else if (color === BLACK && position > 20 && position < 29) {
      return this.getPawnMovements(position, board, color, BLACK_PAWN_STARTING_MOVE_DIRECTIONS);
    } else if (color === WHITE){
      return this.getPawnMovements(position, board, color, WHITE_PAWN_MOVED_MOVE_DIRECTIONS);
    } else {
      return this.getPawnMovements(position, board, color, BLACK_PAWN_MOVED_MOVE_DIRECTIONS);
    }
  }

  getQueenMoves(position, board, color) {
    return this.getSlidingPiecesMovements(position, board, color, KING_QUEEN_MOVE_DIRECTIONS);
  }

  getRookMoves(position, board, color) {
    return this.getSlidingPiecesMovements(position, board, color, ROOK_MOVE_DIRECTIONS);
  }

  getSlidingPiecesMovements(position, board, color, increments) {
    let legalMoves = [];
    for (let i = 0; i < increments.length; i++) {
      let pointer = position;
      while (board[pointer]) {
        pointer += increments[i];
        if (board[pointer] === EMPTY_SQUARE) {
          legalMoves.push(positionString(position, pointer));
        } else if (this.getColor(pointer, board) && this.getColor(pointer, board) !== color) {
          legalMoves.push(positionString(position, pointer));
          break;
        } else {
          break;
        }
      }
    }
    return legalMoves;
  }

  getSteppingPiecesMovements(position, board, color, increments) {
    let legalMoves = [];
    for (let i = 0; i < increments.length; i++) {
      let pointer = position + increments[i];
      if (!board[pointer]) {
        continue;
      } else if (board[pointer] === EMPTY_SQUARE) {
        legalMoves.push(positionString(position, pointer));
      } else if (this.getColor(pointer, board) && this.getColor(pointer, board) !== color) {
        legalMoves.push(positionString(position, pointer));
      }
    }
    return legalMoves;
  }

  isAttackedBy(moves, board, color, type) {
    return moves
      .map(move => movedToPositionFromString(move))
      .filter(moveToPosition => {
        return board[moveToPosition].toUpperCase() === type.toUpperCase() &&
          this.getColor(moveToPosition, board) !== color;
      });
  }

  findBishopAttackers(position, board, color) {
    const bishopMoves = this.getBishopMoves(position, board, color);
    return this.isAttackedBy(bishopMoves, board, color, 'b');
  }

  findKingAttackers(position, board, color) {
    const kingMoves = this.getKingMoves(position, board, color, false);
    return this.isAttackedBy(kingMoves, board, color, 'k');
  }

  findKnightAttackers(position, board, color) {
    const knightMoves = this.getKnightMoves(position, board, color);
    return this.isAttackedBy(knightMoves, board, color, 'n');
  }

  findPawnAttackers(position, board, color) {
    const pawnMoves = this.getPawnMoves(position, board, color);
    return this.isAttackedBy(pawnMoves, board, color, 'p');
  }

  findQueenAttackers(position, board, color) {
    const queenMoves = this.getQueenMoves(position, board, color);
    return this.isAttackedBy(queenMoves, board, color, 'q');
  }

  findRookAttackers(position, board, color) {
    const rookMoves = this.getRookMoves(position, board, color);
    return this.isAttackedBy(rookMoves, board, color, 'r');                   
  }
  
  isCheck(currentPlayer = this.currentTurn, board = this.board) {
    let kingPos = currentPlayer === WHITE ? board.indexOf(WHITE_KING) : board.indexOf(BLACK_KING);
    
    return this.squareHasAttackers(kingPos, board, currentPlayer);
  }
  
  squareHasAttackers(pos, board, currentPlayer) {

    let bishopAttackers = this.findBishopAttackers(pos, board, currentPlayer);
    if (bishopAttackers.length > 0) return true;
    
    let rookAttackers = this.findRookAttackers(pos, board, currentPlayer);
    if (rookAttackers.length > 0) return true;

    let knightAttackers = this.findKnightAttackers(pos, board, currentPlayer);
    if (knightAttackers.length > 0) return true;

    let queenAttackers = this.findQueenAttackers(pos, board, currentPlayer);
    if (queenAttackers.length > 0) return true;

    let kingAttackers = this.findKingAttackers(pos, board, currentPlayer);
    if (kingAttackers.length > 0) return true;

    let pawnAttackers = this.findPawnAttackers(pos, board, currentPlayer);
    if (pawnAttackers.length > 0) return true;

    return false;
  }

  isLegalMove(from, to) {
    return this.legalMoves.indexOf(positionString(from, to) !== -1);
  }
}

const BOARD_EQUIVALENT_SQUARES = [
  '0', ' 0', ' 0', ' 0', ' 0', ' 0', ' 0', ' 0', ' 0', '0',
  '0', 'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8', '0',
  '0', 'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7', '0',
  '0', 'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6', '0',
  '0', 'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5', '0',
  '0', 'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4', '0',
  '0', 'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3', '0',
  '0', 'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2', '0',
  '0', 'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1', '0',
  '0', ' 0', ' 0', ' 0', ' 0', ' 0', ' 0', ' 0', ' 0', '0',
];

module.exports = {
  Board,
  positionString,
  movedToPositionFromString,
  movedFromPositionFromString,
  testMove,
  CURRENT_TURN_BLACK_BIT,
  BIT_ON,
  BIT_OFF,
  WHITE_QUEENSIDE_ROOK_MOVED_BIT,
  WHITE_KINGSIDE_ROOK_MOVED_BIT,
  BLACK_QUEENSIDE_ROOK_MOVED_BIT,
  BLACK_KINGSIDE_ROOK_MOVED_BIT,
  WHITE_KING_MOVED_BIT,
  BLACK_KING_MOVED_BIT,
  LAST_MOVE_FROM_TENS,
  LAST_MOVE_FROM_ONES,
  LAST_MOVE_TO_TENS,
  LAST_MOVE_TO_ONES,
};

},{}]},{},[1])(1)
});
