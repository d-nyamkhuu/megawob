// Keeps the Notes document, toolbar details and status readout from the original editor widget.
env.widget({
  task: 'use-desktop-tools',
  site: 'design-use-desktop-tools-editor-01',
  name: 'design',
  split: 'train',
  scenarios: ['editor'],
  template: 'use-desktop-tools/workspace',
  design: {
    siteCssLast: true,
    css: '.at-win{left:0!important;top:0!important;width:100%!important;height:100%!important;border-radius:0;box-shadow:none}.at-pagearea{background:var(--panel);padding:0!important}.at-sheet{border:0;box-shadow:none;background:var(--panel);margin:0!important;width:100%!important;max-width:none!important;padding:26px 32px!important}',
    toolIcons: {
      bullet: '<g fill="currentColor" stroke="none"><circle cx="2.5" cy="3.5" r="1.25"/><circle cx="2.5" cy="8" r="1.25"/><circle cx="2.5" cy="12.5" r="1.25"/></g><path d="M6 3.5h9M6 8h9M6 12.5h9"/>',
    },
    toolHtml: {
      number: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1"><g fill="currentColor" stroke="none" font-family="Georgia,serif" font-size="5"><text x="1" y="5">1</text><text x="1" y="9.5">2</text><text x="1" y="14">3</text></g><path d="M6 3.5h9M6 8h9M6 12.5h9"/></svg>',
    },
    fontName: null,
    sizeInitial: 'Normal Text',
    sizeCur: (key, S) => {
      const label = S.fam.SIZE_LABEL[key];
      return label === 'Normal' ? 'Normal Text' : label;
    },
    footerReadout: false,
    docTitle: 'A Note About Birds',
    wordsLabel: (count) => `${count} words`,
    barColor: '#ee1717',
    parts: {
      edPainted: (base) => (E, m) => {
        base(E, m);
        // Keep the responsive design size whenever all text is visible. Fit
        // the actual formatted text, excluding the sheet's decorative padding.
        E.docEl.style.removeProperty('font-size');
        const preferred = parseFloat(getComputedStyle(E.docEl).fontSize);
        const bottom = E.area.getBoundingClientRect().bottom - 8;
        for (let size = preferred; size >= 13; size--) {
          E.docEl.style.setProperty('font-size', `${size}px`, 'important');
          if (E.docEl.getBoundingClientRect().bottom <= bottom) break;
        }
      },
      frame: () => (ctx) => {
        const { util } = ctx;
        const win = util.el('section', 'at-win', ctx.stage);
        const title = util.el('div', 'at-title', win);
        util.el('b', '', title, 'My Notes');
        const body = util.el('div', 'at-body', win);
        const main = util.el('div', 'at-main', body);
        const gear = util.el('button', '', title);
        gear.hidden = true;
        return { win, title, main, gear, appMenu: null };
      },
    },
  },
});
