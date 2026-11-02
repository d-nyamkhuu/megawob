(function () {
  'use strict';
  const cfg = {
    title: 'Desk  File  Edit  Options  Help',
    tools: 'Mon  Mar 10  1986  10:24',
    side: 'Information|Fill in the form to get in touch.\nYou can also visit our help page\nfor more details.|◉General enquiry\n○Technical support\n○Feedback|☑Send me a copy of my message\n☐I agree to the terms',
    obstacle: 'Welcome!',
    copy: 'This short tour will show you around the interface.',
    dismiss: 'Skip tour',
  };
  const palette = { bg: '#07832b', panel: '#c6c6c6', fg: '#000000', muted: '#000000', line: '#000000' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original uses the task strip below a shell width of 1180px.
      _c.display = (_c.ctx.display === 'panel' || _c.ctx.display === 'toast') && _c.W < 1180
        ? 'header' : (_c.ctx.display || 'header');
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'atari', 'board');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const desk = u.el('span', 'desk-emblem', head);
      desk.innerHTML =
        '<svg viewBox="0 0 24 30" fill="#ddd" stroke="black" stroke-width="1.5"><path d="M2 2h17l3 4v22H2z" fill="black"/><path d="M7 4h9v6h-3v8l5 6H7l3-6V9H7z"/><path d="M4 12h4M17 10h3M4 16h5M17 16h3M4 22h3M18 22h2" stroke="#ddd"/></svg>';
      u.el('div', 'title', head, cfg.title);
      const tl = u.el('div', 'tools', head);
      cfg.tools.split('|').forEach((s) => u.el('div', '', tl, s));
      u.el('div', 'badge', head, 'Lesson 1/3');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      Object.assign(_c, { shell, head, desk, work, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.work;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const { work, shell } = _c;
      u.el('span', 'gem-x', work);
      u.el('span', 'gem-z', work);
      const wt = u.el('span', 'gem-title', work);
      u.el('span', 'gem-caption', wt, 'Contact Form');
      [
        ['A:', 'f'],
        ['B:', 'd'],
        ['TRASH', 't'],
      ].forEach((a) => {
        const ic = u.el('div', 'icon icon-' + a[1], shell);
        const pic = u.el('i', '', ic);
        pic.innerHTML =
          a[1] === 'f'
            ? '<svg viewBox="0 0 64 70"><path fill="black" d="M2 2h58l2 4v62H2z"/><path fill="#ddd" d="M14 5h34v21H14zM11 34h42v30H11z"/><path d="M37 8h7v14h-7zM27 55h8v5h-8z"/></svg>'
            : a[1] === 'd'
              ? '<svg viewBox="0 0 64 76" fill="#ddd" stroke="black" stroke-width="3"><path d="M8 3h34l16 17v53H8z"/><path d="M42 3v18h16M18 15h15M18 23h15M18 32h29M18 39h29M18 46h29M18 53h29M18 60h24"/></svg>'
              : '<svg viewBox="0 0 64 80" fill="#ddd" stroke="black" stroke-width="3"><path d="M12 20l3 54q18 8 34 0l3-54z"/><ellipse cx="32" cy="20" rx="25" ry="8"/><path d="M13 17v-5h12V8h15v4h11v5M23 29v40M32 30v41M41 29v40"/></svg>';
        u.el('span', '', ic, a[0]);
      });
      const aside = u.el('aside', 'inspector', work);
      cfg.side.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', aside, s));
      aside.querySelectorAll('p').forEach((p) => {
        p.innerHTML = p.textContent
          .replace('help page', '<u class="gem-link">help page</u>')
          .replace('terms', '<u class="gem-link">terms</u>')
          .replace(/◉/g, '<i class="gr on"></i>')
          .replace(/○/g, '<i class="gr"></i>')
          .replace(/☑/g, '<i class="gb on">✓</i>')
          .replace(/☐/g, '<i class="gb"></i>');
      });
      _c.body = work;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.work.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction');
        panel.dataset.display = 'panel';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = 'toast';
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const emblem = _c.util.el('span', 'status-emblem', foot);
      emblem.innerHTML = _c.desk.innerHTML;
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Ready.';
      _c.util.el('span', 'stepinfo', foot, 'Step 1 of 1   |   Time: Paused');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      if (ctx.kind === 'chat') {
        const el = ctx.util.el('section', 'perturb chat design-obstacle tour-overlay', document.body);
        ctx.util.el('h2', '', el, cfg.obstacle);
        ctx.util.el('p', '', el, cfg.copy);
        const dismiss = ctx.util.el('button', 'dismiss-design', el, cfg.dismiss);
        dismiss.type = 'button';
        dismiss.addEventListener('click', ctx.dismiss);
        const next = ctx.util.el('button', 'next-design', el, 'Next');
        next.type = 'button';
        next.addEventListener('click', ctx.dismiss);
        const x = ctx.util.el('button', 'x-design', el, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close tour');
        x.addEventListener('click', ctx.dismiss);
        return { el, dismiss };
      }
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-widget-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-widget-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000000'],
      LOW_ACCENTS: ['#000000'],
      parts,
    },
  });
})();
