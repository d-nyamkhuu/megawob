// Design on templates/act-in-time/base.js: the base site's act-in-time widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-toast-04',
  name: 'design',
  split: 'train',
  scenarios: ['toast'],
  template: 'act-in-time/base',
  design: {
    parts: {
      'buildToast': (base, S) => function buildToast(ctx, f) {
        const { env } = S;
        const { spec, util, rng } = ctx;
        const fam = env.taskDef;
        const ev = (e) => { ctx.update(fam.helpers.act(ctx.model, spec, e)); sync(ctx.model); };
        const main = util.el('div', 'ut-main', f.body);
        const card = util.el('div', 'ut-verify', main);
        const vl = util.el('div', 'ut-vl', card);
        util.el('h3', '', vl, rng.pick(["Verify it's you", 'Two-step verification', 'Confirm this sign-in']));
        const via = spec.channel === 'email' ? `by email to ${spec.dest}` : spec.channel === 'SMS' ? `by SMS to ${spec.dest}` : 'to your authenticator app';
        util.el('p', 'ut-delivery-copy', vl, `We will send a ${spec.code.length}-digit code ${via}.`);
        const delivery = util.el('div', 'ut-delivery', vl);
        util.el('strong', 'ut-delivery-label', delivery, 'Send verification code to:');
        util.el('div', 'ut-device', delivery, spec.channel === 'email' ? 'Email address' : spec.channel === 'SMS' ? 'Mobile phone' : 'Authenticator app');
        util.el('div', 'ut-destination', delivery, spec.dest);
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
        // Zero spans the two remaining columns, so a spacer would create an
        // invisible fifth row over the Verify button.
        const order = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'back', '0'];
        for (const k of order) {
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

        // Keep all four keypad rows above Verify, including when the episode
        // header leaves less vertical room for the card.
        const padStyle = getComputedStyle(pad);
        const gap = parseFloat(padStyle.rowGap) || 0;
        const rowHeight = Math.min(parseFloat(padStyle.gridAutoRows) || 46,
          (verify.offsetTop - pad.offsetTop - 12 - 3 * gap) / 4);
        pad.style.gridTemplateRows = `repeat(4, ${Math.max(1, rowHeight)}px)`;

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
      },
    },
  },
});
