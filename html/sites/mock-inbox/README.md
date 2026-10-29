# mock-inbox (frozen, eval-only)

A replica of an organisation-hosted webmail: a portal bar (organisation mark, portal nav, search, avatar),
an app strip, breadcrumb, footer, and a mail client inside. Widget: `use-email/webmail` (all `use-email`
scenarios). The client reuses the reference `mail` widget's state machine and DOM (copied, without the `ads` and
`classic` clients) under a different look layer (`rm-` classes): square or soft corners, accent bar on unread
rows, tinted read/unread rows, flat toolbar. No real brands, logos or trademarks.

**Frozen and eval-only.** The site and manifest are `heldout`: the widget registers only under
`<task>.heldout` and `<task>.mock-inbox`, never in the training split. Do not tune the training
tasks to this site's look, and do not edit it after results have been collected against it; add a new
`mock-*` site instead. Check with `python -m megawob.check --site mock-inbox --jobs 1`.
