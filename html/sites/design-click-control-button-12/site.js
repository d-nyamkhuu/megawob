(function () {
  'use strict';
  const ENV =
    '<svg viewBox="0 0 250 155"><defs><linearGradient id="leaf" x2=".3" y2="1"><stop stop-color="#b5e26b"/><stop offset=".5" stop-color="#6bb632"/><stop offset="1" stop-color="#237b22"/></linearGradient><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#eaf6ff"/></linearGradient></defs><path d="M78 114Q96 2 210 9Q181 27 159 82Q191 36 249 47Q215 66 203 104Q179 161 108 134Z" fill="url(#leaf)"/><path d="M116 126Q160 52 207 17M143 130Q181 75 230 54" fill="none" stroke="#a5d86c" opacity=".6"/><g transform="translate(8 34) rotate(-7 76 51)"><rect x="0" y="0" width="151" height="95" rx="5" fill="url(#paper)" stroke="#83a9ca" stroke-width="2"/><path d="M2 91L59 46M148 91L94 48" fill="none" stroke="#b2d3ee"/><path d="M2 3L68 56Q75 62 82 55L148 3" fill="url(#paper)" stroke="#83a9ca" stroke-width="2"/></g></svg>';
  const LAND =
    '<svg viewBox="0 0 1672 165" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="hill" x2="0" y2="1"><stop stop-color="#c7e3ad"/><stop offset=".45" stop-color="#acd182"/><stop offset="1" stop-color="#9ac963"/></linearGradient><linearGradient id="cloud" x2="0" y2="1"><stop stop-color="#ecfaff" stop-opacity=".85"/><stop offset="1" stop-color="#ecfaff" stop-opacity=".1"/></linearGradient><radialGradient id="hillLight"><stop stop-color="#e2f0c7" stop-opacity=".65"/><stop offset="1" stop-color="#e2f0c7" stop-opacity="0"/></radialGradient></defs><path d="M0 88C223 83 308 141 556 143S812 100 1000 114S1229 166 1392 122S1590 96 1672 118V165H0Z" fill="url(#hill)"/><ellipse cx="917" cy="134" rx="380" ry="26" fill="url(#hillLight)"/><path d="M1260 145Q1440 132 1520 138T1672 132V165H1260Z" fill="#7fbf40" opacity=".25"/><path d="M1329 55Q1329 37 1344 41Q1349 20 1370 29Q1381 4 1401 23Q1419 18 1427 40Q1445 36 1448 55Z" fill="url(#cloud)"/></svg>';
  env.site({
    name: 'design-click-control-button-12',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref web2';
      const shell = u.el('main', 'shell', document.body);
      // New episode choices use independent streams; existing widget draws stay unchanged.
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5);
      const placement = original ? 'footer' : er.pick(['header', 'panel-link']);
      const endLabel = original ? 'Submit' : er.pick(endLabels);
      const head = u.el('header', 'banner', shell);
      u.el('div', 'landscape', head).innerHTML = LAND;
      const exp = u.el('button', 'expand', head);
      exp.type = 'button';
      u.el('span', '', exp, 'Expand tools');
      u.el('i', 'caret', exp);
      const hint = u.el('div', 'hint', head);
      hint.innerHTML = 'Tools are hidden. Click to<br>show the command ribbon.';
      exp.addEventListener('click', () => {
        const o = shell.classList.toggle('tools-open');
        hint.innerHTML = o
          ? 'Command ribbon shown.<br>Click to hide it.'
          : 'Tools are hidden. Click to<br>show the command ribbon.';
        exp.firstChild.textContent = o ? 'Collapse tools' : 'Expand tools';
      });
      const tag = u.el('div', 'tagline', head);
      tag.innerHTML = '<span>A simpler way</span><br>to stay in touch';
      const mail = u.el('div', 'mail', head);
      mail.innerHTML = ENV;
      const ribbon = u.el('div', 'ribbon', shell);
      ['Format', 'Insert', 'Options', 'Tools'].forEach((t) => u.el('span', '', ribbon, t));
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      let display = ctx.display;
      if ((display === 'panel' && shell.clientWidth < 1260) || (display === 'toast' && shell.clientHeight < 700))
        display = 'header';
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'toast') {
        note.classList.add('instruction-toast');
      }
      if (ctx.instruction.length > 65) note.classList.add('instruction-long');
      const fld = (l, v, cc) => {
        const r = u.el('div', 'frow', center);
        u.el('label', '', r, l);
        u.el('div', 'fval', r, v);
        if (cc) {
          const c = u.el('span', 'cc', r);
          c.innerHTML = '<a>Cc</a> <b>|</b> <a>Bcc</a>';
        }
      };
      fld('To:', 'team@company.com', true);
      fld('Subject:', 'Project Update', false);
      const stage = u.el('div', 'stage', center);
      const att = u.el('div', 'attach', center);
      const ab = u.el('span', 'abtn', att);
      ab.innerHTML =
        '<svg viewBox="0 0 24 24" width="1.3em" height="1.3em" fill="none" stroke="#3a4a63" stroke-width="2" stroke-linecap="round"><path d="M20 11l-8 8a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8"/></svg><span>Attach file</span>';
      u.el('span', 'none', att, 'No file attached');
      const aside = u.el('aside', 'tips', work);
      if (display === 'panel') {
        aside.append(note);
        note.classList.add('instruction-panel');
      }
      u.el('h2', '', aside, 'Quick tips');
      const ul = u.el('ul', '', aside);
      ['Be clear and concise.', 'Include key details.', 'Check your recipients.', 'Use a descriptive subject.'].forEach(
        (t) => u.el('li', '', ul, t),
      );
      const foot = u.el('footer', 'footer', shell);
      u.el('span', 'draft', foot, 'Draft saved 2 minutes ago');
      const cancel = u.el('span', 'cancel', foot, 'Cancel');
      cancel.addEventListener('click', () => env.log('decoy', { label: 'Cancel' }));
      u.el('div', 'task-actions', foot);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? head : placement === 'panel-link' ? aside : foot;
        submit = u.el(
          placement === 'panel-link' ? 'a' : 'button',
          'submit' + (placement === 'header' ? ' submit-header' : placement === 'panel-link' ? ' submit-link' : ''),
          parent,
          endLabel,
        );
        if (placement === 'panel-link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = [...new Set(endLabels)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options);
          const decoy = u.el('button', 'end-xtra', foot, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
          foot.insertBefore(decoy, cancel);
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
