# Booking platform set-up

Written for Prompt 5 (31 Oct 2026). Neither platform's current settings screens have been checked, so this is a checklist of **what** must be set, plus the exact questions to send their support. Ask for the answers in writing.

## Switching the website over (2 minutes, once you've chosen)

In `src/config/site.ts`:

1. `booking.provider`: change `'TODO'` to `'VELLUTO_MSGP'` or `'HALAXY'`.
2. `booking.url`: paste your public booking page link.
3. Only if the vendor confirms in writing that embedding is allowed: in `bookingProviders`, set that provider's `embed` to `true`. The page then shows a "Choose a time" button that opens their booking page inside yours, plus a fallback "Open booking in a new tab" link.

Commit and push; the preview updates in a few minutes.

## Settings to configure inside the platform

| # | Setting | What to set | Why |
| --- | --- | --- | --- |
| 1 | Payment at booking | $425 taken when appointment 1 is booked; $320 when appointment 2 is booked; $89 when each review is booked | Matches the split on /pricing; someone found unsuitable at appointment 1 never pays part 2 |
| 2 | Minimum notice for appointment 1 | At least 10 days after booking | Time for the intake, the observer form (Velluto reminders run on days 2, 5 and 7) and baseline checks |
| 3 | Appointment type: Assessment | Video, 60 minutes | Pathway step 5 |
| 4 | Appointment type: Diagnosis and plan | Video, 30-45 minutes | Pathway step 6 |
| 5 | Appointment type: Review | Video, 15 minutes, $89 | Every 2-4 weeks while treatment is adjusted |
| 6 | Appointment type: Ongoing review | Video, 15 minutes, $89 | Every 3-6 months once stable |
| 7 | Who can book appointment 1 online | New patients, Queensland only if the platform can ask | Backs up the eligibility check |
| 8 | Reminder messages | SMS and email, e.g. 48 hours and 2 hours before | Fewer missed appointments |
| 9 | Confirmation redirect | `https://<your domain>/booking-confirmed` (preview: `https://hyperfocus-health.pages.dev/booking-confirmed`) | Shows the "what happens next" timeline |
| 10 | Cancellation window | Match `policies.cancellation` in site.ts once decided | The website and platform must say the same thing |
| 11 | Intake hand-off | Intake link sent automatically after payment | Pathway step 3 |
| 12 | Payment account | Paid into the operating entity's account (not JIC Global) | Clean books, correct ABN on receipts |

## Questions for Velluto / MySpecialistGP support

1. Can patients book and pay from a link on my own website, and does that link open my profile only, or a page that also lists other GPs?
2. Can the booking calendar be embedded in my website (iframe), and is that allowed?
3. Can I set a minimum of 10 days between booking and the first appointment?
4. Can the intake be sent before the appointment is chosen (sell the package first, book once intake is done)?
5. After payment, can patients be redirected to a page on my website? If so, where do I set it?
6. Your booking page says patients have 24 hours to pay or the booking cancels. Can payment be required at the moment of booking instead?
7. Where are payment records, booking data and intake answers stored, and for how long?
8. Does voice answering work on every intake question, or only free-text ones?
9. Can I show my own cancellation and refund policy on the booking page?

## Questions for Halaxy support

1. Does Halaxy offer an online booking widget I can embed on my website (iframe or script)? Is it allowed on any domain?
2. Can I require payment at the time of online booking (a different amount per appointment type), for telehealth appointments with no Medicare claim?
3. Can I set a minimum booking notice of 10 days for one appointment type only (the first assessment)?
4. After a booking is paid, can the patient be redirected to a URL on my website?
5. Can a third-party intake link (Velluto) be sent automatically after a paid booking, or would this be manual?
6. Can online booking be limited to new patients, with returning patients booking reviews separately?
7. Where are booking and payment data stored (country), and for how long?
8. Does the booking flow work on mobile without patients creating an account?

## Not decided yet (placeholders on the site)

- `booking.provider`, `booking.url`
- `prices.assessmentTotal`, `prices.inPersonGap`, `prices.reviewLengthMinutes`
- `policies.cancellation`, `policies.noShow`, `policies.refundIfUnsuitable`, `policies.notDiagnosed`
- `contact.email`
