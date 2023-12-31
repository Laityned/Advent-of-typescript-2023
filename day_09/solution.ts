type Reverse<T extends string> = T extends `${infer a}${infer b}`
  ? `${Reverse<b>}${a}`
  : "";
