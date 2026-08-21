// 9 challenges: 3 easy, 3 medium, 3 hard. "validation" is never sent to the client.
module.exports = [
  // ───────────── EASY ─────────────
  {
    id: 'html-link-target',
    title: 'Broken Link Target',
    category: 'webdev',
    difficulty: 'easy',
    language: 'html',
    points: 100,
    timeLimit: 180,
    description:
      'The "View Projects" link should open in a new browser tab, but it opens in the same tab. Fix the bug in the anchor tag.',
    buggyCode: `<!DOCTYPE html>
<html>
<head>
  <title>Portfolio</title>
</head>
<body>
  <h1>Welcome!</h1>
  <p>Check out my latest work:</p>
  <a href="projects.html" target="blank">View Projects</a>
</body>
</html>`,
    hints: [
      'The problem is inside the target attribute of the anchor tag.',
      'To open a new tab, target must be the special value _blank — with an underscore!',
    ],
    explanation:
      'target="blank" is treated as a frame name that does not exist, so the browser opens the link in the same tab. target="_blank" opens a new tab.',
    validation: { type: 'pattern', mustInclude: ['target="_blank"'], mustNotInclude: ['target="blank"'] },
  },
  {
    id: 'dsa-array-sum',
    title: 'Incorrect Array Sum',
    category: 'dsa',
    difficulty: 'easy',
    language: 'javascript',
    points: 100,
    timeLimit: 180,
    description:
      'sumArray(arr) should return the total of all numbers in the array. One wrong line makes every result off by one. Find and fix it.',
    buggyCode: `function sumArray(arr) {
  let sum = 1;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}`,
    hints: [
      'Try it with an empty array: the correct answer is 0.',
      'The accumulator variable is initialized to the wrong value.',
    ],
    explanation:
      'let sum = 1 makes every result exactly 1 too high. Initializing sum = 0 gives the correct total.',
    validation: {
      type: 'dsa',
      functionName: 'sumArray',
      testCases: [
        { input: [[1, 2, 3]], expected: 6 },
        { input: [[-1, 0, 1]], expected: 0 },
        { input: [[]], expected: 0 },
        { input: [[5, 5, 5, 5]], expected: 20 },
      ],
    },
  },
  {
    id: 'css-selector-mismatch',
    title: 'Unstyled Submit Button',
    category: 'webdev',
    difficulty: 'easy',
    language: 'html',
    points: 100,
    timeLimit: 180,
    description:
      'The submit button should be green with white text, but it has no styling at all. The CSS selector and the button ID do not match. Fix the selector.',
    buggyCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    #submit-button {
      background: green;
      color: white;
      padding: 8px 16px;
    }
  </style>
</head>
<body>
  <form>
    <input type="text" placeholder="Your name">
    <button id="submit-btn" type="submit">Submit</button>
  </form>
</body>
</html>`,
    hints: [
      'CSS id selectors must exactly match the id attribute in the HTML.',
      'The button has id="submit-btn", but the CSS targets a different id.',
    ],
    explanation:
      'The CSS targets #submit-button while the button has id="submit-btn". Renaming the selector to #submit-btn applies the styles.',
    validation: { type: 'pattern', mustInclude: ['#submit-btn {'], mustNotInclude: ['#submit-button'] },
  },

  // ───────────── MEDIUM ─────────────
  {
    id: 'dsa-fizzbuzz',
    title: 'FizzBuzz Skips the Last Number',
    category: 'dsa',
    difficulty: 'medium',
    language: 'javascript',
    points: 200,
    timeLimit: 300,
    description:
      'fizzBuzz(n) should return an array from 1 to n: "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for both. The last number is currently missing. Fix the loop.',
    buggyCode: `function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i < n; i++) {
    if (i % 15 === 0) result.push("FizzBuzz");
    else if (i % 3 === 0) result.push("Fizz");
    else if (i % 5 === 0) result.push("Buzz");
    else result.push(String(i));
  }
  return result;
}`,
    hints: [
      'fizzBuzz(1) should return ["1"], but it returns [] — the loop never runs.',
      'Off-by-one: the loop condition excludes n itself. It should run while i <= n.',
    ],
    explanation:
      'The condition i < n stops one step too early. Changing it to i <= n includes the final number.',
    validation: {
      type: 'dsa',
      functionName: 'fizzBuzz',
      testCases: [
        { input: [3], expected: ['1', '2', 'Fizz'] },
        { input: [5], expected: ['1', '2', 'Fizz', '4', 'Buzz'] },
        { input: [1], expected: ['1'] },
        { input: [15], expected: ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz'] },
      ],
    },
  },
  {
    id: 'js-event-handler-mismatch',
    title: 'Button Click Does Nothing',
    category: 'webdev',
    difficulty: 'medium',
    language: 'html',
    points: 200,
    timeLimit: 300,
    description:
      'Clicking the button should show "Button clicked!", but nothing happens and the console throws an error. The handler name and the function name do not match. Fix the mismatch.',
    buggyCode: `<!DOCTYPE html>
<html>
<head>
  <script>
    function handleClick() {
      document.getElementById("message").textContent = "Button clicked!";
    }
  </script>
</head>
<body>
  <button onclick="onButtonClick()">Click me</button>
  <p id="message"></p>
</body>
</html>`,
    hints: [
      'The <script> block defines handleClick, but the button calls something else.',
      'Compare the onclick attribute with the function defined in the script.',
    ],
    explanation:
      'onclick="onButtonClick()" calls a function that does not exist, throwing a ReferenceError. Using onclick="handleClick()" wires the button to the real function.',
    validation: {
      type: 'pattern',
      mustInclude: ['onclick="handleClick()"'],
      mustNotInclude: ['onclick="onButtonClick()"'],
    },
  },
  {
    id: 'dsa-factorial',
    title: 'Factorial Skips Factors',
    category: 'dsa',
    difficulty: 'medium',
    language: 'javascript',
    points: 200,
    timeLimit: 300,
    description:
      'factorial(n) should return n! = n × (n−1) × … × 1. The recursion currently skips every second factor. Fix it.',
    buggyCode: `function factorial(n) {
  if (n === 0) return 1;
  return n * factorial(n - 2);
}`,
    hints: [
      'factorial(3) should be 3 × 2 × 1 = 6, but the code returns 3.',
      'The recursive call subtracts too much from n.',
    ],
    explanation:
      'n - 2 jumps over factors (5! becomes 5 × 3 × 1 = 15). Subtracting 1 keeps every factor.',
    validation: {
      type: 'dsa',
      functionName: 'factorial',
      testCases: [
        { input: [5], expected: 120 },
        { input: [1], expected: 1 },
        { input: [6], expected: 720 },
        { input: [0], expected: 1 },
      ],
    },
  },

  // ───────────── HARD ─────────────
  {
    id: 'dsa-binary-search',
    title: 'Binary Search Never Gives Up',
    category: 'dsa',
    difficulty: 'hard',
    language: 'javascript',
    points: 300,
    timeLimit: 420,
    description:
      'binarySearch(arr, target) should return the index of target, or -1 if it is missing. When the target is missing, the current code loops forever (the sandbox kills it after 1 second). Fix the loop.',
    buggyCode: `function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid;
    else high = mid - 1;
  }
  return -1;
}`,
    hints: [
      'Trace arr = [1,3,5,7,9], target = 8. The mid index keeps repeating forever.',
      'When arr[mid] < target, low should move past mid, not stay on it.',
    ],
    explanation:
      'low = mid can repeat the same index forever when the target is absent. Setting low = mid + 1 guarantees the interval shrinks every round.',
    validation: {
      type: 'dsa',
      functionName: 'binarySearch',
      testCases: [
        { input: [[1, 3, 5, 7, 9], 7], expected: 3 },
        { input: [[1, 3, 5, 7, 9], 8], expected: -1 },
        { input: [[2, 4, 6], 2], expected: 0 },
        { input: [[], 5], expected: -1 },
      ],
    },
  },
  {
    id: 'js-loop-closure',
    title: 'All Buttons Report the Last Number',
    category: 'webdev',
    difficulty: 'hard',
    language: 'javascript',
    points: 300,
    timeLimit: 420,
    description:
      'Each button should log its own index when clicked, but every button logs the same final number. This is a classic loop-closure bug. Fix it.',
    buggyCode: `const buttons = document.querySelectorAll(".btn");

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    console.log("Button " + i + " clicked");
  });
}`,
    hints: [
      'After the loop ends, every handler shares the same i variable.',
      'Replace the loop variable keyword with a block-scoped one.',
    ],
    explanation:
      'var is function-scoped, so all handlers close over the same i, which ends at buttons.length. Using let gives each iteration its own binding.',
    validation: { type: 'pattern', mustInclude: ['let i = 0'], mustNotInclude: ['var i = 0'] },
  },
  {
    id: 'dsa-two-sum',
    title: 'Two Sum Reuses the Same Index',
    category: 'dsa',
    difficulty: 'hard',
    language: 'javascript',
    points: 300,
    timeLimit: 420,
    description:
      'twoSum(nums, target) should return the indices of the two numbers that add up to target. You may not reuse the same element twice, but the current code does exactly that. Fix it.',
    buggyCode: `function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}`,
    hints: [
      'Try nums = [3, 2, 4], target = 6. The answer is [1, 2], but the code returns [0, 0].',
      'The inner loop starts at i, so an element can pair with itself. It should start just after i.',
    ],
    explanation:
      'j = i lets an element pair with itself (3 + 3 = 6). Starting j at i + 1 only pairs distinct elements.',
    validation: {
      type: 'dsa',
      functionName: 'twoSum',
      testCases: [
        { input: [[3, 2, 4], 6], expected: [1, 2] },
        { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
        { input: [[3, 3], 6], expected: [0, 1] },
        { input: [[1, 2, 3], 7], expected: [] },
      ],
    },
  },
];