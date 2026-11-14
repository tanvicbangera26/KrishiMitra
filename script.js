
// --------------------------------------
// KrishiMitra - DEMONSTRATION DATA
// --------------------------------------

const markets = [
  { name: "Mangaluru", price: 2000, transport: 500, other: 200 },
  { name: "Puttur", price: 2200, transport: 1100, other: 250 },
  { name: "Bantwal", price: 2100, transport: 650, other: 200 }
];

const forecast = [2000, 2020, 2050, 2070, 2100, 2120, 2150];

let alerts = [];
let recognition = null;
let lastVoiceAnswer = "";

// --------------------------------------
// PAGE NAVIGATION
// --------------------------------------

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.classList.remove("active");
  });

  const page = document.getElementById(pageId);

  if (page) {
    page.classList.add("active");
  }

  const button = document.querySelector(`[data-page="${pageId}"]`);
  if (button) button.classList.add("active");

  const titles = {
    dashboard: "Dashboard",
    prices: "Market Prices",
    prediction: "Price Prediction",
    mandi: "Best Mandi Recommendation",
    quality: "Crop Quality Estimation",
    advisor: "Sell or Wait Advisor",
    voice: "Kannada Voice Assistant",
    profit: "Profit Calculator",
    alerts: "Price Alerts"
  };

  document.getElementById("page-title").textContent =
    titles[pageId] || "AgriPrice AI";
}

document.querySelectorAll(".nav-btn").forEach(button => {
  button.addEventListener("click", () => {
    showPage(button.dataset.page);
  });
});

// --------------------------------------
// MARKET TABLE
// --------------------------------------

function displayMarketPrices() {
  const table = document.getElementById("market-table");

  table.innerHTML = markets.map(market => `
    <tr>
      <td>${market.name}</td>
      <td>₹${market.price.toLocaleString("en-IN")}</td>
      <td>₹${market.transport}</td>
      <td>₹${market.other}</td>
    </tr>
  `).join("");
}

// --------------------------------------
// PRICE CHARTS
// --------------------------------------

function createChart(canvasId, labels, values) {
  const canvas = document.getElementById(canvasId);

  if (!canvas || typeof Chart === "undefined") return;

  new Chart(canvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Price per quintal (₹)",
        data: values,
        borderColor: "#287647",
        backgroundColor: "rgba(40,118,71,0.12)",
        fill: true,
        tension: 0.35
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}

// --------------------------------------
// DASHBOARD INSIGHTS
// --------------------------------------

function displayDashboardInsights() {
  const box = document.getElementById("dashboard-insights");

  box.innerHTML = `
    <div class="insight">📍 Compare estimated net returns before selecting a market.</div>
    <div class="insight">🍅 Check crop quality to estimate a possible selling price.</div>
    <div class="insight">🧠 Consider crop condition before deciding to wait for a higher price.</div>
    <div class="insight">🎙️ Ask simple questions using the Kannada voice assistant.</div>
  `;
}

// --------------------------------------
// INNOVATION 1: BEST MANDI
// --------------------------------------

function recommendMandi() {
  const quantity = Number(
    document.getElementById("mandi-quantity").value
  );

  const location = document.getElementById("farmer-location").value.trim();
  const result = document.getElementById("mandi-result");
  const table = document.getElementById("mandi-table");

  if (!Number.isFinite(quantity) || quantity <= 0) {
    result.textContent = "Please enter a valid quantity greater than zero.";
    result.className = "result warning";
    return;
  }

  // Net return = selling revenue - all estimated expenses
  const calculations = markets.map(market => {
    const revenue = market.price * quantity;
    const totalCost = market.transport + market.other;
    const netReturn = revenue - totalCost;

    return {
      ...market,
      revenue,
      totalCost,
      netReturn
    };
  });

  calculations.sort((a, b) => b.netReturn - a.netReturn);

  table.innerHTML = calculations.map(market => `
    <tr>
      <td>${market.name}</td>
      <td>₹${market.revenue.toLocaleString("en-IN")}</td>
      <td>₹${market.totalCost.toLocaleString("en-IN")}</td>
      <td><strong>₹${market.netReturn.toLocaleString("en-IN")}</strong></td>
    </tr>
  `).join("");

  const best = calculations[0];

  result.className = "result";
  result.innerHTML = `
    <strong>🏆 Recommended market: ${best.name}</strong><br>
    ${location ? `Farmer location entered: ${escapeHTML(location)}<br>` : ""}
    Quantity: ${quantity} quintals<br>
    Selling price: ₹${best.price.toLocaleString("en-IN")} per quintal<br>
    Estimated revenue: ₹${best.revenue.toLocaleString("en-IN")}<br>
    Estimated expenses: ₹${best.totalCost.toLocaleString("en-IN")}<br>
    <strong>Estimated net return: ₹${best.netReturn.toLocaleString("en-IN")}</strong><br>
    This market gives the highest calculated net return among the sample options.
  `;
}

// --------------------------------------
// INNOVATION 2: CROP QUALITY ESTIMATION
// --------------------------------------

function estimateQuality() {
  const crop = document.getElementById("quality-crop").value;
  const grade = Number(document.getElementById("crop-grade").value);
  const basePrice = Number(document.getElementById("quality-base").value);

  const result = document.getElementById("quality-result");

  if (!Number.isFinite(basePrice) || basePrice <= 0) {
    result.textContent = "Enter a valid base market price.";
    result.className = "result warning";
    return;
  }

  const estimatedPrice = basePrice * grade;

  let gradeName = "Grade B";
  if (grade > 1) gradeName = "Grade A";
  if (grade < 1) gradeName = "Grade C";

  result.className = "result";
  result.innerHTML = `
    <strong>🍅 ${crop} quality estimation</strong><br>
    Selected quality: ${gradeName}<br>
    Base market price: ₹${basePrice.toFixed(2)} per quintal<br>
    Quality adjustment factor: ${grade}<br>
    <strong>Estimated price: ₹${estimatedPrice.toFixed(2)} per quintal</strong><br>
    Estimated difference: ₹${(estimatedPrice - basePrice).toFixed(2)} per quintal.
  `;
}

// --------------------------------------
// INNOVATION 3: SMART SELL OR WAIT
// --------------------------------------

function sellWaitAdvice() {
  const current = Number(document.getElementById("sell-current").value);
  const future = Number(document.getElementById("sell-future").value);
  const condition = document.getElementById("sell-condition").value;
  const shelfLife = Number(document.getElementById("shelf-life").value);

  const result = document.getElementById("sell-result");

  if (
    !Number.isFinite(current) ||
    !Number.isFinite(future) ||
    current <= 0 ||
    future <= 0
  ) {
    result.textContent = "Please enter valid current and future prices.";
    result.className = "result warning";
    return;
  }

  const change = ((future - current) / current) * 100;

  let advice = "";
  let reason = "";
  let className = "result";

  if (condition === "poor" || shelfLife <= 1) {
    advice = "SELL AS SOON AS PRACTICAL";
    reason = "The crop is deteriorating or has very little estimated storage life. Waiting may increase spoilage risk.";
    className = "result danger";
  } else if (change > 3 && shelfLife >= 5 && condition === "good") {
    advice = "WAIT MAY BE WORTH CONSIDERING";
    reason = "The sample forecast indicates a possible price increase and the crop is reported to be in good condition. Monitor prices and crop quality.";
  } else if (change < 0) {
    advice = "CONSIDER SELLING SOON";
    reason = "The sample forecast indicates a possible price decrease. Waiting may not be beneficial.";
    className = "result warning";
  } else {
    advice = "MONITOR THE MARKET";
    reason = "The expected price movement is small or the storage period is limited. Compare the potential price gain with storage and spoilage risks.";
    className = "result warning";
  }

  result.className = className;
  result.innerHTML = `
    <strong>🧠 Recommendation: ${advice}</strong><br>
    Current price: ₹${current.toFixed(2)} per quintal<br>
    Expected price: ₹${future.toFixed(2)} per quintal<br>
    Expected price movement: ${change.toFixed(2)}%<br>
    Remaining storage life: ${shelfLife} day(s)<br>
    Reason: ${reason}<br>
    <small>This is a rule-based demonstration, not a guaranteed market prediction.</small>
  `;
}

// --------------------------------------
// INNOVATION 4: PERISHABLE CROP ADVISOR
// --------------------------------------

function perishableAdvice() {
  const crop = document.getElementById("perishable-crop").value;
  const days = Number(document.getElementById("harvest-days").value);
  const storage = document.getElementById("storage-condition").value;
  const condition = document.getElementById("perishable-condition").value;

  const result = document.getElementById("perishable-result");

  if (!Number.isFinite(days) || days < 0) {
    result.textContent = "Enter a valid number of days.";
    result.className = "result warning";
    return;
  }

  let urgency = "MODERATE";
  let advice = "Check the crop condition daily and compare available market prices.";
  let className = "result";

  if (condition === "spoiling" || storage === "poor" || days >= 5) {
    urgency = "HIGH";
    advice = "Prioritise selling or processing the crop as soon as practical. Inspect it carefully for spoilage.";
    className = "result danger";
  } else if (condition === "average" || days >= 3) {
    urgency = "MEDIUM";
    advice = "Avoid unnecessary storage. Compare today's market options and monitor crop condition.";
    className = "result warning";
  } else if (storage === "cool" && condition === "fresh") {
    urgency = "LOWER";
    advice = "The crop is reported as fresh and stored in cool conditions. Continue monitoring its quality and market price.";
  }

  result.className = className;
  result.innerHTML = `
    <strong>🥬 ${crop} selling urgency: ${urgency}</strong><br>
    Days since harvest: ${days}<br>
    Storage: ${storage}<br>
    Crop condition: ${condition}<br>
    Advice: ${advice}<br>
    <small>Storage life varies by variety, temperature, humidity and handling. This is not a validated shelf-life calculation.</small>
  `;
}

// --------------------------------------
// INNOVATION 5: KANNADA VOICE ASSISTANT
// --------------------------------------

function startVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const status = document.getElementById("voice-status");

  if (!SpeechRecognition) {
    status.textContent =
      "Speech recognition is not supported in this browser. Try Google Chrome.";
    return;
  }

  if (recognition) {
    recognition.stop();
  }

  recognition = new SpeechRecognition();
  recognition.lang = "kn-IN";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    status.textContent = "ಕೇಳುತ್ತಿದ್ದೇನೆ... Speak in Kannada.";
  };

  recognition.onresult = event => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("voice-question").value = transcript;
    status.textContent = "ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಗುರುತಿಸಲಾಗಿದೆ.";
    answerVoiceQuestion();
  };

  recognition.onerror = event => {
    status.textContent = "Voice error: " + event.error +
      ". Check microphone permission and try again.";
  };

  recognition.onend = () => {
    if (status.textContent.includes("ಕೇಳುತ್ತಿದ್ದೇನೆ")) {
      status.textContent = "Voice input ended.";
    }
  };

  recognition.start();
}

function stopVoice() {
  if (recognition) {
    recognition.stop();
  }

  document.getElementById("voice-status").textContent =
    "Voice recognition stopped.";
}

function answerVoiceQuestion() {
  const question = document.getElementById("voice-question").value
    .trim()
    .toLowerCase();

  const answerBox = document.getElementById("voice-answer");

  if (!question) {
    answerBox.textContent = "ದಯವಿಟ್ಟು ಮೊದಲು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.";
    lastVoiceAnswer = answerBox.textContent;
    return;
  }

  let answer = "";

  if (
    question.includes("ಬೆಲೆ") ||
    question.includes("price") ||
    question.includes("ಟೊಮೇಟೊ")
  ) {
    answer =
      "ಟೊಮೇಟೊದ ಮಾದರಿ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್‌ಗೆ 2000 ರೂಪಾಯಿ. ಇದು ಪ್ರದರ್ಶನದ ದತ್ತಾಂಶ ಮಾತ್ರ. ನಿಜವಾದ ಇಂದಿನ ಬೆಲೆ ಅಲ್ಲ.";
  } else if (
    question.includes("ಮಾರುಕಟ್ಟೆ") ||
    question.includes("market") ||
    question.includes("ಮಂಡಿ")
  ) {
    answer =
      "ನಿಮಗೆ ಹೆಚ್ಚು ಲಾಭ ನೀಡಬಹುದಾದ ಮಾರುಕಟ್ಟೆಯನ್ನು ತಿಳಿಯಲು ಬೆಸ್ಟ್ ಮಂಡಿ ವಿಭಾಗವನ್ನು ತೆರೆಯಿರಿ. ಸಾರಿಗೆ ವೆಚ್ಚವನ್ನೂ ಲೆಕ್ಕ ಹಾಕಲಾಗುತ್ತದೆ.";
  } else if (
    question.includes("ಮಾರಾಟ") ||
    question.includes("sell") ||
    question.includes("ಮಾರಬೇಕು")
  ) {
    answer =
      "ಬೆಳೆ ಗುಣಮಟ್ಟ ಮತ್ತು ಉಳಿದಿರುವ ಸಂಗ್ರಹ ಅವಧಿಯನ್ನು ಪರಿಶೀಲಿಸಿ. ಸ್ಮಾರ್ಟ್ ಸೆಲ್ ಆರ್ ವೇಟ್ ವಿಭಾಗದಲ್ಲಿ ಸಲಹೆ ಪಡೆಯಿರಿ.";
  } else if (
    question.includes("ಗುಣಮಟ್ಟ") ||
    question.includes("quality")
  ) {
    answer =
      "ಬೆಳೆ ಗುಣಮಟ್ಟವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ. ಗುಣಮಟ್ಟ ಆಧರಿಸಿ ಅಂದಾಜು ಬೆಲೆಯನ್ನು ತಿಳಿಯಲು ಕ್ರಾಪ್ ಕ್ವಾಲಿಟಿ ವಿಭಾಗವನ್ನು ಬಳಸಿ.";
  } else {
    answer =
      "ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ಪ್ರಶ್ನೆ ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ಬೆಲೆ, ಮಾರುಕಟ್ಟೆ, ಮಾರಾಟ ಅಥವಾ ಗುಣಮಟ್ಟದ ಬಗ್ಗೆ ಕೇಳಿ.";
  }

  lastVoiceAnswer = answer;
  answerBox.textContent = answer;
}

function speakAnswer() {
  if (!lastVoiceAnswer) {
    answerVoiceQuestion();
  }

  if (!("speechSynthesis" in window)) {
    alert("Speech output is not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(lastVoiceAnswer);
  speech.lang = "kn-IN";
  speech.rate = 0.85;

  window.speechSynthesis.speak(speech);
}

// --------------------------------------
// PROFIT CALCULATOR
// --------------------------------------

function calculateProfit() {
  const quantity = Number(document.getElementById("profit-quantity").value);
  const price = Number(document.getElementById("profit-price").value);
  const transport = Number(document.getElementById("profit-transport").value);
  const other = Number(document.getElementById("profit-other").value);

  const result = document.getElementById("profit-result");

  if (
    ![quantity, price, transport, other].every(Number.isFinite) ||
    quantity < 0 || price < 0 || transport < 0 || other < 0
  ) {
    result.textContent = "Please enter valid non-negative numbers.";
    result.className = "result warning";
    return;
  }

  const revenue = quantity * price;
  const totalExpenses = transport + other;
  const netProfit = revenue - totalExpenses;

  result.className = "result";
  result.innerHTML = `
    Total revenue: ₹${revenue.toLocaleString("en-IN")}<br>
    Total expenses: ₹${totalExpenses.toLocaleString("en-IN")}<br>
    <strong>Estimated net return: ₹${netProfit.toLocaleString("en-IN")}</strong>
  `;
}

// --------------------------------------
// PRICE ALERTS
// --------------------------------------

function addAlert() {
  const price = Number(document.getElementById("alert-price").value);
  const type = document.getElementById("alert-type").value;

  if (!Number.isFinite(price) || price <= 0) {
    alert("Please enter a valid target price.");
    return;
  }

  alerts.push({ price, type });
  displayAlerts();
}

function displayAlerts() {
  const box = document.getElementById("alert-list");

  if (alerts.length === 0) {
    box.innerHTML = "<div class='insight'>No alerts added yet.</div>";
    return;
  }

  box.innerHTML = alerts.map((alert, index) => `
    <div class="insight">
      ${alert.type === "above" ? "Price reaches or exceeds" : "Price falls to or below"}
      ₹${alert.price} per quintal
      <button class="secondary" onclick="removeAlert(${index})">Remove</button>
    </div>
  `).join("");
}

function removeAlert(index) {
  alerts.splice(index, 1);
  displayAlerts();
}

// --------------------------------------
// SAFETY: ESCAPE USER-ENTERED TEXT
// --------------------------------------

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

// --------------------------------------
// INITIALIZE WEBSITE
// --------------------------------------

displayMarketPrices();
displayDashboardInsights();
displayAlerts();

document.getElementById("current-price").textContent = "₹2,000";
document.getElementById("predicted-price").textContent = "₹2,150";

document.getElementById("forecast-message").innerHTML =
  "Sample forecast: ₹2,000 to ₹2,150 per quintal over seven days.";

createChart(
  "priceChart",
  ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
  forecast
);

createChart(
  "forecastChart",
  ["Today", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
  forecast
);
