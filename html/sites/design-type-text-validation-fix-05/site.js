// Amiga Workbench "Contacts" window: bottom dock, contact header band, form task area, lower inspector.
(function () {
  'use strict';
  const NAMES = ['Anderson, Lisa', 'Baker, Tom', 'Carter, Monica', 'Chen, David', 'Evans, Rachel', 'Garcia, Miguel', 'Harris, Kevin', 'Jackson, Natalie', 'Kim, Daniel', 'Lopez, Sandra', 'Mitchell, Brian', 'Nguyen, Thao', 'Patel, Amit', 'Roberts, Julia', 'Smith, Aaron', 'Turner, Olivia', 'Walker, Nathan', 'Young, Kelly'];
  const DOCK = [['☻', 'Contacts'], ['▦', 'Calendar'], ['✉', 'Mail'], ['✔', 'Tasks'], ['▤', 'Notes']];
  const FALLBACK = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];

  function frameFor(ctx) {
    const u = ctx.util;
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();

    const top = u.el('header', 'ds-top', document.body);
    u.el('span', 'ds-brand', top, 'Amiga Workbench');
    const gad = u.el('span', 'ds-gads', top);
    ['−', '□', '×'].forEach((t) => u.el('i', '', gad, t));

    const win = u.el('div', 'ds-win', document.body);
    const wt = u.el('div', 'ds-wtitle', win);
    u.el('span', 'ds-wicon', wt, '▣');
    u.el('span', 'ds-wname', wt, 'Contacts');
    const tools = u.el('span', 'ds-tools', wt);
    u.el('i', 'ds-close', wt, '×');

    const mode = ctx.display === 'panel' ? 'panel' : ctx.display;
    const briefing = (parent, cls) => {
      const b = u.el('aside', cls, parent);
      if (cls === 'ds-brief') u.el('h2', '', b, 'Note');
      u.el('div', 'ds-instruction', b, ctx.instruction);
      return b;
    };
    if (mode === 'header') briefing(win, 'ds-header-note');

    const cols = u.el('div', 'ds-cols', win);
    const list = u.el('aside', 'ds-list', cols);
    u.el('div', 'ds-listhead', list, 'All Contacts ▾');
    const ul = u.el('div', 'ds-names', list);
    NAMES.forEach((n) => u.el('div', n.startsWith('Carter') ? 'sel' : '', ul, n));

    const mid = u.el('div', 'ds-mid', cols);
    const band = u.el('div', 'ds-band', mid);
    const pic = u.el('div', 'ds-pic', band);
    u.el('i', 'hair', pic);
    u.el('i', 'face', pic);
    u.el('i', 'body', pic);
    const who = u.el('div', 'ds-who', band);
    u.el('div', 'ds-bigname', who, 'Monica Carter');
    ['Marketing Manager', 'Riverside Creative', 'Portland, OR'].forEach((t) => u.el('div', '', who, t));
    const ph = u.el('div', 'ds-phones', band);
    u.el('div', '', ph, 'Work     (503) 555-0184');
    u.el('div', '', ph, 'Mobile   (503) 555-2761');

    const main = u.el('div', 'ds-main', mid);
    const stage = u.el('main', 'ds-stage', main);
    const foot = u.el('footer', 'ds-footer', mid);
    u.el('span', 'ds-ready', foot, 'Ready');
    const fright = u.el('span', 'ds-fright', foot);

    const insp = u.el('aside', 'ds-insp', cols);
    if (mode === 'panel') briefing(insp, 'ds-brief');
    const tabs = u.el('div', 'ds-itabs', insp);
    u.el('span', 'on', tabs, 'Details');
    u.el('span', '', tabs, 'Notes');
    const det = u.el('div', 'ds-det', insp);
    [['Contact ID:', '1027'], ['Type:', 'Business ▾'], ['Status:', 'Active ▾'], ['Source:', 'Conference ▾'], ['Added:', 'Mar 12, 1990'], ['Modified:', 'Mar 14, 1990']].forEach(([a, b]) => {
      const r = u.el('div', 'row', det);
      u.el('span', '', r, a);
      u.el('span', b.includes('▾') ? 'dd' : '', r, b);
    });
    u.el('div', 'ds-igh', insp, 'Groups:');
    const gb = u.el('div', 'ds-ibox', insp);
    [['Clients', 0], ['Marketing', 1], ['Partners', 0], ['Vendors', 0], ['Personal', 0]].forEach(([t, c]) => {
      const r = u.el('div', 'chk', gb);
      u.el('i', c ? 'on' : '', r, c ? '✓' : '');
      u.el('span', '', r, t);
    });
    u.el('div', 'ds-igh', insp, 'Tags:');
    const tb = u.el('div', 'ds-ibox tags', insp);
    u.el('div', '', tb, 'marketing');
    u.el('div', '', tb, 'event-1990');

    if (mode === 'toast') briefing(document.body, 'ds-toast');

    const dock = u.el('nav', 'ds-dock', document.body);
    DOCK.forEach(([g, t], i) => {
      const d = u.el('div', 'ds-dk' + (i === 0 ? ' on' : ''), dock);
      u.el('i', '', d, g);
      u.el('span', '', d, t);
    });

    let submit = null;
    if (!ctx.finish) {
      const er = ctx.rng.fork('chrome/end');
      const canonical = er.bool(0.5);
      let placement = 'header';
      let label = 'Finish';
      if (!canonical) {
        placement = er.pick(['footer', 'link']);
        const labels = ctx.content && ctx.content.END_LABELS;
        const pool = Array.isArray(labels) && labels.length ? labels : FALLBACK;
        label = String(er.pick(pool));
      }
      let collide = null;
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const labels = ctx.content && ctx.content.END_LABELS;
        const pool = (Array.isArray(labels) && labels.length ? labels : FALLBACK).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
        const options = [...new Set(pool)].filter((x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = cr.pick(options);
      }
      const addDecoy = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      const endButton = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (placement === 'header') {
        if (collide) addDecoy(tools, collide);
        submit = endButton(tools, 'ds-submit', label);
      } else if (placement === 'footer') {
        if (collide) addDecoy(fright, collide);
        submit = endButton(fright, 'ds-submit', label);
      } else {
        if (collide) addDecoy(fright, collide);
        submit = endButton(fright, 'ds-submit ds-submit-link', label);
      }
    }
    return { stage, submit };
  }

  env.site({
    name: 'design-type-text-validation-fix-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: { parts: { frame: () => frameFor } },
  });
})();
