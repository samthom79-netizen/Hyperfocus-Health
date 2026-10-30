---
# /pricing. Prices come from src/config/site.ts via {tokens}.
# Rule: one clear total to diagnosis, every other likely cost on the same page.

title: "Prices"
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
  - stage: "Review appointment"
    whatYouGet: "Every 2-4 weeks while treatment is adjusted, until things are stable. A short check-in form comes first."
    cost: "{prices.review} each"
  - stage: "Optional bundle"
    whatYouGet: "Diagnosis plus 3 months of reviews, paid once"
    cost: "{prices.bundle}"
    note: "{prices.bundleTerms}"
  - stage: "Ongoing reviews"
    whatYouGet: "Every 3-6 months once things are stable"
    cost: "{prices.ongoingReview} each"
  - stage: "Blood tests or ECG"
    whatYouGet: "Only if your history needs them"
    cost: "{prices.testsNote}"

example:
  heading: "A typical first 3 months"
  intro: "An example of the cost from booking to 3 months after diagnosis, if you don't choose the bundle."
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
    - "{policies.paymentTiming}"
    - "GST: {prices.gstNote}"
    - "If Dr Sam finds this service isn't right for you after reading your intake: {policies.refundIfUnsuitable}"
    - "Need to change or cancel? See [cancellations and refunds](/cancellations)."
---
