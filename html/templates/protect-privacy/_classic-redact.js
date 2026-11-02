/* protect-privacy/classic: redact parts; existing design parts remain overridable. */
(function () {
  'use strict';
  env.template('protect-privacy/_classic-redact', () => ({
    install(BASE, state) {
      BASE.toolbar = (main, m) => {
        const tb = state.P.element('div', 'sp-tools', main);
        state.P.tool(tb, 'tool:select', '↖ Select', m.tool === 'select');
        state.P.tool(tb, 'tool:redact', '▮ Redact', m.tool === 'redact' || m.tool === 'locked', state.spec.noRedact ? 'PRO' : null);
        state.P.tool(tb, 'tool:highlight', '✎ Highlight', m.tool === 'highlight');
        state.P.element('span', 'sp-vsep', tb);
        state.P.key(state.P.element('button', `sp-btn sm${m.marks.length ? ' pri' : ''}`, tb, `Apply redactions${m.marks.length ? ` (${m.marks.length})` : ''}`), 'apply');
        state.P.key(state.P.element('button', 'sp-btn sm', tb, 'Revert'), 'revert');
        const sp = state.P.element('span', '', tb); sp.style.flex = '1';
        state.P.element('span', 'sp-muted', tb, state.spec.file).style.fontSize = '12px';
        state.P.key(state.P.element('button', 'sp-btn sm pri', tb, '⤓ Export PDF'), 'export');
      };

      BASE.banner = (main, m) => {
        if (m.tool === 'locked') state.P.element('div', 'sp-banner', main, `Redaction is part of ${state.orgName} Pro. Upgrade to permanently remove text and images.`);
        else if (m.tool === 'redact' && !m.marks.length && !m.burned.length) state.P.element('div', 'sp-banner', main, 'Click text to mark it for redaction, then Apply redactions.').style.background = 'color-mix(in srgb, var(--accent) 12%, var(--panel))';
      };

      BASE.document = (main, m) => {
        const pdf = state.P.element('div', 'sp-pdf', main);
        const page = state.P.element('div', 'sp-page', pdf);
        state.P.element('h4', '', page, state.spec.title);
        state.P.element('div', 'meta', page, `Prepared for ${state.spec.recipient} · ${state.orgName}`);
        const body = state.P.element('div', '', page);
        state.spec.tokens.forEach((t, i) => state.P.token(body, t, i, m));
      };

      BASE.tool = (tb, k, label, on, extra) => {
        const t = state.P.key(state.P.element('span', `sp-tool${on ? ' on' : ''}`, tb, label), k);
        if (extra) state.P.element('span', 'pro', t, extra);
        return t;
      };

      BASE.token = (body, t, i, m) => {
        const cls = m.burned.includes(i) ? ' bn' : m.marks.includes(i) ? ' mk' : m.hl.includes(i) ? ' hl' : '';
        state.P.key(state.P.element('span', `sp-tk${cls}`, body, t.w), `tok:${i}`);
        body.append(`${t.tail || ''} `);
      };

      BASE.view = (m) => {
        const main = state.P.element('div', 'sp-main', state.app);
        state.P.toolbar(main, m);
        state.P.banner(main, m);
        state.P.document(main, m);
        if (m.exported) state.P.element('div', 'sp-toast', main, `Exported ${state.spec.file}`);
      };
    },
  }));
})();
