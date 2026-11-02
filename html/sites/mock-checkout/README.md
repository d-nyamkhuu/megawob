# mock-checkout (frozen, eval-only)

A replica of the stripped-down shell a generic web shop shows around its checkout: announcement strip, a header
with a lock mark and "Secure checkout", inert links, a fake search box, an optional help sidebar and a footer
with policy links and trust notes. Widgets: `use-shop/storefront` (the `checkout` scenario: shop, product, cart,
checkout, order, cancel and track pages) and `wizard/steps` (the `checkout` flow as a multi-step form with an
inert order summary). No real brands, logos or trademarks.

**Frozen and eval-only.** The site and manifest are `heldout`: the widgets register only under
`<task>.heldout` and `<task>.mock-checkout`, never in the training split. Do not tune the training
tasks to this site's look, and do not edit it after results have been collected against it; add a new
`mock-*` site instead. Check with `python -m megawob.check --site mock-checkout --jobs 1`.
