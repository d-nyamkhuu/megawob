// Design on templates/use-chat/workspace.js.
(function () {
let breakoutControls;
env.widget({
  task: 'use-chat',
  site: 'design-use-chat-breakout-05',
  name: 'design',
  split: 'train',
  scenarios: ['breakout'],
  template: 'use-chat/workspace',
  design: {
    parts: {
      // The surrounding site already draws the workspace frame. Keep the
      // template's task controls and dialogs in the stage, without duplicating it.
      topbar: () => () => {},
      rail: () => () => {},
      body: () => parent => parent,
      navigation: (base, S) => () => ({ text: S.ctx.util.el('span', '') }),
      status: (base, S) => () => S.ctx.util.el('div', ''),
      meetingHeader: () => () => {},
      meetingMeta: () => () => {},
      breakoutNotice: () => () => {},
      room: (base, S) => (board, room, rooms, model) => {
        base(board, room, rooms, model);
        if (room === -1) {
          S.P.iconButton(rooms.get(room).querySelector('.ch-roomhead'), 'settings',
            'Manage members', 'settings', { settings: true }, 'hub-member-settings');
        }
      },
      // Room options belong with the rest of the settings, rather than under
      // the assignment board. The template still supplies their handlers.
      breakoutControls: (base) => {
        breakoutControls = base;
        return () => {};
      },
      modal: (base, S) => (title, closeKey, event) => {
        const dialog = base(title, closeKey, event);
        if (closeKey === 'settingsClose') {
          const tools = S.ctx.util.el('div', 'hub-room-options', dialog.content);
          breakoutControls(tools, S.ctx.model);
        }
        return dialog;
      },
    },
  },
});
})();
