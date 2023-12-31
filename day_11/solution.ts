type SantaListProtector<T> = {
  +readonly [P in keyof T]: keyof T[P] extends never
    ? T[P]
    : SantaListProtector<T[P]>;
};
