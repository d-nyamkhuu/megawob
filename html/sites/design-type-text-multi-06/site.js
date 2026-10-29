(function () {
  'use strict';
  const C = { site: 'design-type-text-multi-06', title: 'Address Entry', instruction: 'left' };
  const SVG = 'http://www.w3.org/2000/svg';
  function svg(parent, cls, html) {
    const s = document.createElementNS(SVG, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('class', cls);
    s.innerHTML = html;
    parent.appendChild(s);
    return s;
  }
  function instruction(ctx, parent) {
    const text = ctx.instruction;
    const match = text.match(/^(.*?[.:])\s+(?=[^"]+:\s*")/);
    const note = ctx.util.el('div', 'ds-instruction', parent);
    ctx.util.el('strong', 'ds-instruction-title', note, match ? match[1] : 'Enter these values:');
    text
      .slice(match ? match[0].length : 0)
      .split(/,\s*(?=[^",]+:\s*")/)
      .forEach((line, i, lines) =>
        ctx.util.el('div', 'ds-instruction-line', note, line + (i < lines.length - 1 ? ',' : '')),
      );
  }
  function fitInstructions() {
    document.querySelectorAll('.ds-instruction').forEach((note) => {
      const parent = note.parentElement,
        cs = getComputedStyle(parent);
      const room = parent.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      if (note.getBoundingClientRect().height <= room) return;
      const title = note.querySelector('strong');
      const original = parseFloat(getComputedStyle(note).fontSize);
      const ratio = parseFloat(getComputedStyle(title).fontSize) / original;
      const resize = (size) => {
        note.style.setProperty('font-size', size + 'px', 'important');
        title.style.fontSize = size * ratio + 'px';
      };
      let size = original;
      while (note.getBoundingClientRect().height > room && size > original * 0.8) resize(--size);
      if (note.getBoundingClientRect().height > room) {
        note.classList.add('ds-note-compact');
        note.style.setProperty('line-height', '1.3', 'important');
        size = original;
        resize(size);
        while (note.getBoundingClientRect().height > room && size > 12) resize(--size);
      }
    });
  }
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const labels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const classic = er.bool(0.5);
      const placement = classic ? 'footer' : er.pick(['header', 'side']);
      const endLabel = classic ? 'Submit' : er.pick(labels);
      const cr = ctx.rng.fork('chrome/collide');
      const collide = cr.bool(0.3)
        ? cr.pick(labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))
        : null;
      const decoy = (button, label, collision = false) => {
        button.dataset.role = 'xtra';
        button.addEventListener('click', () => env.log('decoy', collision ? { label, collide: true } : { label }));
      };
      const endButton = (parent, cls) => {
        const b = u.el('button', 'ds-submit ' + cls, parent, endLabel);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      svg(
        logo,
        'ds-logo-ic',
        '<path d="M5 20l2-11h3V5h5l2 4h2l1 11H5zM10 9h5v11M8 12v2m0 2v2m5-11v2m0 2v2m0 2v2m5-5v2m0 2v2" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>',
      );
      u.el('span', 'ds-brand', top, C.title);
      let submit = null;
      if (!ctx.finish && placement === 'header') submit = endButton(top, 'ds-end-header');
      const wc = u.el('span', 'ds-wc', top);
      svg(wc, 'ds-wc-ic', '<path d="M5 12h14" stroke="#222" stroke-width="1.6" fill="none"/>');
      svg(
        wc,
        'ds-wc-ic',
        '<rect x="5" y="5" width="14" height="14" rx="2" stroke="#222" stroke-width="1.6" fill="none"/>',
      );
      svg(wc, 'ds-wc-ic', '<path d="M5 5l14 14M19 5L5 19" stroke="#222" stroke-width="1.6" fill="none"/>');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const mode = ctx.display === 'hidden' ? 'hidden' : ctx.display === 'toast' ? 'toast' : 'left';
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left') {
        const b = u.el('aside', 'ds-brief', main);
        instruction(ctx, b);
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = u.el('aside', 'ds-toast', content);
        instruction(ctx, note);
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', stage.parentElement);
      const clear = u.el('button', 'ds-btn ds-clear', foot, 'Clear form');
      clear.type = 'button';
      decoy(clear, 'Clear form');
      u.el('span', 'ds-spacer', foot);
      const draft = u.el('button', 'ds-btn ds-draft', foot, collide || 'Save draft');
      draft.type = 'button';
      decoy(draft, collide || 'Save draft', !!collide);
      if (!ctx.finish && placement === 'footer') submit = endButton(foot, 'ds-end-footer');
      const side = u.el('aside', 'ds-side', body);
      if (!ctx.finish && placement === 'side') submit = endButton(side, 'ds-end-side');
      u.el('h3', '', side, 'Details');
      const d = u.el('div', 'ds-detail', side);
      const ic = u.el('span', 'ds-doc', d);
      svg(
        ic,
        'ds-doc-ic',
        '<path d="M5 3h9l5 5v13H5zM14 3v5h5" fill="none" stroke="#603be2" stroke-width="1.3" stroke-linejoin="round"/><path d="M8 11h8M8 14h8M8 17h5" stroke="#603be2" stroke-width="1.1"/>',
      );
      const dt = u.el('div', '', d);
      u.el('div', 'ds-dt', dt, 'New address');
      u.el('div', 'ds-dd', dt, 'Fill in the requested information and submit.');
      u.el('hr', '', side);
      u.el('h4', '', side, 'Required fields');
      let req = ['Company', 'Address line 1', 'ZIP code'];
      try {
        const fs = (ctx.spec && ctx.spec.fields) || [];
        const r = fs.filter((f) => !f.blank).map((f) => f.label);
        if (r.length) req = r;
      } catch (e) {}
      req.forEach((t) => {
        const row = u.el('div', 'ds-req', side);
        u.el('span', 'ds-circ', row);
        u.el('span', '', row, t);
      });
      u.el('hr', '', side);
      u.el('h4', '', side, 'Tips');
      const tip = u.el('div', 'ds-tip', side);
      const ti = u.el('span', '', tip);
      svg(
        ti,
        'ds-tip-ic',
        '<circle cx="12" cy="12" r="9" fill="none" stroke="#3b6fd8" stroke-width="1.6"/><path d="M12 11v6M12 7.5v1" stroke="#3b6fd8" stroke-width="1.8" stroke-linecap="round"/>',
      );
      u.el('span', '', tip, 'Ensure the information matches the requested values exactly.');
      fitInstructions();
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
