(function () {
  'use strict';
  env.site({
    name: 'design-type-text-complete-02',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = '';
      const win = u.el('div', 'os-window', document.body);
      const title = u.el('header', 'os-title', win);
      u.el('span', 'os-appicon', title, '♟');
      u.el('b', '', title, 'People Manager');
      u.el('button', 'os-close', title, '×');
      const menu = u.el('nav', 'os-menu', win);
      u.el('span', 'os-grip', menu, '↕');
      ['File', 'Edit', 'View', 'Record', 'Tools', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const tools = u.el('div', 'os-tools', win);
      [
        ['▧', 'New'],
        ['📂', 'Open'],
        ['▤', 'Delete'],
        ['⌕', 'Find'],
        ['▤', 'Print'],
      ].forEach(([i, t]) => {
        const b = u.el('button', 'os-tool', tools);
        u.el('span', 'os-tool-icon', b, i);
        u.el('span', '', b, t);
      });
      let submit = null;
      let label = 'Finish';
      let collide = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        if (!er.bool(0.5)) {
          label = String(
            er.pick(
              (ctx.content && ctx.content.END_LABELS) || [
                'Submit',
                'Done',
                'Finish',
                'Continue',
                'Save',
                'OK',
                'Confirm',
                'Apply',
              ],
            ),
          );
        }
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const p = ((ctx.content && ctx.content.END_LABELS) || ['Save', 'Update', 'Apply', 'Done']).map((x) =>
            typeof x === 'string' ? x : x.label || x.text || x.name,
          );
          const choices = p.filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (choices.length) collide = cr.pick(choices);
        }
        const end = u.el('button', 'os-finish', tools, label);
        end.type = 'button';
        end.dataset.role = 'submit';
        end.addEventListener('click', () => ctx.submit());
        submit = end;
        end.setAttribute('aria-label', label);
        end.title = label;
        if (collide) {
          const d = u.el('button', 'os-xtra', tools, collide);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        }
      }
      const body = u.el('div', 'os-body', win);
      const contacts = u.el('aside', 'os-contacts', body);
      u.el('h2', 'os-panehead', contacts, 'Contacts');
      const names = [
        'Baker, Simon',
        'Carter, Melissa',
        'Davies, Rachael',
        'Evans, Tom',
        'Grant, Heidi',
        'Hughes, Daniel',
        'Lawson, Paula',
        'Mills, Kevin',
        'Parker, Owen',
        'Reed, Nicola',
        'Roberts, James',
        'Turner, Elaine',
        'White, Colin',
        'Young, Sophie',
      ];
      names.forEach((n, i) => {
        const r = u.el('div', 'os-contact' + (i === 1 ? ' selected' : ''), contacts);
        u.el('span', 'os-person', r, '♟');
        u.el('span', '', r, n);
      });
      const center = u.el('section', 'os-center', body);
      const tabs = u.el('nav', 'os-tabs', center);
      ['Details', 'Address', 'Communication', 'Notes'].forEach((x, i) => {
        const t = u.el('div', 'os-tab' + (!i ? ' active' : ''), tabs, x);
      });
      const mode = ctx.display || 'hidden';
      if (mode === 'header') u.el('div', 'os-note os-note-header', center, ctx.instruction);
      const stage = u.el('main', 'os-stage', center);
      if (mode === 'panel') u.el('aside', 'os-note os-note-panel', center, ctx.instruction);
      if (mode === 'toast') {
        const n = u.el('div', 'os-note os-note-toast', center, ctx.instruction);
        const x = u.el('button', 'os-note-x', n, '×');
        x.onclick = () => n.remove();
      }
      const inspect = u.el('aside', 'os-inspector', body);
      u.el('h2', 'os-panehead', inspect, 'Properties');
      [
        ['Type:', 'Person'],
        ['Created:', '14 Mar 1989  10:24'],
        ['Last edited:', '14 Mar 1989  10:24'],
        ['Record size:', '1.2K'],
      ].forEach((pair) => {
        const r = u.el('div', 'os-prop', inspect);
        u.el('span', '', r, pair[0]);
        u.el('span', '', r, pair[1]);
      });
      u.el('hr', '', inspect);
      [
        ['Category:', 'Customer'],
        ['Status:', 'Active'],
      ].forEach((pair) => {
        const r = u.el('div', 'os-prop', inspect);
        u.el('span', '', r, pair[0]);
        u.el('button', 'os-select', r, pair[1] + '　▾');
      });
      const bar = u.el('footer', 'os-iconbar', win);
      [
        ['🫐', 'Apps'],
        ['▣', 'Discs'],
        ['▤', 'Documents'],
        ['🌐', 'Utilities'],
        ['🎨', 'Paint'],
      ].forEach(([i, t]) => {
        const b = u.el('div', 'os-app', bar);
        u.el('span', '', b, i);
        u.el('span', '', b, t);
      });
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This application stores preferences on this computer.',
        toast: 'Record updated.',
        chat: 'People Manager help. How can we assist?',
        promo: 'New features are available.',
        banner: 'System notice: routine service update.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      b.onclick = () => ctx.dismiss('close');
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
