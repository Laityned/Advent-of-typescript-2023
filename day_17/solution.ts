type RockPaperScissors = "👊🏻" | "🖐🏾" | "✌🏽";

type WhoWins<
  You extends RockPaperScissors,
  Me extends RockPaperScissors
> = Me extends You
  ? "draw"
  : Me extends "👊🏻"
  ? You extends "✌🏽"
    ? "win"
    : "lose"
  : Me extends "🖐🏾"
  ? You extends "👊🏻"
    ? "win"
    : "lose"
  : You extends "🖐🏾"
  ? "win"
  : "lose";
