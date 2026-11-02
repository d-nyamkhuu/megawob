/* act-in-time/_arena-popup: shared template implementation; parts remain on the calling template. */
(function () {
  'use strict';
  function buildPopup(S, ctx, f) {
    const { spec, util, rng } = ctx;
    const fam = env.taskDef;
    const ev = (e) => ctx.update(fam.helpers.act(ctx.model, spec, e));
    const popup = spec.popup;
    const main = util.el('div', 'ut-main', f.body);
    const mr = main.getBoundingClientRect();
    const card = util.el('div', 'ut-login', main);
    card.style.left = Math.round(rng.float(0.1, 0.9) * Math.max(0, mr.width - 340)) + 'px';
    card.style.top = Math.round(rng.float(0.05, 0.75) * Math.max(0, mr.height - 320)) + 'px';
    S.P.loginHeading(ctx, card);
    const loginExtra = S.P.loginIntro(ctx, main, card);
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
    const fieldExtra = S.P.fields(ctx, card, userEl, passEl);
    const err = util.el('div', 'ut-err', card, 'Incorrect username or password.');
    err.hidden = true;
    const login = util.el('button', 'ut-btn primary', card, rng.pick(['Log in', 'Sign in']));
    login.type = 'button';
    S.P.loginButton(ctx, login, fieldExtra);
    const signed = util.el('div', 'ut-signed', card);
    signed.hidden = true;
    let settings = null;
    if (popup.kind === 'bar') {
      const foot = util.el('div', 'ut-foot', card);
      settings = util.el('button', 'ut-link', foot, 'Cookie settings');
      settings.type = 'button';
      settings.addEventListener('click', () => {
        ev({ settings: true });
        sync(ctx.model);
      });
    }

    // "You left" page (recoverable exit through the dialog).
    const left = util.el('div', 'ut-left', f.body);
    util.el('h3', '', left, 'You left the sign-in page');
    util.el('p', '', left, 'Your session was closed.');
    const back = util.el('button', 'ut-btn', left, 'Return to sign in');
    back.type = 'button';
    back.addEventListener('click', () => {
      ev({ back: true });
      sync(ctx.model);
    });
    left.hidden = true;

    const choice = {};
    const { dlg, bar } = buildInterruption(popup, util, f, S, ctx, choice, rng, env, ev, sync);

    const blocked = () =>
      (popup.kind === 'modal' && ctx.model.popup === 'open') || ctx.model.exited || !!ctx.model.login;
    const lock = () => {
      const b = blocked();
      if (b && (document.activeElement === userEl || document.activeElement === passEl) && popup.kind === 'modal')
        document.activeElement.blur();
      userEl.disabled = b;
      passEl.disabled = b;
      login.setAttribute('aria-disabled', b ? 'true' : 'false');
    };
    const tfUser = env.ui.textField(userEl, {
      value: ctx.model.user,
      label: 'username',
      onInput: (v) => ev({ field: 'user', value: v }),
    });
    const tfPass = env.ui.textField(passEl, {
      value: ctx.model.pass,
      label: 'password',
      onInput: (v) => ev({ field: 'pass', value: v }),
    });
    for (const [key, el] of [
      ['user', userEl],
      ['pass', passEl],
    ]) {
      el.addEventListener('focus', () => {
        if (ctx.model.popup === 'pending' && popup.trigger === `focus-${key}`) {
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
      const open = S.P.popupOpen(m);
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
      S.P.loginSync(ctx, { main, card, userEl, passEl, login, loginExtra, fieldExtra }, m);
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

  function buildInterruption(popup, util, f, S, ctx, choice, rng, env, ev, sync) {
    let dlg = null;
    let bar = null;
    if (popup.kind === 'modal') {
      const backdrop = util.el('div', 'ut-backdrop', f.body);
      const box = util.el('div', 'ut-dialog', f.body);
      box.dataset.role = 'dialog';
      S.P.dialogContent(ctx, box);
      const row = util.el('div', 'ut-row', box);
      const mk = (label) => {
        const b = util.el('button', 'ut-btn', null, label);
        b.type = 'button';
        return b;
      };
      choice.stay = mk(S.D.stayLabel || popup.stay);
      choice.leave = mk(popup.leave);
      if (S.D.hideLeave) choice.leave.style.display = 'none';
      S.P.dialogButtons(ctx, box, row, choice, mk);
      if (popup.order === 'stay-first') row.append(choice.stay, choice.leave);
      else row.append(choice.leave, choice.stay);
      const br = f.body.getBoundingClientRect();
      box.style.left = Math.round(rng.float(0.15, 0.85) * Math.max(0, br.width - 330)) + 'px';
      box.style.top = Math.round(rng.float(0.15, 0.6) * Math.max(0, br.height - 170)) + 'px';
      dlg = env.ui.dialog(box, {
        open: S.P.popupOpen(ctx.model),
        buttons: [
          ['stay', choice.stay],
          ['leave', choice.leave],
        ],
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
      util.el('p', '', bar, popup.text);
      const mk = (key, label, cls) => {
        const b = util.el('button', 'ut-btn ' + cls, null, label);
        b.type = 'button';
        b.addEventListener('click', () => {
          ev({ popup: key });
          sync(ctx.model);
        });
        return b;
      };
      choice.accept = mk('accept', popup.accept, 'primary');
      if (popup.reject) choice.reject = mk('reject', popup.reject, 'ghost');
      const order =
        popup.order === 'reject-first' && choice.reject
          ? [choice.reject, choice.accept]
          : [choice.accept, choice.reject];
      for (const b of order) if (b) bar.append(b);
      bar.hidden = true;
    }
    return { dlg, bar };
  }

  function installPopup(BASE, S, V, constants) {
    if (V === 'popup') {
      BASE.beforeBuild = (ctx, f) => {
        if (S.D.geometric) ctx.util.el('div', 'ds-geometric', f.body);
        if (S.D.openPending && !ctx.model.login && ctx.model.popup === 'pending')
          ctx.update({ ...ctx.model, popup: 'open' });
      };

      BASE.build = (ctx, f) => buildPopup(S, ctx, f);

      BASE.loginHeading = (ctx, card) => {
        const { util, rng } = ctx;
        util.el('h3', '', card, S.D.loginTitle === null ? rng.pick(['Sign in', 'Log in', 'Welcome back']) : S.D.loginTitle);
      };

      BASE.loginIntro = (ctx, main, card) => {
        if (S.D.loginSubtitle !== null) return ctx.util.el('p', 'ds-login-subtitle', card, S.D.loginSubtitle);
        return null;
      };

      BASE.fields = (ctx, card, userEl, passEl) => ({});

      BASE.loginButton = (ctx, login, extra) => {};

      BASE.dialogContent = (ctx, box) => {
        const { util, spec } = ctx;
        if (S.D.dialogTitle !== null) {
          util.el('h3', '', box, S.D.dialogTitle);
          util.el('p', '', box, S.D.dialogText);
        } else {
          util.el('p', '', box, spec.popup.msg);
          util.el('p', '', box, spec.popup.question);
        }
      };

      BASE.dialogButtons = (ctx, box, row, choice, mk) => {};

      BASE.loginSync = (ctx, layout, m) => {};

      BASE.popupOpen = (m) => m.popup === 'open' || (S.D.pendingVisible && m.popup === 'pending');
    }
  }
  env.template('act-in-time/_arena-popup', () => ({ installPopup }));
})();
