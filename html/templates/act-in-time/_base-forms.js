/* act-in-time/_base-forms: shared template implementation; parts remain on the calling template. */
(function () {
  'use strict';
  function buildInterruption(P, util, f, choice, rng, env, ctx, ev, sync) {
    let dlg = null;
    let bar = null;
    if (P.kind === 'modal') {
      const backdrop = util.el('div', 'ut-backdrop', f.body);
      const box = util.el('div', 'ut-dialog', f.body);
      box.dataset.role = 'dialog';
      util.el('p', '', box, P.msg);
      util.el('p', '', box, P.question);
      const row = util.el('div', 'ut-row', box);
      const mk = (label) => {
        const b = util.el('button', 'ut-btn', null, label);
        b.type = 'button';
        return b;
      };
      choice.stay = mk(P.stay);
      choice.leave = mk(P.leave);
      if (P.order === 'stay-first') row.append(choice.stay, choice.leave);
      else row.append(choice.leave, choice.stay);
      const br = f.body.getBoundingClientRect();
      box.style.left = Math.round(rng.float(0.15, 0.85) * Math.max(0, br.width - 330)) + 'px';
      box.style.top = Math.round(rng.float(0.15, 0.6) * Math.max(0, br.height - 170)) + 'px';
      dlg = env.ui.dialog(box, {
        open: ctx.model.popup === 'open',
        buttons: [['stay', choice.stay], ['leave', choice.leave]],
        backdrop,
        label: 'popup',
        onChange: (open, result) => {
          if (result === 'leave' || result === 'stay') ev({ popup: result });
          sync(ctx.model);
        },
      });
    } else {
      bar = util.el('div', 'ut-cookie', f.body);
      bar.dataset.role = 'cookie';
      util.el('p', '', bar, P.text);
      const mk = (key, label, cls) => {
        const b = util.el('button', 'ut-btn ' + cls, null, label);
        b.type = 'button';
        b.addEventListener('click', () => { ev({ popup: key }); sync(ctx.model); });
        return b;
      };
      choice.accept = mk('accept', P.accept, 'primary');
      if (P.reject) choice.reject = mk('reject', P.reject, 'ghost');
      const order = P.order === 'reject-first' && choice.reject ? [choice.reject, choice.accept] : [choice.accept, choice.reject];
      for (const b of order) if (b) bar.append(b);
      bar.hidden = true;
    }
    return { dlg, bar };
  }

  function buildPopup(unitScope, ctx, f) {
    const { env } = unitScope;
    const { spec, util, rng } = ctx;
    const fam = env.taskDef;
    const ev = (e) => ctx.update(fam.helpers.act(ctx.model, spec, e));
    const P = spec.popup;
    const main = util.el('div', 'ut-main', f.body);
    const mr = main.getBoundingClientRect();
    const card = util.el('div', 'ut-login', main);
    card.style.left = Math.round(rng.float(0.1, 0.9) * Math.max(0, mr.width - 340)) + 'px';
    card.style.top = Math.round(rng.float(0.05, 0.75) * Math.max(0, mr.height - 320)) + 'px';
    util.el('h3', '', card, rng.pick(['Sign in', 'Log in', 'Welcome back']));
    const field = (key, label, type) => {
      const fl = util.el('div', 'ut-field', card);
      const id = `ut-${key}`;
      const lab = util.el('label', '', fl, label);
      lab.htmlFor = id;
      const inp = util.el('input', 'ut-input', fl);
      inp.type = type;
      inp.id = id;
      inp.name = key;
      inp.autocomplete = 'off';
      inp.spellcheck = false;
      return inp;
    };
    const userEl = field('user', rng.pick(['Username', 'User name', 'Username or email']), 'text');
    const passEl = field('pass', 'Password', 'password');
    const err = util.el('div', 'ut-err', card, 'Incorrect username or password.');
    err.hidden = true;
    const login = util.el('button', 'ut-btn primary', card, rng.pick(['Log in', 'Sign in']));
    login.type = 'button';
    const signed = util.el('div', 'ut-signed', card);
    signed.hidden = true;
    let settings = null;
    if (P.kind === 'bar') {
      const foot = util.el('div', 'ut-foot', card);
      settings = util.el('button', 'ut-link', foot, 'Cookie settings');
      settings.type = 'button';
      settings.addEventListener('click', () => { ev({ settings: true }); sync(ctx.model); });
    }

    // "You left" page (recoverable exit through the dialog).
    const left = util.el('div', 'ut-left', f.body);
    util.el('h3', '', left, 'You left the sign-in page');
    util.el('p', '', left, 'Your session was closed.');
    const back = util.el('button', 'ut-btn', left, 'Return to sign in');
    back.type = 'button';
    back.addEventListener('click', () => { ev({ back: true }); sync(ctx.model); });
    left.hidden = true;

    const choice = {};
    const { dlg, bar } = buildInterruption(P, util, f, choice, rng, env, ctx, ev, sync);

    

    const blocked = () => (P.kind === 'modal' && ctx.model.popup === 'open') || ctx.model.exited || !!ctx.model.login;
    const lock = () => {
      const b = blocked();
      if (b && (document.activeElement === userEl || document.activeElement === passEl) && P.kind === 'modal') document.activeElement.blur();
      userEl.disabled = b;
      passEl.disabled = b;
      login.setAttribute('aria-disabled', b ? 'true' : 'false');
    };
    const tfUser = env.ui.textField(userEl, { value: ctx.model.user, label: 'username', onInput: (v) => ev({ field: 'user', value: v }) });
    const tfPass = env.ui.textField(passEl, { value: ctx.model.pass, label: 'password', onInput: (v) => ev({ field: 'pass', value: v }) });
    for (const [key, el] of [['user', userEl], ['pass', passEl]]) {
      el.addEventListener('focus', () => {
        if (ctx.model.popup === 'pending' && P.trigger === `focus-${key}`) {
          ev({ open: true });
          env.log('open', { what: 'popup', on: `focus-${key}` });
          sync(ctx.model);
        }
      });
    }
    const btns = env.ui.buttons([login], {
      keys: ['login'],
      label: 'login',
      disabled: () => blocked(),
      onClick: () => {
        ev({ login: true });
        sync(ctx.model);
      },
      mark: () => {},
    });

    function sync(m) {
      const open = m.popup === 'open';
      if (dlg && dlg.isOpen() !== open) dlg.set(open);
      if (bar) bar.hidden = !open;
      left.hidden = !m.exited;
      lock();
      if (userEl.value !== m.user) tfUser.set(m.user);
      if (passEl.value !== m.pass) tfPass.set(m.pass);
      err.hidden = !m.failed;
      signed.hidden = !m.login;
      signed.textContent = m.login ? `Signed in as ${m.login.user}` : '';
      f.setStatus(m.login ? '<b>Signed in</b>' : m.exited ? 'Signed out' : open ? '<b>Notice</b>' : 'Not signed in');
    }
    sync(ctx.model);
    return {
      sync,
      locate(tg) {
        if (tg.field === 'user') return tfUser.locate();
        if (tg.field === 'pass') return tfPass.locate();
        if (tg.login) return btns.locate('login');
        if (tg.popup) return choice[tg.popup] ? util.center(choice[tg.popup]) : null;
        if (tg.settings) return settings ? util.center(settings) : null;
        if (tg.back) return util.center(back);
        return null;
      },
    };
}

  function buildToast(unitScope, ctx, f) {
    const { env } = unitScope;
    const { spec, util, rng } = ctx;
    const fam = env.taskDef;
    const ev = (e) => { ctx.update(fam.helpers.act(ctx.model, spec, e)); sync(ctx.model); };
    const main = util.el('div', 'ut-main', f.body);
    const card = util.el('div', 'ut-verify', main);
    const vl = util.el('div', 'ut-vl', card);
    util.el('h3', '', vl, rng.pick(["Verify it's you", 'Two-step verification', 'Confirm this sign-in']));
    const via = spec.channel === 'email' ? `by email to ${spec.dest}` : spec.channel === 'SMS' ? `by SMS to ${spec.dest}` : 'to your authenticator app';
    util.el('p', '', vl, `We will send a ${spec.code.length}-digit code ${via}.`);
    const send = util.el('button', 'ut-btn', vl, 'Send code');
    send.type = 'button';
    send.addEventListener('click', () => ev({ send: true }));
    const boxes = util.el('div', 'ut-boxes', vl);
    const cells = [...spec.code].map(() => util.el('i', '', boxes));
    const msg = util.el('p', '', vl);
    const verify = util.el('button', 'ut-btn primary', vl, rng.pick(['Verify', 'Confirm', 'Continue']));
    verify.type = 'button';
    verify.addEventListener('click', () => ev({ verify: true }));
    const pad = util.el('div', 'ut-pad3', card);
    const keys = {};
    const order = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'back', '0', null];
    for (const k of order) {
      if (k === null) { util.el('span', '', pad); continue; }
      const b = util.el('button', 'ut-btn', pad, k === 'back' ? '⌫' : k);
      b.type = 'button';
      b.addEventListener('click', () => ev({ key: k }));
      keys[k] = b;
    }
    const mr = main.getBoundingClientRect();
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;
    card.style.left = Math.round(rng.float(0.05, 0.6) * Math.max(0, mr.width - cw)) + 'px';
    card.style.top = Math.round(rng.float(0.05, 0.9) * Math.max(0, mr.height - ch)) + 'px';

    // The code toast: a corner of the console body. Its content (the code) exists only while the toast is shown: it is
    // built when it appears and removed (text gone, not hidden) when it expires, and a Resend builds a new one.
    const toast = util.el('div', 'ut-ctoast', f.body);
    toast.hidden = true;
    let life = null;
    const corner = rng.pick(['tr', 'br', 'tr', 'tl']);
    toast.style[corner[0] === 't' ? 'top' : 'bottom'] = '14px';
    toast.style[corner[1] === 'r' ? 'right' : 'left'] = '14px';
    function fillToast() {
      const tSmall = util.el('small', '', toast, spec.channel === 'authenticator' ? 'Authenticator' : spec.channel === 'email' ? 'New email' : 'Messages · now');
      tSmall.dataset.role = 'toast';
      toast.append(spec.channel === 'email' ? 'Your sign-in code is ' : 'Your verification code is ');
      util.el('b', '', toast, spec.code);
      life = util.el('i', 'ut-life', toast);
    }

    function sync(m) {
      const shown = fam.helpers.toastShown(spec, m);
      if (shown && !toast.firstChild) fillToast();
      if (!shown && toast.firstChild) { toast.textContent = ''; life = null; }
      toast.hidden = !shown;
      if (shown) life.style.width = `${Math.max(0, 100 * (1 - (m.t - m.sent - spec.delay) / spec.ttl))}%`;
      send.textContent = m.sent === null ? 'Send code' : 'Resend code';
      cells.forEach((c, i) => {
        c.textContent = m.digits[i] || '';
        c.className = i === m.digits.length && !m.verified ? 'cur' : '';
      });
      msg.className = m.verified ? 'ut-ok' : '';
      msg.style.color = m.failed ? '#c92a2a' : '';
      msg.textContent = m.verified ? 'Verified. You are signed in.' : m.failed ? 'That code is incorrect. Try again.' : m.sent === null ? 'No code sent yet.' : 'Code sent. Enter it below.';
      verify.setAttribute('aria-disabled', m.digits.length === spec.code.length && !m.verified ? 'false' : 'true');
      f.setStatus(m.verified ? '<b>Verified</b>' : m.sent === null ? 'Waiting' : 'Code sent');
    }
    return {
      sync,
      locate(tg) {
        if (tg.send) return util.center(send);
        if (tg.verify) return util.center(verify);
        if (tg.key !== undefined) return util.center(keys[tg.key]);
        return null;
      },
    };
}

  function buildCountdown(unitScope, ctx, f) {
    const { env, spot, clockText } = unitScope;
    const { spec, util, rng } = ctx;
    const fam = env.taskDef;
    const ev = (e) => { ctx.update(fam.helpers.act(ctx.model, spec, e)); sync(ctx.model); };
    const main = util.el('div', 'ut-main', f.body);
    const card = util.el('div', 'ut-hold', main);
    const hh = util.el('div', 'ut-holdhead', card);
    util.el('h3', '', hh, spec.item);
    const timer = util.el('div', 'ut-timer', hh);
    const barI = util.el('i', '', util.el('div', 'ut-holdbar', card));
    const chips = {};
    for (const g of spec.groups) {
      const gr = util.el('div', 'ut-grp', card);
      util.el('div', 'ut-k', gr, g.label);
      const row = util.el('div', 'ut-chips', gr);
      chips[g.key] = {};
      for (const o of g.options) {
        const b = util.el('button', 'ut-chip', row, o);
        b.type = 'button';
        b.addEventListener('click', () => ev({ opt: [g.key, o] }));
        chips[g.key][o] = b;
      }
    }
    const confirm = util.el('button', 'ut-btn primary', card, spec.confirm);
    confirm.type = 'button';
    confirm.addEventListener('click', () => ev({ confirm: true }));
    const done = util.el('div', 'ut-done', card);
    const doneT = util.el('span', '', done);
    const cancel = util.el('button', 'ut-link', done, 'Cancel reservation');
    cancel.type = 'button';
    cancel.addEventListener('click', () => ev({ cancel: true }));
    const mr = main.getBoundingClientRect();
    const [x, y] = spot(rng, main, card.offsetWidth, card.offsetHeight + 46, [0.05, 0.95], [0.02, 0.9]);
    card.style.left = x + 'px';
    card.style.top = Math.max(0, Math.min(y, mr.height - card.offsetHeight - 46)) + 'px';

    function sync(m) {
      const left = fam.helpers.holdLeft(spec, m);
      timer.textContent = m.confirmed ? 'Reserved' : left > 0 ? `Held for ${clockText(left + 999)}` : 'Expired';
      timer.classList.toggle('low', !m.confirmed && left <= 3000);
      barI.style.width = `${m.confirmed ? 100 : (100 * left) / spec.hold}%`;
      for (const g of spec.groups) for (const [o, b] of Object.entries(chips[g.key])) b.classList.toggle('on', m.sel[g.key] === o);
      const all = spec.groups.every((g) => m.sel[g.key] !== undefined);
      confirm.setAttribute('aria-disabled', all && !m.confirmed && left > 0 ? 'false' : 'true');
      done.hidden = !m.confirmed;
      doneT.textContent = m.confirmed ? `Done: ${spec.groups.map((g) => m.sel[g.key]).join(' · ')}` : '';
      cancel.hidden = !spec.recoverable;
      cancel.style.display = spec.recoverable ? '' : 'none';
      f.setStatus(m.confirmed ? '<b>Confirmed</b>' : left > 0 ? `Hold ends in <b>${Math.ceil(left / 1000)} s</b>` : 'Hold expired');
    }
    return {
      sync,
      locate(tg) {
        if (tg.opt) return util.center(chips[tg.opt[0]][tg.opt[1]]);
        if (tg.confirm) return util.center(confirm);
        if (tg.cancel) return util.center(cancel);
        return null;
      },
    };
}

  function buildDebounce(unitScope, ctx, f) {
    const { env, spinner } = unitScope;
    const { spec, util, rng } = ctx;
    const fam = env.taskDef;
    const ev = (e) => { ctx.update(fam.helpers.act(ctx.model, spec, e)); sync(ctx.model); };
    const main = util.el('div', 'ut-main', f.body);
    const card = util.el('div', 'ut-trip', main);
    util.el('h3', '', card, rng.pick(['Plan your trip', 'Where are you going?', 'Search destinations', 'Delivery details']));
    const fl = util.el('div', 'ut-field', card);
    const lab = util.el('label', '', fl, spec.label);
    lab.htmlFor = 'ut-city';
    const ac = util.el('div', 'ut-ac', fl);
    const inp = util.el('input', 'ut-input', ac);
    inp.id = 'ut-city';
    inp.type = 'text';
    inp.autocomplete = 'off';
    inp.spellcheck = false;
    inp.placeholder = rng.pick(['Start typing a city', 'City or airport', 'e.g. Lisbon', 'Search']);
    const spin = spinner(util, ac);
    spin.svg.setAttribute('class', 'ut-acspin');
    const sug = util.el('div', 'ut-sug', ac);
    const fake = util.el('div', 'ut-fake', card);
    for (const [k, v] of rng.sample([['Dates', 'Any time'], ['Travelers', '1 adult'], ['Class', 'Economy'], ['Bags', '1 cabin bag']], 2)) {
      const d = util.el('div', '', fake);
      util.el('div', 'ut-k', d, k).style.marginBottom = '5px';
      util.el('span', '', d, v);
    }
    const mr = main.getBoundingClientRect();
    card.style.left = Math.round(rng.float(0.05, 0.95) * Math.max(0, mr.width - 420)) + 'px';
    card.style.top = Math.round(rng.float(0, 0.3) * Math.max(0, mr.height - 420)) + 'px';

    const tf = env.ui.textField(inp, { value: ctx.model.q, label: 'city', onInput: (v) => ev({ input: v }) });
    inp.addEventListener('focus', () => { if (!ctx.model.focus) ev({ focus: true }); });
    inp.addEventListener('blur', () => { if (ctx.model.focus) ev({ focus: false }); });
    inp.addEventListener('keydown', (e) => {
      const m = ctx.model;
      if (fam.helpers.suggestState(spec, m) !== 'shown') return;
      const list = fam.helpers.suggestions(spec, m.q);
      if (!list.length) return;
      const at = m.active === null ? -1 : list.indexOf(m.active);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const k = e.key === 'ArrowDown' ? Math.min(list.length - 1, at + 1) : Math.max(0, at - 1);
        ev({ active: list[k] });
      } else if (e.key === 'Enter' && m.active !== null) {
        e.preventDefault();
        ev({ pick: m.active });
      }
    });
    let opts = new Map();
    let built = null;

    function sync(m) {
      if (inp.value !== m.q) tf.set(m.q);
      const state = fam.helpers.suggestState(spec, m);
      spin.svg.hidden = state !== 'loading';
      spin.svg.style.display = state === 'loading' ? '' : 'none';
      spin.arc.setAttribute('transform', `rotate(${Math.round((m.t / spec.beat) * 135) % 360} 11 11)`);
      const key = state === 'shown' ? `shown:${m.q}` : state;
      if (key !== built) {
        built = key;
        sug.replaceChildren();
        opts = new Map();
        if (state === 'loading') {
          const n = util.el('div', 'ut-snote', sug);
          n.append('Searching…');
        } else if (state === 'shown') {
          const list = fam.helpers.suggestions(spec, m.q);
          if (!list.length) util.el('div', 'ut-snote', sug, 'No matches');
          for (const i of list) {
            const c = spec.pool[i];
            const o = util.el('div', 'ut-sopt', sug);
            o.dataset.role = 'option';
            const l = util.el('span', '', o, c.city);
            util.el('small', '', l, `, ${c.country}`);
            if (c.iata) util.el('i', '', o, c.iata);
            o.addEventListener('mousedown', (e) => e.preventDefault());
            o.addEventListener('click', () => ev({ pick: i }));
            opts.set(i, o);
          }
        }
      }
      sug.hidden = state !== 'loading' && state !== 'shown';
      for (const [i, o] of opts) o.classList.toggle('act', m.active === i);
      const sel = m.value !== null ? spec.pool[m.value] : null;
      f.setStatus(sel ? `<b>${sel.city}</b>, ${sel.country}${sel.iata ? ` (${sel.iata})` : ''} selected` : state === 'loading' ? 'Searching…' : state === 'typing' ? 'Typing…' : 'Ready');
    }
    return {
      sync,
      locate(tg) {
        if (tg.field) return tf.locate();
        if (tg.suggestion !== undefined) return opts.get(tg.suggestion) ? util.center(opts.get(tg.suggestion)) : null;
        return null;
      },
    };
}
  env.template('act-in-time/_base-forms', () => ({ buildPopup, buildToast, buildCountdown, buildDebounce }));
})();
