# Legal pages: questions for vendors and your MDO

Written for Prompt 10 (31 Oct 2026). The privacy policy, collection notice, terms, complaints and accessibility pages are drafts. They can't be finished until each vendor below answers in writing and your MDO or a lawyer has read them. Every answer goes into `vendors` or `legal` in `src/config/site.ts`.

Ask every vendor for written answers, not a sales call.

## Questions for every vendor that touches patient information

1. Where is our data stored? Name the country and city or data centre region.
2. Where is it processed? List every subprocessor (hosting, email, telephony, speech-to-text, AI model, error monitoring) and the country each one is in.
3. Is any patient information used to train AI models? Will you put "no" in the contract?
4. How long do you keep our data, and can we set a shorter period? What happens to it if we leave?
5. Will you sign a data processing agreement that covers the Australian Privacy Principles?
6. Do you hold ISO 27001 or SOC 2? Can you send a summary report or certificate?
7. Is data encrypted at rest and in transit? Who on your side can access it?
8. How fast will you tell us about a data breach, and how?
9. Do you have an accessibility statement for the pages patients use?

## Extra questions, vendor by vendor

### Booking and payment (Halaxy, HotDoc or HealthEngine)

- Do we ever see full card numbers, or does your payment provider hold them?
- Does the patient booking page show star ratings or reviews? Can they be switched off? (Our advertising rules ban reviews of clinical care.)
- Is any patient data shared with third parties for marketing?

### Intake (likely Velluto)

From Velluto's privacy policy (version 2.0, 4 April 2026), its own claims:

- Database and documents: AWS ap-southeast-2 (Sydney). AI summaries: AWS Bedrock in Sydney, and Google Vertex AI in australia-southeast1 (Sydney).
- Overseas recipients: Resend (USA) for email, Vercel (USA) for hosting, Cloudflare (USA) for network security, Sentry (Germany) for error monitoring. Velluto says no health information goes to these.
- Retention: adult assessment data kept 7 years from completion. Server logs 90 days.

Still to ask Velluto:

- Please confirm the policy above still applies, and that the first names in Resend emails are the only personal details that go overseas.
- Who holds the record legally: us or Velluto? Can we export everything when we want to?

### AI phone assistant (MayaAI, AiDial or other)

- Use the 12 questions in `docs/receptionist/README.md`.
- Can audio recording be turned off while keeping transcripts? Can transcripts be kept for 30 days only?

### Practice software and video appointments (likely Halaxy)

- Where are clinical records and video call data stored and processed?
- Are video calls recorded? (They shouldn't be.)
- Does your messaging or email to patients go through overseas services?

### AI note-taking tool, if you use one (Lyrebird, Heidi or none)

- Where is audio processed? Is it deleted after the note is written, and when?
- Can you supply wording for getting the patient's consent at the start of an appointment?

### Email for clinical messages

- If clinical email goes through Proton Mail, its servers are in Switzerland and Germany [Likely: confirm with Proton]. That's an overseas disclosure the privacy policy must name. Consider an Australian-hosted option, or keep clinical messages inside the practice software.

### Cloudflare (website hosting)

- Where are website request logs (IP addresses) processed and kept? The website itself collects no health information.

## Questions for your MDO or a lawyer

### Records and privacy

1. How long must I keep adult health records as a private specialist GP in Queensland? (The site says nothing until you answer.)
2. How quickly must I respond to a request to see or correct records, and can I charge a fee?
3. Is the privacy policy's list of overseas recipients enough for APP 8, or do I need each patient's consent?
4. The observer form collects information about the patient from someone else. Does that person need their own collection notice?
5. Is "I'll ask your permission at the start of the appointment" enough consent for an AI note-taking tool?
6. Is the phone assistant's spoken notice ("I'm an AI assistant. This call may be recorded") enough under APP 5 and Queensland law?

### Fees and the patient relationship

7. Can I keep the $95 pre-assessment review fee when I decide from the pre-assessment form alone (with an email explaining why) that the service isn't suitable? Is this fair under Australian Consumer Law?
8. Can I keep $440 ($95 + $345) when ADHD isn't diagnosed at appointment 1?
9. Are the cancellation fees (50% under 48 hours, 100% for a missed appointment) reasonable?
10. The terms say someone becomes a patient once they book and I accept them after reading the intake. Is that the right point?
11. What wording should the terms use to limit liability, and which state's law governs?

### Telehealth

12. Is offering appointment 1 (the assessment) by phone, at the patient's choice, defensible under the Medical Board's telehealth guidance?
13. Am I covered for telehealth to anywhere in Queensland, and for the AI tools I use?
14. If I'm interstate (locum work), what's my position for patients mid-way through treatment?

### Business

15. Should the website name the business entity and show an ABN once they exist?
16. Is 13 Begley Street, Cannonvale suitable to publish as the business address? (If it's your home, use the suburb only.)
