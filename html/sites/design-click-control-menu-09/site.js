(function () {
  'use strict';
  const cfg = {
    'title': 'Contact Manager',
    'theme': 'openlook',
    'layout': 'inspector',
    'tools': 'File    Edit    View    People    Tools    Help',
    'side': 'Contact Details|No contact selected|Name:   \u2014|Email:   \u2014|Phone:   \u2014|Group:   \u2014|Notes:',
  };
  env.site({
    name: 'design-click-control-menu-09',
    styles: ['site.css', 'wood.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'wood';
      const W = u.el('main', 'w-win', document.body);
      const tb = u.el('header', 'w-title', W);
      tb.innerHTML =
        '<svg width="30" height="26" viewBox="0 0 30 26"><path d="M4 22C8 10 16 4 27 3 24 12 16 19 8 21Z" fill="#ddd0a3" stroke="#8a6a3a"/><path d="M2 26 23 6M8 18l8-1M10 15l8-1M13 12l8-1M16 9l7-1M9 18l-1-5M12 15l-1-5M15 12l-1-4M18 9V6" fill="none" stroke="#685333" stroke-width=".7"/></svg><span>Notebook Pro</span><i class="wc"><b>&#8212;</b><b>&#9633;</b><b>&#10005;</b></i>';
      const bar = u.el('div', 'w-bar', W);
      const ph = u.el('div', 'w-menuslot', bar, 'Menu');
      ph.setAttribute('aria-hidden', 'true');
      const chev =
        '<svg class="chv" width="12" height="8" viewBox="0 0 12 8"><path d="m1 1 5 5 5-5" fill="none" stroke="#2a1d12" stroke-width="2"/></svg>';
      const sel1 = u.el('span', 'w-sel w-font', bar);
      sel1.innerHTML = '<span>Georgia</span>' + chev;
      const sel2 = u.el('span', 'w-sel w-size', bar);
      sel2.innerHTML = '<span>12</span>' + chev;
      const S = (d) =>
        '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#2a1d12" stroke-width="2" stroke-linecap="round">' +
        d +
        '</svg>';
      const gap = () => u.el('span', 'w-gap', bar);
      ['B', 'I', 'U'].forEach((t, i) => u.el('span', 'w-tb w-' + t.toLowerCase(), bar, t));
      gap();
      const al = [
        S('<path d="M3 4h14M3 8h9M3 12h14M3 16h9"/>'),
        S('<path d="M3 4h14M8 8h9M3 12h14M8 16h9"/>'),
        S('<path d="M3 4h14M3 8h14M3 12h14M3 16h14"/>'),
      ];
      al.forEach((s, i) => {
        const e = u.el('span', 'w-tb w-al' + (i === 0 ? ' on' : ''), bar);
        e.innerHTML = s;
      });
      gap();
      const ls = [
        S('<path d="M8 5h9M8 10h9M8 15h9M3 5h.5M3 10h.5M3 15h.5"/>'),
        S('<path d="M8 5h9M8 10h9M8 15h9M3 4l1-1v4M3 9h2M3 14h2"/>'),
      ];
      ls.forEach((s) => {
        const e = u.el('span', 'w-tb w-ic', bar);
        e.innerHTML = s;
      });
      gap();
      const lk = u.el('span', 'w-tb w-ic', bar);
      lk.innerHTML = S('<path d="M8 12l4-4M9 6l1-1a3.5 3.5 0 0 1 5 5l-1 1M11 14l-1 1a3.5 3.5 0 0 1-5-5l1-1"/>');
      gap();
      const im = u.el('span', 'w-tb w-ic', bar);
      im.innerHTML = S('<rect x="3" y="4" width="14" height="12" rx="1"/><path d="m4 14 4-4 3 3 2-2 3 3"/>');
      const sr = u.el('span', 'w-search', bar);
      sr.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#2a1d12" stroke-width="2"><circle cx="8" cy="8" r="5.5"/><path d="m12 12 5 5"/></svg><span>Search documents...</span>';
      const body = u.el('div', 'w-body', W);
      const idx = u.el('nav', 'w-index', body);
      for (let i = 1; i <= 20; i++) u.el('div', '', idx, String(i));
      const sheet = u.el('section', 'w-sheet', body);
      const note = u.el('div', 'w-note', sheet, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      sheet.dataset.display = ctx.display;
      const doc = u.el('div', 'w-doc', sheet);
      doc.innerHTML =
        '<h1>Project Notes</h1><p class="d">April 27, 2011</p><hr><h2>Ideas</h2><ul><li>Refine concept</li><li>Review feedback</li><li>Plan next steps</li></ul><h2>Next Steps</h2><div class="ck"><span></span>Finalize draft</div><div class="ck"><span></span>Prepare assets</div><div class="ck"><span></span>Schedule review</div>';
      const stage = u.el('div', 'w-stage', W);
      const foot = u.el('footer', 'w-foot', W);
      foot.innerHTML =
        '<span class="knob"></span><span class="st">Document: Untitled</span><span class="sep"></span><span class="st">Words: 24</span><span class="sp"></span><button type="button" class="bt">&#9724;&nbsp; Save</button><button type="button" class="bt">&#8630;&nbsp; Discard</button>';
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['header', 'link']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels.filter((label) => label !== 'Submit'));
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'submit w-submit' + (placement === 'header' ? ' w-end-header' : placement === 'link' ? ' w-end-link' : ''),
          placement === 'header' ? tb : foot,
          endLabel,
        );
        if (placement === 'link') {
          submit.href = '#';
          foot.insertBefore(submit, foot.querySelector('.sp'));
        } else submit.type = 'button';
        if (placement === 'header') {
          tb.insertBefore(submit, tb.querySelector('.wc'));
          tb.querySelector('.wc').style.marginLeft = '0';
        }
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.dataset.role = 'submit';
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      const collide = cr.bool(0.3);
      const save = foot.querySelector('.bt');
      const decoyLabel = collide
        ? cr.pick(endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase()))
        : endLabel === 'Save'
          ? 'Save draft'
          : 'Save';
      save.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 2h16l3 3v17H3z" fill="currentColor"/><path d="M7 3h10v6H7zM7 14h11v8H7z" fill="#d6bc7d"/><path d="M14 3h2v5h-2z" fill="currentColor"/></svg>';
      u.el('span', '', save, decoyLabel);
      save.dataset.role = 'xtra';
      save.addEventListener('click', () =>
        env.log('decoy', collide ? { label: decoyLabel, collide: true } : { label: decoyLabel }),
      );
      const discard = foot.querySelectorAll('.bt')[1];
      discard.dataset.role = 'xtra';
      discard.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 2-8 7 8 6V10c13-2 12 11 4 12 14-1 15-18-4-17Z" fill="currentColor"/></svg><span>Discard</span>';
      discard.addEventListener('click', () => env.log('decoy', { label: 'Discard' }));
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
