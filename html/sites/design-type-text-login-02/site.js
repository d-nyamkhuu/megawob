// Soft three-zone login frame, designed on the shared account-access frame.
(function () {
  'use strict';

  function briefing(ctx, parent, cls) {
    const u = ctx.util;
    const box = u.el('aside', cls, parent);
    let host = box;
    if (cls === 'ds-brief') u.el('h2', '', box, 'Instructions');
    else {
      const icon = u.el('div', 'ds-ico', box);
      icon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 1h12l6 6v16H3V3z" fill="#2577f2"/><path d="M16 1v6h6" fill="#125fda"/><path d="M6 9h13v12H6z" fill="#e6f2ff"/><path d="M8 12h9M8 15h9M8 18h5" stroke="#2577f2" stroke-width="1.5"/></svg>';
      host = u.el('div', 'ds-tbox', box);
      u.el('div', 'ds-kicker', host, 'Your task');
    }
    const instruction = u.el('div', 'ds-instruction', host);
    ctx.instruction.split(/("[^"]*")/).forEach((text) => {
      if (/^"[^"]*"$/.test(text)) u.el('b', '', instruction, text);
      else if (text) instruction.appendChild(document.createTextNode(text));
    });
    return box;
  }

  function helpRail(_c) {
    const { body, u } = _c;
    const help = u.el('aside', 'ds-help', body);
    const head = u.el('div', 'ds-help-head', help);
    const icon = u.el('div', 'ds-help-ico', head);
    u.el('i', '', icon, 'i');
    const copy = u.el('div', '', head);
    u.el('h3', '', copy, 'Help');
    u.el('p', '', copy, 'Follow the instructions to complete the task.');
    // Generic guidance stays independent of the episode's goal and finish route.
    [
      'Use your account username or email address.',
      'Passwords are case sensitive.',
      'Review your entries before continuing.',
    ].forEach((text, i) => {
      const row = u.el('div', 'ds-step', help);
      u.el('span', 'ds-num', row, String(i + 1));
      u.el('div', '', row, text);
    });
    Object.assign(_c, { help, top: head });
  }

  env.site({
    name: 'design-type-text-login-02',
    template: 'site/type-text-login-01',
    styles: ['site.css'],
    design: {
      C: {
        site: 'design-type-text-login-02',
        brand: 'Account Access',
        title: '',
        instruction: 'top',
        rail: '',
        menu: '',
        briefTitle: 'Instructions',
      },
      parts: {
        // The design has no title bar or menus; the Help heading hosts header actions.
        'frame.5': () => () => {},
        'frame.6': () => () => {},
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.14': () => (_c) => {
          _c.briefing = (parent, cls) => briefing(_c.ctx, parent, cls);
        },
        'frame.19': (base) => (_c) => {
          base(_c);
          helpRail(_c);
        },
        // The shared frame owns labels, placement, decoys, finish mode and handlers.
        // Only dress and position its existing controls for the soft Help rail.
        'frame.26': (base) => (_c) => {
          base(_c);
          const { foot, help, placement, submit, top, u } = _c;
          if (!submit) return;
          const decoys = [...top.querySelectorAll('[data-role="xtra"]'),
            ...foot.querySelectorAll('[data-role="xtra"]')];
          decoys.forEach((button) => { button.className = 'ds-pq'; });
          if (placement === 'header') {
            submit.className = 'ds-end-header';
            // Keep the help heading readable at the smallest viewport.
            const action = u.el('div', 'ds-help-action', help);
            action.append(...decoys, submit);
          } else if (placement === 'link') {
            submit.className = 'ds-end-link';
            const action = u.el('div', 'ds-help-action', help);
            action.append(...decoys, submit);
          }
        },
      },
    },
  });
})();
