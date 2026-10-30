# Setting up the receptionist in ElevenLabs

Written 31 Oct 2026 from ElevenLabs' public docs. I have not seen your ElevenLabs screens, so button names may differ. Where a step says **[Requires verification]**, check it on screen or with ElevenLabs support before relying on it.

## Read this first: where the data goes

- ElevenLabs stores customer data in the **United States** by default. Data residency (EU, India or Singapore only, no Australia) is Enterprise-only. **[Certain, ElevenLabs docs, 31 Oct 2026]**
- Callers' messages are health-adjacent personal information. Sending them overseas is allowed, but the privacy policy (Prompt 10) must say so (Australian Privacy Principle 8), and the agent must keep collecting as little as possible: first name, phone number, one-line reason.
- If you'd rather keep everything in Australia, ask Voral (see `README.md`) before building here.

## 1. Create the agent (about 20 min)

1. Log in to ElevenLabs and open **ElevenAgents** (or **Agents**).
2. Click **New agent** and choose a blank agent.
3. Name it `Hyperfocus Health receptionist`.
4. **First message**: paste the opening line from `system-prompt.md` ("Hi, you've reached Hyperfocus Health...").
5. **System prompt**: paste everything below the line in `system-prompt.md`.
6. **Language**: English. **Voice**: pick a calm Australian English voice. Listen to 3 before choosing.
7. **Model (LLM)**: pick the most reliable option offered, not the fastest. Set temperature (creativity) as low as it goes. **[Requires verification: options change often]**

## 2. Add the knowledge base (5 min)

1. In the agent, open **Knowledge base**.
2. Upload `docs/receptionist/knowledge-base.md`. This is the agent's only source of facts.
3. Every time the website copy changes: run `npm run kb` (or ask Claude to), then delete the old file in ElevenLabs and upload the new one.

## 3. Tools: turn almost everything off (5 min)

1. Turn **on**: *End call* (needed for the silent and abusive caller rules).
2. Turn **off**: transfers, booking, calendar, anything that acts on the caller's behalf.
3. **Data collection / analysis**: add 4 fields: `first_name`, `phone`, `reason`, `urgent` (yes/no). **[Requires verification: section name]**

## 4. Get the messages to you (30-60 min)

ElevenLabs can send a summary of each call to a web address after the call ends (a "post-call webhook"). **[Likely]**

1. Easiest route: an n8n or Make workflow that receives the webhook and emails the 4 fields to the clinical inbox.
2. Subject line `URGENT: Hyperfocus call` when `urgent` is yes, otherwise `Hyperfocus call message`.
3. Put the clinical inbox address in that workflow, not in this repo.
4. Test with call 15 and call 1 from `test-calls.md`.

Texting the booking link to callers needs an SMS step in the same workflow. **[Requires verification]** Until that exists, the agent reads out the website address instead.

## 5. Keep as little as possible (2 min)

1. In the agent, open **Advanced**, then **Data retention**.
2. Transcripts: **30 days** (long enough to review calls in the first 8 weeks, then reply to messages).
3. Audio recordings: the shortest option offered, or off if allowed.
4. Choose to apply it to existing conversations too, then **Save**.
The default is 2 years. **[Certain, ElevenLabs docs]**

## 6. Connect an Australian phone number (about 1 hour, plus Twilio approval time)

ElevenLabs connects to phone numbers you buy from **Twilio**.

1. Create a Twilio account at twilio.com.
2. Buy an Australian number with voice. Twilio usually needs an Australian business address and ID for this ("regulatory bundle"), which can take a few days. **[Requires verification]**
3. In Twilio, create an **API key** (its ID starts with `SK`). Copy your **Account SID**, the key ID and the secret.
4. In ElevenAgents, open **Phone numbers** and click to import a Twilio number.
5. Enter a label, the number, the Account SID and the API key secret.
6. Under the number, choose `Hyperfocus Health receptionist` as the agent.
7. Ring it from your mobile and check **Call history**.

ElevenLabs' docs don't say whether Australian Twilio numbers have any limits. Ask support before buying. **[Requires verification]**

## 7. The off switch: plain voicemail (15 min, set up before launch)

If any safety test fails, or something goes wrong, you need to switch the line to voicemail in under a minute.

1. In Twilio, create a **TwiML Bin** called `Voicemail` that plays a short message ("You've reached Hyperfocus Health. If this is an emergency, hang up and call triple zero. Please leave your first name and number.") and records the caller.
2. To switch over: Twilio, then **Phone numbers**, your number, **A call comes in**, choose the `Voicemail` bin, **Save**.
3. To switch back: re-import or re-assign the number in ElevenAgents (step 6).
**[Requires verification: Twilio screen names]**

## 8. Optional: "Talk to the assistant in your browser"

Only if you want it on /contact.

1. In the agent, find the **Widget** or embed settings. Add your website domain to the allowed list. **[Likely]**
2. Copy the agent ID.
3. In `src/config/site.ts`, under `receptionist.webWidget`, set:
   - `scriptUrl`: `'https://unpkg.com/@elevenlabs/convai-widget-embed'` **[Likely: copy the exact one from the embed code]**
   - `tag`: `'elevenlabs-convai'`
   - `agentId`: the ID you copied
4. Set `receptionist.vendor` to `'ELEVENLABS'`.
The button then appears on /contact. The script only loads after a visitor taps it.

## 9. Before go-live

1. Run all 25 calls in `test-calls.md`. All safety calls (1-4) must pass.
2. Put the phone number in `contact.phone` in `src/config/site.ts`, then run `npm run kb` and upload the new knowledge base.
3. Read every transcript for the first 8 weeks.
