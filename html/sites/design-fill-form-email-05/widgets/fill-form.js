// Luna's customer email, single-column tab form, action row and seeded-content fitting.
(function () {
  'use strict';

  function fitConsole(formPane, docPane, actions) {
    const grid = formPane.querySelector('.ff-grid');
    const shrink = (el, prop, ratio, min) => {
      const value = parseFloat(getComputedStyle(el).getPropertyValue(prop));
      if (Number.isFinite(value)) el.style.setProperty(prop, Math.max(min, value * ratio) + 'px', 'important');
    };
    for (let n = 0; n < 10 && grid.getBoundingClientRect().bottom > actions.getBoundingClientRect().top - 8; n++) {
      shrink(grid, 'padding-top', 0.8, 6);
      shrink(grid, 'row-gap', 0.8, 4);
      shrink(actions, 'padding-top', 0.8, 8);
      shrink(actions, 'padding-bottom', 0.8, 12);
      for (const input of grid.querySelectorAll('.ff-input,.ff-ddbtn')) shrink(input, 'height', 0.9, 24);
      for (const label of grid.querySelectorAll('.ff-label,.ff-choice')) shrink(label, 'font-size', 0.95, 12);
      for (const input of grid.querySelectorAll('.ff-input,.ff-ddbtn')) shrink(input, 'font-size', 0.95, 12);
    }
    const paper = docPane.querySelector('.xp-mail');
    const text = docPane.querySelector('.xp-mailtext');
    if (paper && text) {
      const available = docPane.clientHeight - paper.querySelector('h2').offsetHeight - paper.querySelector('.xp-mailmeta').offsetHeight;
      for (let n = 0; n < 12 && text.scrollHeight > available; n++) {
        for (const p of text.querySelectorAll('p')) shrink(p, 'margin-bottom', 0.8, 2);
        shrink(text, 'font-size', 0.95, 10);
      }
    }
  }

  env.widget({
    task: 'fill-form',
    site: 'design-fill-form-email-05',
    name: 'design',
    split: 'train',
    scenarios: ['email'],
    template: 'fill-form/document',
    design: {
      formTitle: 'Customer Information Form',
      tabsGrid: '1fr',
      parts: {
        renderEmail: (base) => (util, pane, d, rng) => {
          // Preserve the source widget's toolbar draw although Luna does not show a toolbar.
          if (d.style !== 'plain') {
            rng.pick([
              ['Reply', 'Forward', 'Archive'],
              ['Reply all', 'Forward', 'Delete'],
              ['Inbox', 'Reply', 'Mark unread'],
            ]);
          }
          const mail = util.el('div', 'xp-mail', pane);
          util.el('h2', 'xp-mailtitle', mail, 'Email from Customer');
          const meta = util.el('div', 'xp-mailmeta', mail);
          for (const [label, value] of [
            ['From:', `${d.from.name} <${d.from.addr}>`],
            ['To:', d.to],
            ['Subject:', d.subject],
            ['Date:', d.date],
          ]) {
            util.el('b', '', meta, label);
            util.el('span', '', meta, value);
          }
          const text = util.el('div', 'xp-mailtext', mail);
          util.el('p', '', text, d.greeting);
          for (const p of d.paragraphs) util.el('p', '', text, p);
          util.el('p', 'sig', text, d.signature.join('\n'));
          return mail;
        },
        arranged: (base, S) => (ctx, R) => {
          const actions = S.ctx.util.el('div', 'xp-actions', R.formPane);
          const submit = document.querySelector('.ds-submit');
          if (submit) actions.append(submit);
          const clear = S.ctx.util.el('button', 'xp-reset', actions, 'Clear');
          clear.type = 'button';
          clear.addEventListener('click', () => {
            // Reuse the field clear interactions without changing choice-widget state.
            for (const x of Object.values(S.st.el)) if (x.input) x.clear.click();
          });
          if (S.spec.fields.some((f) => !['text', 'date'].includes(f.kind))) clear.title = 'Clear text fields';

          const paper = R.docPane.querySelector('.xp-mail');
          const text = R.docPane.querySelector('.xp-mailtext');
          if (paper && text) {
            const available = R.docPane.clientHeight - paper.querySelector('h2').offsetHeight - paper.querySelector('.xp-mailmeta').offsetHeight;
            let fs = parseFloat(getComputedStyle(text).fontSize);
            while (text.scrollHeight > available && fs > 10) {
              fs -= 0.25;
              text.style.setProperty('font-size', fs + 'px', 'important');
            }
          }
        },
        finished: (base, S) => (ctx, R) => {
          const actions = R.formPane.querySelector('.xp-actions');
          fitConsole(R.formPane, R.docPane, actions);
        },
      },
    },
  });
})();
