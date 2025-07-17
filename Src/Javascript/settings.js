// settings.js
let storedDiscountValues = {}; // Cache for loaded values

function initSettingsPage() {
  loadSettings();

  // Load stored discount-related values (once)
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    if (navigator.onLine) {
      try {
        const doc = await db.collection("userSettings").doc(user.uid).get();
        storedDiscountValues = doc.exists ? doc.data().firestoreValues || {} : {};
      } catch (err) {
        console.warn("Failed to load Firestore discount values:", err);
      }
    } else {
      for (let key in localStorage) {
        if (key.includes("_discount_") || key.includes("_downpayment_") || key.includes("_omit_option_")) {
          storedDiscountValues[key] = localStorage.getItem(key);
        }
      }
    }

    generateDiscountInputs();
  });

  if (document.getElementById('bTotalProgramValue')) {
    calculateProgramValues();
    document.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('input', calculateProgramValues);
    });
  }

  const defaultSection = document.getElementById("section1");
  const defaultButton = document.querySelector('[data-target="section1"]');
  if (defaultSection && defaultButton) {
    defaultSection.classList.add("active");
    defaultButton.classList.add("active");
  }

  document.querySelectorAll(".subNav-button").forEach(button => {
    button.addEventListener("click", function () {
      const target = this.getAttribute("data-target");
      document.querySelectorAll(".content-section").forEach(section => section.classList.remove("active"));
      document.getElementById(target)?.classList.add("active");
      document.querySelectorAll(".subNav-button").forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");
    });
  });

  document.querySelectorAll('.settings input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', generateDiscountInputs);
  });
}

function calculateProgramValues() {
  const programs = [
    { lengthId: "bProgramLength", paymentId: "bBaseMonthlyPayment", downId: "bBaseDownPayment", totalId: "bTotalProgramValue" },
    { lengthId: "bbcProgramLength", paymentId: "bbcBaseMonthlyPayment", downId: "bbcBaseDownPayment", totalId: "bbcTotalProgramValue" },
    { lengthId: "mcProgramLength", paymentId: "mcBaseMonthlyPayment", downId: "mcBaseDownPayment", totalId: "mcTotalProgramValue" }
  ];

  programs.forEach(program => {
    const length = parseFloat(document.getElementById(program.lengthId)?.value) || 0;
    const monthly = parseFloat(document.getElementById(program.paymentId)?.value) || 0;
    const down = parseFloat(document.getElementById(program.downId)?.value) || 0;
    const total = down + monthly * length;

    const output = document.getElementById(program.totalId);
    if (output) output.textContent = `$${total.toFixed(2)}`;
  });
}

function saveSettings() {
  const settings = {
    options: [...document.querySelectorAll('.settings input[type="checkbox"]')].map(input => ({
      id: input.id,
      enabled: input.checked
    })),
    names: [...document.querySelectorAll('.settings input[type="text"]')].map(input => ({
      id: input.id,
      value: input.value
    })),
    values: [...document.querySelectorAll('input[type="number"]')].map(input => ({
      id: input.id,
      value: input.value
    })),
    section2Values: {}
  };

  document.querySelectorAll('#section2 input').forEach(input => {
    settings.section2Values[input.id] = input.type === "checkbox" ? input.checked : input.value;
  });

  const firestoreValues = {};
  document.querySelectorAll('.discount-input, .downpayment-input').forEach(input => {
    firestoreValues[input.id] = input.value;
  });
  document.querySelectorAll('.omit-container input[type="checkbox"]').forEach(input => {
    firestoreValues[input.id] = input.checked;
  });

  const user = firebase.auth().currentUser;
  if (!user) {
    localStorage.setItem('calculatorSettings', JSON.stringify(settings));
    Object.entries(firestoreValues).forEach(([key, val]) => localStorage.setItem(key, val));
    console.log("Settings saved locally:", settings);
    return;
  }

  db.collection("userSettings").doc(user.uid).set({
    ...settings,
    firestoreValues
  }, { merge: true }).then(() => {
    Object.entries(firestoreValues).forEach(([key, val]) => localStorage.setItem(key, val));
    console.log("Settings saved to Firestore");
  }).catch(err => console.error("Firestore save failed:", err));

  const savedMessage = document.getElementById('savedMessage');
  if (savedMessage) {
    savedMessage.style.opacity = '1';
    savedMessage.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => savedMessage.style.opacity = '0', 1500);
  }
}

function loadSettings(reloadSection2 = false) {
  const saved = JSON.parse(localStorage.getItem('calculatorSettings'));
  if (!saved) return;

  if (!reloadSection2) {
    saved.options?.forEach(setting => {
      const input = document.getElementById(setting.id);
      if (input) input.checked = setting.enabled;
    });

    saved.names?.forEach(setting => {
      const input = document.getElementById(setting.id);
      if (input) input.value = setting.value;
    });

    saved.values?.forEach(setting => {
      const input = document.getElementById(setting.id);
      if (input) input.value = setting.value;
    });
  }

  setTimeout(() => {
    Object.entries(saved.section2Values || {}).forEach(([id, value]) => {
      const input = document.getElementById(id);
      if (input) {
        input.type === "checkbox" ? input.checked = value : input.value = value;
      }
    });
  }, 100);
}

async function generateDiscountInputs() {
  const programs = [
    { containerId: 'basicDiscountsContainer', prefix: 'basic' },
    { containerId: 'bbcDiscountsContainer', prefix: 'bbc' },
    { containerId: 'mcDiscountsContainer', prefix: 'mc' }
  ];

  for (const program of programs) {
    const container = document.getElementById(program.containerId);
    if (!container) continue;

    container.innerHTML = "";
    const checkboxes = document.querySelectorAll('.settings input[type="checkbox"]');

    for (let index = 0; index < checkboxes.length; index++) {
      const checkbox = checkboxes[index];
      if (!checkbox.checked) continue;

      const optionName = document.getElementById(`${program.prefix}Option${index + 1}Name`)?.value || `Option ${index + 1}`;
      const omitId = `${program.prefix}_omit_option_${index + 1}`;
      const discountId = `${program.prefix}_discount_${index + 1}`;
      const downId = `${program.prefix}_downpayment_${index + 1}`;

      const optionWrapper = document.createElement('div');
      optionWrapper.className = "option-container";

      const omitCheckbox = document.createElement('input');
      omitCheckbox.type = "checkbox";
      omitCheckbox.id = omitId;
      omitCheckbox.checked = storedDiscountValues[omitId] !== "false";

      const omitLabel = document.createElement('label');
      omitLabel.setAttribute("for", omitId);

      const omitContainer = document.createElement('div');
      omitContainer.className = "omit-container";
      omitContainer.appendChild(omitCheckbox);
      omitContainer.appendChild(omitLabel);

      const inputContainer = document.createElement('div');
      inputContainer.className = "input-container";

      if (!omitCheckbox.checked) {
        const disabledLabel = document.createElement('p');
        disabledLabel.innerHTML = `<strong>${optionName}</strong> (disabled)`;
        disabledLabel.className = "disabled-label";
        inputContainer.appendChild(disabledLabel);
      } else {
        const discountLabel = document.createElement('label');
        discountLabel.innerHTML = index === 0
          ? `<strong>${optionName}</strong> Discount (Paid In Full) %`
          : `<strong>${optionName}</strong> Discount %`;

        const discountInput = document.createElement('input');
        discountInput.type = "number";
        discountInput.id = discountId;
        discountInput.className = "discount-input";
        discountInput.min = 0;
        discountInput.max = 100;
        discountInput.value = storedDiscountValues[discountId] || "";

        const paymentLabel = document.createElement('label');
        paymentLabel.innerHTML = `<strong>${optionName}</strong> Downpayment`;

        const paymentInput = document.createElement('input');
        paymentInput.type = "number";
        paymentInput.id = downId;
        paymentInput.className = "downpayment-input";
        paymentInput.value = storedDiscountValues[downId] || "";

        inputContainer.appendChild(discountLabel);
        inputContainer.appendChild(discountInput);
        inputContainer.appendChild(paymentLabel);
        inputContainer.appendChild(paymentInput);
      }

      optionWrapper.appendChild(omitContainer);
      optionWrapper.appendChild(inputContainer);
      container.appendChild(optionWrapper);

      const separator = document.createElement('hr');
      separator.className = "option-separator";
      container.appendChild(separator);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) app.style.display = 'none';

  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    if (app) app.style.display = 'block';
    initSettingsPage();
  });
});
