type Count<
  Presents extends string[],
  Item extends string,
  Arr extends unknown[] = []
> = Presents extends [infer First, ...infer ShortList extends string[]]
  ? First extends Item
    ? Count<ShortList, Item, [...Arr, 1]>
    : Count<ShortList, Item, [...Arr]>
  : Arr["length"];
