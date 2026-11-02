// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-redact-03',
  name: 'design',
  split: 'train',
  scenarios: ['redact'],
  template: 'protect-privacy/classic',
  design: {
    parts: {
    fit(base) {
      return function (ctx) {
        const g = base(ctx);
        g.winW = g.fullW;
        g.winH = g.fullH;
        g.ax = 'left';
        const width = ctx.size.width;
        ctx.stage.style.setProperty('--pine-paper-font', `${Math.max(13, Math.min(19, width * 0.015))}px`);
        ctx.stage.style.setProperty('--pine-paper-pad-y', `${Math.max(16, Math.min(32, width * 0.024))}px`);
        ctx.stage.style.setProperty('--pine-paper-pad-x', `${Math.max(20, Math.min(58, width * 0.04))}px`);
        return g;
      };
    },
    view(base, S) {
      return function (m) {
        const P = S.P;
        const app = S.app;
        const workspace = P.element('div', 'pine-workspace', app);
        const tools = P.element('aside', 'pine-tools', workspace);
        P.tool(tools, 'tool:redact', 'Redact', m.tool === 'redact' || m.tool === 'locked', S.spec.noRedact ? 'PRO' : null);
        P.tool(tools, 'tool:highlight', 'Highlighter', m.tool === 'highlight');
        P.key(P.element('button', 'pine-action', tools, '✓\nApply'), 'apply');
        P.key(P.element('button', 'pine-action', tools, '↶\nRevert'), 'revert');
        const center = P.element('div', 'pine-center', workspace);
        const controls = P.element('div', 'pine-docbar', center);
        P.element('span', 'pine-doc-label', controls, 'Document:');
        P.element('span', 'pine-doc-name', controls, S.spec.title);
        P.element('span', 'pine-page-count', controls, '◀　▶　 Page:　1　 of 3');
        P.key(P.element('button', 'pine-export', controls, '▤　Export...'), 'export');
        P.banner(center, m);
        P.document(center, m);
        if (m.exported) P.element('div', 'sp-toast', center, `Exported ${S.spec.file}`);
        const inspector = P.element('aside', 'pine-inspector', workspace);
        P.element('h3', '', inspector, 'Document Properties');
        const detail = P.element('dl', 'pine-details', inspector);
        const values = [
          ['File Name:', S.spec.title || S.spec.file], ['Type:', 'HR Case Notes'],
          ['Case Number:', S.spec.file], ['Pages:', '3'], ['Created:', 'Feb 5, 1997'],
          ['Last Modified:', 'Feb 5, 1997'], ['Author:', S.spec.recipient || 'Karen Mitchell'],
          ['Department:', 'Human Resources'], ['Confidentiality:', 'Internal Use Only'],
        ];
        for (const [k, v] of values) P.detailRow(detail, k, v);
        P.element('div', 'pine-keyword-title', inspector, 'Keywords:');
        P.element('div', 'pine-keywords', inspector, S.spec.tokens.slice(0, 5).map((t) => t.w).join('\n'));
      };
    },
    },
  },
});
