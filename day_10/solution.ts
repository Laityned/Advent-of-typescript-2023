type StreetSuffixTester<
  T extends string,
  U extends string
> = T extends `${infer P}${U}` ? true : false;
