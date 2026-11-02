/*
 * find-fact / phone-book: a contact book (name, phone, email, address).
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('find-fact');
  const C = env.content;
  const I = env.instruct;
  const { keepIdx } = env.util;
  const { pageCount, people, PH_PEOPLE, pickErr, PROPS, say, shown, usPhone, wrongPick } = fam.lib;

  const PROP_ALIASES = { phone: [
    'phone', 'number', 'telephone number', 'phone number', 'tel no'
  ], email: ['email address', 'e-mail'], address: ['street address', 'home address'] };

  function streetAddress(rng, spec) {
    let s = `${rng.int(1, 9800)} ${C.pick(rng, C.STREET_NAMES, C.csplitOf(spec))}`;
    if (rng.bool(0.25)) s += `, ${rng.pick(['Apt', 'Unit', 'Suite', 'Room', 'Flat'])} ${rng.int(1, 60)}`;
    return s;
  }
  function contacts(rng, n, spec) {
    return people(rng, n, spec).map((p) => ({
      first: p.first,
      last: p.last,
      name: p.full,
      phone: usPhone(rng),
      email: C.emailAddress(rng, p).toLowerCase(),
      address: streetAddress(rng, spec),
    }));
  }

  function samplePhoneBook(rng, spec, opts) {
    const prop = rng.pick(Object.keys(PROPS));
    const recoverable = opts.recover ?? rng.bool(0.5);
    // opts.route: 'pointer' forces mode 'pages' (pointer only), 'keyboard' mode 'search' (typed query).
    let pagesMode = rng.bool(0.6);
    if (opts.route === 'pointer' || opts.route === 'keyboard') pagesMode = opts.route === 'pointer';
    if (pagesMode) {
      const perPage = rng.pick([1, 1, 2, 3, 4, 5]);
      const pages = spec.ood ? rng.int(8, perPage >= 4 ? 9 : 12) : rng.int(3, perPage >= 4 ? 5 : 7);
      const list = contacts(rng, pages * perPage, spec);
      const page = rng.bool(0.85) ? rng.int(1, pages - 1) : 0;
      const target = page * perPage + rng.int(0, perPage - 1);
      return { mode: 'pages', pager: rng.pick(['numbers', 'arrows']), perPage, contacts: list, target, prop, recoverable };
    }
    const maxResults = rng.pick([3, 4, 5]);
    const list = contacts(rng, spec.ood ? rng.int(24, 36) : rng.int(10, 20), spec)
      .sort((a, b) => (a.last + ' ' + a.first).localeCompare(b.last + ' ' + b.first));
    const target = rng.int(maxResults, list.length - 1);
    return { mode: 'search', maxResults, contacts: list, target, prop, recoverable };
  }

  env.scenario('find-fact', {
    name: 'phone-book',
    sample: samplePhoneBook,
    route(spec, r) {
      if (r === 'pointer' || r === 'keyboard') spec.forcedRoute = r;
    },
    baseModel() {
      return { page: 0, query: '', picks: [], wrongs: 0 };
    },
    start(m, spec, mode) {
      const t = spec.target;
      if (mode === 'partial') {
        if (spec.mode === 'pages') m.page = Math.floor(t / spec.perPage);
        else m.query = spec.contacts[t].name;
        return;
      }
      if (spec.recoverable) {
        // A wrong pick is pending: the result is shown with an Undo.
        const other = (t + 1) % spec.contacts.length;
        if (spec.mode === 'pages') m.page = Math.floor(other / spec.perPage);
        else m.query = spec.contacts[other].name;
        m.picks = [{ contact: other, prop: spec.prop }];
        m.wrongs = 1;
        return;
      }
      if (spec.mode === 'pages') m.page = (Math.floor(t / spec.perPage) + 1) % pageCount(spec);
      else m.query = spec.contacts[(t + 1) % spec.contacts.length].name;
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      const n = spec.contacts.length;
      if (spec.mode === 'pages') {
        const pages = Math.ceil(n / spec.perPage);
        const tp = Math.floor(spec.target / spec.perPage);
        const keepP = keepIdx(r, pages, [tp], k(1, 2));
        if (keepP.length < pages) {
          const kept = [];
          keepP.forEach((p) => { for (let j = 0; j < spec.perPage && p * spec.perPage + j < n; j++) kept.push(p * spec.perPage + j); });
          const t0 = kept.indexOf(spec.target);
          spec.contacts = kept.map((i) => spec.contacts[i]);
          spec.target = t0;
        }
      } else {
        const keep = keepIdx(r, n, [spec.target], spec.maxResults + k(2, 5));
        const t0 = keep.indexOf(spec.target);
        if (t0 >= spec.maxResults) {
          spec.contacts = keep.map((i) => spec.contacts[i]);
          spec.target = t0;
        }
      }
    },
    error(model, spec) {
      if (model.picks.length) return Math.max(...model.picks.map((p) => pickErr(p, spec)));
      return shown(model, spec).includes(spec.target) ? 0.8 : 1;
    },
    plan(model, spec) {
      if (wrongPick(model, spec)) return spec.recoverable ? { click: { undo: true } } : null;
      if (shown(model, spec).includes(spec.target)) return { click: { contact: spec.target, prop: spec.prop } };
      if (spec.mode === 'search') return { type: [{ search: true }, spec.contacts[spec.target].name] };
      const want = Math.floor(spec.target / spec.perPage);
      if (spec.pager === 'numbers') return { click: { page: want } };
      return { click: { pager: want > model.page ? 'next' : 'prev' } };
    },
    solve(spec, model) {
      const page = spec.mode === 'pages' ? Math.floor(spec.target / spec.perPage) : 0;
      const query = spec.mode === 'search' ? spec.contacts[spec.target].name : model.query;
      return { page, query, picks: [{ contact: spec.target, prop: spec.prop }], wrongs: model.wrongs || 0 };
    },
    ended: (model, spec) => (model.wrongs || 0) >= (spec.recoverable ? 2 : 1) ? 'wrong-choice' : null,
    instruction(spec, rng) {
      const c = spec.contacts[spec.target];
      const what = I.alias(rng, PROPS[spec.prop], PROP_ALIASES[spec.prop]);
      return say(rng, spec, [
        'Find {name} in the contact book and click on their {what}.',
        'Click the {what} of {name} in the contact book.',
        'Open {name}’s {what} from the contacts.',
        'In the address book, click {name}’s {what}.',
        'Look up {name} and click the {what} listed for them.',
        'Go to {name} in the directory and click their {what}.',
        'Use the contacts to find and click {name}’s {what}.',
        'The {what} shown for {name} is the link to click.',
      ], { name: c.name, what }, { terse: `${c.name}: ${what}`, steps: [`find ${c.name} in the contact book`, `click their ${what}`] });
    },
    judgeAsk(jr, spec, page, pick) {
      let x = null, templates, vars = {}, message;
      x = pick(PH_PEOPLE);
      if (!x) return null;
      templates = ['Find {x} in the contact book and click their {what}.', 'Click the {what} of {x} in the contact book.', 'Look up {x} and click the {what} listed for them.'];
      vars = { x, what: PROPS[spec.prop] };
      message = `I can't do that: there is no contact named ${x} in the contact book.`;
      return { x, templates, vars, message };
    },
    judgeError: (model) => model.picks.length ? 1 : 0,
    silentEdit(next, prev, spec, rng, m) {
      if (next.picks.length <= prev.picks.length) return null;
      m.picks = env.util.clone(prev.picks);
      m.wrongs = prev.wrongs || 0;
    },
    retargetTries(spec, model, rng, tries) {
      if (model.picks && model.picks.length) return null; // a pick is a final choice: no new goal after it
      spec.contacts.forEach((c, i) => {
        if (i !== spec.target && (spec.mode === 'pages' || i >= spec.maxResults)) tries.push({ ...spec, target: i });
      });
    },
  });
})();
