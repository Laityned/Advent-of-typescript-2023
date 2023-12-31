type Repeat<
  Item extends string,
  Nr extends number,
  Arr extends unknown[] = []
> = Arr["length"] extends Nr ? Arr : Repeat<Item, Nr, [...Arr, Item]>;

type Rebuild<
  List extends number[],
  Arr extends string[] = ["🛹", "🚲", "🛴", "🏄"]
> = List extends [infer Item extends number, ...infer Rest]
  ? Rest extends number[]
    ? Arr extends [
        infer First extends string,
        ...infer RestItems extends string[]
      ]
      ? [...Repeat<Arr[0], Item>, ...Rebuild<Rest, [...RestItems, First]>]
      : []
    : []
  : [];
