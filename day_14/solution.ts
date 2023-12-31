type DecipherNaughtyList<T extends string> =
  T extends `${infer Name extends string}/${infer Rest extends string}`
    ? Name | DecipherNaughtyList<Rest>
    : T;
