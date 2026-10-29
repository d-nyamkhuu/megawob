(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-invoice-12',
    'brand': 'Amiga  Workbench',
    'title': 'Invoice Entry',
    'instruction': 'top',
    'rail': '',
    'menu': '',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const ball = u.el('span', 'ds-ball', top);
      u.el('span', 'ds-brand', top, 'Amiga  Workbench');
      u.el('span', 'ds-mem', top, '2,048,000 graphics mem   1,024,000 other mem');
      u.el('span', 'ds-clock', top, 'Mon 14 Sep 2026   10:24');
      u.el('span', 'ds-front', top);
      const body = u.el('div', 'ds-body', document.body);
      const icons = u.el('aside', 'ds-icons', body);
      const pictures = {
        disk: '<path d="M11 3H65L74 10V69H11Z" fill="#063fb4"/><path d="M23 4H61V31H23Z" fill="#d5d6d9"/><path d="M49 8H58V24H49Z" fill="#777"/><path d="M21 35H63V66H21Z" fill="#eee"/><path d="M25 40H60M25 45H60M25 50H60M25 55H60M25 60H60" stroke="#777"/><path d="M15 5V66M25 7H45" stroke="white"/>',
        drawer:
          '<path d="M2 22L15 10H83V48L72 61H2Z" fill="#a4a4a4"/><path d="M2 22H72L83 10M72 22V61" fill="none"/><path d="M8 28H65V54H8Z" fill="#ddd"/><path d="M12 32H61V49H12Z" fill="#999"/><path d="M30 37H47V42H30Z" fill="#ddd"/><path d="M5 24H69M10 29H62M17 13H78" stroke="white"/>',
        trash:
          '<path d="M22 18L25 70Q45 79 65 70L68 18Z" fill="#aaa"/><path d="M27 24L30 69M36 26V71M45 27V73M54 26V71M63 24L60 69" stroke="#111" stroke-width="4"/><path d="M25 24L28 68M40 28V69M57 28V68" stroke="white"/><ellipse cx="45" cy="18" rx="29" ry="10" fill="#ddd"/><ellipse cx="45" cy="17" rx="22" ry="5" fill="#555"/><path d="M35 16V6H55V16" fill="none" stroke-width="5"/><path d="M38 12V7H52" stroke="white"/>',
      };
      [
        ['Ram Disk', 'disk'],
        ['Work', 'drawer'],
        ['Documents', 'drawer'],
        ['Wastebasket', 'trash'],
      ].forEach(([t, k]) => {
        const i = u.el('div', 'ds-icon ds-icon-' + k, icons);
        const pic = u.el('i', '', i);
        pic.innerHTML =
          '<svg viewBox="' +
          (k === 'drawer' ? '0 5 90 65' : k === 'disk' ? '5 0 75 74' : '0 0 90 82') +
          '" shape-rendering="crispEdges"><g stroke="#111" stroke-width="2" stroke-linejoin="miter">' +
          pictures[k] +
          '</g></svg>';
        u.el('span', '', i, t);
      });
      const win = u.el('div', 'ds-window', body);
      const tb = u.el('div', 'ds-titlebar', win);
      u.el('b', 'ds-gad ds-close', tb);
      u.el('span', 'ds-wtitle', tb, C.title);
      u.el('b', 'ds-gad ds-zoom', tb);
      u.el('b', 'ds-gad ds-max', tb);
      u.el('b', 'ds-gad ds-close2', tb);
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endRng.bool(0.5);
      const placement = referenceEnd ? 'footer' : endRng.pick(['toolbar', 'link']);
      const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels);
      const collideRng = ctx.rng.fork('chrome/collide');
      let tools = null;
      function titleTools() {
        if (!tools) {
          tools = u.el('div', 'ds-title-tools', tb);
          tb.insertBefore(tools, tb.querySelector('.ds-zoom'));
        }
        return tools;
      }
      if (collideRng.bool(0.3)) {
        const labels = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (labels.length) {
          const label = collideRng.pick(labels);
          const decoy = u.el('button', 'ds-tool ds-xtra', titleTools(), label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      const content = u.el('div', 'ds-content', win);
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      const view = u.el('aside', 'ds-view', main);
      u.el('div', 'ds-view-h', view, 'View Options');
      const vb = u.el('div', 'ds-view-b', view);
      [
        ['Show grid', true],
        ['Fit to window', false],
        ['Monochrome', false],
      ].forEach(([t, on]) => {
        const r = u.el('button', 'ds-chk' + (on ? ' on' : ''), vb);
        r.type = 'button';
        r.setAttribute('aria-pressed', String(on));
        u.el('i', '', r);
        u.el('span', '', r, t);
        r.addEventListener('click', () => {
          r.classList.toggle('on');
          r.setAttribute('aria-pressed', String(r.classList.contains('on')));
        });
      });
      u.el('hr', '', vb);
      const sv = u.el('button', 'ds-save', vb, 'Save view');
      sv.type = 'button';
      const saveNote = u.el('div', 'ds-save-note', vb, '(Saves only presentation preferences)');
      sv.addEventListener('click', () => {
        env.log('decoy', { label: 'Save view' });
        view.dataset.preferences = JSON.stringify(
          [...vb.querySelectorAll('.ds-chk')].map((r) => r.classList.contains('on')),
        );
        saveNote.textContent = '(View preferences saved)';
      });
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          placement === 'toolbar'
            ? 'ds-tool ds-end-tool'
            : placement === 'link'
              ? 'ds-submit ds-end-link'
              : 'ds-submit',
          placement === 'toolbar' ? titleTools() : foot,
          endLabel,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cancel = u.el('button', 'ds-cancel', foot, 'Clear Fields');
      cancel.type = 'button';
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
