// Design on templates/use-chat/workspace.js; defaults preserve the reference scaffold.
env.widget({
  task: 'use-chat',
  site: 'design-use-chat-breakout-04',
  name: 'design',
  split: 'train',
  scenarios: ['breakout'],
  template: 'use-chat/workspace',
  design: {
    parts: {
      styles: (base, S) => function () {
        return base() + (S.ctx.size.height < 500 ? `
          .ch-top { height:28px; }
          .ch-board { padding:6px; }
          .ch-roomhead { padding:5px; min-height:29px; }
          .ch-roomstatus { padding:2px 8px; }
          .ch-roomfooter { padding:3px 8px; }
        ` : '');
      },
      meetingHeader: (base, S) => function (m) {
        if (S.ctx.size.height >= 500) return base(m);
        const { util } = S.ctx;
        const head = util.el('div', 'th-breakout-header', S.main);
        util.el('span', 'th-breakout-heading', head, `Breakout rooms · ${S.spec.workspace} / Weekly project review`);
        const tools = util.el('div', 'th-breakout-tools', head);
        const manage = S.P.button(tools, 'Manage members', 'settings', { settings: true });
        S.P.icon(manage, 'people', 13);
        S.P.iconButton(tools, 'more', 'Meeting options', null, null);
      },
      meetingMeta: (base, S) => function (meeting) {
        if (S.ctx.size.height >= 500) return base(meeting);
        S.ctx.util.el('div', 'th-breakout-meta', meeting,
          'Live / 18:42 / You are the host · Encrypted · Connection stable');
      },
      breakoutNotice: (base, S) => function (parent, m) {
        if (S.ctx.size.height >= 500) return base(parent, m);
        S.ctx.util.el('div', 'th-breakout-info', parent,
          `Session 1 / Small group discussion. Participants stay in the main meeting until rooms are opened. ${S.spec.people.length} participants / ${S.spec.roomNames.length} rooms / Manual assignment / 15 minute session`);
      },
    },
  },
});
