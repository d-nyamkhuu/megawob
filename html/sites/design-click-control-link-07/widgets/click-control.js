// Notebook resource rows place each link before its description and mirror the latest selection.
env.widget({
  task: 'click-control',
  site: 'design-click-control-link-07',
  name: 'design',
  split: 'train',
  scenarios: ['link'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      linkDecor: (base, S) => (ctx, art, links) => {
        S.P.linkResources(ctx, art, links, {
          intro: 'Our team shares short updates, helpful resources, and upcoming events. Browse the links below to learn more about each topic.',
          labels: [
            ' — Project overview and goals for this quarter.',
            ' — Details about the community program.',
            ' — Volunteer opportunities and how to get involved.',
            ' — Read the latest newsletter.',
            ' — Information about upcoming events.',
          ],
          after: true,
        });
      },
      linkSynced: () => (ctx, m, links) => {
        const out = document.querySelector('.selection-box');
        const last = m.clicks && m.clicks.length ? m.clicks[m.clicks.length - 1] : null;
        if (out) {
          out.textContent = last === null
            ? 'No link selected.'
            : 'Selected: ' + (typeof last === 'object'
              ? last.text || last.key || ''
              : links.find((a) => a.dataset.key === String(last))?.textContent || String(last));
        }
      },
    },
  },
});
