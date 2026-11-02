// Keeps this site's inline date icon and fixed footer while using the shared invoice renderer.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-invoice-07',
  name: 'design',
  split: 'train',
  scenarios: ['invoice'],
  template: 'fill-form/document',
  design: {
    formTitle: null,
    dateIcon: {
      cls: 'ff-calendar',
      host: 'box',
      early: true,
      tag: 'span',
      focus: true,
      boxCls: 'has-calendar',
      svg: '<svg viewBox="0 0 28 28"><path d="M3 5h22v21H3z" fill="#eee" stroke="#111" stroke-width="2"/><path d="M3 5h22v6H3zM8 2v6M20 2v6" stroke="#111" stroke-width="3"/><path d="M7 15h3m4 0h3m3 0h2M7 20h3m4 0h3m3 0h2" stroke="#111" stroke-width="3"/></svg>',
    },
    parts: {
      fieldWrap: () => () => {},
      arranged: () => () => {},
      finished: () => (ctx, R) => {
        const { docPane, formPane } = R;
        const paper = docPane.querySelector('.ff-paper');
        if (paper) {
          let docFont = Math.min(18, docPane.clientHeight * 0.0278);
          for (; docFont >= 9; docFont -= 0.25) {
            docPane.style.setProperty('--doc-font', docFont + 'px');
            docPane.style.setProperty('--doc-gap', Math.max(3, docFont * 0.55) + 'px');
            if (docPane.scrollHeight <= docPane.clientHeight + 1) break;
          }
        }
        const form = formPane.querySelector('.ff-form');
        if (form) {
          let formFont = Math.min(23, formPane.clientHeight * 0.0525);
          let fieldGap = formPane.clientHeight * 0.024;
          const padding = parseFloat(getComputedStyle(formPane).paddingTop) * 2;
          for (let i = 0; i < 24; i++) {
            formPane.style.setProperty('--form-font', formFont + 'px');
            formPane.style.setProperty('--field-gap', fieldGap + 'px');
            if (form.offsetHeight <= formPane.clientHeight - padding) break;
            fieldGap = Math.max(2, fieldGap - 0.7);
            formFont = Math.max(11, formFont - 0.2);
          }
        }
      },
    },
  },
});
