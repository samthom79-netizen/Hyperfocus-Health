# AI receptionist

The phone line is answered by an AI agent that does three things only: answers questions from a locked knowledge base, points callers to the booking link and the 60-second check, and takes messages. It never books, triages or gives medical advice.

| File | What it is |
| --- | --- |
| `knowledge-base.md` | The agent's only facts. Built from the website by `npm run kb`. Never edit by hand. |
| `system-prompt.md` | The agent's instructions. Paste into the vendor's settings. |
| `test-calls.md` | 25 test calls with pass/fail rules. Run before launch, after any change, then monthly. |

## Sam's requirement (31 Oct 2026)

Data must be stored in Australia. ElevenLabs is ruled out (US storage by default; no Australian region).

## Shortlist (checked 31 Oct 2026; all claims are the vendors' own, not verified)

| Vendor | Built for | Data location (vendor's words) | Practice software | Price (AUD) | Catch |
| --- | --- | --- | --- | --- | --- |
| **MayaAI** (Nutire Pty Ltd, ABN 55 671 343 856) | GP, specialist, dental, allied health | "Platform data, call recordings and transcripts are stored in Australia." Says overseas access by third-party providers may occur. ISO 27001. | Halaxy and Cliniko live | $149 + GST a month for 250 min, then $0.35/min. 1-month free trial, no card, no set-up or cancellation fee | AI processing may happen overseas: get the subprocessor list |
| **AiDial** (ABN 64 630 163 469) | Many sectors, healthcare included | "Hosts and processes calls in Australia on every plan." Optional Compliance Pack: "no overseas AI model calls." | Halaxy page listed; details not shown | $149 a month for 60 calls + 60 SMS, then $2.49 a call; $249 for 150 calls. GST and set-up fee unclear | Not health-specific; AI models not named; Compliance Pack price not published |
| **Rauraa** | Medical clinics | "All data stored on Australian servers." | "All major practice software" (none named) | $299 a month for 500 min; 14-day trial | No named people, integrations or emergency handling on the site |
| **Voral.ai** ("Liza") | Medical practices | Australia | Best Practice, Cliniko (no Halaxy) | Not published | Early-stage; pricing unknown |

Ruled out: ElevenLabs (US data), HealthEngine Helen (data in "Australia or the United States"; HealthEngine's 2020 Federal Court penalty).

## Questions for whichever vendor you trial (ask for written answers)

1. List every subprocessor (telephony, speech-to-text, AI model, voice) and the country each one processes data in.
2. Can every part of a call, including the AI model, run in Australia? Is that a contract term or a setting?
3. Can I set transcript retention to 30 days and turn audio recording off?
4. Can the agent answer only from a document I upload, with no general knowledge and no booking?
5. Can it email each message (first name, phone, reason, URGENT yes/no) to one inbox?
6. Can it text the caller a booking link?
7. Do you integrate with Halaxy? (Only needed later; the agent won't book.)
8. Can I switch the line to plain voicemail myself, instantly?
9. Australian phone number: yours, or do I bring my own?
10. Monthly cost at about 100 calls a month; set-up fee; minimum term.
11. Is there a browser widget, and does it load only when the visitor clicks?
12. Will you sign a data processing agreement that says patient data isn't used to train models?

## Rules that never change

- The opening line says it's an AI, the call may be recorded, and to call 000 in an emergency.
- Any mention of suicide, self-harm, harm to others or an emergency: 000, Lifeline 13 11 14 and 1300 MH CALL 1300 642 255 first.
- No medicines, doses, results, diagnoses or eligibility decisions. No competitor comparisons.
- Collects first name, phone number and a one-line reason only.
- One-click switch to plain voicemail, set up before launch.
