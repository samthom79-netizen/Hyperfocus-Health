---
# /pricing. Prices come from src/config/site.ts via {tokens}.
# Rule: one clear total to diagnosis, every other likely cost on the same page.

title: "Adult ADHD assessment prices"
description: "What an adult ADHD assessment with Hyperfocus Health costs, including reviews and a typical first 3 months. No hidden fees."
heading: "What it costs"
readingTime: "2 min read"
shortVersion:
  - "It costs {prices.assessmentTotal} in total to reach a diagnosis and a written plan."
  - "Reviews while treatment is adjusted cost {prices.review} each. Every likely cost is on this page."
  - "Video appointments have no Medicare rebate. In person at Cannonvale, the fees are the same and you may get a rebate."

tableHeading: "Every cost, stage by stage"
tableNote: "{appointments.lengthsNote} The same fees apply by video or in person at {clinic.suburb}."
rows:
  - stage: "Assessment to diagnosis"
    whatYouGet: "Online intake, appointment 1 (about 60 min), appointment 2 (about 30-45 min) and your written plan"
    cost: "{prices.assessmentTotal} total"
    note: "Paid in 2 parts: {prices.payAtBooking} when you book, then {prices.payAppointment2} when you book appointment 2."
  - stage: "Review appointment"
    whatYouGet: "About {appointments.reviewMinutes} min, every 2-4 weeks while treatment is adjusted, until things are stable. A short check-in form comes first."
    cost: "{prices.review} each"
  - stage: "Ongoing reviews"
    whatYouGet: "About {appointments.reviewMinutes} min, every 3-6 months once things are stable"
    cost: "{prices.ongoingReview} each"
  - stage: "Blood tests or ECG"
    whatYouGet: "Only if your history needs them"
    cost: "{prices.testsNote}"

example:
  heading: "A typical first 3 months"
  intro: "An example of the cost from booking to 3 months after diagnosis."
  notIncluded: "Not included: any blood tests or ECG, which are arranged and charged separately."

medicare:
  heading: "Medicare in plain words"
  paragraphs:
    - "Video appointments have no Medicare rebate. Medicare only pays for a GP video appointment if you've had a face-to-face visit with the same practice in the last 12 months. As a new patient of a video service, you won't have."
    - "In person at {clinic.name} in {clinic.suburb}, the fees are the same. You may be able to claim a Medicare rebate for each appointment, which lowers what you pay."
    - "{booking.inPerson.carePlanNote}"

payment:
  heading: "Paying, cancelling and refunds"
  points:
    - "You pay {prices.payAtBooking} when you book appointment 1, and {prices.payAppointment2} when you book appointment 2. Each review is paid when you book it."
    - "{prices.gstNote}"
    - "The fee pays for Dr Sam's time and assessment, not a particular result."
    - "{policies.refundIfUnsuitable}"
    - "Need to change or cancel? See [cancellations and refunds](/cancellations)."
---
