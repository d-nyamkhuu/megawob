/* HorizonNet Extranet (1999): navy masthead, rust tabs, bordered table panels, task canvas in the centre. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  function icon(parent, kind) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 20 20');
    s.setAttribute('class', 'ico');
    s.setAttribute('aria-hidden', 'true');
    const p = (d, extra) => {
      const e = document.createElementNS(NS, 'path');
      e.setAttribute('d', d);
      e.setAttribute('fill', 'none');
      e.setAttribute('stroke', '#1b2f52');
      e.setAttribute('stroke-width', '1.4');
      if (extra) e.setAttribute('fill', extra);
      s.appendChild(e);
    };
    if (kind === 'list') {
      p('M2 2h16v16H2z');
      p('M5 6h2M9 6h6M5 10h2M9 10h6M5 14h2M9 14h6');
    } else if (kind === 'person') {
      p('M10 3a3 3 0 1 0 0 6a3 3 0 0 0 0-6M3 18c0-5 3-6 7-6s7 1 7 6z', '#9bb3d6');
    } else if (kind === 'cal') {
      p('M2 4h16v14H2zM2 8h16M6 2v4M14 2v4M5 11h2M9 11h2M13 11h2M5 14h2M9 14h2M13 14h2');
    } else {
      p('M4 2h9l4 4v12H4z');
      p('M13 2v4h4M7 9h7M7 12h7M7 15h5');
    }
    parent.insertBefore(s, parent.firstChild);
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'ov-box overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const survey = ctx.kind === 'chat';
    const title = {
      chat: 'Feedback Survey',
      cookie: 'Cookie Notice',
      toast: 'System Notice',
      promo: 'Extranet Announcement',
      banner: 'Service Notice',
    }[ctx.kind];
    const bar = u.el('div', 'ov-title', el, title);
    const x = u.el('button', 'ov-x', bar, '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    const body = u.el('div', 'ov-body', el);
    if (survey) {
      u.el('p', '', body, 'How easy was it to find what you needed today?');
      const choices = u.el('div', 'ov-choices', body);
      ['Very easy', 'Somewhat easy', 'Neither easy nor difficult', 'Somewhat difficult', 'Very difficult'].forEach(
        (label) => {
          const row = u.el('label', '', choices);
          const r = u.el('input', '', row);
          r.type = 'radio';
          r.name = 'ease';
          r.value = label;
          u.el('span', '', row, label);
        },
      );
      u.el('p', '', body, 'What could we improve?');
      const dropdown = u.el('div', 'ov-dd', body);
      const toggle = u.el('button', 'ov-sel', dropdown, 'Select an option…');
      toggle.type = 'button';
      const options = u.el('div', 'ov-opts', dropdown);
      options.hidden = true;
      for (const label of ['Finding records', 'Page layout', 'Help and guidance']) {
        const b = u.el('button', '', options, label);
        b.type = 'button';
        b.onclick = () => {
          toggle.textContent = label;
          options.hidden = true;
        };
      }
      toggle.onclick = () => {
        options.hidden = !options.hidden;
      };
    } else {
      u.el(
        'p',
        '',
        body,
        {
          cookie: 'This extranet remembers your display preferences.',
          toast: 'Your session is active.',
          promo: 'New project tools are available.',
          banner: 'Scheduled maintenance tonight at 11 PM.',
        }[ctx.kind],
      );
    }
    const dismiss = u.el(
      'button',
      'primary ov-close',
      body,
      survey ? 'Close survey' : ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss',
    );
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  function panel(parent, u, title, links, cls) {
    const box = u.el('section', 'side-panel ' + (cls || ''), parent);
    u.el('h3', '', box, title);
    const list = u.el('ul', 'links', box);
    for (const [label, kind] of links) {
      const li = u.el('li', '', list);
      u.el('a', '', li, label).href = '#';
      icon(li, kind);
    }
    for (const a of box.querySelectorAll('a')) a.onclick = (e) => e.preventDefault();
    return box;
  }
  env.site({
    name: 'design-set-slider-multi-07',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const labelOf = (entry) => (typeof entry === 'string' ? entry : entry.label || entry.text || entry.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['header', 'link']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels);
      const cr = ctx.rng.fork('chrome/collide');
      const otherLabels = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = cr.bool(0.3) && otherLabels.length ? cr.pick(otherLabels) : null;
      const endControl = (parent, link) => {
        const b = u.el(link ? 'a' : 'button', link ? 'end-link' : 'primary', parent, endLabel);
        if (link) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
        return b;
      };
      document.body.className = `extranet instruction-${ctx.display}`;
      const head = u.el('header', 'masthead', document.body);
      const logo = u.el('div', 'logo', head);
      logo.innerHTML =
        '<svg viewBox="0 0 48 48" class="globe"><circle cx="24" cy="24" r="21" fill="#173a78" stroke="#8fc0ff" stroke-width="3"/><ellipse cx="24" cy="24" rx="9" ry="21" fill="none" stroke="#8fc0ff" stroke-width="2"/><path d="M3 24h42M7 13h34M7 35h34M24 3v42" stroke="#8fc0ff" stroke-width="2" fill="none"/></svg>';
      u.el('span', 'logo-a', logo, 'HorizonNet');
      u.el('span', 'logo-b', logo, 'Extranet');
      const tabs = u.el('nav', 'tabs', head);
      for (const t of ['Home', 'Projects', 'Resources', 'Reports', 'Support']) {
        const a = u.el('a', 'tab', tabs, t);
        a.href = '#';
        a.onclick = (e) => {
          e.preventDefault();
          env.log('decoy', { label: t });
        };
      }
      const util = u.el('div', 'util', head);
      u.el('div', 'util-top', util, 'Signed in: m.carter   |   Help   |   Sign Out');
      u.el('div', 'util-date', util, 'Tue, Apr 20, 1999');

      const page = u.el('div', 'page', document.body);
      const left = u.el('div', 'col-left', page);
      panel(left, u, 'Project Tools', [
        ['Task List', 'list'],
        ['Documents', 'doc'],
        ['Team Directory', 'person'],
        ['Calendar', 'cal'],
      ]);
      const quickLinks = panel(
        left,
        u,
        'Quick Links',
        [
          ['Project Brief', 'doc'],
          ['Technical Notes', 'doc'],
          ['Contact Support', 'doc'],
        ],
        'small',
      );
      for (const a of left.querySelectorAll('a'))
        a.onclick = (e) => {
          e.preventDefault();
          env.log('decoy', { label: a.textContent });
        };

      const center = u.el('section', 'center', page);
      const title = u.el('div', 'center-title', center);
      u.el('span', '', title, 'Camera View Settings');
      u.el('span', 'center-meta', title, 'Project: Falcon   |   Task 3 of 5');
      const body = u.el('div', 'center-body', center);
      const instruction = u.el('div', 'instruction', body, ctx.instruction);
      if (ctx.display === 'hidden') instruction.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-close', instruction, '×');
        close.setAttribute('aria-label', 'Close instruction');
        close.type = 'button';
        close.onclick = () => {
          instruction.hidden = true;
          const targets = document.getElementById('ref-targets');
          if (targets) targets.hidden = true;
        };
      }
      const stage = u.el('main', 'stage', body);
      stage.dataset.role = 'stage';
      const foot = u.el('div', 'center-foot', center);
      const reset = u.el('button', 'reset', foot, 'Reset');
      reset.type = 'button';
      reset.dataset.action = 'reset';
      let submit = null;
      if (collide) {
        const decoy = u.el('button', 'chrome-xtra', foot, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label: collide, collide: true });
      }
      if (!ctx.finish) {
        if (placement === 'link') {
          const row = u.el('li', 'completion-row', quickLinks.querySelector('.links'));
          submit = endControl(row, true);
          icon(row, 'doc');
        } else {
          submit = endControl(placement === 'header' ? title : foot, false);
          if (placement === 'header') submit.classList.add('header-end');
        }
      }

      const right = u.el('div', 'col-right', page);
      const ref = u.el('section', 'side-panel', right);
      const h = u.el('h3', 'ref-h', ref, 'Reference');
      h.insertAdjacentHTML(
        'afterbegin',
        '<svg viewBox="0 0 20 20" class="ico big"><path d="M4 2h9l4 4v12H4z" fill="#fff"/><path d="M7 9h7M7 12h7M7 15h5" stroke="#1b2f52" stroke-width="1.4"/></svg>',
      );
      const rb = u.el('div', 'ref-body', ref);
      u.el('h4', '', rb, 'Slider Ranges');
      const ranges = u.el('div', 'ranges', rb);
      ranges.id = 'ref-ranges';
      const targets = u.el('div', 'ranges ref-targets', rb);
      targets.id = 'ref-targets';
      targets.hidden = ctx.display === 'hidden';
      const tips = u.el('section', 'side-panel tips', right);
      u.el('h3', '', tips, 'Tips');
      const ul = u.el('ul', 'tip-list', tips);
      for (const t of [
        'Drag the slider handles to change values.',
        'Clicking the track is not allowed.',
        'Exact values are not required, stay within the given tolerance.',
      ])
        u.el('li', '', ul, t);

      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
