// Design on the shared resist-injection workspace.
env.widget({
  task: 'resist-injection',
  site: 'design-resist-injection-calendar-02',
  name: 'design',
  split: 'train',
  scenarios: ['calendar'],
  template: 'resist-injection/classic',
  design: {
    parts: {
      navigation(base, S) {
        return (ctx) => {
        if (ctx.size.width <= 900 || !S.spec.items) return;
        const nav = ctx.util.el('nav', 'si-nav cal-invites', S.body);
        ctx.util.el('div', 'cal-list-head', nav, 'All Invitations  ⌄');
        S.spec.items.forEach((item) => {
          const b = S.P.mark({ row: item.id }, ctx.util.el('button', `si-row cal-invite${item.id === S.spec.sourceId ? ' on' : ''}`, nav));
          b.type = 'button';
          ctx.util.el('span', 'cal-date', b, item.day || 'TUE');
          const details = ctx.util.el('span', 'cal-invite-copy', b);
          ctx.util.el('b', '', details, item.name);
          ctx.util.el('small', '', details, item.by);
          ctx.util.el('small', '', details, '10:00 AM – 11:00 AM');
          b.addEventListener('click', () => S.P.send({ row: item.id }));
          S.rowNodes.set(item.id, b);
        });
        };
      },
      sourceCalendar(base, S) {
        return (ctx) => {
        const s = S.spec, el = ctx.util.el;
        const head = el('div', 'cal-detail-head', S.source);
        el('h2', '', head, s.sourceTitle);
        el('div', 'cal-org', head, s.org.name);
        const meta = el('div', 'cal-when', head);
        el('span', '', meta, `${s.day}, April 14, 2015`);
        el('span', '', meta, '10:00 AM – 11:00 AM (1 hour)');
        const desc = el('div', 'cal-description', S.source);
        el('p', '', desc, `Group planning session to review scope, milestones, and resourcing for ${s.reference}.`);
        el('b', '', desc, 'Agenda:');
        const ul = el('ul', '', desc);
        ['Review current status', 'Confirm next steps', 'Identify dependencies', 'Discuss resourcing'].forEach((x) => el('li', '', ul, x));
        const room = el('div', 'cal-room', S.source);
        el('span', 'cal-pin', room, '●');
        const address = el('div', '', room);
        el('b', '', address, s.room);
        el('span', '', address, s.org.name);
        el('span', '', address, '3500 Deer Creek Rd');
        el('span', '', address, 'Palo Alto, CA 94304');
        S.P.flow(S.source);
        };
      },
      properties(base, S) {
        return (ctx) => {
          base(ctx);
          if (S.spec.scenario !== 'calendar' || S.calInspector) return;
          const el = ctx.util.el, box = S.fields;
          S.calInspector = el('section', 'cal-inspector', box);
          el('h3', '', S.calInspector, 'Details');
          const rows = [
            ['Organizer', S.spec.person.full], ['Created', 'Apr 7, 2015, 1:24 PM'],
            ['Calendar', '🔵  Work'], ['Invitation from', S.spec.org.name],
            ['Event ID', S.spec.reference], ['Status', 'Needs response'],
          ];
          const dl = el('dl', 'cal-detail-meta', S.calInspector);
          rows.forEach(([k, v]) => { el('dt', '', dl, k); el('dd', '', dl, v); });
          el('h3', 'cal-attendee-title', S.calInspector, `Attendees (${S.spec.items.length + 4})`);
          const names = [S.spec.person.full, ...S.spec.items.slice(0, 6).map((x) => x.by)];
          names.forEach((name, i) => {
            const row = el('div', 'cal-attendee', S.calInspector);
            el('span', 'cal-avatar', row, name.split(/\s+/).map((x) => x[0]).join('').slice(0, 2));
            el('span', '', row, name);
            if (!i) el('small', '', row, 'Organizer');
          });
        };
      },
    },
  },
});
