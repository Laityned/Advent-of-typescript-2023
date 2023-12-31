type Alley = "  ";
type MazeItem = "🎄" | "🎅" | Alley;
type DELICIOUS_COOKIES = "🍪";
type MazeMatrix = MazeItem[][];
type Directions = "up" | "down" | "left" | "right";

type Position = [number, number];

type FindInRow<
  Row extends MazeItem[],
  Column extends unknown[] = []
> = Row[Column["length"]] extends "🎅"
  ? Column["length"]
  : Row["length"] extends Column["length"]
  ? never
  : FindInRow<Row, [...Column, 1]>;

type FindSanta<
  Matrix extends MazeMatrix,
  Row extends unknown[] = []
> = "🎅" extends Matrix[number][number]
  ? FindInRow<Matrix[Row["length"]]> extends never
    ? FindSanta<Matrix, [...Row, 1]>
    : [FindInRow<Matrix[Row["length"]]>, Row["length"]]
  : never;

type AddOne<
  Number extends number,
  Arr extends unknown[] = []
> = Arr["length"] extends Number
  ? [...Arr, 1]["length"]
  : AddOne<Number, [...Arr, 1]>;

type SubstractOne<
  Number extends number,
  Arr extends unknown[] = []
> = Number extends 0
  ? -1
  : [...Arr, 1]["length"] extends Number
  ? Arr["length"]
  : SubstractOne<Number, [...Arr, 1]>;

type UpdateCoordinates<
  Current extends Position,
  Direction extends Directions,
  X extends number = Current[0],
  Y extends number = Current[1]
> = Direction extends "up"
  ? [X, SubstractOne<Y>]
  : Direction extends "down"
  ? [X, AddOne<Y>]
  : Direction extends "left"
  ? [SubstractOne<X>, Y]
  : [AddOne<X>, Y];

type WinnerLeft<X extends number, Direction extends Directions> = X extends 0
  ? Direction extends "left"
    ? true
    : false
  : false;

type WinnerUp<Y extends number, Direction extends Directions> = Y extends 0
  ? Direction extends "up"
    ? true
    : false
  : false;

type WinnerRight<
  X extends number,
  Direction extends Directions,
  Matrix extends MazeMatrix,
  Row extends MazeItem[] = Matrix[0]
> = Direction extends "right"
  ? X extends Row["length"]
    ? true
    : false
  : false;

type WinnerDown<
  Y extends number,
  Direction extends Directions,
  Matrix extends MazeMatrix
> = Direction extends "down"
  ? Y extends Matrix["length"]
    ? true
    : false
  : false;

type Winner<
  Matrix extends MazeMatrix,
  Current extends Position,
  Direction extends Directions,
  X extends number = Current[0],
  Y extends number = Current[1]
> =
  | WinnerLeft<X, Direction>
  | WinnerUp<Y, Direction>
  | WinnerRight<X, Direction, Matrix>
  | WinnerDown<Y, Direction, Matrix> extends false
  ? false
  : true;

type FillArray<Array extends MazeItem[]> = {
  [X in keyof Array]: DELICIOUS_COOKIES;
};

type FillMatrix<Matrix extends MazeMatrix> = {
  [Y in keyof Matrix]: FillArray<Matrix[Y]>;
};

type Valid<
  Matrix extends MazeMatrix,
  NextPosition extends Position,
  X extends number = NextPosition[0],
  Y extends number = NextPosition[1]
> = Matrix[Y][X] extends Alley ? true : false;

type UpdateRow<
  Row extends MazeItem[],
  Current extends Position,
  Item extends MazeItem
> = {
  [X in keyof Row]: X extends `${Current[0]}` ? Item : Row[X];
};

type UpdateArray<
  Matrix extends MazeMatrix,
  Current extends Position,
  Item extends MazeItem
> = Extract<
  {
    [Y in keyof Matrix]: Y extends `${Current[1]}`
      ? UpdateRow<Matrix[Y], Current, Item>
      : Matrix[Y];
  },
  MazeMatrix
>;

type UpdateMatrix<
  Matrix extends MazeMatrix,
  Current extends Position,
  NextPosition extends Position
> = UpdateArray<UpdateArray<Matrix, Current, Alley>, NextPosition, "🎅">;

type Move<
  Matrix extends MazeMatrix,
  Direction extends Directions,
  Current extends Position = FindSanta<Matrix>,
  NextPosition extends Position = UpdateCoordinates<Current, Direction>,
  IsWinner extends boolean = Winner<Matrix, Current, Direction>,
  IsValid extends boolean = Valid<Matrix, NextPosition>,
  Cookies extends DELICIOUS_COOKIES[][] = FillMatrix<Matrix>,
  NextMatrix extends MazeMatrix = UpdateMatrix<Matrix, Current, NextPosition>
> = IsWinner extends true
  ? Cookies
  : IsValid extends true
  ? NextMatrix
  : Matrix;
