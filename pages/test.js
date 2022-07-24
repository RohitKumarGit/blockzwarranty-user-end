const findContinuousubarraywitharithmeticMean = (arr, k) => {
  let start = 0;
  let end = k - 1;
  let sum = 0;
  let result = [];
  while (end < arr.length) {
    sum = 0;
    for (let i = start; i <= end; i++) {
      sum += arr[i];
    }
    if (sum / k === arr[start]) {
      result.push(start);
    }
    start++;
    end++;
  }
  return result;
};
console.log(
  findContinuousubarraywitharithmeticMean([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5)
);
