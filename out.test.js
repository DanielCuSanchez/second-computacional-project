const input = {
  'q0': { 'a': 'q1', 'b': 'q2' },
  'q1': { 'a': 'q1', 'b': 'q2' },
  'q2': { 'a': 'q3', 'b': 'q4' },
  'q3': { 'a': 'q5', 'b': 'q2' },
  'q4': { 'a': 'q5', 'b': 'q4' },
  'q5': { 'a': 'q5', 'b': 'q5' }
}

//con el test1:
const outTest1 = {
  'q0': { 'a': 'q1', 'b': 'q2' },
  'q1': { 'a': 'q1', 'b': 'q2' },
  'q2': { 'a': 'q3', 'b': 'q4' },
  'q3': { 'a': 'q5', 'b': 'q2' },
  'q4': { 'a': 'q5', 'b': 'q4' },
  'q5': { 'a': 'q5', 'b': 'q5' }
}

//con el test2
const outTest2 = {
  'q0': { 'a': 'q1' },
  'q1': { 'a': 'q1', 'b': 'q2' },
  'q2': { 'a': 'q2', 'b': 'q2' }
}