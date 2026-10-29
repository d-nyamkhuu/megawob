(function () {
  'use strict';
  const drawIcon = (parent, name) => {
    const paths = {
      calendar: '<rect x="4" y="5" width="16" height="16" rx="1.5"/><path d="M8 3v4M16 3v4M4 10h16M8 14h2M14 14h2M8 17h2"/>',
      people: '<circle cx="9" cy="7" r="2.5"/><path d="M3.5 19v-2.5A4.5 4.5 0 018 12h2a4.5 4.5 0 014.5 4.5V19M16 5a2.5 2.5 0 010 5M17 13a4 4 0 013.5 4v2"/>',
      clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 6v6l4 2"/>',
      heart: '<path fill="currentColor" stroke="none" d="M12 21C8 17.6 3 14 3 8.8 3 3.8 9 2 12 6c3-4 9-2.2 9 2.8C21 14 16 17.6 12 21z"/>'
    };
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('fill','none'); svg.setAttribute('stroke','currentColor');
    svg.setAttribute('stroke-width','2'); svg.setAttribute('stroke-linecap','round'); svg.setAttribute('stroke-linejoin','round');
    svg.setAttribute('aria-hidden','true'); svg.innerHTML=paths[name] || paths.calendar; parent.appendChild(svg);
  };
  env.site({
    name: 'design-use-desktop-tools-week-05',
    template: 'site/base',
    design: {
        THEMES: { light: { bg: '#f5f4fc', panel: '#ffffff', fg: '#111b31', muted: '#596273', line: '#dfe3eb' }, dark: { bg: '#f5f4fc', panel: '#ffffff', fg: '#111b31', muted: '#596273', line: '#dfe3eb' }, warm: { bg: '#f5f4fc', panel: '#ffffff', fg: '#111b31', muted: '#596273', line: '#dfe3eb' } },
        ACCENTS: ['#2684f5'], LOW_THEME: { bg: '#f5f4fc', panel: '#fff', fg: '#111b31', muted: '#596273', line: '#dfe3eb' }, LOW_ACCENTS: ['#2684f5'],
        LANGS: ['en'], TITLES: ['Calendar'],
      parts: {
        frame: (_base, S) => function (ctx) {
          const u = ctx.util;
          document.body.className = 'calendar-app instruction-' + (ctx.display || 'hidden');
          const shell = u.el('div', 'calendar-window', document.body);
          const headArea = u.el('header', 'calendar-header', shell);
          const header = u.el('div', 'window-titlebar', headArea);
          drawIcon(u.el('span', 'calendar-app-icon', header), 'calendar');
          u.el('strong', 'window-title', header, 'Calendar');
          let note = null;
          const actions = u.el('div', 'window-actions', header);
          const endValues = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length ? ctx.content.END_LABELS : ['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply'];
          const er = ctx.rng.fork('chrome/end');
          const labelOf = x => typeof x === 'string' ? x : x && (x.label || x.text || x.name) || String(x);
          const apply = endValues.map(labelOf).find(x => x.toLowerCase() === 'apply');
          const label = apply && er.bool(0.65) ? apply : labelOf(er.pick(endValues));
          const placement = er.pick(['header','header','header','icon','footer']);
          const { collide, cr } = S.frameCollide({ content:ctx.content, rng:ctx.rng }, label);
          if (!ctx.finish && collide) {
            const b = u.el('button', 'window-secondary', actions, collide.text);
            b.type = 'button';
            b.addEventListener('click', () => env.log('decoy', { label: collide.text, collide: true }));
          }
          let submit = null;
          if (!ctx.finish && placement !== 'footer') {
            submit = u.el('button', 'window-apply' + (placement === 'icon' ? ' window-icon' : ''), actions, placement === 'icon' ? '✓' : label);
            submit.type = 'button';
            submit.title = label; submit.setAttribute('aria-label', label);
            submit.addEventListener('click', () => ctx.submit());
          }
          const controls = u.el('div', 'native-controls', header);
          u.el('span', 'minimize', controls, '−'); u.el('span', 'maximize', controls, '□'); u.el('span', 'close', controls, '×');
          if (ctx.display === 'header') {
            note = u.el('div', 'header-instruction', headArea, ctx.instruction);
            note.dataset.role = 'instruction';
          }
          const inner = u.el('div', 'calendar-content', shell);
          const workspace = u.el('main', 'calendar-workspace', inner);
          const stage = u.el('section', 'week-stage', workspace);
          const side = u.el('aside', 'calendar-side', workspace);
          if (ctx.display === 'panel') {
            note = u.el('section', 'instruction-card', side);
            note.dataset.role = 'instruction';
            drawIcon(u.el('span', 'instruction-icon', note),'calendar'); u.el('p', '', note, ctx.instruction);
          }
          const summary = u.el('section', 'week-summary', side);
          u.el('h2', '', summary, 'This Week');
          u.el('div', 'summary-dates', summary, 'Apr 27 – May 3, 2025');
          const grid = u.el('div', 'summary-grid', summary);
          const stats = [['10','Total events','calendar','blue'],['6','Meetings','people','green'],['2','Focus blocks','clock','purple'],['2','Personal','heart','pink']];
          for (const [value, title, icon, color] of stats) {
            const card = u.el('div', 'summary-card', grid);
            u.el('strong', '', card, value); drawIcon(u.el('span', 'summary-icon '+color, card),icon); u.el('small', '', card, title);
          }
          if (ctx.display === 'toast') {
            const toast = u.el('div', 'task-toast', side);
            toast.dataset.role = 'instruction';
            u.el('span', '', toast, ctx.instruction);
            const close = u.el('button', '', toast, '×'); close.type='button'; close.setAttribute('aria-label','Close'); close.addEventListener('click',()=>{toast.remove();env.log('note-close');});
          }
          if (!ctx.finish && placement === 'footer') {
            const foot = u.el('footer', 'calendar-footer', shell);
            submit = u.el('button', 'window-apply', foot, label);
            submit.type = 'button'; submit.addEventListener('click', () => ctx.submit());
          }
          return { stage, submit };
        },
        overlay: (base, S) => function(ctx) {
          const result = base(ctx);
          if (ctx.kind === 'banner') {
            result.el.classList.add('calendar-banner');
            result.el.style.top = (document.querySelector('.calendar-header').getBoundingClientRect().bottom + 10) + 'px';
          }
          return result;
        },
        fault: (base, S) => function(ctx) {
          const result = base(ctx);
          if (ctx.kind === 'shift') document.querySelector('.calendar-header').after(result.el);
          return result;
        },
      },
    },
  });
})();
