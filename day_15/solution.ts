type RepeatArray<
  Toy extends string,
  N extends number,
  Arr extends string[] = []
> = Arr["length"] extends N ? Arr : RepeatArray<Toy, N, [...Arr, Toy]>;

type ObjectToUnion<T extends {}> = T[keyof T];

type BoxToys<Toy extends string, Boxes extends number> = ObjectToUnion<{
  [Box in Boxes]: RepeatArray<Toy, Box>;
}>;
