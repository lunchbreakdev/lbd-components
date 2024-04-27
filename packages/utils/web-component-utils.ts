export const uniqueId = (
  (counter) => (str?: string) =>
    `:${str}${++counter}:`
)(0)
