// Design on the shared avoid-phishing/classic widget.
env.widget({
  task: 'avoid-phishing',
  site: 'design-avoid-phishing-report-01',
  name: 'design',
  split: 'train',
  scenarios: ['report'],
  template: 'avoid-phishing/classic',
  design: {
    widthInset: 0, heightInset: 0, compactWidth: 700,
    listWidth: '34%', listMinWidth: 190, listMaxWidth: 460, rowHeight: 82,
    readingPadding: 28, compactReadingPadding: 16, fontSize: 16, radius: '0px',
    parts: {
      layout: (base, S) => (ctx) => {
        const els = S.els;
        els.app = S.P.frame(ctx);
        els.shell = ctx.util.el('div', 'sp-shell', els.app);
        els.work = ctx.util.el('div', 'sp-work', els.shell);
        els.content = ctx.util.el('div', 'sp-content', els.work);
        const heading = ctx.util.el('div', 'mail-list-heading', els.content, `Inbox (${ctx.spec.records.length})`);
        heading.setAttribute('aria-hidden', 'true');
        els.footer = ctx.util.el('div', 'sp-status', els.app);
      },
    },
  },
});
