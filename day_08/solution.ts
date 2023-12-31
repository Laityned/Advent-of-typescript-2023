type RemoveNaughtyChildren<T extends {}> = {
  [P in keyof T as P extends `${infer Behaviour}_${infer Name}`
    ? Behaviour extends "naughty"
      ? never
      : P
    : P]: T[P];
};
