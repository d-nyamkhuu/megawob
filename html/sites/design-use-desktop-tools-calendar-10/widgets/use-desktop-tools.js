// Empty design anchors the calendar scenario preset to this original site.
env.widget({
  task: 'use-desktop-tools',
  site: 'design-use-desktop-tools-calendar-10',
  name: 'design',
  split: 'train',
  scenarios: ['calendar'],
  traits: { startHour: 8 },
  template: 'use-desktop-tools/workspace',
  design: {
    namePlaceholder: '',
    parts: {
      calFormFields: (base, S) => (C) => {
        base(C);
        C.timePicker = S.timePicker(C, { durationIn: 'form' });
        C.timePicker.startLabel.firstChild.nodeValue = 'Start time:';
        C.timePicker.startButton.textContent = '4:00 PM';
        C.timePicker.durationButton.textContent = '1 hour';
        C.timePicker.sel.start = 32;
        C.timePicker.sel.dur = 2;
      },
      calEventPainted: (base) => (C, m, event) => {
        base(C, m, event);
        if (event && C.timePicker) C.timePicker.sync(event);
      },
      calPaintForm: (base) => (C, m) => {
        base(C, m);
        C.form.hidden = false;
        C.hint.hidden = true;
      },
    },
  },
});
