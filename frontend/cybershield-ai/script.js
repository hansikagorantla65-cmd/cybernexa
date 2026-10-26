/* ==========================================================
   CyberShield AI — Prototype Logic
   This file is split into 3 clearly-labelled parts:
     1. Screen navigation   (switching between Home / Subscribe / Transaction / Learn)
     2. Mock upload + analysis (fake "scanning" for the two upload flows)
     3. Quiz logic

   Beginner note: we don't use any framework here. We just grab
   elements with document.getElementById() / querySelector() and
   change their CSS classes or text. That's enough for a prototype.
   ========================================================== */


/* ===========================================================
   1. SCREEN NAVIGATION
   =========================================================== */

// Keep track of which screen we're currently on, so the Back
// button always knows where to return to ("Home", basically).
let currentScreenId = "screen-home";

const topbar = document.getElementById("topbar");
const topbarTitle = document.getElementById("topbarTitle");
const backBtn = document.getElementById("backBtn");

function goToScreen(screenId) {
  // Hide every screen, then show only the one we want.
  document.querySelectorAll(".screen").forEach((section) => {
    section.classList.remove("active");
  });
  const target = document.getElementById(screenId);
  target.classList.add("active");
  currentScreenId = screenId;

  // Home has no top bar (it's a clean landing screen).
  // Every other screen shows a Back button + its title.
  if (screenId === "screen-home") {
    topbar.hidden = true;
  } else {
    topbar.hidden = false;
    topbarTitle.textContent = target.dataset.title || "";
  }

  // Scroll back to the top whenever we change screens.
  window.scrollTo({ top: 0, behavior: "instant" });
}

// Wire up every button on the Home screen that has a
// data-nav="..." attribute to navigate to that screen.
document.querySelectorAll("[data-nav]").forEach((btn) => {
  btn.addEventListener("click", () => goToScreen(btn.dataset.nav));
});

// The single shared Back button always returns Home in this prototype.
backBtn.addEventListener("click", () => goToScreen("screen-home"));


/* ===========================================================
   2. MOCK UPLOAD + ANALYSIS
   In the real product, the uploaded screenshot would be sent to
   an OCR/AI service. Here, we just fake a short "scanning" delay
   and then reveal pre-written sample results, so the FLOW can be
   tested and demoed before the AI part exists.
   =========================================================== */

// A tiny reusable helper: given the three panels of a flow
// (upload -> scanning -> result), animate the transition.
function runMockScan({ uploadPanel, scanningPanel, resultPanel, onDone }) {
  uploadPanel.classList.add("hidden");
  scanningPanel.classList.remove("hidden");

  // Simulate processing time so the "scanning" state feels real.
  setTimeout(() => {
    scanningPanel.classList.add("hidden");
    resultPanel.classList.remove("hidden");
    if (onDone) onDone();
  }, 1400);
}

// --- Subscription screenshot flow ---
const subFileInput = document.getElementById("subFileInput");
const subUploadPanel = document.getElementById("subUploadPanel");
const subScanningPanel = document.getElementById("subScanningPanel");
const subResultPanel = document.getElementById("subResultPanel");
const subThumbImg = document.getElementById("subThumbImg");
const subCheckAnotherBtn = document.getElementById("subCheckAnotherBtn");

// A couple of sample "extracted" results so re-testing the flow
// doesn't always show identical numbers. Picked at random each time.
const SUBSCRIPTION_SAMPLES = [
  {
    trial: "7-day free trial",
    initial: "₹0 today",
    renewal: "₹999 / month",
    frequency: "Monthly",
    autoRenew: "Yes — renews automatically unless cancelled",
    hasWarning: true,
  },
  {
    trial: "14-day free trial",
    initial: "₹0 today",
    renewal: "₹2,499 / year",
    frequency: "Yearly",
    autoRenew: "Yes — renews automatically unless cancelled",
    hasWarning: true,
  },
];

subFileInput.addEventListener("change", () => {
  const file = subFileInput.files[0];
  if (!file) return;

  // Show a preview of whatever image the user picked.
  subThumbImg.src = URL.createObjectURL(file);

  runMockScan({
    uploadPanel: subUploadPanel,
    scanningPanel: subScanningPanel,
    resultPanel: subResultPanel,
    onDone: () => {
      // Pick one sample result at random and fill in the fields.
      const sample = SUBSCRIPTION_SAMPLES[Math.floor(Math.random() * SUBSCRIPTION_SAMPLES.length)];
      document.getElementById("fTrialDuration").textContent = sample.trial;
      document.getElementById("fInitialPrice").textContent = sample.initial;
      document.getElementById("fRenewalPrice").textContent = sample.renewal;
      document.getElementById("fRenewalFreq").textContent = sample.frequency;
      document.getElementById("fAutoRenew").textContent = sample.autoRenew;

      // Only show the big warning banner when auto-renewal applies.
      document.getElementById("subWarningBanner").classList.toggle("hidden", !sample.hasWarning);
    },
  });
});

subCheckAnotherBtn.addEventListener("click", () => {
  subResultPanel.classList.add("hidden");
  uploadPanelReset(subFileInput, subUploadPanel);
});

// --- Transaction screenshot flow ---
const txFileInput = document.getElementById("txFileInput");
const txUploadPanel = document.getElementById("txUploadPanel");
const txScanningPanel = document.getElementById("txScanningPanel");
const txResultPanel = document.getElementById("txResultPanel");
const txThumbImg = document.getElementById("txThumbImg");
const txCheckAnotherBtn = document.getElementById("txCheckAnotherBtn");

const TRANSACTION_SAMPLES = [
  {
    amount: "₹499.00",
    merchant: "Netflix India",
    type: "Debit — card payment",
    recurring: "Likely recurring subscription",
  },
  {
    amount: "₹149.00",
    merchant: "Spotify AB",
    type: "Debit — UPI autopay",
    recurring: "Likely recurring subscription",
  },
  {
    amount: "₹1,250.00",
    merchant: "Local Store Pvt Ltd",
    type: "Debit — card payment",
    recurring: "No recurring pattern detected",
  },
];

txFileInput.addEventListener("change", () => {
  const file = txFileInput.files[0];
  if (!file) return;

  txThumbImg.src = URL.createObjectURL(file);

  runMockScan({
    uploadPanel: txUploadPanel,
    scanningPanel: txScanningPanel,
    resultPanel: txResultPanel,
    onDone: () => {
      const sample = TRANSACTION_SAMPLES[Math.floor(Math.random() * TRANSACTION_SAMPLES.length)];
      document.getElementById("tAmount").textContent = sample.amount;
      document.getElementById("tMerchant").textContent = sample.merchant;
      document.getElementById("tType").textContent = sample.type;
      document.getElementById("tRecurring").textContent = sample.recurring;
    },
  });
});

txCheckAnotherBtn.addEventListener("click", () => {
  txResultPanel.classList.add("hidden");
  uploadPanelReset(txFileInput, txUploadPanel);
});

// Shared helper: clear a file input and bring its upload box back.
function uploadPanelReset(fileInput, uploadPanel) {
  fileInput.value = "";
  uploadPanel.classList.remove("hidden");
}


/* ===========================================================
   3. LEARN & PROTECT — QUIZ
   =========================================================== */

const QUIZ_QUESTIONS = [
  {
    question: "A shopping app offers a \"free trial\" that needs your card details upfront. What does this usually mean?",
    options: [
      "It's completely free forever, the card is just for identity proof",
      "You'll likely be charged automatically once the trial period ends",
      "Your card can never be charged unless you type your PIN",
    ],
    correctIndex: 1,
    explanation: "Free trials that collect card details almost always convert into a paid subscription automatically once the trial ends — unless you cancel first.",
  },
  {
    question: "What does \"auto-renewal\" mean for a subscription?",
    options: [
      "You'll get a reminder and must approve every renewal manually",
      "The plan renews and charges you again automatically, without needing your action",
      "The subscription cancels itself automatically after one cycle",
    ],
    correctIndex: 1,
    explanation: "Auto-renewal means the service keeps billing you on a repeating cycle unless you actively cancel — it does not stop or ask permission on its own.",
  },
  {
    question: "You see a recurring charge on your bank statement that you don't recognise. What's the safest first step?",
    options: [
      "Share your OTP with the number that texted you, so they can 'verify' it",
      "Check your subscriptions list and transaction history yourself, then contact your bank's official helpline if still unsure",
      "Ignore it — recurring charges are always harmless",
    ],
    correctIndex: 1,
    explanation: "Always verify independently through your bank's official channels. Never share an OTP, PIN or CVV with anyone who contacts you — banks never ask for these.",
  },
  {
    question: "Someone calls claiming to be from your bank and asks for your UPI PIN to \"stop a suspicious transaction.\" What should you do?",
    options: [
      "Give the PIN quickly so they can block the transaction in time",
      "Refuse — no bank employee will ever ask for your PIN, OTP or CVV over a call",
      "Give the PIN only if they already know your name and account number",
    ],
    correctIndex: 1,
    explanation: "This is a classic scam pattern. Banks and payment apps never need your PIN, OTP, CVV or password to fix or block anything — sharing them hands over full control of your money.",
  },
  {
    question: "Which detail is the strongest sign that a \"free\" offer is actually a paid subscription in disguise?",
    options: [
      "The page has bright colours and a countdown timer",
      "The terms mention a renewal price and a renewal frequency after the trial",
      "The app has a five-star rating",
    ],
    correctIndex: 1,
    explanation: "Colours, timers and ratings are just marketing. The real signal is fine print about what price you'll be charged, and how often, once the trial or intro period ends.",
  },
];

let quizIndex = 0;
let quizScore = 0;

const quizIntroPanel = document.getElementById("quizIntroPanel");
const quizQuestionPanel = document.getElementById("quizQuestionPanel");
const quizResultPanel = document.getElementById("quizResultPanel");
const quizStartBtn = document.getElementById("quizStartBtn");
const quizRetakeBtn = document.getElementById("quizRetakeBtn");
const quizNextBtn = document.getElementById("quizNextBtn");
const quizOptionsEl = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");
const quizFeedbackText = document.getElementById("quizFeedbackText");
const quizCounter = document.getElementById("quizCounter");
const quizQuestionText = document.getElementById("quizQuestionText");
const quizProgressBar = document.getElementById("quizProgressBar");

document.getElementById("quizQCount").textContent = QUIZ_QUESTIONS.length;

quizStartBtn.addEventListener("click", () => {
  quizIndex = 0;
  quizScore = 0;
  quizIntroPanel.classList.add("hidden");
  quizResultPanel.classList.add("hidden");
  quizQuestionPanel.classList.remove("hidden");
  renderQuestion();
});

quizRetakeBtn.addEventListener("click", () => {
  quizResultPanel.classList.add("hidden");
  quizIntroPanel.classList.remove("hidden");
});

function renderQuestion() {
  const q = QUIZ_QUESTIONS[quizIndex];

  quizCounter.textContent = `Question ${quizIndex + 1} of ${QUIZ_QUESTIONS.length}`;
  quizProgressBar.style.width = `${((quizIndex) / QUIZ_QUESTIONS.length) * 100 + (100 / QUIZ_QUESTIONS.length)}%`;
  quizQuestionText.textContent = q.question;

  // Rebuild the option buttons for this question.
  quizOptionsEl.innerHTML = "";
  q.options.forEach((optionText, i) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.type = "button";
    btn.textContent = optionText;
    btn.addEventListener("click", () => selectAnswer(i, btn));
    quizOptionsEl.appendChild(btn);
  });

  quizFeedback.classList.add("hidden");
}

function selectAnswer(choiceIndex, chosenBtn) {
  const q = QUIZ_QUESTIONS[quizIndex];
  const allOptionButtons = quizOptionsEl.querySelectorAll(".quiz-option");

  // Lock all options once one is picked, and mark correct/incorrect.
  allOptionButtons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correctIndex) btn.classList.add("correct");
  });

  if (choiceIndex === q.correctIndex) {
    quizScore++;
    quizFeedbackText.textContent = `Correct! ${q.explanation}`;
  } else {
    chosenBtn.classList.add("incorrect");
    quizFeedbackText.textContent = `Not quite. ${q.explanation}`;
  }

  quizFeedback.classList.remove("hidden");
}

quizNextBtn.addEventListener("click", () => {
  quizIndex++;
  if (quizIndex < QUIZ_QUESTIONS.length) {
    renderQuestion();
  } else {
    showQuizResult();
  }
});

function showQuizResult() {
  quizQuestionPanel.classList.add("hidden");
  quizResultPanel.classList.remove("hidden");

  document.getElementById("scoreValue").textContent = `${quizScore}/${QUIZ_QUESTIONS.length}`;

  // Draw the score onto the circular progress ring.
  const circumference = 327; // matches stroke-dasharray in CSS
  const fraction = quizScore / QUIZ_QUESTIONS.length;
  const offset = circumference - circumference * fraction;
  document.getElementById("scoreCircle").style.strokeDashoffset = offset;

  const messages = {
    5: "Excellent — you can spot the red flags that lead to surprise charges.",
    4: "Great job — just one habit away from being scam-proof.",
    3: "Good start — revisit the ones you missed to sharpen your instincts.",
  };
  document.getElementById("scoreMessage").textContent =
    messages[quizScore] || "Keep learning — recognising these patterns is the best protection against surprise charges.";
}


/* ===========================================================
   Initial state: make sure we start on the Home screen.
   =========================================================== */
goToScreen("screen-home");
