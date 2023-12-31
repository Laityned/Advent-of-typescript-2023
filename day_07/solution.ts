type AppendGood<T extends {}> = {
  [P in keyof T as P extends string ? `good_${P}` : P]: T[P];
};
