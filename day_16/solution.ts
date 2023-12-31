type FindInRow<
  T extends string[],
  Column extends unknown[] = []
> = T[Column["length"]] extends "🎅🏼"
  ? Column["length"]
  : Column["length"] extends T["length"]
  ? never
  : FindInRow<T, [...Column, 1]>;

type FindSanta<T extends string[][], Row extends unknown[] = []> = FindInRow<
  T[Row["length"]]
> extends never
  ? FindSanta<T, [...Row, 1]>
  : [Row["length"], FindInRow<T[Row["length"]]>];
