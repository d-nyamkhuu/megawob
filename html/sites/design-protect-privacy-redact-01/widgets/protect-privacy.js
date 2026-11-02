// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-redact-01',
  name: 'design',
  split: 'train',
  scenarios: ['redact'],
  template: 'protect-privacy/classic',
  design: {
    parts: {
      view: (base, S) => (m) => {
        const P = S.P;
        const main = P.element('div', 'sp-main sp-redact-main', S.app);
        const area = P.element('div', 'sp-redact-area', main);
        const rail = P.element('aside', 'sp-redact-rail', area);
        P.element('h3', '', rail, 'Tools');
        P.tool(rail, 'tool:select', '↖  Select', m.tool === 'select');
        P.tool(rail, 'tool:redact', '▰  Redact', m.tool === 'redact' || m.tool === 'locked', S.spec.noRedact ? 'PRO' : null);
        P.tool(rail, 'tool:highlight', '✎  Highlighter', m.tool === 'highlight');
        P.element('div', 'sp-redact-divider', rail);
        P.element('h3', 'sp-zoom-label', rail, 'Zoom');
        const zoom = P.element('div', 'sp-redact-zoom', rail);
        P.element('button', '', zoom, '−'); P.element('b', '', zoom, '100%'); P.element('button', '', zoom, '+');

        const content = P.element('div', 'sp-redact-content', area);
        const head = P.element('div', 'sp-doc-h sp-redact-head', content);
        P.element('div', 't sp-redact-title', head, S.spec.title);
        P.element('span', 'sp-redact-meta', head, '▤  PDF  •  3 pages');
        const actions = P.element('div', 'sp-redact-actions', head);
        P.key(P.element('button', `sp-btn${m.marks.length ? ' pri' : ''}`, actions, `✓  Apply${m.marks.length ? ` (${m.marks.length})` : ''}`), 'apply');
        P.key(P.element('button', 'sp-btn', actions, '⟲  Revert'), 'revert');
        const exportWrap = P.element('div', 'sp-redact-export', actions);
        P.key(P.element('button', 'sp-btn', exportWrap, '⇧  Export  ﹀'), 'export');
        if (m.tool === 'locked') P.element('div', 'sp-banner', content, `Redaction is part of ${S.spec.org.name} Pro. Upgrade to permanently remove text and images.`);
        else if (m.tool === 'redact' && !m.marks.length && !m.burned.length) P.element('div', 'sp-banner', content, 'Click text to mark it for redaction, then Apply.');
        const pdf = P.element('div', 'sp-pdf sp-redact-pdf', content);
        const page = P.element('div', 'sp-page sp-redact-page', pdf);
        P.element('div', 'sp-report-headline', page, S.spec.org.name);
        P.element('div', 'sp-report-code', page, S.spec.title);
        P.element('div', 'sp-report-page-no', page, 'Page 1 of 3');
        P.element('div', 'sp-report-meta', page, `Prepared for ${S.spec.recipient} · ${S.spec.org.name}`);
        P.element('div', 'sp-report-rule', page);
        const body = P.element('div', 'sp-report-body', page);
        S.spec.tokens.forEach((t, i) => P.token(body, t, i, m));
        if (m.exported) P.element('div', 'sp-toast', main, `Exported ${S.spec.file}`);
      },
    },
  },
});
