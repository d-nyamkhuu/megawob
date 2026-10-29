// Design of this site on the composition/sections template (templates/complete-goals/sections.js).
env.widget({
  task: 'complete-goals',
  site: 'design-complete-goals-booking-05',
  name: 'design',
  split: 'train',
  scenarios: ['booking'],
  template: 'complete-goals/sections',
  design: {
    fontFamily: '"Lucida Grande", Arial, sans-serif',
    wrapPadding: '14px 0 28px',
    headingGap: '12px',
    titleSize: '26px',
    subtitleSize: '13px',
    labelSize: '15px',
    muted: '#17191f',
    line: '#8c8985',
    accent: '#7a1820',
    cardBackground: 'linear-gradient(90deg, #e8e6e1, #e2e0dc)',
    cardRadius: '2px',
    cardPadding: '0 0 12px',
    ruleWidth: '2px',
    rulePadding: '8px',
    styles: ['cards', 'cards', 'cards', 'cards'],
    subtitles: [''],
    gapRange: [14, 14],
    columnRange: [1100, 1300],
    gridMinWidth: 9999,
    heightRange: [540, 540],
    heightInset: 60,
    cardInset: 0,
    parts: {
      frame: (base, S) => (ctx, look, at, W) => {
        const host = base(ctx, look, at, W);
        const icons = {
          member: '<circle cx="24" cy="14" r="10"/><path d="M5 46c0-14 8-21 19-21s19 7 19 21z"/>',
          options: '<path d="m20 3 8 0 2 7 5 2 6-4 6 6-4 6 2 5 7 2v8l-7 2-2 5 4 6-6 6-6-4-5 2-2 7h-8l-2-7-5-2-6 4-6-6 4-6-2-5-7-2v-8l7-2 2-5-4-6 6-6 6 4 5-2z" transform="translate(3 0) scale(.8)"/><circle cx="24" cy="25" r="8" fill="white"/>',
          date: '<rect x="5" y="8" width="38" height="39" rx="3" fill="white"/><path d="M6 10h36v10H6z" fill="#e75a55"/><path d="M14 4v10M34 4v10" fill="none" stroke-linecap="round"/><path d="M12 26h25M12 33h25M12 40h25M16 23v20M25 23v20M34 23v20" stroke="#9bb8d5" stroke-width="3"/>',
        };
        const row = (parent, label, value, kind) => {
          const r = ctx.util.el('div', 'aqua-row aqua-static', parent);
          r.dataset.label = label;
          ctx.util.el('span', 'aqua-label', r, label ? label + ':' : '');
          const field = ctx.util.el('div', 'aqua-well' + (kind ? ' aqua-' + kind : ''), r, value || '');
          if (kind === 'select') ctx.util.el('span', 'aqua-arrow', field, '');
          return r;
        };
        for (const [kind, title] of [['member','Member Information'], ['options','Membership Options'], ['date','Appointment']]) {
          const card = ctx.util.el('section', 'cp-card aqua-' + kind, host);
          card.dataset.pane = kind;
          const head = ctx.util.el('div', 'aqua-heading', card);
          const icon = ctx.util.el('span', 'aqua-icon', head);
          icon.innerHTML = '<svg viewBox="0 0 50 52" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="aqua-'+kind+'" x2="0" y2="1"><stop stop-color="#f4fbff"/><stop offset=".45" stop-color="#c5e8ff"/><stop offset="1" stop-color="#62a7dc"/></linearGradient></defs><g fill="url(#aqua-'+kind+')" stroke="#355d86" stroke-width="2.3" stroke-linejoin="round">'+icons[kind]+'</g></svg>';
          ctx.util.el('h2', '', head, title);
          const body = ctx.util.el('div', 'aqua-content', card);
          if (kind === 'member') {
            ['Employer','Username','Birth Date','Email','Phone','Address','','City'].forEach(label => row(body,label));
            const last = row(body,'State','--','select');
            last.classList.add('aqua-state');
            ctx.util.el('span','aqua-zip-label',last,'ZIP:');
            ctx.util.el('div','aqua-well aqua-zip',last);
          } else if (kind === 'options') {
            row(body,'Membership Type','Individual','select');
            row(body,'Renewal Frequency','Monthly','select');
            const interests = ctx.util.el('div','aqua-interests aqua-static',body);
            ctx.util.el('span','aqua-label',interests,'Interests:');
            const list = ctx.util.el('div','aqua-checks',interests);
            for (const name of ['Road Running','Trail Running','Track & Field','Marathon Training','Community Events']) {
              const lab = ctx.util.el('label','',list);
              const check = ctx.util.el('input','',lab); check.type = 'checkbox'; check.tabIndex = -1;
              ctx.util.el('span','',lab,name);
            }
          } else {
            row(body,'Appointment Date','','calendar');
            row(body,'Appointment Time','9:00 AM','select');
            row(body,'Purpose','Membership Meeting','select');
            row(body,'Location','Club Office','select');
            row(body,'Notes','','notes');
          }
        }
        return host;
      },
      card: (base, S) => (ctx, host, part) => host.querySelector('[data-pane="' + ({'type-text':'member','choose-option':'options','set-date':'date'}[part.task] || 'member') + '"]'),
      label: (base, S) => () => null,
      box: (base, S) => (ctx, card, part, i) => {
        const box = base(ctx, card, part, i);
        const body = card.querySelector('.aqua-content');
        if (part.task === 'choose-option') body.insertBefore(box, body.children[1]);
        else body.prepend(box);
        return box;
      },
      section: (base, S) => (ctx, entry) => {
        base(ctx, entry);
        const card = entry.card;
        if (entry.part.task === 'type-text') {
          const labels = Array.from(entry.box.querySelectorAll('input,textarea')).map(el => (el.getAttribute('aria-label') || '').toLowerCase().replace(/[^a-z]/g,''));
          for (const row of card.querySelectorAll('.aqua-row')) {
            if (labels.includes(row.dataset.label.toLowerCase().replace(/[^a-z]/g,''))) row.remove();
          }
          const count = entry.box.querySelectorAll('.ft-field').length;
          const rows = Array.from(card.querySelectorAll('.aqua-row'));
          rows.slice(Math.max(0,9-count)).forEach(row => row.remove());
          if (count > 5) {
            card.classList.add('aqua-dense');
            const inspector = document.querySelector('.aqua-inspector').getBoundingClientRect();
            const edge = Math.min(inspector.top, ctx.stage.getBoundingClientRect().bottom, card.getBoundingClientRect().bottom);
            const room = edge - card.querySelector('.aqua-heading').getBoundingClientRect().bottom - 40;
            const action = entry.box.querySelector('.ft-actions') ? 62 : 0;
            const height = Math.max(19,Math.min(38,Math.floor((room-action-count*5)/count)));
            card.style.setProperty('--aqua-field-height',height+'px');
          }
        } else if (entry.part.task === 'choose-option') {
          card.querySelector('[data-label="Renewal Frequency"]').remove();
        } else if (entry.part.task === 'set-date') {
          card.querySelector('[data-label="Appointment Date"]').remove();
        }
      },
      boxWidth: (base, S) => (ctx) => Math.max(280, Math.floor((ctx.size.width - 84) / 3)),
    },
  },
});
