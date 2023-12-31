type Connect4Chips = "🔴" | "🟡";
type Connect4Cell = Connect4Chips | "  ";
type EmptyConnect4Cell = "  ";
type Connect4State = "🔴" | "🟡" | "🔴 Won" | "🟡 Won" | "Draw";

type ConnectGame = {
  board: Connect4Cell[][];
  state: Connect4Chips;
};

type EmptyBoard = [
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "]
];

type NewGame = {
  board: EmptyBoard;
  state: "🟡";
};

type GetFirstEmptyRowIndex<
  Field extends Connect4Cell[][],
  Column extends number,
  Arr extends unknown[] = []
> = Field[[...Arr, 1]["length"]][Column] extends EmptyConnect4Cell
  ? GetFirstEmptyRowIndex<Field, Column, [...Arr, 1]>
  : Arr["length"];

type FlipState<State extends Connect4Chips> = State extends "🔴" ? "🟡" : "🔴";

type UpdateRow<Row extends Connect4Cell[], Column extends number, Turn> = {
  [X in keyof Row]: X extends `${Column}` ? Turn : Row[X];
};

type UpdateBoard<
  Board extends Connect4Cell[][],
  Column extends number,
  Turn extends Connect4Chips
> = Extract<
  {
    [Y in keyof Board]: Y extends `${GetFirstEmptyRowIndex<Board, Column>}`
      ? UpdateRow<Board[Y], Column, Turn>
      : Board[Y];
  },
  Connect4Cell[][]
>;

type FourTheSame<Cell extends Connect4Cell[]> = Cell extends [
  infer A,
  ...infer B
]
  ? B[number] extends A
    ? A extends EmptyConnect4Cell
      ? false
      : A
    : false
  : false;

type FourInRow<Row extends Connect4Cell[]> = Row extends [
  infer A extends Connect4Cell,
  infer B extends Connect4Cell,
  infer C extends Connect4Cell,
  infer D extends Connect4Cell,
  ...infer Rest extends Connect4Cell[]
]
  ? FourTheSame<[A, B, C, D]> extends Connect4Cell
    ? A
    : FourInRow<[B, C, D, ...Rest]>
  : false;

type ToInt<Number extends string | number | Symbol> =
  Number extends `${infer N extends number}` ? N : never;

type FourInRows<
  Board extends Connect4Cell[][],
  Index extends number = ToInt<keyof Board>
> = Index extends number
  ? FourInRow<Board[Index]> extends infer Chip extends Connect4Chips
    ? Chip
    : never
  : never;

type Filled<Board extends Connect4Cell[][]> =
  EmptyConnect4Cell extends Board[number][number] ? false : true;

type TransposeMatrix<
  Board extends Connect4Cell[][],
  Row = Board["length"] extends 0 ? [] : Board[0]
> = Extract<
  {
    [X in keyof Row]: {
      [Y in keyof Board]: X extends keyof Board[Y] ? Board[Y][X] : [];
    };
  },
  Connect4Cell[][]
>;

type CheckDiagonalUp<Board extends Connect4Cell[][]> = Board extends [
  infer Row1 extends Connect4Cell[],
  infer Row2 extends Connect4Cell[],
  infer Row3 extends Connect4Cell[],
  infer Row4 extends Connect4Cell[],
  ...infer Rest extends Connect4Cell[][]
]
  ? [Row1, Row2, Row3, Row4] extends [
      [...infer D1 extends Connect4Cell[], any, any, any],
      [any, ...infer D2 extends Connect4Cell[], any, any],
      [any, any, ...infer D3 extends Connect4Cell[], any],
      [any, any, any, ...infer D4 extends Connect4Cell[]]
    ]
    ? FourInRows<TransposeMatrix<[D1, D2, D3, D4]>> extends never
      ? CheckDiagonalUp<[Row2, Row3, Row4, ...Rest]>
      : FourInRows<TransposeMatrix<[D1, D2, D3, D4]>>
    : never
  : never;

type CheckDiagonalDown<Board extends Connect4Cell[][]> = Board extends [
  infer Row1 extends Connect4Cell[],
  infer Row2 extends Connect4Cell[],
  infer Row3 extends Connect4Cell[],
  infer Row4 extends Connect4Cell[],
  ...infer Rest extends Connect4Cell[][]
]
  ? [Row1, Row2, Row3, Row4] extends [
      [any, any, any, ...infer D1 extends Connect4Cell[]],
      [any, any, ...infer D2 extends Connect4Cell[], any],
      [any, ...infer D3 extends Connect4Cell[], any, any],
      [...infer D4 extends Connect4Cell[], any, any, any]
    ]
    ? FourInRows<TransposeMatrix<[D1, D2, D3, D4]>> extends never
      ? CheckDiagonalDown<[Row2, Row3, Row4, ...Rest]>
      : FourInRows<TransposeMatrix<[D1, D2, D3, D4]>>
    : never
  : never;

type Winner<
  Board extends Connect4Cell[][],
  TBoard extends Connect4Cell[][] = TransposeMatrix<Board>
> =
  | FourInRows<Board>
  | FourInRows<TBoard>
  | CheckDiagonalDown<Board>
  | CheckDiagonalUp<Board>;

type UpdateState<
  State extends Connect4Chips,
  Winner extends Connect4Chips | never,
  Filled extends boolean
> = [Winner] extends [never]
  ? Filled extends true
    ? "Draw"
    : FlipState<State>
  : `${Winner & string} Won`;

type Connect4<
  Game extends ConnectGame,
  Column extends number,
  NextBoard extends Connect4Cell[][] = UpdateBoard<
    Game["board"],
    Column,
    Game["state"]
  >,
  IsWinner extends Connect4Chips | never = Winner<NextBoard>,
  IsFilled extends boolean = Filled<NextBoard>,
  NextState extends Connect4State = UpdateState<
    Game["state"],
    IsWinner,
    IsFilled
  >
> = {
  board: NextBoard;
  state: NextState;
};
