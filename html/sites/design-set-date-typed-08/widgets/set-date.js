// Design on templates/set-date/calendar.js.
env.widget({
  task: 'set-date',
  site: 'design-set-date-typed-08',
  name: 'design',
  split: 'train',
  scenarios: ['typed'],
  template: 'set-date/calendar',
  design: {
    title: 'Schedule an Appointment',
    parts: {
      heading: (base, S) => (ctx) => {
        const { card } = S;
        const { util } = ctx;
        util.el('div', 'fd-intro', card, 'Please complete the form below.  Fields marked with an asterisk (*) are required.');
      },
      buildTyped: (base, S) => (ctx) => {
        const { spec, card, geo } = S;
        const { util } = ctx;

        // The scheduling fields are application frame; only the masked date is scored.
        const scene = util.el('div', 'fd-scene', card);
        function extraField(label, kind, options) {
          const row = util.el('div', 'fd-scene-row', scene);
          const lab = util.el('label', 'fd-label', row, label);
          if (kind === 'menu') {
            const box = util.el('div', 'fd-scene-menu', row);
            const button = util.el('button', 'fd-scene-choice', box, '-- Please select --');
            button.type = 'button';
            const list = util.el('div', 'fd-scene-options', box);
            list.hidden = true;
            button.addEventListener('click', () => { list.hidden = !list.hidden; });
            options.forEach(text => {
              const option = util.el('button', '', list, text);
              option.type = 'button';
              option.addEventListener('click', () => { button.textContent = text; list.hidden = true; });
            });
            lab.addEventListener('click', () => button.focus());
          } else {
            const input = util.el(kind === 'notes' ? 'textarea' : 'input', 'fd-scene-input', row);
            if (kind !== 'notes') input.type = 'text';
            lab.addEventListener('click', () => input.focus());
          }
          return row;
        }
        extraField('Full name *', 'text');
        extraField('Email address *', 'text');
        extraField('Phone number', 'text');
        geo.body = scene;
        S.P.buildText(ctx, spec.mask, '', `(${spec.maskShown || spec.mask})`);
        extraField('Appointment time *', 'menu', ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM']);
        extraField('Reason for visit *', 'menu', ['Consultation', 'Follow-up', 'Routine appointment']);
        extraField('Additional notes', 'notes');
        const clear = document.querySelector('.ds-clear');
        if (clear) clear.addEventListener('click', () => {
          scene.querySelectorAll('input,textarea').forEach(input => { input.value = ''; });
          scene.querySelectorAll('.fd-scene-choice').forEach(button => { button.textContent = '-- Please select --'; });
          scene.querySelectorAll('.fd-scene-options').forEach(list => { list.hidden = true; });
          S.control.dispatchEvent(new Event('input', { bubbles: true }));
        });
      },
    },
  },
});
