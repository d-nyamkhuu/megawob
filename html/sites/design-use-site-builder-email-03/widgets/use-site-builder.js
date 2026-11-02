// Publishing studio design for the email campaign editor: campaign fields on top, the email below,
// the block library as a tall column on the right. No workspace nav, toolbar or footer.
env.widget({
  task: 'use-site-builder',
  site: 'design-use-site-builder-email-03',
  name: 'design',
  split: 'train',
  scenarios: ['email'],
  template: 'use-site-builder/studio',
  design: {
    emailWidth: 2000,
    parts: {
      toolbar: () => () => {},
      navigation: () => () => {},
      footer: (base) => () => {
        const bits = base();
        bits.status.parentElement.remove();
        return bits;
      },
      // Campaign fields only (no delivery checklist or tracking details).
      campaignInspector: (base, S) => () => {
        const work = S.els.work;
        const el = S.ctx.util.el;
        const inspector = S.P.pane('inspector', work, 'ab-inspector');
        Object.assign(inspector.style, { display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', columnGap: '18px', alignContent: 'start', padding: '10px 14px' });
        S.spec.fields.forEach((def) => S.P.field(inspector, def, false, 'inspector'));
        // paint() keeps a subject checkline up to date; it lives off-screen here.
        S.st.subjectCheck = S.P.checkline(el('div', '', null), 'Subject line missing');
      },
      document: (base, S) => () => {
        base();
        const el = S.ctx.util.el;
        const main = S.els.work.querySelector(':scope > .ab-main');
        const bar = el('div', 'ab-ref-section-title', null, 'Email Content');
        Object.assign(bar.style, { flex: 'none', height: '36px', display: 'flex', alignItems: 'center', padding: '0 14px', background: '#285f52', color: '#fff', fontSize: '18px', fontWeight: '600' });
        main.firstElementChild.replaceWith(bar);
        const page = main.querySelector('.ab-page');
        page.style.gridTemplateRows = `repeat(${S.spec.goalSlots.length}, minmax(0, 1fr))`;
      },
      composer: (base, S) => () => {
        const { P } = S;
        const work = S.els.work;
        P.campaignInspector();
        P.document();
        P.library();
        Object.assign(work.style, { display: 'grid', gridTemplateColumns: 'minmax(0,2.16fr) minmax(300px,1fr)', gridTemplateRows: 'minmax(160px,25%) minmax(0,1fr)', gap: '12px' });
        const place = (selector, style) => Object.assign(work.querySelector(selector).style, style);
        place(':scope > .ab-inspector', { gridColumn: '1', gridRow: '1', width: 'auto' });
        place(':scope > .ab-main', { gridColumn: '1', gridRow: '2', overflow: 'hidden' });
        place(':scope > .ab-side', { gridColumn: '2', gridRow: '1 / span 2', width: 'auto', overflow: 'hidden' });
      },
    },
  },
});
