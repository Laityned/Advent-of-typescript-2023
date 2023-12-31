type Reverse<Tuple> = Tuple extends [infer Head, ...infer Rest]
  ? [...Reverse<Rest>, Head]
  : [];

type FindSanta<T extends readonly string[]> = Reverse<T> extends [
  infer A,
  ...infer P
]
  ? A extends "🎅🏼"
    ? P["length"]
    : FindSanta<Reverse<P>>
  : never;
