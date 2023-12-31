type Letters = {
  A: ["█▀█ ", "█▀█ ", "▀ ▀ "];
  B: ["█▀▄ ", "█▀▄ ", "▀▀  "];
  C: ["█▀▀ ", "█ ░░", "▀▀▀ "];
  E: ["█▀▀ ", "█▀▀ ", "▀▀▀ "];
  H: ["█ █ ", "█▀█ ", "▀ ▀ "];
  I: ["█ ", "█ ", "▀ "];
  M: ["█▄░▄█ ", "█ ▀ █ ", "▀ ░░▀ "];
  N: ["█▄░█ ", "█ ▀█ ", "▀ ░▀ "];
  P: ["█▀█ ", "█▀▀ ", "▀ ░░"];
  R: ["█▀█ ", "██▀ ", "▀ ▀ "];
  S: ["█▀▀ ", "▀▀█ ", "▀▀▀ "];
  T: ["▀█▀ ", "░█ ░", "░▀ ░"];
  Y: ["█ █ ", "▀█▀ ", "░▀ ░"];
  W: ["█ ░░█ ", "█▄▀▄█ ", "▀ ░ ▀ "];
  " ": ["░", "░", "░"];
  ":": ["#", "░", "#"];
  "*": ["░", "#", "░"];
};

type ExtendString<T extends string, U extends string> = `${T}${U}`;

type ExtendStringArray<
  T extends [string, string, string],
  U extends string[]
> = U extends [
  ...infer Rest,
  infer One extends string,
  infer Two extends string,
  infer Three extends string
]
  ? [
      ...Rest,
      ExtendString<One, T[0]>,
      ExtendString<Two, T[1]>,
      ExtendString<Three, T[2]>
    ]
  : U;

type ToAsciiArt<
  T extends string,
  Arr extends string[] = ["", "", ""]
> = T extends `${infer First}${infer Rest}`
  ? First extends "\n"
    ? ToAsciiArt<Rest, [...Arr, "", "", ""]>
    : Uppercase<First> extends keyof Letters
    ? Letters[Uppercase<First>] extends [string, string, string]
      ? ToAsciiArt<
          Rest,
          ExtendStringArray<
            [
              Letters[Uppercase<First>][0],
              Letters[Uppercase<First>][1],
              Letters[Uppercase<First>][2]
            ],
            Arr
          >
        >
      : ToAsciiArt<Rest, Arr>
    : ToAsciiArt<Rest, Arr>
  : Arr;
