const vm = require('vm');

const MAX_CODE_LENGTH = 5000;
const TIMEOUT_MS = 1000;

/** Entry point: dispatch by validation type. */
function validateSubmission(challenge, code) {
  if (typeof code !== 'string' || code.length === 0 || code.length > MAX_CODE_LENGTH) {
    return { correct: false, feedback: 'Code is missing or too long (max 5000 chars).' };
  }
  return challenge.validation.type === 'dsa'
    ? validateDsa(challenge, code)
    : validatePattern(challenge, code);
}

/** Web Dev challenges: the fix must be present, the bug must be gone. */
function validatePattern(challenge, code) {
  const { mustInclude = [], mustNotInclude = [] } = challenge.validation;
  for (const pat of mustInclude) {
    if (!code.includes(pat)) {
      return { correct: false, feedback: `Missing the fix: expected "${pat}".` };
    }
  }
  for (const pat of mustNotInclude) {
    if (code.includes(pat)) {
      return { correct: false, feedback: `The bug is still there: "${pat}".` };
    }
  }
  return { correct: true, feedback: 'All checks passed!' };
}

/** DSA challenges: run the submitted code in a sandbox against hidden test cases. */
function validateDsa(challenge, code) {
  const { functionName, testCases } = challenge.validation;
  for (const tc of testCases) {
    const source = [
      code,
      `;JSON.stringify((${functionName}).apply(null, ${JSON.stringify(tc.input)}))`,
    ].join('\n');
    try {
      const result = new vm.Script(source, { timeout: TIMEOUT_MS })
        .runInNewContext({ console: { log: () => {} } }, { timeout: TIMEOUT_MS });
      const expected = JSON.stringify(tc.expected);
      if (result !== expected) {
        return {
          correct: false,
          feedback: `Test failed: input ${JSON.stringify(tc.input)} → expected ${expected}, got ${result}.`,
        };
      }
    } catch (err) {
      const msg = /timed out/.test(err.message)
        ? 'Runtime error: execution timed out (likely an infinite loop).'
        : `Runtime error: ${err.message}`;
      return { correct: false, feedback: msg };
    }
  }
  return { correct: true, feedback: `All ${testCases.length} test cases passed!` };
}

module.exports = { validateSubmission, MAX_CODE_LENGTH };