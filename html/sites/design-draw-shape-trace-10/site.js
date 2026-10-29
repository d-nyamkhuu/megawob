(function () {
  'use strict';
  env.site({
    name: 'design-draw-shape-trace-10',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design mg' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const picture = (p, cls, name) => {
        const img = u.el('img', cls, p);
        img.src = 'sites/design-draw-shape-trace-10/assets/' + name + '.webp';
        img.alt = '';
        img.draggable = false;
        return img;
      };
      const leaf = (p, cls, w) => picture(p, cls, 'leaf');
      const tree = (p, cls, w) => picture(p, cls, 'tree');
      const page = u.el('div', 'mg-page', body);
      const mast = u.el('header', 'mg-mast', page);
      leaf(mast, 'mg-leaf l1', 64);
      const mt = u.el('div', 'mg-mtxt', mast);
      u.el('h1', '', mt, 'Maple Grove Community');
      u.el('div', 'mg-tag', mt, 'Good Neighbors  •  Brighter Tomorrows');
      leaf(mast, 'mg-leaf l2', 64);
      const est = u.el('div', 'mg-est', mast);
      u.el('div', '', est, 'Est. 1996');
      picture(est, 'mg-badge', 'badge');
      u.el('div', 'mg-ot', est, 'Our Town Online');
      const frame = u.el('div', 'mg-frame', page);
      const nav = u.el('nav', 'mg-nav', frame);
      const icons = {
        Home: [
          ['path', 'M3 13L13 3L23 13V23H3Z', '#f0e0c0'],
          ['path', 'M2 13L13 2L24 13', 'none', '#c0392b'],
          ['rect', [10, 15, 6, 8], '#8a4a2a'],
        ],
        Residents: [
          ['circle', [8, 8, 3.5], '#c8a070'],
          ['circle', [18, 8, 3.5], '#c8a070'],
          ['path', 'M2 24V16Q8 11 13 16V24Z', '#2a8a4a'],
          ['path', 'M13 24V16Q18 11 24 16V24Z', '#2a4aa0'],
        ],
        Events: [
          ['rect', [3, 5, 20, 19], '#fff'],
          ['rect', [3, 5, 20, 6], '#c0392b'],
          ['path', 'M7 14H9M12 14H14M17 14H19M7 19H9M12 19H14M17 19H19', 'none', '#333'],
        ],
        'Photo Album': [
          ['rect', [5, 2, 16, 22], '#f4f4f4'],
          ['path', 'M8 7H18M8 11H18M8 15H18M8 19H14', 'none', '#333'],
        ],
        'Community Board': [
          ['path', 'M2 12L9 8L14 10L19 8L24 12L19 18L14 20L9 17Z', '#e0b080'],
          ['path', 'M9 8L14 13L19 8', 'none', '#333'],
        ],
        Contact: [
          ['rect', [2, 5, 22, 16], '#fff'],
          ['path', 'M2 5L13 14L24 5', 'none', '#333'],
        ],
      };
      const iconNames = ['home', 'residents', 'events', 'album', 'board', 'contact'];
      for (const [j, t] of ['Home', 'Residents', 'Events', 'Photo Album', 'Community Board', 'Contact'].entries()) {
        const a = u.el('a', '', nav);
        picture(a, 'mg-nav-icon mg-icon-' + iconNames[j], iconNames[j]);
        u.el('span', '', a, t);
        a.href = '#';
        a.onclick = (e) => e.preventDefault();
      }
      const inner = u.el('div', 'mg-inner', frame);
      const sub = u.el('div', 'mg-sub', inner);
      tree(sub, 'mg-tree', 18);
      u.el('h2', '', sub, 'Mouse Skills Corner');
      tree(sub, 'mg-tree', 18);
      const sm = u.el('div', 'mg-small', sub);
      sm.append('Small Town', document.createElement('br'), 'Big Connections');
      const content = u.el('div', 'mg-content', inner);
      const note = u.el('section', 'task-note mg-note', content);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      instruction.style.fontSize = `clamp(20px, ${Math.min(2.85, 170 / ctx.instruction.length)}vw, 48px)`;
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => {
          note.style.visibility = 'hidden';
          env.log('note-close');
        };
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('main', 'stage mg-stage', content);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer mg-actions', content);
      const clr = u.el('button', 'clear mg-clear', footer, 'Clear Path');
      clr.type = 'button';
      clr.onclick = () => {
        env.widgetDef.clear?.();
      };
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const defaultEpisode = er.bool(0.5);
        const placement = defaultEpisode ? 'footer-center' : er.pick(['subhead', 'footer-right', 'link']);
        const endBank =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const asLabel = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
        const submitLabel = endBank.map(asLabel).find((x) => x.trim().toLowerCase() === 'submit') || 'Submit';
        const label = defaultEpisode ? submitLabel : asLabel(er.pick(endBank));
        const target = placement === 'subhead' ? sub : footer;
        const cls =
          placement === 'link'
            ? 'mg-end-link'
            : `submit mg-submit${placement === 'footer-right' ? ' mg-submit-right' : ''}${placement === 'subhead' ? ' mg-submit-head' : ''}`;
        const tag = placement === 'link' ? 'a' : 'button';
        submit = u.el(tag, cls, target, placement === 'link' ? `${label} ›` : label);
        if (tag === 'button') submit.type = 'button';
        else submit.href = '#';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const endBank =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const own = submit ? (submit.getAttribute('aria-label') || '').trim().toLowerCase() : '';
        const options = [
          ...new Set(
            endBank
              .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
              .filter((x) => x.trim().toLowerCase() !== own),
          ),
        ];
        if (options.length) {
          const value = collideRng.pick(options),
            d = u.el('button', 'mg-xtra', footer, value);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.onclick = () => env.log('decoy', { label: value, collide: true });
        }
      }
      const ft = u.el('div', 'mg-foot', inner);
      leaf(ft, 'mg-fl', 24);
      u.el('span', '', ft, 'Maps to People ~ People to a Stronger Maple Grove');
      leaf(ft, 'mg-fl', 24);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      u.el('h3', '', box, 'Product Updates Newsletter');
      u.el('p', '', box, 'Get occasional updates about new features and tips.');
      u.el('div', 'nl-input', box, 'Your email address (optional)');
      const cb = u.el('div', 'nl-check', box);
      u.el('span', 'nl-box', cb);
      u.el('span', '', cb, 'Send me product updates');
      const dismiss = u.el('button', 'dismiss', box, 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      const x = u.el('button', 'nl-x', box, '✕');
      x.type = 'button';
      x.onclick = () => dismiss.click();
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
