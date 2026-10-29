(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-color-12',
    'task': 'read-figure',
    'scenario': 'color',
    'style': 'mint',
    'title': 'WorkBoard',
    'menu': 'Notebook / Visual Tasks',
    'note': '',
    'layout': 'utility',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css', 'vista.css'],
    frame(ctx) {
      document.body.className = 'vista instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'vwin', document.body),
        title = u.el('header', 'vtitle', app);
      u.el('span', 'vicon', title);
      u.el('span', '', title, 'Color Match — Practice');
      const wc = u.el('div', 'vctl', title);
      u.el('i', 'vmin', wc);
      u.el('i', 'vmax', wc);
      u.el('i', 'vclose', wc, '✕');
      const menu = u.el('nav', 'vmenu', app);
      ['File', 'Edit', 'View', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const body = u.el('div', 'vbody', app),
        idx = u.el('div', 'vindex', body);
      for (let i = 1; i <= 10; i++) u.el('span', i === 4 ? 'on' : '', idx, String(i));
      const center = u.el('div', 'center', body),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      u.el('p', 'vsub', center, 'Match the color shown in the sample by clicking the same color below.');
      const stage = u.el('section', 'stage', center);
      const side = u.el('aside', 'vside', body);
      const pv = u.el('button', 'vpreview', side);
      pv.type = 'button';
      pv.addEventListener('click', () => env.log('decoy', { label: 'Preview' }));
      u.el('b', '', pv, '▶');
      u.el('span', '', pv, 'Preview');
      u.el('p', 'vnote', side, 'See a preview of the task\n(does not submit your answer).'); // Episode controls use independent streams; the original task draws stay unchanged.
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const placement = er.pick(['footer', 'toolbar', 'status', 'footer']);
      const label = placement === 'footer' ? 'Submit' : er.pick(labels.filter((x) => x !== 'Submit'));
      const footer = u.el('footer', 'bottom', side),
        status = u.el('div', 'vstatus', app, 'Item 3 of 10');
      let tools = null,
        submit = null;
      const toolbar = () => tools || (tools = u.el('div', 'vtools', menu));
      if (!ctx.finish) {
        const parent = placement === 'footer' ? footer : placement === 'toolbar' ? toolbar() : status;
        submit = u.el('button', 'submit' + (placement === 'footer' ? '' : ' vsubmit-' + placement), parent, label);
        submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.dataset.role = 'submit';
        submit.addEventListener('click', ctx.submit);
      }
      if (cr.bool(0.3)) {
        const pool = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const text = cr.pick(pool),
            decoy = u.el('button', 'vdecoy', toolbar(), text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      // Side-card and notification notes leave the task stage and its anchors untouched.
      if (ctx.display === 'panel' || ctx.display === 'toast') {
        const note = u.el('section', 'vinstruction vinstruction-' + ctx.display, side);
        u.el('b', '', note, ctx.display === 'panel' ? 'Task instructions' : 'Practice reminder');
        note.append(brief);
        side.insertBefore(note, footer);
      } else if (ctx.display === 'hidden') {
        brief.remove();
      }
      brief.classList.toggle('vlong', ctx.instruction.length > 55);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
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
