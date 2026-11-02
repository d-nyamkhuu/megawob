/*
 * act-in-time / popup: login-user-popup.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('act-in-time');
  const C = env.content;
  const I = env.instruct;
  const { ABSENT_CONTROLS, act, limit, nd, Q, round3, snap } = fam.lib;

  const NAMES = ['ann', 'bob', 'cara', 'dale', 'elena', 'felix', 'gina', 'hugo', 'iris', 'jake', 'kira', 'liam',
    'mona', 'nico', 'olga', 'pedro', 'quinn', 'rosa', 'sam', 'tina', 'uma', 'victor', 'wendy', 'yuri', 'zoe', 'abel',
    'bruno', 'clio', 'dario', 'edith', 'faye', 'greta', 'heath', 'ilya', 'joel', 'keith', 'leona', 'marco', 'nisha',
    'otto', 'priya', 'ralph', 'sasha', 'terry', 'ulric', 'vance', 'wilma', 'zelda', 'alina', 'benji', 'inez', 'mavis',
    'noor', 'petra', 'talia', 'uri', 'willa', 'zane', 'basil', 'amara', 'caleb', 'emil', 'freya', 'gavin', 'hana',
    'juno', 'kai', 'lars', 'mila', 'oscar', 'pavel', 'remy', 'sana', 'theo', 'vera', 'wade', 'zuri', 'adair', 'briar',
    'cyrus', 'daria', 'enzo', 'farah', 'hilda', 'indra', 'jessa', 'luca', 'mina', 'nadia', 'orrin', 'rhea', 'soren',
    'tomas', 'xenia', 'anika', 'arden', 'audra', 'aviva', 'belen', 'darby', 'delia', 'devin', 'elio', 'ellis', 'esme',
    'evan', 'fern', 'fiona', 'gilda', 'iman', 'jalen', 'jana', 'jorge', 'kasia', 'kenji', 'laila', 'malia', 'nolan',
    'orla', 'oswin', 'robin', 'rowan', 'simon', 'tobin', 'valen', 'zora'];
  const POPUP_MSGS = ['Your session is about to expire.', 'Your session is about to time out.',
    'Your session is expiring soon.', 'Your session is going to time out soon.', 'Your session is timing out soon.',
    'You have 10 new messages.', 'It looks like you are trying to log in.', 'Please do not panic.',
    'This is an annoying popup message.', 'Sorry for this annoying message.', 'A new version of this page is available.',
    'We noticed unusual activity on your network.',
    'This page has been idle for a while.',
    'Your notification summary is ready.',
    'An invitation is waiting for your review.',
    'A few page elements are still loading.',
    'We are checking the status of our services.',
    'The connection has been slower than usual.',
    'A background update is being prepared.',
    'Dates on this site use the local time zone.',
    'Some images are hidden to reduce data use.',
    'Our usage guidelines have been revised.',
    'Just a little interruption in your day.',
    'This notice arrived without an invitation.',
    'Thanks for bearing with the interruption.',
    'Shared devices may retain browsing history.',
    'File previews are temporarily unavailable.',
    'Live activity totals are estimates.',
    'Attachments have a size limit.',
    'A draft stays private until it is published.',
    'Guest access includes only public sections.',
    'Links to other sites open in a separate tab.',
    'The site glossary explains unfamiliar terms.',
    'A popup has entered the conversation.',
    'This little box has rather good timing.',
    'Saved bookmarks are grouped into folders.',
    'Audio clips include written transcripts.',
    'Printable pages omit the navigation menu.',
    'An item can belong to several collections.',
    'Public comments are visible to all visitors.',
    'Unread notices appear in bold.',
    'Downloads include the original file names.',
    'The site map lists every public section.',
    'Page numbers start over in each collection.',
    'A new puzzle is posted every Monday.',
    'The next community poll opens this evening.',
    'Profile pictures are optional.',
    'The internet has a curious sense of timing.',
    'Even a short message needs a place to sit.',
    'Thanks for spending part of your day here.'];
  // [question, button that keeps the session, button that leaves]
  const POPUP_QS = [['Exit to home page?', 'Cancel', 'OK'], ['Leave this page?', 'Stay', 'Leave'],
    ['Do you want to stay signed in?', 'Stay signed in', 'Sign out'], ['Continue your session?', 'Continue', 'Log out'],
    ['Return to the start page?', 'No', 'Yes'], ['Reload the page now?', 'Not now', 'Reload']];

  function samplePopup(rng, beat, o) {
    let user = rng.pick(NAMES);
    if (rng.bool(0.6)) user = C.username(rng, C.personName(rng, { csplit: o.csplit })).toLowerCase().replace(/[^a-z0-9._-]/g, '');
    const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
    const pass = [...Array(o.ood ? rng.int(7, 9) : rng.int(4, 6))].map(() => rng.pick([...chars])).join('');
    const kind = rng.bool(0.35) ? 'bar' : 'modal';
    const trigger = rng.pick(['time', 'time', 'focus-user', 'focus-pass']);
    const popup = { kind, trigger };
    if (kind === 'modal') {
      const [question, stay, leave] = rng.pick(POPUP_QS);
      Object.assign(popup, { msg: rng.pick(POPUP_MSGS), question, stay, leave, order: rng.pick(['stay-first', 'leave-first']) });
    } else {
      const list = C.BANNER_TEXTS.cookie.filter((b) => b.buttons && b.buttons.length >= 2);
      const b = C.pick(rng, list, { csplit: o.csplit });
      const rej = b.buttons.slice(1).find((x) => /reject|decline|no,|no |only essential|disagree|necessary/i.test(x));
      Object.assign(popup, { text: b.text, accept: b.buttons[0], reject: rej || null,
        want: rej && rng.bool(0.45) ? rng.pick(['accept', 'reject']) : null, order: rng.pick(['accept-first', 'reject-first']) });
    }
    if (trigger === 'time') popup.at = snap((rng.int(1, 2) - rng.float(0.3, 0.7)) * beat);
    return { user, pass, popup };
  }

  const T_POPUP = ['Log in with the username {u} and the password {p}.', 'Sign in as {u} using the password {p}.',
    'Use the username {u} and password {p} to log in.', 'Enter {u} as the username and {p} as the password, then log in.',
    'Log into the account {u} (password {p}).', 'Sign in: user {u}, password {p}.',
    'For login, use username {u} and password {p}.', 'Complete login: username {u}, password {p}.'];

  env.scenario('act-in-time', {
    name: 'popup',
    sample: samplePopup,
    level(spec, lv, r, keep) {
      spec.pass = spec.pass.slice(0, keep(4, 5));
      if (lv >= 1 && spec.popup.kind === 'bar') spec.popup.want = null;
    },
    start(spec) {
      const mode = spec.startMode;
      const m = { t: 0, user: '', pass: '', popup: 'pending', choice: null, exited: false, login: null, failed: false, strikes: 0 };
      if (mode === 'partial') m.user = spec.user;
      if (mode === 'wrong') {
        m.user = spec.user.length > 3 ? spec.user.slice(0, -2) + spec.user.slice(-1) + spec.user.slice(-2, -1) : spec.user + 'x';
        m.pass = spec.pass.slice(1) + 'q';
      }
      return m;
    },
    error(model, spec) {
      if (model.exited) return 1;
      const v = model.login || model;
      const f = (nd(v.user, spec.user) + nd(v.pass, spec.pass)) / 2;
      const base = 0.8 * f + (model.login ? 0 : 0.2);
      if (!spec.popup.want) return round3(base);
      return round3(0.85 * base + 0.15 * (model.choice === spec.popup.want ? 0 : 1));
    },
    endedBy(model, spec) {
      if (model.strikes >= limit(spec)) return model.exited ? 'exited' : 'bad-login';
      return null;
    },
    tickBy(model, spec, dt, t) {
      const open = model.popup === 'pending' && spec.popup.trigger === 'time' && t >= spec.popup.at;
      return open ? { ...model, t, popup: 'open' } : { ...model, t };
    },
    act(model, spec, ev, m) {
      if (ev.popup) {
        if (spec.popup.kind === 'modal') {
          if (ev.popup === 'leave') { m.exited = true; m.strikes += 1; }
          m.popup = 'done';
        } else { m.choice = ev.popup; m.popup = 'done'; }
      } else if (ev.open) m.popup = 'open';
      else if (ev.settings) m.popup = 'open';
      else if (ev.back) m.exited = false;
      else if (ev.login) {
        const ok = m.user === spec.user && m.pass === spec.pass;
        if (ok) { m.login = { user: m.user, pass: m.pass }; m.failed = false; } else { m.strikes += 1; m.failed = true; }
      } else if (ev.field) { m[ev.field] = ev.value; m.failed = false; }
    },
    simulate(m, spec, step, c) {
      if (c.popup) m = act(m, spec, { popup: c.popup });
      else if (c.settings) m = act(m, spec, { settings: true });
      else if (c.back) m = act(m, spec, { back: true });
      else if (c.login) { if (m.popup !== 'open' || spec.popup.kind === 'bar') m = act(m, spec, { login: true }); }
      else if (step.type) {
        const f = step.type[0].field;
        if (m.popup === 'pending' && spec.popup.trigger === `focus-${f}`) {
          m.popup = 'open';
          if (spec.popup.kind === 'bar') m = act(m, spec, { field: f, value: step.type[1] });
        } else if (m.popup !== 'open' || spec.popup.kind === 'bar') m = act(m, spec, { field: f, value: step.type[1] });
      }
      return m;
    },
    plan(model, spec) {
      const p = spec.popup;
      if (model.exited) return { click: { back: true } };
      if (model.popup === 'open') return { click: { popup: p.kind === 'modal' ? 'stay' : p.want || 'accept' } };
      const cookieWrong = p.kind === 'bar' && p.want && model.choice !== p.want;
      if (cookieWrong && model.popup === 'done') return { click: { settings: true } };
      if (model.login) return cookieWrong ? { click: { settings: true } } : null;
      if (model.user !== spec.user) return { type: [{ field: 'user' }, spec.user] };
      if (model.pass !== spec.pass) return { type: [{ field: 'pass' }, spec.pass] };
      // A cookie bar that has not shown yet may still cover the button: the login click is fine anyway.
      return { click: { login: true } };
    },
    solveBy(spec, model, m) {
      return { ...m, user: spec.user, pass: spec.pass, popup: 'done', exited: false, failed: false, strikes: 0,
      choice: spec.popup.kind === 'bar' ? spec.popup.want || 'accept' : null, login: { user: spec.user, pass: spec.pass } };
    },
    phrase(spec, rng, pick, say) {
      let core = I.fill(pick(T_POPUP), { u: Q(spec.user), p: Q(spec.pass) });
      const w = spec.popup.want;
      if (w) core += ' ' + (w === 'accept' ? rng.pick([
        'Accept the cookies if asked.', 'If a cookie notice shows up, accept it.',
        'Allow cookies when the banner appears.', 'Consent to cookies if a notice appears.',
        'Choose to allow cookies if asked.', 'On a cookie prompt, give consent.'
      ])
        : rng.pick([
          'Decline optional cookies if asked.', 'If a cookie notice shows up, reject the optional cookies.',
          'Say no to non-essential cookies.', 'When asked, keep only necessary cookies.',
          'Optional cookies should be declined if asked.', 'If asked, opt out of optional cookies.'
        ]));
      return say(core, { steps: [`type ${Q(spec.user)} as the username`, `type ${Q(spec.pass)} as the password`, 'log in'] });
    },
    judgeAsk(jr, spec, mk, cant) {
      const what = jr.pick(ABSENT_CONTROLS.popup);
      return mk(what, [
        'Sign in as {u} by pressing {what}.', 'Use {what} to log in as {u}.', 'Click {what} and sign in as {u}.',
        'Your login as {u} must use {what}.', '{u} is to be signed in via {what}.'
      ], { u: Q(spec.user), what },
        cant(`there is no such control, only a username and a password field`));
    },
    factRows(model, spec, f) {
      return !model.login ? [] : [f('Status', 'Signed in', ['State']), f('Signed in as', model.login.user, ['User', 'Account'])];
    },
    silentEdit(next, prev, spec, rng, m, out) {
      if (next.exited) return null;
      const opts = [];
      if (next.login && !prev.login) opts.push('login');
      if (!next.login) for (const k of ['user', 'pass']) if (next[k] === spec[k] && prev[k] !== spec[k] && spec[k].length > 1) opts.push(k);
      if (!opts.length) return null;
      const w = rng.pick(opts);
      if (w === 'login') Object.assign(m, { login: null, failed: false });
      else m[w] = next[w].slice(0, Math.max(1, next[w].length - rng.int(1, 2))); // the field's max length cut the text
      return out(m);
    },
    retargetEdit(spec, model, rng, base, good) {
      if (model.login || model.exited) return null;
      const user = rng.pick(NAMES.filter((n) => n !== spec.user));
      const chars = [...'abcdefghijkmnpqrstuvwxyz23456789'];
      let pass = spec.pass;
      for (let k = 0; k < 20 && pass === spec.pass; k++) pass = [...Array(spec.pass.length)].map(() => rng.pick(chars)).join('');
      return good({ ...base, user, pass });
    },
  });
})();
