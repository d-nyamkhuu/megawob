(function () {
  'use strict';
  const C = { 'site': 'design-read-figure-shades-12' };
  env.site({
    name: C.site,
    styles: ['site.css', 'ref.css'],
    initialOverlay: { kind: 'banner' },
    frame(ctx) {
      document.body.className = 'r12 instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'r-app', document.body),
        top = u.el('header', 'r-top', app);
      u.el('span', 'r-name', top, 'Color Match');
      const st = u.el('div', 'r-status', top);
      u.el('span', '', st, 'Task 1 of 1');
      u.el('i', 'r-sep', st);
      const ps = u.el('span', 'r-paused', st);
      u.el('b', '', ps);
      u.el('b', '', ps);
      ps.appendChild(document.createTextNode('Paused'));
      const panes = u.el('div', 'r-panes', app),
        left = u.el('section', 'r-left', panes);
      const compact =
        ctx.size && ((ctx.size.width || ctx.size.w || 0) < 1260 || (ctx.size.height || ctx.size.h || 0) < 700);
      const display = compact && ['panel', 'toast'].includes(ctx.display) ? 'header' : ctx.display;
      document.body.className = 'r12 instruction-' + display;
      const brief = u.el('h1', 'r-brief', left, ctx.display === 'hidden' ? '' : ctx.instruction);
      if (display !== 'header') brief.remove();
      const stage = u.el('div', 'r-stage', left);
      const right = u.el('aside', 'r-right', panes);
      if (display === 'panel') {
        u.el('div', 'r-instruction-panel', right, ctx.instruction);
      }
      if (display === 'toast') {
        u.el('div', 'r-instruction-toast', right, ctx.instruction);
      }
      const disc = u.el('div', 'r-disc', right);
      const svg = u.svg('svg', { width: 298, height: 296, viewBox: '0 0 298 296' }, disc);
      u.svg(
        'path',
        {
          d: 'M105 111C104 102 112 100 149 100S194 102 193 111L191 135C188 169 179 190 158 200C156 212 159 221 167 223C178 226 181 228 181 237L182 244C182 252 117 252 117 244L118 237C118 228 121 226 132 223C140 221 142 212 140 200C118 189 111 167 107 135Z',
          fill: '#5bc8a7',
        },
        svg,
      );
      u.svg(
        'path',
        {
          d: 'M107 123H83C84 154 98 180 125 180M191 123H215C214 154 200 180 173 180',
          fill: 'none',
          stroke: '#5bc8a7',
          'stroke-width': 13,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
        svg,
      );
      u.svg(
        'path',
        {
          d: 'M149 34v35M65 66l25 25M234 66l-25 25M38 172h32M229 172h32',
          fill: 'none',
          stroke: '#5bc8a7',
          'stroke-width': 4.5,
          'stroke-linecap': 'round',
        },
        svg,
      );
      u.el('h2', '', right, "You're doing great!");
      u.el('p', 'r-sub', right, 'Take a moment and look carefully at the tiles.');
      const toolWrap = u.el('div', 'r-tool-wrap', right);
      const ex = u.el('button', 'r-expand', toolWrap, '▼  Expand tools');
      ex.type = 'button';
      ex.setAttribute('aria-expanded', 'false');
      const tools = u.el('div', 'r-tools', toolWrap);
      tools.hidden = true;
      u.el('span', 'r-selection-count', tools, '0 selected');
      const clear = u.el('button', '', tools, 'Clear selection');
      clear.type = 'button';
      clear.addEventListener('click', () => stage.dispatchEvent(new Event('clear-selection')));
      ex.addEventListener('click', () => {
        tools.hidden = !tools.hidden;
        ex.textContent = tools.hidden ? '▼  Expand tools' : '▲  Collapse tools';
        ex.setAttribute('aria-expanded', String(!tools.hidden));
      });
      const toolNote = u.el(
        'p',
        'r-note',
        right,
        'Tools are hidden for a cleaner view. Click to show selection controls.',
      );
      ex.addEventListener('click', () => {
        toolNote.style.visibility = tools.hidden ? 'visible' : 'hidden';
      });
      const footer = u.el('footer', 'r-foot', app);
      u.el('span', '', footer, 'Select all matching tiles, then submit.');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          labels = (
            (ctx.content && ctx.content.END_LABELS) || [
              'Submit',
              'Done',
              'Finish',
              'Continue',
              'Save',
              'OK',
              'Confirm',
              'Apply',
              'Complete',
              "I'm done",
            ]
          ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
        const label = er.bool(0.75) ? 'Submit' : er.pick(labels);
        const placement = er.pick(['footer', 'footer', 'footer', 'footer', 'header', 'link']);
        const collideRng = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (collideRng.bool(0.3)) {
          const pool = labels
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
            .filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
          if (pool.length) collide = collideRng.pick(pool);
        }
        const decoyBtn = (parent, text, collides) => {
          const b = u.el('button', 'r-xtra', parent, text);
          b.type = 'button';
          b.addEventListener('click', () =>
            env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
          );
        };
        const endBtn = (parent, cls, text) => {
          const b = u.el(cls === 'r-endlink' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (collide && placement !== 'header') decoyBtn(st, collide, true);
        if (placement === 'header') {
          if (collide) decoyBtn(st, collide, true);
          submit = endBtn(st, 'r-submit r-top-submit', label);
        } else if (placement === 'link') {
          submit = endBtn(footer, 'r-endlink', label + ' ›');
        } else {
          submit = endBtn(footer, 'r-submit', label);
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      if (ctx.initial) {
        const original = document.querySelector('.r-expand');
        const r = original.getBoundingClientRect();
        const el = u.el('div', 'r-initial-fold', document.body);
        el.style.left = r.left + 'px';
        el.style.top = r.top + 'px';
        const dismiss = u.el('button', 'r-expand', el, '▼  Expand tools');
        dismiss.type = 'button';
        dismiss.addEventListener('click', () => {
          if (original.getAttribute('aria-expanded') === 'false') original.click();
          ctx.dismiss();
        });
        return { el, dismiss };
      }
      const el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
