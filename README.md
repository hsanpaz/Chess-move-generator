# Legal chess move generator

A Javascript legal chess move generator based on the javascript [Chess Engine](https://github.com/robtaussig/chess) wrote by [@robtaussig](https://github.com/robtaussig).

I includes the en-passant implementation.

The module return an array of legal moves from a extended fen position.

## usage

Legal moves for fen start position (initial board state).

Fen : rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -

In the browser: 
```html
<script src="dist/movegen.js"></script>
```
in Node
```javascript
const { Chess } = require('./Chess');
```
legal moves 
```javascript
/*is possible to use the original board representation with isFen = false : 
const initialBoard = `00000000000rnbqkbnr00pppppppp00--------00--------00--------00--------00PPPPPPPP00RNBQKBNR0000000000000000000000`;*/
const initialBoard = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -';// fen start position.
let isFen = true;
let results = moveGenerator.chessMove.getValidMoves(initialBoard, isFen);// true for fen board
console.log(results);
//=> 
[
  {"a2": "a3"},
  {"a2": "a4"},
  {"b2": "b3"},
  {"b2": "b4"},
  {"c2": "c3"},
  {"c2": "c4"},
  {"d2": "d3"},
  {"d2": "d4"},
  {"e2": "e3"},
  {"e2": "e4"},
  {"f2": "f3"},
  {"f2": "f4"},
  {"g2": "g3"},
  {"g2": "g4"},
  {"h2": "h3"},
  {"h2": "h4"},
  {"b1": "a3"},
  {"b1": "c3"},
  {"g1": "f3"},
  {"g1": "h3"}
]
```

## To Do:


- get legal moves from san notation.