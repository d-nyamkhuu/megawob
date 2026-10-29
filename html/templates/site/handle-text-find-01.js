// site/ui-text-find-01: site template generated from the site.js of design-handle-text-find-01, of which many design-* sites
// were restyled copies; they are designs on it (templates/README.md, "Generated site templates"). The defaults
// (design {}) reproduce design-handle-text-find-01. Tokens (each replaced whole): cfg. Parts: frame, overlay, and the
// sections of frame() ('frame.1'..'frame.57'), overlay() ('overlay.1'..'overlay.7'): one per statement of the
// original body, run in order.
(function () {
  'use strict';

  const TOKENS = {
    cfg: {
      "title": "WritePro - Agreement.txt",
      "theme": "civic",
      "layout": "atari",
      "tools": "New       Open       Cut       Copy       Paste       Undo       Find       Help",
      "rail": "Floppy A|Floppy B|Hard Disk|Wastebasket",
      "side": "Help & Tips|Select text with the mouse or Shift + arrow keys.|Use Ctrl + C to copy, Ctrl + X to cut, and Ctrl + V to paste.|Press Ctrl + Z to undo your last change.|Use the Find command to look for a word or phrase in this document.|You can scroll with the mouse wheel or the scrollbar to read more content."
    },
  };

  const base = (S) => ({
    frame: function frame(ctx) {
      const _c = { ctx };
      for (let i = 1; i <= 57; i++) {
        const r = S[`frame.${i}`](_c);
        if (r !== undefined) return r;
      }
    },
    'frame.1': function (_c) {
      const {ctx} = _c;
      const u = ctx.util;
      Object.assign(_c, {
        u
      });
    },
    'frame.2': function (_c) {
      const {cfg} = S;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
    },
    'frame.3': function (_c) {
      const {u} = _c;
      const shell = u.el('main', 'shell', document.body);
      Object.assign(_c, {
        shell
      });
    },
    'frame.4': function (_c) {
      const {shell, u} = _c;
      const head = u.el('header', 'head', shell);
      Object.assign(_c, {
        head
      });
    },
    'frame.5': function (_c) {
      const {cfg} = S;
      const {head, u} = _c;
      const title = u.el('div', 'title', head, cfg.title);
      Object.assign(_c, {
        title
      });
    },
    'frame.6': function (_c) {
      const {cfg} = S;
      const {title, u} = _c;
      if (['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite'].includes(cfg.theme)) {
        const controls = u.el('span', 'window-controls', title);
        controls.innerHTML = '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      }
    },
    'frame.7': function (_c) {
      const {cfg} = S;
      const {head, u} = _c;
      if (cfg.tools) {
        const tb = u.el('div', 'tools', head);
        tb.innerHTML = '<span class=gem-tool><svg viewBox="0 0 48 48"><path d="M10 5h20l9 9v29H10zM30 5v11h9M16 23h18v15H16z"/></svg>New</span><span class=gem-tool><svg viewBox="0 0 48 48"><path d="M5 13h15l4 5h19v24H5zM7 13l4-7h12l5 7"/></svg>Open</span><span class=gem-tool><svg viewBox="0 0 48 48"><path d="M12 8l25 32M37 8L12 40M8 12l8-7 5 5-7 8M28 31l5-5 9 9-7 8z"/></svg>Cut</span><span class=gem-tool><svg viewBox="0 0 48 48"><path d="M14 7h18l9 9v27H14zM32 7v10h9M7 13v28h27"/></svg>Copy</span><span class=gem-tool><svg viewBox="0 0 48 48"><path d="M10 7h28v35H10zM16 14h16v4H16zM16 23h16M16 29h16M16 35h11"/></svg>Paste</span><span class=gem-tool><svg viewBox="0 0 48 48"><path d="M13 17a15 15 0 1 1-2 14M13 17V7m0 10h10M13 17l8-7"/></svg>Undo</span><span class=gem-tool><svg viewBox="0 0 48 48"><circle cx="20" cy="20" r="11"/><path d="m28 28 13 13"/></svg>Find</span><span class=gem-tool><svg viewBox="0 0 48 48"><path d="M5 14q10-12 19 0 9-12 19 0v25q-10-12-19 0-9-12-19 0zM24 14v25"/><path d="M9 20h10M9 26h10M29 20h10M29 26h10"/></svg>Help</span>';
      }
    },
    'frame.8': function (_c) {
      const {cfg} = S;
      const {shell, u} = _c;
      if (cfg.overview) {
        const ov = u.el('section', 'overview', shell);
        cfg.overview.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', ov, s));
      }
    },
    'frame.9': function (_c) {
      const {head} = _c;
      const tools = head.querySelector('.tools');
      Object.assign(_c, {
        tools
      });
    },
    'frame.10': function (_c) {
      const {head, title, tools} = _c;
      if (tools) head.insertBefore(tools, title);
    },
    'frame.11': function (_c) {
      const {head, u} = _c;
      u.el('div', 'civic-subtitle', head, 'Follow the instruction below to complete the task.');
    },
    'frame.12': function (_c) {
      const {head, u} = _c;
      u.el('div', 'civic-application', head, 'Application for Community Support');
    },
    'frame.13': function (_c) {
      const {head, u} = _c;
      u.el('div', 'civic-step', head, 'Step 2 of 3');
    },
    'frame.14': function (_c) {
      const {shell, u} = _c;
      const work = u.el('div', 'work', shell);
      Object.assign(_c, {
        work
      });
    },
    'frame.15': function (_c) {
      const {cfg} = S;
      const {u, work} = _c;
      if (cfg.rail) {
        const rail = u.el('nav', 'rail', work);
        cfg.rail.split('|').forEach((s, i) => {
          const d = u.el('div', i === 0 ? 'active' : '', rail);
          const art = ['<path d="M8 7h32v34H8zM15 7v15h18V7M16 29h16v12H16z"/><path d="M20 11h8v8h-8z"/>', '<path d="M8 7h32v34H8zM15 7v15h18V7M16 29h16v12H16z"/><path d="M20 11h8v8h-8z"/>', '<path d="M5 16h38v25H5zM9 16l4-9h22l4 9"/><circle cx="24" cy="28" r="5"/>', '<path d="M11 12h26l-2 30H13zM8 8h32v5H8zM18 17v18M24 17v18M30 17v18"/>'][i];
          d.innerHTML = '<svg class="gem-desk-icon" viewBox="0 0 48 48">' + art + '</svg><span>' + s + '</span>';
        });
      }
    },
    'frame.16': function (_c) {
      const {u, work} = _c;
      const center = u.el('section', 'center', work);
      Object.assign(_c, {
        center
      });
    },
    'frame.17': function (_c) {
      const {cfg} = S;
      const {center, ctx, u, work} = _c;
      const note = u.el('div', 'instruction', cfg.layout === 'response' ? work : center, ctx.instruction);
      Object.assign(_c, {
        note
      });
    },
    'frame.18': function (_c) {
      const {ctx, note} = _c;
      note.dataset.display = ctx.display;
    },
    'frame.19': function (_c) {
      const {ctx, note} = _c;
      note.hidden = ctx.display === 'hidden';
    },
    'frame.20': function (_c) {
      const {ctx, note} = _c;
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
      }
    },
    'frame.21': function (_c) {
      const {center, u} = _c;
      const stage = u.el('div', 'stage', center);
      Object.assign(_c, {
        stage
      });
    },
    'frame.22': function (_c) {
      const {center, ctx, note, stage} = _c;
      if (ctx.display === 'panel') {
        note.classList.add('instruction-panel');
        center.style.display = 'grid';
        center.style.gridTemplateColumns = 'minmax(0,1fr) minmax(170px,22%)';
        center.style.gridTemplateRows = 'minmax(0,1fr)';
        center.style.gap = '1vw';
        center.style.padding = '1.8vh 2.3vw 1.2vh 4.55vw';
        note.style.gridColumn = '2';
        note.style.gridRow = '1';
        note.style.margin = '0';
        note.style.alignSelf = 'start';
        note.style.padding = '16px';
        note.style.fontSize = 'clamp(16px,1.25vw,21px)';
        note.style.border = '2px solid #156bb0';
        note.style.borderLeft = '7px solid #156bb0';
        note.style.borderRadius = '6px';
        note.style.background = '#f3f8fe';
        stage.style.gridColumn = '1';
        stage.style.gridRow = '1';
      }
    },
    'frame.23': function (_c) {
      _c.aside = null;
    },
    'frame.24': function (_c) {
      const {cfg} = S;
      const {u, work} = _c;
      if (cfg.side) {
        _c.aside = u.el('aside', 'inspector', work);
        cfg.side.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', _c.aside, s));
      }
    },
    'frame.25': function (_c) {
      const {center, u} = _c;
      const fp = u.el('section', 'gem-find', center);
      Object.assign(_c, {
        fp
      });
    },
    'frame.26': function (_c) {
      const {fp, u} = _c;
      u.el('h2', '', fp, '⌕  Find');
    },
    'frame.27': function (_c) {
      const {fp, u} = _c;
      const fl = u.el('label', 'gem-find-label', fp, 'Find what:');
      Object.assign(_c, {
        fl
      });
    },
    'frame.28': function (_c) {
      const {fp, u} = _c;
      const fi = u.el('input', 'gem-find-input', fp);
      Object.assign(_c, {
        fi
      });
    },
    'frame.29': function (_c) {
      const {fi} = _c;
      fi.type = 'text';
    },
    'frame.30': function (_c) {
      const {fi} = _c;
      fi.setAttribute('aria-label', 'Find what');
    },
    'frame.31': function (_c) {
      const {fp, u} = _c;
      const opts = u.el('div', 'gem-find-options', fp);
      Object.assign(_c, {
        opts
      });
    },
    'frame.32': function (_c) {
      const {opts, u} = _c;
      const mc = u.el('label', '', opts);
      Object.assign(_c, {
        mc
      });
    },
    'frame.33': function (_c) {
      const {mc, u} = _c;
      const mci = u.el('input', '', mc);
      Object.assign(_c, {
        mci
      });
    },
    'frame.34': function (_c) {
      const {mci} = _c;
      mci.type = 'checkbox';
    },
    'frame.35': function (_c) {
      const {mc, mci} = _c;
      mc.append(mci, document.createTextNode(' Match case'));
    },
    'frame.36': function (_c) {
      const {opts, u} = _c;
      const ww = u.el('label', '', opts);
      Object.assign(_c, {
        ww
      });
    },
    'frame.37': function (_c) {
      const {u, ww} = _c;
      const wwi = u.el('input', '', ww);
      Object.assign(_c, {
        wwi
      });
    },
    'frame.38': function (_c) {
      const {wwi} = _c;
      wwi.type = 'checkbox';
    },
    'frame.39': function (_c) {
      const {ww, wwi} = _c;
      ww.append(wwi, document.createTextNode(' Whole words only'));
    },
    'frame.40': function (_c) {
      const {fp, u} = _c;
      const acts = u.el('div', 'gem-find-actions', fp);
      Object.assign(_c, {
        acts
      });
    },
    'frame.41': function (_c) {
      const {acts, u} = _c;
      const prev = u.el('button', '', acts, 'Find Previous');
      Object.assign(_c, {
        prev
      });
    },
    'frame.42': function (_c) {
      const {acts, u} = _c;
      const next = u.el('button', '', acts, 'Find Next');
      Object.assign(_c, {
        next
      });
    },
    'frame.43': function (_c) {
      const {center, fi, mci, next, prev, wwi} = _c;
      [prev, next].forEach(b => {
        b.type = 'button';
        b.addEventListener('click', () => {
          const q = fi.value;
          if (!q) return;
          const doc = center.querySelector('.ut-doc,.ut-page');
          if (!doc) return;
          const walker = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT);
          const nodes = [];
          while (walker.nextNode()) nodes.push(walker.currentNode);
          const backwards = b === prev;
          let hits = [];
          for (const n of nodes) {
            const raw = n.nodeValue;
            const hay = mci.checked ? raw : raw.toLocaleLowerCase();
            const needle = mci.checked ? q : q.toLocaleLowerCase();
            let pos = backwards ? hay.length - needle.length : 0;
            while (pos >= 0 && pos <= hay.length - needle.length) {
              const at = hay.indexOf(needle, pos);
              if (at < 0) break;
              const before = hay[at - 1] || ' ';
              const after = hay[at + needle.length] || ' ';
              if (!wwi.checked || !(/[\w]/).test(before) && !(/[\w]/).test(after)) hits.push({
                n,
                at
              });
              pos = at + 1;
            }
          }
          if (!hits.length) return;
          const hit = backwards ? hits[hits.length - 1] : hits[0];
          const range = document.createRange();
          range.setStart(hit.n, hit.at);
          range.setEnd(hit.n, hit.at + q.length);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          const box = doc.classList.contains('ut-doc') ? doc : null;
          if (box) {
            const rr = range.getBoundingClientRect(), br = box.getBoundingClientRect();
            if (rr.top < br.top) box.scrollTop -= br.top - rr.top; else if (rr.bottom > br.bottom) box.scrollTop += rr.bottom - br.bottom;
          }
        });
      });
    },
    'frame.44': function (_c) {
      const {cfg} = S;
      const {ctx, note} = _c;
      if (cfg.layout === 'console' && _c.aside && ctx.display !== 'toast') {
        _c.aside.insertBefore(note, _c.aside.children[1] || null);
      }
    },
    'frame.45': function (_c) {
      const {shell, u} = _c;
      const foot = u.el('footer', 'footer', shell);
      Object.assign(_c, {
        foot
      });
    },
    'frame.46': function (_c) {
      const {ctx, foot, note} = _c;
      if (ctx.display === 'toast') {
        foot.appendChild(note);
        Object.assign(note.style, {
          position: 'static',
          zIndex: 'auto',
          top: 'auto',
          left: 'auto',
          maxWidth: '58%',
          margin: '0',
          padding: '8px 12px',
          fontSize: 'clamp(13px,1vw,17px)',
          lineHeight: '1.25',
          minHeight: '0',
          border: '2px solid #156bb0',
          borderRadius: '5px',
          boxShadow: '0 2px 8px #1233',
          flex: '1'
        });
      }
    },
    'frame.47': function (_c) {
      const {cfg} = S;
      const {foot, u} = _c;
      if (cfg.foot) {
        const dock = u.el('div', 'dock-sections', foot);
        cfg.foot.split('|').forEach(s => {
          const d = u.el('section', 'dock-section', dock);
          u.el('strong', '', d, s);
          if (cfg.theme === 'qt') {
            if (s === 'Task List') {
              ['1.  Click requested control', '2.  Review result', '3.  Submit', '4.  Finish'].forEach((t, i) => u.el('div', i === 0 ? 'current-task' : 'task-row', d, t));
            } else if (s === 'Status') {
              ['Current Step:     1 of 4', 'Status:    Not completed', 'Attempts:    0', 'Result:    —'].forEach(t => u.el('div', 'status-row', d, t));
            } else if (s === 'Notes') {
              u.el('div', 'dock-note', d, 'Follow the instruction above.');
            }
          }
        });
      } else u.el('span', 'ready', foot, 'Ready.');
    },
    'frame.48': function (_c) {
      _c.submit = null;
    },
    'frame.49': function (_c) {
      _c.endPlacement = null;
    },
    'frame.50': function (_c) {
      _c.endText = 'Submit';
    },
    'frame.51': function (_c) {
      const {ctx} = _c;
      const endR = ctx.rng.fork('chrome/end');
      Object.assign(_c, {
        endR
      });
    },
    'frame.52': function (_c) {
      const {ctx, endR} = _c;
      if (!ctx.finish) {
        if (endR.bool(0.5)) {
          _c.endPlacement = 'footer';
        } else {
          _c.endPlacement = endR.pick(['header', 'link']);
          const endBank = ctx.content && Array.isArray(ctx.content.END_LABELS) ? ctx.content.END_LABELS : ['Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
          const choices = endBank.map(x => typeof x === 'string' ? x : x && (x.label || x.text || x.name) || String(x)).filter(x => String(x).trim().toLowerCase() !== 'submit');
          if (choices.length) _c.endText = endR.pick(choices);
        }
      }
    },
    'frame.53': function (_c) {
      const {ctx, u} = _c;
      const makeEnd = (parent, asLink) => {
        const b = u.el(asLink ? 'a' : 'button', 'submit', parent, _c.endText);
        if (asLink) b.href = '#'; else b.type = 'button';
        b.addEventListener('click', e => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      Object.assign(_c, {
        makeEnd
      });
    },
    'frame.54': function (_c) {
      const {foot, head, makeEnd, u} = _c;
      if (_c.endPlacement === 'footer') {
        _c.submit = makeEnd(foot, false);
      } else if (_c.endPlacement === 'header') {
        _c.submit = makeEnd(head, false);
        _c.submit.style.position = 'absolute';
        _c.submit.style.right = '2.3vw';
        _c.submit.style.bottom = '1vh';
        _c.submit.style.height = '5.4vh';
        _c.submit.style.width = '18.4vw';
        _c.submit.style.minWidth = '0';
        _c.submit.style.padding = '0';
        _c.submit.style.fontSize = 'clamp(17px,1.5vw,25px)';
      } else if (_c.endPlacement === 'link') {
        _c.submit = makeEnd(foot, true);
        _c.submit.style.background = 'transparent';
        _c.submit.style.border = '0';
        _c.submit.style.boxShadow = 'none';
        _c.submit.style.color = '#123f73';
        _c.submit.style.fontSize = 'clamp(16px,1.2vw,21px)';
        _c.submit.style.fontWeight = '700';
        _c.submit.style.textDecoration = 'underline';
        _c.submit.style.minWidth = '0';
        _c.submit.style.padding = '8px 10px';
        u.el('span', '', _c.submit, ' ›');
      }
    },
    'frame.55': function (_c) {
      const {ctx} = _c;
      const collideR = ctx.rng.fork('chrome/collide');
      Object.assign(_c, {
        collideR
      });
    },
    'frame.56': function (_c) {
      const {collideR, ctx, foot, u} = _c;
      if (!ctx.finish && collideR.bool(0.3)) {
        const all = ctx.content && Array.isArray(ctx.content.END_LABELS) ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete'];
        const labels = all.map(x => typeof x === 'string' ? x : x && (x.label || x.text || x.name) || String(x)).filter(x => String(x).trim().toLowerCase() !== _c.endText.trim().toLowerCase());
        if (labels.length) {
          const label = collideR.pick(labels);
          const decoy = u.el('button', 'submit', foot, label);
          decoy.type = 'button';
          decoy.style.width = 'auto';
          decoy.style.height = 'auto';
          decoy.style.minWidth = '0';
          decoy.style.marginLeft = '0';
          decoy.style.padding = '1.3vh 1.4vw';
          decoy.style.fontSize = 'clamp(13px,1vw,17px)';
          decoy.style.background = 'linear-gradient(125deg,#e8f2fd,#d9e8f8)';
          decoy.style.color = '#123f73';
          decoy.style.border = '2px solid #9cb7d3';
          decoy.addEventListener('click', () => env.log('decoy', {
            label,
            collide: true
          }));
        }
      }
    },
    'frame.57': function (_c) {
      const {stage} = _c;
      return {
        stage,
        submit: _c.submit
      };
    },
    overlay: function overlay(ctx) {
      const _c = { ctx };
      for (let i = 1; i <= 7; i++) {
        const r = S[`overlay.${i}`](_c);
        if (r !== undefined) return r;
      }
    },
    'overlay.1': function (_c) {
      const {ctx} = _c;
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      Object.assign(_c, {
        el
      });
    },
    'overlay.2': function (_c) {
      const {ctx, el} = _c;
      ctx.util.el('strong', '', el, ({
        cookie: 'Cookie preferences',
        toast: 'Notification',
        chat: 'Support',
        promo: 'A special offer',
        banner: 'Service notice'
      })[ctx.kind]);
    },
    'overlay.3': function (_c) {
      const {ctx, el} = _c;
      ctx.util.el('p', '', el, ({
        cookie: 'Choose your preferences to continue.',
        toast: 'Your workspace is ready.',
        chat: 'How can we help?',
        promo: 'Explore the latest tools.',
        banner: 'A new update is available.'
      })[ctx.kind]);
    },
    'overlay.4': function (_c) {
      const {ctx, el} = _c;
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      Object.assign(_c, {
        dismiss
      });
    },
    'overlay.5': function (_c) {
      const {dismiss} = _c;
      dismiss.type = 'button';
    },
    'overlay.6': function (_c) {
      const {ctx, dismiss} = _c;
      dismiss.addEventListener('click', ctx.dismiss);
    },
    'overlay.7': function (_c) {
      const {dismiss, el} = _c;
      return {
        el,
        dismiss
      };
    },
  });

  env.template('site/handle-text-find-01', (design, def) => {
    const S = {};
    const { D, P } = env.templateDesign('site/handle-text-find-01', design, def, { tokens: TOKENS, base: base(S), state: S });
    Object.assign(S, D, P);
    return { frame: P.frame, overlay: P.overlay };
  });
})();
