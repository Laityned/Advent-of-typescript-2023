/** because "dashing" implies speed */
type Dasher = "💨";

/** representing dancing or grace */
type Dancer = "💃";

/** a deer, prancing */
type Prancer = "🦌";

/** a star for the dazzling, slightly mischievous Vixen */
type Vixen = "🌟";

/** for the celestial body that shares its name */
type Comet = "☄️";

/** symbolizing love, as Cupid is the god of love */
type Cupid = "❤️";

/** representing thunder, as "Donner" means thunder in German */
type Donner = "🌩️";

/** meaning lightning in German, hence the lightning bolt */
type Blitzen = "⚡";

/** for his famous red nose */
type Rudolph = "🔴";

type Reindeer =
  | Dasher
  | Dancer
  | Prancer
  | Vixen
  | Comet
  | Cupid
  | Donner
  | Blitzen
  | Rudolph;

type SRegion = Reindeer[];
type SRow = Reindeer[][];
type SField = Reindeer[][][];
type FSField = Reindeer[][];

type Concat<A extends Reindeer[], B extends Reindeer[]> = [...A, ...B];

type test_row = [["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"]];
type test_row1 = [["💨", "💨", "🦌"], ["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"]];

type FlattenRow<Row extends SRow> = Row extends [
  infer Trio extends SRegion,
  ...infer Rest extends SRow
]
  ? Concat<Trio, FlattenRow<Rest>>
  : [];

type FlattenSudoku<Field extends SField> = {
  [Row in keyof Field]: FlattenRow<Field[Row]>;
};

type ValidateGroup<Group extends SRegion> = Reindeer extends Group[number]
  ? never
  : false;

type ValidateRow<Row extends SRow> = ValidateGroup<FlattenRow<Row>>;

type ValidateRows<
  Field extends SField,
  Index extends number = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
> = Index extends number ? ValidateRow<Field[Index]> : never;

type TransposeMatrix<
  Field extends FSField,
  Row = Field["length"] extends 0 ? [] : Field[0]
> = {
  [X in keyof Row]: {
    [Y in keyof Field]: X extends keyof Field[Y] ? Field[Y][X] : never;
  };
};

type ValidateColumn<Column extends SRegion> = ValidateGroup<Column>;

type ValidateColumns<
  Field extends FSField,
  Index extends number = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
> = Index extends number ? ValidateColumn<Field[Index]> : never;

type MapBox<N extends number> = [
  [[0, 0], [1, 0], [2, 0]],
  [[3, 0], [4, 0], [5, 0]],
  [[6, 0], [7, 0], [8, 0]],
  [[0, 1], [1, 1], [2, 1]],
  [[3, 1], [4, 1], [5, 1]],
  [[6, 1], [7, 1], [8, 1]],
  [[0, 2], [1, 2], [2, 2]],
  [[3, 2], [4, 2], [5, 2]],
  [[6, 2], [7, 2], [8, 2]]
][N];

type GetBox<
  Field extends SField,
  Index extends number,
  Map extends number[][] = MapBox<Index>
> = [
  ...Field[Map[0][0]][Map[0][1]],
  ...Field[Map[1][0]][Map[1][1]],
  ...Field[Map[2][0]][Map[2][1]]
];

type ValidateSquare<
  Field extends SField,
  Index extends number = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
> = Index extends number ? ValidateGroup<GetBox<Field, Index>> : false;

type Validate<Field extends SField> = [
  | ValidateRows<Field>
  | ValidateColumns<FlattenSudoku<Field>>
  | ValidateSquare<Field>
] extends [never]
  ? true
  : false;
