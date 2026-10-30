# AI receptionist

The phone line is answered by an AI agent that does three things only: answers questions from a locked knowledge base, points callers to the booking link and the 60-second check, and takes messages. It never books, triages or gives medical advice.

| File | What it is |
| --- | --- |
| `knowledge-base.md` | The agent's only facts. Built from the website by `npm run kb`. Never edit by hand. |
| `system-prompt.md` | The agent's instructions. Paste into the vendor's settings. |
| `test-calls.md` | 25 test calls with pass/fail rules. Run before launch, after any change, then monthly. |
| `elevenlabs-setup.md` | Step-by-step set-up if the vendor is ElevenLabs. |

## Vendor: not chosen yet

Set `receptionist.vendor` in `src/config/site.ts` once decided.

| Option | Fit | Main catch |
| --- | --- | --- |
| ElevenLabs Agents | Cheapest, most control, you already have an account | Data stored in the US; you build and own every guardrail |
| Voral.ai | Australian medical voice AI; vendor says data is in Sydney | Halaxy link not listed [Requires verification] |

## Questions to send Voral (ask for written answers)

1. Where are call audio, transcripts and messages stored (country), and for how long? Can I set retention to 30 days?
2. Can the agent answer only from a document I upload, with no general knowledge?
3. Can it take messages only (no booking, no triage) and email each summary to one inbox, with an URGENT flag?
4. Can it text a booking link to the caller?
5. Do you integrate with Halaxy?
6. Can I switch the line to plain voicemail myself, instantly?
7. Can I get an Australian number through you, or do I bring my own?
8. Monthly cost at about 100 calls a month, and any set-up fee?
9. Do you offer a browser widget, and does it load only when the visitor clicks?

## Rules that never change

- The opening line says it's an AI, the call may be recorded, and to call 000 in an emergency.
- Any mention of suicide, self-harm, harm to others or an emergency: 000, Lifeline 13 11 14 and 1300 MH CALL 1300 642 255 first.
- No medicines, doses, results, diagnoses or eligibility decisions. No competitor comparisons.
- Collects first name, phone number and a one-line reason only.
- One-click switch to plain voicemail, set up before launch.
