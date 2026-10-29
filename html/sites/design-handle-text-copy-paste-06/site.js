(function () {
  'use strict';
  const cfg = {
    'title': 'The Daily Chronicle',
    'theme': 'news',
    'layout': 'offset',
    'tools': 'TUESDAY, APRIL 12, 2011\nNews   |   Business   |   Sports   |   Life',
    'rail': 'Print|Text Size|Copy Link|Save',
    'overview':
      'Riverside Park to Get Major Upgrade|LOCAL NEWS|City council approves funding for new trails, lighting and green spaces.|By Emily Carter     April 12, 2011|The city council voted unanimously Monday night to fund a major upgrade to Riverside Park, a project that will add new walking trails, improved lighting and expanded green spaces. Construction is expected to begin this summer, with much of the work completed by next spring.|Mayor Thomas Reed called the project “a big step forward for a healthier, more connected community,” noting that the park is one of the city’s most treasured public spaces.|Residents have long advocated for improvements, and city officials say the upgrades will make the park more accessible and enjoyable for families, joggers and visitors year-round.|Share this article:     ✉ Email     ▣ Facebook     ♥ Twitter',
  };
  env.site({
    name: 'design-handle-text-copy-paste-06',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      if (['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite'].includes(cfg.theme)) {
        const controls = u.el('span', 'window-controls', title);
        controls.innerHTML =
          '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      }
      if (cfg.tools) u.el('div', 'tools', head, cfg.tools);
      if (cfg.overview) {
        const ov = u.el('section', 'overview', shell);
        cfg.overview.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', ov, s));
      }
      const tools = head.querySelector('.tools');
      if (tools) head.insertBefore(tools, title);
      u.el('div', 'civic-subtitle', head, 'Follow the instruction below to complete the task.');
      u.el('div', 'civic-application', head, 'Application for Community Support');
      u.el('div', 'civic-step', head, 'Step 2 of 3');
      const work = u.el('div', 'work', shell);
      if (cfg.rail) {
        const rail = u.el('nav', 'rail', work);
        cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      }
      const center = u.el('section', 'center', work);
      const display = ctx.display || 'header';
      const noteParent = display === 'header' ? head : cfg.layout === 'response' ? work : center;
      const note = u.el('div', 'instruction', noteParent, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'header') {
        note.classList.add('instruction-header');
      }
      if (display === 'toast') {
        note.classList.add('instruction-toast');
      }
      if (display === 'panel') {
        note.classList.add('instruction-panel');
      }
      const stage = u.el('div', 'stage', center);
      let aside = null;
      if (cfg.side) {
        aside = u.el('aside', 'inspector', work);
        cfg.side.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', aside, s));
      }
      if (cfg.layout === 'console' && aside && ctx.display !== 'toast') {
        aside.insertBefore(note, aside.children[1] || null);
      }
      const foot = u.el('footer', 'footer', shell);
      if (cfg.foot) {
        const dock = u.el('div', 'dock-sections', foot);
        cfg.foot.split('|').forEach((s) => {
          const d = u.el('section', 'dock-section', dock);
          u.el('strong', '', d, s);
          if (cfg.theme === 'qt') {
            if (s === 'Task List') {
              ['1.  Click requested control', '2.  Review result', '3.  Submit', '4.  Finish'].forEach((t, i) =>
                u.el('div', i === 0 ? 'current-task' : 'task-row', d, t),
              );
            } else if (s === 'Status') {
              ['Current Step:     1 of 4', 'Status:    Not completed', 'Attempts:    0', 'Result:    —'].forEach((t) =>
                u.el('div', 'status-row', d, t),
              );
            } else if (s === 'Notes') {
              u.el('div', 'dock-note', d, 'Follow the instruction above.');
            }
          }
        });
      } else u.el('span', 'ready', foot, 'Ready.');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const labels = (
          (ctx.content && ctx.content.END_LABELS) || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
          ]
        ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
        const base = labels.find((x) => x.toLowerCase() === 'submit') || labels[0];
        const common = er.bool(0.5);
        const placement = common ? 'footer' : er.pick(['footer', 'link', 'header']);
        const label = common ? base : er.pick(labels.filter((x) => x !== base));
        const end = (parent, tag, cls, text) => {
          const b = u.el(tag, cls, parent, text);
          if (tag === 'button') b.type = 'button';
          else b.href = '#';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (placement === 'header') {
          submit = end(head, 'button', 'submit end-header', label);
        } else if (placement === 'link') {
          submit = end(foot, 'a', 'end-link', label + ' ›');
        } else {
          submit = end(foot, 'button', 'submit', label);
        }
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = (
          (ctx.content && ctx.content.END_LABELS) || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
          ]
        ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
        const own = submit ? submit.getAttribute('aria-label') || '' : '';
        const choices = [...new Set(pool)].filter((x) => x.trim().toLowerCase() !== own.trim().toLowerCase());
        if (choices.length) {
          const d = u.el('button', 'end-xtra', foot, cr.pick(choices));
          d.type = 'button';
          d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
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
  });
})();
