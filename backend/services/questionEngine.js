export function buildQuestionSet(topic = 'logic') {
  const questions = [
    {
      id: 'q1',
      text: 'What comes next in the sequence: 2, 4, 8, 16, ?',
      answer: '32'
    },
    {
      id: 'q2',
      text: 'Which shape does not belong: circle, square, triangle, apple?',
      answer: 'apple'
    }
  ];

  return questions;
}
