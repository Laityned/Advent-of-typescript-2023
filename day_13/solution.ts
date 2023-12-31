type DayCounter<
  START extends number,
  END extends number,
  Arr extends unknown[] = [],
  Acc extends unknown[] = []
> = Arr["length"] extends END
  ? Arr["length"]
  :
      | DayCounter<
          START,
          END,
          [...Arr, Arr["length"]],
          Acc["length"] extends START ? Acc : [...Acc, Arr["length"]]
        >
      | (Acc["length"] extends START ? Arr["length"] : never);
