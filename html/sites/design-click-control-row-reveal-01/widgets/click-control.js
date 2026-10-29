// Design on templates/click-control/base.js: the base site's click-control widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'click-control',
  site: 'design-click-control-row-reveal-01',
  name: 'design',
  split: 'train',
  scenarios: ['row-reveal'],
  template: 'click-control/base',
  design: {
    parts: {
      'buildRowReveal': (base, S) => function buildRowReveal(ctx, content, up, page) {
        const { CSS_HIDDEN, PAST, box, ensureStyle, env, fromNotice, icon } = S;
        const { spec, util, rng } = ctx;
        ensureStyle('uc-style-hidden', CSS_HIDDEN);
        const b = box(ctx, content, { top: true });
        const r = content.getBoundingClientRect();
        const rowH = Math.max(28, Math.min(40, Math.floor((r.height - 36) / spec.rows.length)));
        const table = util.el('table', 'uc-table uc-rows uc-rr', b);
        table.style.setProperty('--rowh', rowH + 'px');
        table.style.width = Math.min(720, Math.floor(r.width)) + 'px';
        const head = util.el('tr', '', table);
        spec.columns.forEach((c) => util.el('th', '', head, c === 'Team' ? 'Department' : c));
        const people = spec.kind !== 'files';
        const extraColumns = people && spec.columns.length === 3;
        const locations = ['San Francisco', 'Seattle', 'New York', 'Austin', 'Chicago', 'Boston'];
        const activeDates = ['Apr 22, 2019', 'Apr 21, 2019', 'Apr 20, 2019', 'Apr 22, 2019', 'Apr 19, 2019', 'Apr 18, 2019'];
        const initials = (name) => String(name).trim().split(/\s+/).map((s) => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
        const email = (name) => String(name).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z\s-]/g, '').trim().replace(/\s+/g, '.') + '@acmecorp.com';
        if (extraColumns) {
          util.el('th', 'decorative-column', head, 'Location');
          util.el('th', 'decorative-column', head, 'Last Active');
        }
        util.el('th', '', head, '');
        const icons = spec.style === 'icons';
        table.style.setProperty('--actions-width', Math.max(118, spec.quick.length * (icons ? 36 : 76) + 38) + 'px');
        const trs = {};
        const quick = {};
        const mores = {};
        for (const row of spec.rows) {
          const rowIndex = spec.rows.indexOf(row);
          const tr = util.el('tr', '', table);
          tr.dataset.role = 'row';
          row.cells.forEach((c, i) => {
            const td = util.el('td', '', tr, c);
            if (i) td.style.color = 'var(--muted)';
            if (i === 0) { td.style.maxWidth = '260px'; td.style.overflow = 'hidden'; td.style.textOverflow = 'ellipsis'; }
            if (people && i === 0) {
              td.classList.add('member-cell');
              td.textContent = '';
              const tone = [0, 0, 1, 0, 2, 3, 0, 4][rowIndex % 8];
              const photo = rowIndex === 1 ? ' member-photo member-photo-2' : rowIndex === 3 ? ' member-photo' : rowIndex === 6 ? ' member-photo member-photo-3' : '';
              util.el('span', 'member-avatar tone-' + tone + photo, td, initials(c));
              util.el('span', 'member-name', td, c);
              util.el('span', 'member-email', td, email(c));
            }
          });
          if (extraColumns) {
            util.el('td', 'decorative-column', tr, locations[rowIndex % locations.length]);
            util.el('td', 'decorative-column', tr, activeDates[rowIndex % activeDates.length]);
          }
          const td = util.el('td', '', tr);
          td.style.width = `${spec.quick.length * (icons ? 32 : 76) + 38}px`;
          const acts = util.el('div', 'uc-acts', td);
          for (const a of spec.quick) {
            const el = util.el('button', 'uc-act' + (icons ? ' icononly' : ''), acts);
            el.type = 'button';
            if (icons) { el.innerHTML = icon(a.icon); el.setAttribute('aria-label', a.label); el.title = a.label; } else el.textContent = a.label;
            const key = `${row.key}|${a.key}`;
            el.addEventListener('click', (e) => {
              if (e.button !== 0) return;
              env.log('select', { what: 'row-action', key });
              up({ clicks: ctx.model.clicks.concat([key]), menuFor: null });
            });
            quick[key] = el;
          }
          const more = util.el('button', 'uc-act uc-more', acts, '⋯');
          more.type = 'button';
          more.setAttribute('aria-label', spec.moreLabel);
          more.title = spec.moreLabel;
          more.addEventListener('click', (e) => {
            if (e.button !== 0) return;
            env.log(ctx.model.menuFor === row.key ? 'close' : 'open', { what: 'row-menu', key: row.key });
            up({ menuFor: ctx.model.menuFor === row.key ? null : row.key, hover: row.key });
          });
          mores[row.key] = more;
          tr.addEventListener('pointerenter', () => { if (ctx.model.hover !== row.key) up({ hover: row.key }); });
          tr.addEventListener('pointerleave', () => { if (ctx.model.hover === row.key) up({ hover: null }); });
          trs[row.key] = tr;
        }
        // The adjacent profile is ordinary directory content, independent of the task's target.
        if (people && spec.rows.length) {
          const index = Math.min(3, spec.rows.length - 1);
          const row = spec.rows[index];
          const set = (selector, text) => { const el = document.querySelector(selector); if (el) el.textContent = text; };
          set('.profile-name', row.cells[0]);
          set('.profile-email', email(row.cells[0]));
          set('.profile-location', locations[index % locations.length] + ', TX');
          set('.profile-value.field-0', row.cells[1] || 'Team member');
          set('.profile-value.field-1', row.cells[2] || 'Operations');
          set('.profile-value.field-2', locations[index % locations.length]);
          set('.profile-value.field-3', spec.rows[0].cells[0]);
          set('.profile-value.field-4', activeDates[index % activeDates.length]);
          set('.about-copy', String(row.cells[0]).split(/\s+/)[0] + ' creates content and campaigns to grow our brand and engage our audience. They work closely with the product and sales teams.');
          const avatar = document.querySelector('.profile-avatar');
          if (avatar) { avatar.classList.add('member-photo'); avatar.textContent = ''; }
        }
        const menu = util.el('div', 'uc-rmenu', page);
        menu.dataset.role = 'menu';
        menu.hidden = true;
        const entries = {};
        const danger = (l) => /delete|remove|trash|suspend|reset password/i.test(l);
        // Destructive entries go last, under a separator (the task's order otherwise).
        const order = spec.more.filter((a) => !danger(a.label)).concat(spec.more.filter((a) => danger(a.label)));
        order.forEach((a, i) => {
          if (i && danger(a.label) && !danger(order[i - 1].label)) util.el('div', 'hr', menu);
          const e = util.el('div', 'ce' + (danger(a.label) ? ' danger' : ''), menu, a.label);
          e.dataset.role = 'menuitem';
          e.addEventListener('click', (ev) => {
            if (ev.button !== 0 || ctx.model.menuFor === null) return;
            const key = `${ctx.model.menuFor}|${a.key}`;
            env.log('select', { what: 'row-menu', key });
            up({ clicks: ctx.model.clicks.concat([key]), menuFor: null });
          });
          entries[a.key] = e;
        });
        const onDown = (ev) => {
          if (!page.isConnected) { document.removeEventListener('pointerdown', onDown, true); return; }
          if (ctx.model.menuFor === null || menu.contains(ev.target) || mores[ctx.model.menuFor].contains(ev.target) || fromNotice(ev)) return;
          up({ menuFor: null });
        };
        document.addEventListener('pointerdown', onDown, true);
        const done = rng.pick(['Done', 'Updated', 'Applied']);
        function place(m) {
          if (m.menuFor === null) { menu.hidden = true; return; }
          menu.hidden = false;
          const pr = page.getBoundingClientRect();
          const br = mores[m.menuFor].getBoundingClientRect();
          const mw = menu.offsetWidth;
          const mh = menu.offsetHeight;
          let x = br.right - pr.left - mw;
          let y = br.bottom - pr.top + 4;
          if (y + mh > pr.height - 8) y = br.top - pr.top - mh - 4;
          x = Math.max(6, Math.min(pr.width - mw - 6, x));
          menu.style.left = Math.round(x) + 'px';
          menu.style.top = Math.round(Math.max(6, y)) + 'px';
        }
        return {
          sync(m) {
            for (const row of spec.rows) {
              const tr = trs[row.key];
              if (m.hover === row.key) tr.setAttribute('data-hover', 'true');
              else tr.removeAttribute('data-hover');
              if (m.menuFor === row.key) tr.setAttribute('data-menu', 'true');
              else tr.removeAttribute('data-menu');
              const hit = m.clicks.find((k) => k.startsWith(`${row.key}|`));
              tr.classList.toggle('dead', !!hit && /delete|remove|trash|suspend|archive/.test(hit));
              const first = tr.firstChild;
              let badge = first.querySelector('.uc-badge');
              if (hit && !badge) badge = util.el('span', 'uc-badge', first);
              if (badge) {
                if (hit) {
                  const a = spec.quick.concat(spec.more).find((x) => `${row.key}|${x.key}` === hit);
                  badge.textContent = a ? (PAST[a.label] || done) : done;
                } else badge.remove();
              }
            }
            place(m);
          },
          locate(t) {
            if (t.row !== undefined) return env.util.center(trs[t.row].firstChild);
            if (t.more !== undefined) return env.util.center(mores[t.more]);
            if (t.action !== undefined) return env.util.center(quick[`${t.action[0]}|${t.action[1]}`]);
            if (t.mentry !== undefined) return menu.hidden ? null : env.util.center(entries[t.mentry]);
            return null;
          },
          recover: 'toast',
        };
      },
    },
  },
});
