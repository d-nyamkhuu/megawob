/* type-text/hooks.js: Scoring, reporting, silent changes and retargeting hooks. */
(function () {
  'use strict';

  const {
    scored, fieldError, countOf, normValue, fmtDate, fieldOk, checkValue, KINDS, person, addressOf, freeText,
    transformSource, transform, password, email, username, C,
  } = env.taskOf('type-text').lib;

  function errorOf(model, spec) {
    const vals = model.fields || {};
    const fs = scored(spec);
    let sum = 0;
    for (const f of fs) sum += fieldError(vals[f.id], f);
    if (spec.save) return (sum + (model.saved ? 0 : 1)) / (fs.length + 1);
    return sum / fs.length;
  }

  function tolOf(spec) {
    // confirm: the filled but unsaved form counts as there (saving is the step to ask about).
    if (spec && spec.judge && spec.judge.mode === 'confirm') return { tau: spec.save ? 1 / (scored(spec).length + 1) : 0, sigma: 0.15 };
    return { tau: 0, sigma: 0.15 };
  }

  // ---------------------------------------------------------------- optional hooks (facts, silent, retarget)

  const liveFields = (spec) => spec.fields.filter((f) => !f.disabled && !f.blank);
  const oneLine = (v) => String(v ?? '').replace(/\r/g, '').split('\n').map((x) => x.trim()).filter(Boolean).join(', ');
  const plainLabel = (f) => f.label.replace(/\s*\(.*\)$/, '');

  function facts(model, spec) {
    const vals = model.fields || {};
    const out = [];
    // aliases: other spellings of the value; labels: other names of the fact. The value has no ', ' (free-text replies split
    // clauses there; words() makes the spellings equal), the original spelling is an alias.
    const push = (label, value, aliases, labels) => {
      const shown = String(value);
      const v = shown.replace(/[,;.]\s+/g, ' ');
      out.push({ label, value: v, aliases: [...new Set([shown, ...(aliases || []).map(String)].filter((a) => a && a !== v))],
        labels: [...new Set((labels || []).map(String).filter((a) => a && a !== label))] });
    };
    const fld = (id) => spec.fields.find((f) => f.id === id);
    const live = liveFields(spec);
    for (const f of live) {
      if (f.maxLength && f.counter) {
        const n = countOf(f, vals[f.id]);
        push(`${plainLabel(f)} characters`, `${n}/${f.maxLength}`, [`${n} of ${f.maxLength}`, String(n)]);
      }
    }
    if (spec.scenario === 'copy' && fld('to')) {
      const t = fld('to');
      push(t.label, oneLine(vals.to), [String(vals.to)], t.aliases);
    }
    if (spec.scenario === 'complete') {
      for (const id of (spec.missing || []).slice(0, 2)) {
        const f = fld(id);
        const row = (spec.profile && spec.profile.rows || []).find((x) => x.id === id);
        push(f.label, oneLine(vals[id]), row ? [row.value] : [], [...(row ? [row.label] : []), ...(f.aliases || [])]);
      }
    }
    for (const f of live.filter((x) => x.type === 'password').slice(0, 1)) {
      const n = countOf(f, vals[f.id]);
      push(`${plainLabel(f)} length`, `${n} characters`, [String(n), `${n} chars`]);
    }
    if (out.length < 2) {
      for (const id of spec.ask.slice().reverse()) {
        const f = fld(id);
        if (!f || f.disabled || f.type === 'password' || out.some((o) => o.label === f.label)) continue;
        push(plainLabel(f), oneLine(vals[f.id]), [String(vals[f.id]), f.say], f.aliases);
        if (out.length >= 2) break;
      }
    }
    if (out.length < 2) {
      const n = live.reduce((a, f) => a + countOf(f, vals[f.id]), 0);
      if (live.length === 1) push('Characters typed', String(n), [`${n} characters`, `${n} chars`]);
      else {
        const k = live.filter((f) => normValue(vals[f.id], f)).length;
        push('Fields filled', `${k} of ${live.length}`, [String(k)]);
      }
    }
    return out.slice(0, 4);
  }

  // preempt=cancel: every field of the form by its label (a disabled look-alike never changes), with the value typed.
  function parts(model, spec) {
    const vals = model.fields || {};
    const seen = new Set();
    const out = [];
    for (const f of spec.fields) {
      const name = plainLabel(f);
      if (seen.has(name)) continue;
      seen.add(name);
      out.push({ name, value: vals[f.id] === undefined ? '' : vals[f.id], ...(f.aliases && f.aliases.length ? { aliases: f.aliases } : {}) });
    }
    // The form's heading and save button are on the page too and never change.
    for (const t of [spec.title, spec.save && spec.saveLabel]) if (t && !seen.has(t)) { seen.add(t); out.push({ name: t, value: 'fixed' }); }
    return out;
  }

  // Wrong values a just-right field can silently come back with; each still passes the field's validation.
  function silentCands(f, v, spec) {
    const out = [];
    const s = String(v);
    if (f.type === 'textarea') {
      const lines = s.split('\n');
      if (lines.length >= 2) out.push(lines.slice(0, -1).join('\n'));
      const last = lines[lines.length - 1];
      if (last.length >= 4) out.push([...lines.slice(0, -1), last.slice(0, last.length - Math.min(8, Math.floor(last.length / 2)))].join('\n'));
      return out;
    }
    if (spec.scenario === 'transform' && spec.given && spec.given !== s) out.push(spec.given);
    if (f.check && f.check.startsWith('date:')) {
      const fmt = f.check.slice(5);
      const y = Number(s.slice(fmt.indexOf('YYYY'), fmt.indexOf('YYYY') + 4));
      const m = Number(s.slice(fmt.indexOf('MM'), fmt.indexOf('MM') + 2));
      const d = Number(s.slice(fmt.indexOf('DD'), fmt.indexOf('DD') + 2));
      if (d > 1) out.push(fmtDate({ y, m, d: d - 1 }, fmt));
      return out;
    }
    if (f.kind === 'amount' && /[.,]\d{1,2}$/.test(s)) out.push(s.replace(/[.,]\d{1,2}$/, ''));
    for (const k of [1, 2, 3, 4]) if (s.length - k >= 2) out.push(s.slice(0, s.length - k));
    return out;
  }

  function silent(next, prev, spec, rng) {
    const live = liveFields(spec);
    const right = live.filter((f) => fieldOk(f, next.fields[f.id]));
    const fresh = right.filter((f) => !fieldOk(f, (prev.fields || {})[f.id]));
    const pool = rng.shuffle(fresh.length ? fresh : right);
    const tau = tolOf(spec).tau;
    for (const f of pool) {
      const cands = rng.shuffle(silentCands(f, next.fields[f.id], spec))
        .filter((c) => normValue(c, f) && !fieldOk(f, c) && checkValue(f.check, normValue(c, f)) && (!f.maxLength || [...c].length <= f.maxLength));
      if (!cands.length) continue;
      const m = env.util.clone(next);
      m.fields[f.id] = cands[0];
      if (errorOf(m, spec) > tau) return m;
    }
    return null;
  }

  // retarget: a different goal in the same form (content and layout stay; only goal fields change).
  const NOTES = ['Leave the parcel at the back door.', 'Ring the bell twice.', 'Call me when you arrive.',
    'The gate code is 4512.', 'Please do not bend.', 'Deliver after 5 pm.', 'Use the side entrance.',
    'Dog in the yard, he is friendly.', 'Hand it to the reception desk.', 'Second floor, first door on the left.',
    'Fragile: glass inside.', 'No signature needed.', 'Please leave it with the doorman.',
    'Place the box beside the planter.', 'The blue door is around the back.', 'Leave it under the porch bench.',
    'Please keep it out of the rain.', 'Deliver to the garden apartment.', 'The flat is above the corner shop.',
    'Please leave it by the mailbox.', 'Use the entrance on Cedar Lane.', 'The lobby door sticks a little.',
    'Please knock, the baby is asleep.', 'Leave it beside the blue bin.', 'Take the path past the garage.',
    'The porch light is always on.', 'Please leave it in the parcel box.', 'The lower entrance faces the alley.',
    'Leave it by the stairwell door.', 'The front desk closes at six.', 'The side gate is unlocked.',
    'Please tuck it behind the planter.', 'The house has a red front door.', 'Leave it on the covered porch.',
    'Enter through the courtyard gate.', 'Please place it near the doormat.', 'The office is in the rear building.',
    'Leave it with the night attendant.', 'Please avoid blocking the walkway.', 'Deliver to the cottage at the end.',
    'The number is posted by the gate.', 'Leave the envelope in the slot.', 'Please set it on the wooden bench.',
    'Leave it at the lower landing.', 'A ramp leads to the rear entrance.', 'The porch door opens inward.',
    'Leave it beside the parcel shelf.', 'Please keep the package upright.', 'Deliver to the unit facing the park.',
    'Leave it inside the vestibule.', 'The parcel room is past the lifts.', 'Use the gate beside the tall hedge.',
    'Text when the package is outside.', 'The buzzer is marked 2B.', 'The loading bay is on Birch Street.',
    'Leave it with the shop next door.', 'Please use the paved garden path.', 'A step marks the front entrance.',
    'Deliver to the rear unit, number 4.', 'Please call from the courtyard.', 'It fits through the mail slot.',
    'Leave it near the umbrella stand.', 'A yellow marker shows the driveway.', 'Our door faces the narrow lane.',
    'Use the Maple Row entrance.', 'The studio is behind the bakery.', 'Take the stairs to the mezzanine.',
    'Use the door beside the bike rack.', 'The parcel locker is by the lifts.', 'Leave it on the tiled step.',
    'The reception is in building C.', 'The annex is past the fountain.', 'Wait by the red postbox, please.',
    'The entrance faces the laundrette.', 'The porch has a small side table.', 'The rear door is next to the bins.',
    'The courtyard has two green doors.', 'Leave it behind the screen door.', 'Stairway entrance is on Elm Court.',
    'Please avoid the gravel path.', 'The bell is by the brass knocker.', 'The entrance has a low stone arch.',
    'The parcel is for the upstairs flat.', 'Please leave it near the side steps.', 'The back lane leads to our door.',
    'Our entrance is by the clock tower.', 'Leave the bag with the caretaker.', 'The doorbell is marked Garden Flat.',
    'Please use the gravel drive.', 'The house is past the bridge.', 'Leave it beside the water butt.',
    'The small gate leads to the yard.', 'Our flat is above the bookshop.', 'Leave the parcel in the alcove.',
    'Our door faces the bus shelter.', 'Use the passage beside the bakery.', 'A lantern marks the garden path.',
    'The rear porch has a green light.', 'Please hand it to the concierge.', 'The cottage has a slate roof.',
    'Leave it inside the garden gate.', 'Our door is beside the post boxes.', 'The workshop is around the corner.',
    'Please place it beneath the window.', 'The house is behind the stone wall.', 'The side door faces the orchard.',
    'Leave it with the evening caretaker.', 'The path starts by the water pump.', 'Please put it in the wooden chest.',
    'Our entrance is on Willow Walk.', 'The porch steps are painted white.', 'The balcony overlooks the courtyard.',
    'Please use the covered passageway.', 'The flat overlooks the small square.', 'The gate faces the old mill.',
    'The steps end at a yellow door.', 'The studio is through the arch.', 'Please place it near the coat rack.'];

  // Another value of the same kind for a one-line field, or undefined when its masks / limits leave no safe one.
  function otherValue(g, f, spec) {
    const k = KINDS[f.kind];
    if (!k || f.mask) return undefined;
    for (let t = 0; t < 14; t++) {
      const v = k.gen(g);
      if (v.mask || v.target === f.target || !v.target) continue;
      if ((v.check !== undefined ? v.check : k.check || null) !== f.check) continue;
      if (f.maxLength && [...v.target].length > f.maxLength) continue;
      if (!checkValue(f.check, v.target)) continue;
      return { target: v.target, say: v.say !== undefined ? v.say : v.target };
    }
    return undefined;
  }

  function retarget(spec, model, rng) {
    if (spec.judge) return null;
    const sp = env.util.clone(spec);
    const g = { rng, csplit: spec.csplit, ood: spec.ood, locale: spec.locale, level: null };
    g.person = person(g);
    g.addr = addressOf(g);
    const fld = (id) => sp.fields.find((f) => f.id === id);
    const v = spec.scenario;
    const tau = tolOf(spec).tau;
    const done = () => (errorOf(model, sp) > tau ? sp : null);
    if (v === 'single') {
      let t = null;
      for (let k = 0; k < 12 && (!t || t === spec.given); k++) t = freeText(g);
      sp.given = t;
      fld('text').target = fld('text').say = t;
      return done();
    }
    if (v === 'transform') {
      let src;
      let tgt;
      for (let k = 0; k < 20; k++) {
        src = transformSource(g, spec.rule, spec.sub);
        tgt = transform(src, spec.rule, spec.sub);
        if (tgt !== src && src !== spec.given) break;
      }
      sp.given = src;
      fld('text').target = fld('text').say = tgt;
      return done();
    }
    if (v === 'password') {
      const pw = password(rng, spec.ood, null);
      sp.given = pw;
      for (const f of sp.fields) f.target = f.say = pw;
      return done();
    }
    if (v === 'login') {
      sp.given = spec.given.includes('@') ? email(g, g.person) : username(g, g.person);
      sp.password = password(rng, spec.ood, null);
      sp.fields[0].target = sp.fields[0].say = sp.given;
      sp.fields[1].target = sp.fields[1].say = sp.password;
      return done();
    }
    if (v === 'multi' || v === 'sections') {
      const cand = v === 'multi' ? spec.ask.map((id) => spec.fields.find((f) => f.id === id)) : spec.fields;
      for (const f0 of rng.shuffle(cand.filter((f) => f && !f.disabled && !f.blank))) {
        const nv = otherValue(g, f0, spec);
        if (!nv || nv.target === f0.from) continue;
        const sp2 = env.util.clone(spec);
        const f = sp2.fields.find((x) => x.id === f0.id);
        if (v === 'sections' && !spec.ask.includes(f.id)) {
          // a field that was fine as it is joins the change request (its page value is the old one)
          f.from = f.target;
          sp2.ask = [...sp2.ask, f.id];
        }
        f.target = nv.target;
        f.say = nv.say;
        if (errorOf(model, sp2) > tau) return sp2;
      }
      return null;
    }
    if (v === 'textarea') {
      const ta = fld('notes');
      const lines = sp.lines.slice();
      const i = rng.int(0, lines.length - 1);
      let nl = null;
      for (let k = 0; k < 12 && (!nl || lines.includes(nl)); k++) {
        if (ta.kindOf === 'list') nl = C.pick(g.rng, C.PRODUCTS, g).name;
        else if (ta.kindOf === 'notes') nl = rng.pick(NOTES);
        else nl = (g.addr.text || `${g.addr.line1}\n${g.addr.city}`).split('\n').map((x) => x.trim()).filter(Boolean)[Math.min(i, 3)];
        if (nl && ta.kindOf === 'list' && (nl.length > 32 || /"/.test(nl))) nl = null;
      }
      if (!nl || lines.includes(nl)) return null;
      lines[i] = nl;
      sp.lines = lines;
      ta.target = ta.say = lines.join('\n');
      if (ta.maxLength && [...ta.target].length > ta.maxLength) return null;
      return done();
    }
    if (v === 'copy' && spec.extraAsk && fld('other')) {
      const nv = otherValue(g, fld('other'), spec);
      if (!nv) return null;
      fld('other').target = nv.target;
      fld('other').say = nv.say;
      return done();
    }
    return null;
  }


  Object.assign(env.taskOf('type-text').lib, { plainLabel, errorOf, tolOf, facts, parts, silent, retarget });
})();
