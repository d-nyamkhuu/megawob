// Adds LedgerPro's read-only survey modal and its custom close label.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-popup-11',
  name: 'design',
  split: 'train',
  scenarios: ['popup'],
  template: 'act-in-time/arena',
  design: {
    stayLabel: 'Close survey',
    parts: {
      dialogContent: () => (ctx, box) => {
        const { util } = ctx;
        util.el('h3', '', box, 'Quick Survey');
        util.el(
          'p',
          '',
          box,
          "We'd love your feedback!\nThis will only take a minute.\n\nHow likely are you to recommend LedgerPro to a friend or colleague?",
        );
        const surveyScale = util.el('div', 'ut-survey-scale', box);
        for (let i = 0; i <= 10; i++) {
          const n = util.el('button', '', surveyScale, String(i));
          n.type = 'button';
        }
        util.el(
          'div',
          'ut-survey-hints',
          box,
          'Not at all likely　　　　　　　　　　　　　　 Extremely likely',
        );
        util.el('label', 'ut-survey-label', box, "What's one thing we could improve?");
        const surveyText = util.el('textarea', 'ut-survey-text', box);
        surveyText.placeholder = 'Type your answer here...';
        surveyText.readOnly = true;
        const surveySend = util.el('button', 'ut-survey-submit', box, 'Submit survey');
        surveySend.type = 'button';
      },
    },
  },
});
