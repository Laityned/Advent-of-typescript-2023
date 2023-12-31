type TicTacToeChip = "❌" | "⭕";
type TicTacToeEndState = "❌ Won" | "⭕ Won" | "Draw";
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = "  ";
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = "top" | "middle" | "bottom";
type TicTacToeXPositions = "left" | "center" | "right";
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTactToeBoard = TicTacToeCell[][];
type TicTacToeGame = {
  board: TicTactToeBoard;
  state: TicTacToeState;
};

type EmptyBoard = [["  ", "  ", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];

type NewGame = {
  board: EmptyBoard;
  state: "❌";
};

type Index = 0 | 1 | 2;

type GetX<XPos extends TicTacToeXPositions> = XPos extends "left"
  ? 0
  : XPos extends "center"
  ? 1
  : 2;

type GetY<YPos extends TicTacToeYPositions> = YPos extends "top"
  ? 0
  : YPos extends "middle"
  ? 1
  : 2;

type FlipTurn<State extends TicTacToeState> = State extends "❌" ? "⭕" : "❌";

type UpdateRow<
  Row extends TicTacToeCell[],
  X extends Index,
  Turn extends TicTacToeState
> = {
  [K in keyof Row]: K extends `${X}`
    ? Turn extends TicTacToeChip
      ? Turn
      : Row[K]
    : Row[K];
};

type UpdateBoard<
  Board extends TicTactToeBoard,
  Y extends Index,
  X extends Index,
  Turn extends TicTacToeState
> = Extract<
  {
    [K in keyof Board]: K extends `${Y}`
      ? UpdateRow<Board[K], X, Turn>
      : Board[K];
  },
  TicTactToeBoard
>;

type EmptyCell<Cell extends TicTacToeCell> = Cell extends TicTacToeEmptyCell
  ? true
  : false;

type ThreeTheSame<Row extends TicTacToeCell[]> = Row extends [
  infer A,
  ...infer B
]
  ? B[number] extends A
    ? A extends TicTacToeEmptyCell
      ? false
      : A
    : false
  : false;

type CheckRow<
  Board extends TicTactToeBoard,
  Iter extends number
> = ThreeTheSame<Board[Iter]>;

type CheckRows<
  Board extends TicTactToeBoard,
  Iter extends number = 0 | 1 | 2
> = Iter extends number
  ? CheckRow<Board, Iter> extends infer Chip extends TicTacToeChip
    ? Chip
    : never
  : never;

type CheckColumn<
  Board extends TicTactToeBoard,
  Iter extends number
> = ThreeTheSame<[Board[0][Iter], Board[1][Iter], Board[2][Iter]]>;

type CheckColumns<
  Board extends TicTactToeBoard,
  Iter extends number = 0 | 1 | 2
> = Iter extends number
  ? CheckColumn<Board, Iter> extends infer Chip extends TicTacToeChip
    ? Chip
    : never
  : never;

type DiagonalMap = [[[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]]];

type CheckDiagonal<
  Board extends TicTactToeBoard,
  N extends number
> = ThreeTheSame<
  [
    Board[DiagonalMap[N][0][0]][DiagonalMap[N][0][1]],
    Board[DiagonalMap[N][1][0]][DiagonalMap[N][1][1]],
    Board[DiagonalMap[N][2][0]][DiagonalMap[N][2][1]]
  ]
>;

type CheckDiagonals<
  Board extends TicTactToeBoard,
  Iter extends number = 0 | 1
> = Iter extends number
  ? CheckDiagonal<Board, Iter> extends infer Chip extends TicTacToeChip
    ? Chip
    : never
  : never;

type Winner<Board extends TicTactToeBoard> =
  | CheckRows<Board>
  | CheckColumns<Board>
  | CheckDiagonals<Board>;

type CheckFilled<Board extends TicTactToeBoard> =
  "  " extends Board[number][number] ? false : true;

type UpdateState<
  State extends TicTacToeState,
  IsWinner extends TicTacToeChip | never,
  IsFilled extends boolean
> = [IsWinner] extends [never]
  ? IsFilled extends true
    ? "Draw"
    : FlipTurn<State>
  : `${IsWinner & string} Won`;

type TicTacToe<
  Game extends TicTacToeGame,
  Position extends TicTacToePositions,
  NewX extends Index = Position extends `${string}-${infer X extends TicTacToeXPositions}`
    ? GetX<X>
    : 0,
  NewY extends Index = Position extends `${infer Y extends TicTacToeYPositions}-${string}`
    ? GetY<Y>
    : 0,
  IsEmpty extends boolean = EmptyCell<Game["board"][NewY][NewX]>,
  NextBoard extends TicTactToeBoard = UpdateBoard<
    Game["board"],
    NewY,
    NewX,
    Game["state"]
  >,
  IsWinner extends TicTacToeChip | never = Winner<NextBoard>,
  IsFilled extends boolean = CheckFilled<NextBoard>,
  NextState extends TicTacToeState = UpdateState<
    Game["state"],
    IsWinner,
    IsFilled
  >
> = IsEmpty extends true
  ? {
      board: NextBoard;
      state: NextState;
    }
  : Game;

type test = TicTacToe<NewGame, "top-center">;
