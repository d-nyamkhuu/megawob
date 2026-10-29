// Design on use-legacy-app/desktop; defaults reproduce this scaffold.
env.widget({
  task: 'use-legacy-app',
  site: 'design-use-legacy-app-sapgui-02',
  name: 'design',
  split: 'train',
  scenarios: ['sapgui'],
  template: 'use-legacy-app/desktop',
  design: {
    font: 'Arial,sans-serif',
    fontSize: 14,
    parts: {
      title: (base, S) => (ctx) => {
        const title = ctx.util.el('div', 'lg-title', S.root);
        ctx.util.el('span', '', title, 'Customer Maintenance (ZREC)');
        const controls = ctx.util.el('span', 'lg-sys', title);
        for (const name of ['min', 'max', 'close']) S.P.icon(name, controls);
      },
      breadcrumb: () => () => {},
      toolbar: (base, S) => (ctx) => {
        base(ctx);
        const tools = S.root.querySelector('.lg-tools');
        tools.classList.add('sap-command-tools');
        const command = S.refs.command;
        const execute = tools.querySelector('button');
        const label = tools.querySelector('label');
        label.textContent = 'Transaction Command';
        label.htmlFor = 'sap-transaction-command';
        command.id = 'sap-transaction-command';
        const maintenance = ctx.util.el('div', 'sap-record-tools', S.root);
        for (const node of [...tools.children]) {
          if (node !== label && node !== command && node !== execute) maintenance.appendChild(node);
        }
        tools.appendChild(label);
        const row = ctx.util.el('div', 'sap-command-row', tools);
        row.appendChild(command);
        row.appendChild(execute);
        execute.replaceChildren();
        ctx.util.el('span', '', execute, 'Send');
        execute.classList.add('sap-send');
        S.P.button(row, 'Clear', () => {
          command.value = '';
          command.dispatchEvent(new Event('input', { bubbles: true }));
          command.focus();
        }, 'lg-btn sap-clear');
        S.P.button(row, 'Display', () => S.P.transact(), 'lg-btn sap-display');
      },
      heading: (base, S) => (ctx) => {
        base(ctx);
        S.refs.heading.parentElement.hidden = true;
      },
      navigator: (base, S) => (ctx) => {
        base(ctx);
        // Keep the original navigator target available once ZREC has opened.
        S.root.querySelector('.sap-record-tools').appendChild(S.refs.tree);
        S.refs.tree.classList.add('sap-record-browser');
      },
      status: (base, S) => (ctx) => {
        base(ctx);
        const status = S.refs.status.parentElement;
        S.root.querySelector('.sap-command-tools').after(status);
      },
      sync: (base, S) => (model) => {
        base(model);
        const command = model.screen === 'command';
        S.root.classList.toggle('sap-command-screen', command);
        S.els.work.hidden = command;
        if (command && !/^E\d/.test(model.status)) {
          S.refs.status.textContent = 'Ready. Enter command (e.g. ZREC) and press Enter.';
        }
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        const title = S.root.querySelector('.lg-title');
        const note = document.querySelector('.ref-task > .ref-instruction');
        const tools = document.querySelector('.ref-task > .ref-tools');
        if (note) title.appendChild(note);
        if (tools && tools.childElementCount) title.appendChild(tools);
        if (ctx.model.screen === 'command' && ctx.model.focus === 'command') S.refs.command.focus();
      },
    },
  },
});
