export type Transformation = "none" | "shuffle";

export const shuffleArray = <T>(arr: T[]): void => {
  let i = 0,
    j = 0,
    tmp: T | null = null;
  for (i = arr.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
};

export const transformArray = <T>(arr: T[], transformation?: string): void => {
  if (transformation) {
    switch (transformation) {
      case "none":
        break;
      case "shuffle":
        shuffleArray(arr);
        break;
      default:
        console.log(`Unknown transformation "${transformation}"`);
        break;
    }
  }
};
