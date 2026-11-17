# Small Vendor Support Platform — Product and Implementation Plan

## 1. Scope and delivery status

This plan revises the supplied “MASTER AGENT PROMPT — BUILD THE SMALL VENDOR SUPPORT PLATFORM” with two distinct user experiences: an open public marketplace and an authenticated vendor workspace. It preserves all five established product pillars.

**Status:** planning complete; application implementation, authentication, database setup, integrations, tests, and deployment remain pending. The two-user option is specified here, not represented as an already working sign-in system.

Build for street vendors, fruit and vegetable sellers, food stalls, roadside merchants, independent market sellers, mobile vendors, and neighbourhood businesses in India. Prioritize low-cost operation, mobile devices, simple language, Malayalam and English, and unreliable connections.

## 2. Product analysis

The strongest idea is connecting customer discovery with practical vendor tools: a shop listing can attract a buyer, surplus reservations can reduce losses, and confirmed transactions can support bookkeeping. Keeping these activities together reduces duplicate entry.

The main risk is excessive scope. Bookkeeping, marketplace discovery, food surplus recovery, cooperative buying, and support information each have different operational needs. A useful MVP must provide a small, honest workflow in every pillar instead of implying that payments, logistics, or legal advice are automated.

Assumptions to validate with a small local pilot:

- Vendors will maintain availability and prices if updating them takes little effort.
- Customers will use a nearby marketplace when listings are accurate and collection is simple.
- Vendors will trust private digital bookkeeping and understand cash versus profit.
- Enough nearby vendors buy comparable goods to make collective purchasing practical.
- Malayalam labels and guided onboarding improve completion on low-end phones.

Interview vendors and customers; observe opening, trading, purchasing, and closing routines. Compare the proposed workflows with notebooks, calculators, calls, and existing messaging habits. Measure task completion, update frequency, reservation collection, and repeat use before expanding.

## 3. Two-user model and access boundary

“Two users” means two product experiences, not a maximum of two accounts.

| Capability | Public visitor | Signed-in vendor |
| --- | --- | --- |
| Browse published shops, products, prices, and surplus | Yes, without login | Yes |
| Search by area, category, price, and availability | Yes | Yes |
| View hours, collection details, directions, and public contact options | Yes | Yes |
| Share shop/product links and shop QR codes | Yes | Yes |
| Send enquiries or request reservations | Yes, with minimum contact verification where needed | Yes |
| Create, edit, publish, or pause a shop | No | Own shop only |
| Manage products, prices, quantities, and surplus | No | Own shop only |
| View sales, expenses, profit estimates, credit, or exports | No | Own records only |
| Join BuyTogether and manage contributions | No | Authorized group participants |
| View vendor support tools and private application checklists | No | Yes |
| Manage vendor settings and notifications | No | Own account only |

The public home page must open directly into customer discovery. Do not show business ledgers, purchasing tools, vendor statistics, or shop-edit buttons in public navigation. Provide one clear “Vendor sign in / Register your shop” entry point.

Use separate public and vendor layouts. A vendor can return to “View public shop” without losing their authenticated session. Hiding buttons is not security: enforce authorization in backend handlers, database policies, and storage policies.

Operational administrators are restricted staff accounts, not a third public onboarding choice. Suppliers participate in the MVP through offers recorded by authorized vendors; a separate supplier portal is a later extension.

## 4. Public visitor journey

1. Open the marketplace without an account.
2. Choose an area manually or optionally allow location access.
3. Search shops and products; filter by shop type, availability, price, or surplus collection window.
4. Open a shop to see its description, products, prices with units, opening hours, last availability update, and public location.
5. View a product, contact the shop, or request a reservation.
6. Receive a private reservation reference and view its status through a secure token or verified contact flow.
7. Collect the item and let the vendor confirm completion.

Reasons: anonymous discovery reduces friction; manual area selection avoids making location permission a barrier; price units prevent misleading comparisons; freshness indicators reduce wasted journeys. Contact verification and request throttling reduce reservation abuse without requiring every visitor to create an account.

MVP reservations are collection requests, not guaranteed orders until confirmed. Do not imply online payment, delivery, or stock certainty where those services do not exist. Public visitors cannot enumerate other customers’ reservation details.

## 5. Vendor authentication and onboarding

Separate account creation from returning-user sign-in. Returning vendors enter credentials only; they must not repeat shop setup on every login.

Proposed MVP authentication: verified email and password with recovery and logout, using a managed authentication service. Validate email usability with vendors before finalizing; phone OTP is a possible alternative but requires a functioning SMS provider, delivery testing, and a cost budget. Never simulate OTP verification in production.

After first registration, guide the vendor through a resumable onboarding flow:

| Step | Information | Reason |
| --- | --- | --- |
| Account | Owner/display name, verified login contact, credentials | Establish ownership and account recovery |
| Shop identity | Shop name, type/category, description, preferred language | Support relevant discovery and readable defaults |
| Shop operation | Fixed/mobile stall, service area, public location, hours, public contact preference | Help customers find the shop without exposing unnecessary personal information |
| First products | Name, category, photo, description, selling price, currency, unit, quantity or availability | Make the storefront useful immediately |
| Optional business details | Private cost price, opening stock, payment methods, collection instructions | Support bookkeeping without making initial setup burdensome |
| Preview and publish | Review exactly what becomes public; publish explicitly | Prevent accidental disclosure or incomplete storefront publication |

Shop types include produce, food stall, grocery, clothing, household goods, and other. Use category-specific suggestions without forcing irrelevant fields. Prices must have explicit units such as per kg, piece, or portion. Cost prices, earnings, debts, personal withdrawals, and private account contacts must never appear on public product pages.

Drafts remain private. Vendors may skip optional fields, save progress, change their shop type later, and pause the shop. An incomplete vendor account opens onboarding rather than an empty dashboard.

## 6. Five pillars: features, purpose, and boundaries

### 6.1 Daily Business Book — vendor only

MVP: sales, purchases/expenses, cash and UPI separation, withdrawals, customer credit and repayments, daily/weekly/monthly summaries, and CSV export. Voice entry is a later enhancement with confirmation before saving.

Reason: replace repetitive notebook arithmetic while retaining a familiar daily-record workflow. Separate cash movement from operating results. A withdrawal is not a business expense; a credit repayment is not a second sale. Purchasing inventory is not automatically identical to cost of goods sold. Label simple cash summaries accurately and only show profit estimates with explicit cost assumptions.

Risks: duplicate entries, missing costs, accidental edits, and private debt disclosure. Use immutable correction history, validated monetary values, idempotent submission, and owner-only access. Do not automatically record a sale when a reservation is created; require confirmed completion and prevent duplicate posting.

### 6.2 Unsold Stock Recovery — public discovery, vendor management

MVP: photographs, remaining quantity, normal and discounted prices, collection deadline, pickup instructions, publication, reservations, cancellation, expiry, and collection confirmation. Track collected surplus separately from uncollected listings.

Reason: discounts and time-bound collection give customers a concrete reason to act and help recover value. Reservations must atomically reduce available quantity to prevent overselling; expired or cancelled holds restore quantity only while the listing remains eligible for sale.

Vendors must confirm suitability for sale. Automatically hide expired listings. Never promote unsafe or spoiled goods for sale or donation. Donation coordination is a later workflow with eligibility and recipient checks. Waste-reduction numbers represent measured collection quantities, not invented environmental impact.

### 6.3 Digital Shop — public storefront, private editor

MVP: profiles, product photos and unit prices, categories, availability, hours, optional mobile-vendor location, QR/link sharing, customer enquiries, and collection reservations.

Reason: give each vendor a useful shareable destination without requiring a standalone website. Public product information supports comparison; private editing protects ownership. Live location is opt-in, can be paused, and shows update time; do not publish a movement history.

Risks: stale prices, large image uploads, unwanted contact, and misleading availability. Compress images, show last updates, validate uploads, and let vendors choose public contact methods. Online checkout, delivery, reviews, and advanced order management remain later features.

### 6.4 BuyTogether — vendor only

MVP: purchase requests with grade/unit/quantity, area-based groups, member quantities, supplier offers, minimum order quantities, transport costs, offer comparison, confirmations, and separately recorded member contributions and purchases.

Reason: comparable demand may improve bargaining power. Compare landed unit cost, including transport and applicable fees, against individual purchasing; never promise savings. The platform coordinates purchases and does not operate warehouses.

Workflow: draft request → open group → collect offers → compare total costs → members confirm → record purchase/collection → close or cancel. Record supplier reliability, quality expectations, cancellation terms, disputes, and payment status. MVP payment tracking is manual reporting, not payment processing or proof of settlement. Never expose one member’s unrelated ledger to another.

### 6.5 Vendor Rights and Support — vendor workspace

MVP: searchable support directory, registration/licensing guidance, document checklists, application steps, local contacts, Malayalam/English content, official source links, and verification dates.

Reason: actionable checklists help vendors navigate fragmented information. Research PM SVANidhi, the Street Vendors Act, 2014, and relevant FSSAI requirements from official sources before publication. This plan does not assert current eligibility, benefits, or licensing rules. Assign content review ownership and flag stale or unverified entries.

Do not describe suggested eligibility as an official determination or require document uploads for ordinary directory browsing. Automated eligibility verification and application submission are future work.

## 7. Navigation and screens

Public mobile navigation: **Explore · Shops · Surplus**. Enquiries and reservation status are reached from the relevant product or private confirmation link. Header: search, language, area, and vendor sign-in.

Vendor mobile navigation: **Home · Book · Products · More**. More contains Surplus, BuyTogether, Support, Notifications, and Settings. Desktop may expose the same destinations in a sidebar. Keep all five pillars reachable without crowding a small screen.

Required screens: public landing/discovery, shop list, shop details, product details, surplus discovery, reservation/enquiry flow, authentication/recovery, onboarding, vendor dashboard, business book, surplus manager, storefront editor, BuyTogether, support directory, notifications, settings, and restricted administrator tools.

The dashboard emphasizes today’s records, stock needing attention, pending reservations, and relevant actions. Avoid decorative metrics and dense charts before sufficient data exists.

## 8. Design system and section-by-section rationale

Use a premium, restrained visual style grounded in everyday commerce. Colors are design choices, not claims that particular colors universally produce trust. Maintain one consistent system across public and vendor experiences.

Base tokens: warm off-white `#FAF8F2`, white `#FFFFFF`, forest green `#14532D`, charcoal `#1F2937`, muted green `#E8F1E8`, amber surface `#FEF3C7`, amber text `#92400E`, blue surface `#EFF6FF`, blue text `#1E40AF`, error red `#B91C1C`.

| Section | Palette and application | Feature/design reason |
| --- | --- | --- |
| Public landing / discovery | Off-white background, charcoal text, forest-green search/action controls | Warm surroundings suit local shops; strong search hierarchy puts customer discovery first |
| Shop and product pages | White cards on off-white; green availability labels | Neutral surfaces let real product photos and unit prices dominate |
| Authentication | White form, forest-green primary button, charcoal labels | A focused form limits distractions during account access |
| Vendor onboarding | Off-white canvas, white fields, muted-green completed steps | Clear progress and resumable steps reduce setup burden |
| Vendor dashboard | Off-white background, white summaries, green primary action | A consistent workspace highlights useful daily actions over visual noise |
| Daily Business Book | White tables, charcoal amounts, green positive status, amber attention | High readability supports careful financial entry; signs and labels carry meaning alongside color |
| Surplus discovery and management | Pale amber highlights, dark amber deadline text, green reserve/publish actions | Amber distinguishes time-sensitive collection from routine stock without making every listing an emergency |
| Digital Shop editor | White previews, muted-green publication state, forest-green save/publish | Aligns the editor with the public storefront while clearly separating draft and published state |
| BuyTogether | Muted-green group panels, white comparison rows, charcoal costs | Shared grouping is visible, while comparable costs stay easy to scan |
| Rights and Support | Pale-blue information cards, dark-blue links, charcoal content | Distinguishes reference information from commerce; official sourcing remains textual, not implied by color |
| Notifications | White list, blue informational labels, amber pending labels, green completed labels | Supports quick triage with explicit status words and icons |
| Settings | White forms on off-white, green save controls, red destructive controls | Familiar controls reduce mistakes; destructive actions are visually distinct and confirmed |
| Administrator tools | Charcoal navigation, white content, amber review labels | A visually distinct shell helps staff recognize privileged operational work |
| Errors and empty states | White/off-white surface, red error text or neutral guidance | Specific recovery instructions help people continue instead of leaving them with a blank screen |

Do not use amber as small text on white or color as the only signal. Verify actual foreground/background pairs against WCAG AA contrast targets during implementation. Use visible focus states, semantic headings, persistent field labels, readable type, generous touch targets, reduced-motion support, and keyboard access.

Use a consistent spacing scale and modest corner rounding. Avoid unnecessary gradients, glass effects, autoplay, and decorative animation. Support Malayalam text wrapping and font coverage; never encode essential text inside an image. Optimize layouts and images for low-end Android devices and slow networks.

## 9. Proposed technical architecture

Proposed stack, subject to a short implementation feasibility check: Next.js with TypeScript for public and authenticated layouts; Tailwind for shared tokens/components; PostgreSQL with Supabase Auth and Storage for relational data and managed authentication. Choose hosting after checking current pricing, service limits, and deployment compatibility. No paid provider or deployment is assumed active.

Reasons: relational transactions support stock reservations and financial consistency; a shared codebase reduces duplicate UI work; managed authentication reduces custom password-handling responsibilities. Evaluate running costs and service dependency before commitment.

Suggested routes:

- Public: `/`, `/shops`, `/shops/[slug]`, `/products/[id]`, `/surplus`, `/reservation/[token]`.
- Account: `/vendor/sign-in`, `/vendor/register`, `/vendor/recover`, `/vendor/onboarding`.
- Protected: `/vendor`, `/vendor/book`, `/vendor/products`, `/vendor/surplus`, `/vendor/shop`, `/vendor/buy-together`, `/vendor/support`, `/vendor/notifications`, `/vendor/settings`.
- Restricted staff: `/admin`.

Use public response projections that omit private fields. Every write derives account identity from the authenticated session; never trust a client-supplied owner identifier. Use database row policies as defense in depth, including direct API access. Administrative secrets remain server-side.

## 10. Data model and integrity

| Entity | Key contents and rules |
| --- | --- |
| Vendor profile | Auth identity, language, private account preferences |
| Shop | Owner, category, public slug, hours, location visibility, draft/published/paused state |
| Product | Shop owner relation, name, unit, public price, availability, approved image reference |
| Private inventory/cost | Private cost and stock details; not part of public product projection |
| Ledger entry | Owner, amount in integer minor units, type, payment method, date, correction linkage |
| Credit/repayment | Owner, private customer reference, outstanding amount, linked entries |
| Surplus listing | Product, eligible quantity, discount, deadline, active/expired/closed state |
| Reservation | Listing, quantity, private customer contact, status, expiry, secure access reference |
| Purchase group/member | Specifications, organizer, member quantities and permissions |
| Supplier offer | Group, supplier reference, unit cost, transport, minimum quantity, validity |
| Contribution/purchase | Member-specific obligations, recorded status, purchase reference |
| Support resource | Official URL, jurisdiction, language, reviewer, verification date |
| Notification/audit event | Recipient, event type, read status; restricted operational history |

Use database constraints for nonnegative quantities, valid states, required ownership, and unique posting references. Reserve stock within a transaction; concurrent requests must not oversell. Financial updates and linked sale posting require idempotency. Validate amounts, units, deadlines, and image files on the server.

Public images may be served publicly after publication. Draft uploads and financial exports remain private; access requires authorization or short-lived signed links. Define retention and deletion behavior for guest contacts and account data before launch.

Offline MVP: friendly connection errors and recoverable form drafts. Never report a reservation, payment, or ledger write as saved without server confirmation. Full offline ledger synchronization requires a later conflict-resolution design.

## 11. Implementation sequence

1. Validate the smallest vendor/customer journeys, scope, and design direction.
2. Set up modular project structure, shared styles, database migrations, and environment configuration.
3. Implement real vendor registration, verification, recovery, session handling, ownership rules, and resumable onboarding.
4. Implement vendor product management and the public marketplace against the same persisted data.
5. Implement business book with correct financial semantics and export.
6. Implement surplus publishing and transactional reservation lifecycle.
7. Implement basic BuyTogether groups, offer comparison, and manual contribution records.
8. Add verified support content, notifications, settings, and minimal restricted moderation tools.
9. Test complete journeys and authorization boundaries; fix failures and document limitations.
10. Prepare production configuration, backup/recovery, deployment instructions, and rollout checks.

Preserve the source specification’s review gates for architecture/design before application implementation and explicit approval before production deployment or payment activation. Creating this requested PLAN.md is authorized; it does not itself deploy or activate anything.

## 12. Acceptance criteria and verification plan

- A logged-out visitor can discover published shops and products without registration and sees no vendor workspace controls.
- Draft/paused shops and private financial fields are absent from public responses, not merely hidden visually.
- A new vendor can register, verify access, complete shop setup, add a priced product, preview, and publish; returning sign-in skips completed onboarding.
- Vendor A cannot read or modify vendor B’s private records through URLs, APIs, database endpoints, exports, or storage paths.
- Published product changes persist and appear publicly; public availability and private cost remain separated.
- Ledger fixtures distinguish cash, UPI, credit, repayment, expenses, inventory cost, and withdrawals without double-counting.
- Concurrent reservations cannot exceed available stock; cancellation, expiry, and collection behave consistently.
- BuyTogether compares comparable units and includes transport; member financial records stay private.
- Support entries have real official links and verification dates; unverified claims are not published as facts.
- Keyboard use, mobile layouts, Malayalam text, contrast, loading, empty states, expired sessions, poor connectivity, and failed writes are checked.
- Real integration tests use at least two vendors and a visitor. Record actual results; no test is marked passed before execution.

## 13. MVP boundaries and future development

The MVP includes vendor registration and onboarding, public discovery, shop/product management, daily records and summaries, surplus reservations, basic collective buying and offer comparison, and a verified support directory.

Later: voice entry, advanced analytics, customer accounts and saved favourites, supplier portal, payment collection, refunds, delivery, comprehensive offline synchronization, automated eligibility assistance, and structured donation partnerships. Do not disguise placeholders as working integrations.

Operational risks include stale stock, uncollected reservations, unsafe surplus, supplier disputes, inaccurate records, and outdated support content. Assign ownership for moderation, complaints, content reviews, and account recovery before a public launch.

## 14. Decision log and final deliverables

| Decision | Reason | Status |
| --- | --- | --- |
| Open visitor experience; separate authenticated vendor workspace | Make browsing easy and business tools private | Specified |
| Shop setup after registration rather than at each login | Collect necessary details without repeated friction | Specified |
| Preserve all five pillars | Retain the original vendor-support mission | Specified |
| One shared palette with functional section accents | Maintain consistency while distinguishing tasks | Specified |
| Managed auth and relational transactional data | Support account security and consistent records | Proposed |
| Guest reservations with private verification/access | Support customers without mandatory accounts | Proposed |
| No platform-managed payments or warehousing in MVP | Limit operational scope while validating demand | Specified |

Completed: source review and revised planning document. Pending: user validation, architecture/design review, application code, migrations, integrations, testing, and deployment. External dependencies: authentication delivery, hosting configuration, verified support sources, and operational ownership.

Final application delivery must include source code, database schema/migrations, setup and environment guide, deployment instructions, executed test report, known limitations, future recommendations, and verified working links when available.
