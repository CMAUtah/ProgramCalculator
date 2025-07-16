function initSettingsPage() {
  loadSettings();

  // Set up program value calculators
  if (document.getElementById('bTotalProgramValue')) {
    calculateProgramValues();
    document.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('input', calculateProgramValues);
    });
  }

  // Set default visible section
  const defaultSection = document.getElementById("section1");
  const defaultButton = document.querySelector('[data-target="section1"]');
  if (defaultSection && defaultButton) {
    defaultSection.classList.add("active");
    defaultButton.classList.add("active");
  }

  // Handle section toggle buttons
  const buttons = document.querySelectorAll(".subNav-button");
  const sections = document.querySelectorAll(".content-section");
  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const target = this.getAttribute("data-target");

      sections.forEach(section => section.classList.remove("active"));
      document.getElementById(target)?.classList.add("active");

      buttons.forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Re-render discount inputs when checkboxes are toggled
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
  generateDiscountInputs();

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

  // Save holiday/section2 values separately
  document.querySelectorAll('#section2 input').forEach(input => {
    settings.section2Values[input.id] = input.type === "checkbox" ? input.checked : input.value;
  });

  const user = firebase.auth().currentUser;
  if (!user) {
    localStorage.setItem('calculatorSettings', JSON.stringify(settings));
    console.log("Settings saved locally:", settings);
    return;
  }

  // Save to Firestore (and local as fallback)
  localStorage.setItem('calculatorSettings', JSON.stringify(settings));
  db.collection("userSettings").doc(user.uid).set(settings)
    .then(() => console.log("Settings saved to Firestore"))
    .catch((err) => console.error("Firestore save failed:", err));

  calculateProgramValues();

  const savedMessage = document.getElementById('savedMessage');
  if (savedMessage) {
    savedMessage.style.opacity = '1';
    savedMessage.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => {
      savedMessage.style.opacity = '0';
    }, 1500);
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

    generateDiscountInputs();
  }

  // Slight delay ensures #section2 is rendered before loading
  setTimeout(() => {
    Object.entries(saved.section2Values || {}).forEach(([id, value]) => {
      const input = document.getElementById(id);
      if (input) {
        input.type === "checkbox" ? input.checked = value : input.value = value;
      }
    });
  }, 100);

  console.log(`Settings ${reloadSection2 ? "for Section 2" : "fully"} loaded`);
}

function generateDiscountInputs() {
  const user = firebase.auth().currentUser;
  const useFirestore = !!user && navigator.onLine;

  const programs = [
    { containerId: 'basicDiscountsContainer', prefix: 'basic' },
    { containerId: 'bbcDiscountsContainer', prefix: 'bbc' },
    { containerId: 'mcDiscountsContainer', prefix: 'mc' }
  ];

  const getStoredValue = async (key) => {
    if (!useFirestore) return localStorage.getItem(key);
    try {
      const doc = await db.collection("userSettings").doc(user.uid).get();
      return doc.exists ? doc.data()?.firestoreValues?.[key] : null;
    } catch (err) {
      console.warn(`Firestore read error for key "${key}":`, err);
      return null;
    }
  };

  const setStoredValue = (key, value) => {
    if (!useFirestore) {
      localStorage.setItem(key, value);
    } else {
      db.collection("userSettings").doc(user.uid).set({
        firestoreValues: { [key]: value }
      }, { merge: true }).catch(err => {
        console.warn(`Firestore write error for key "${key}":`, err);
      });
    }
  };

  programs.forEach(program => {
    const container = document.getElementById(program.containerId);
    if (!container) return;

    container.innerHTML = "";

    document.querySelectorAll('.settings input[type="checkbox"]').forEach(async (checkbox, index) => {
      if (!checkbox.checked) return;

      const optionName = document.getElementById(`basicOption${index + 1}Name`)?.value || `Option ${index + 1}`;
      const omitId = `${program.prefix}_omit_option_${index + 1}`;
      const discountId = `${program.prefix}_discount_${index + 1}`;
      const downId = `${program.prefix}_downpayment_${index + 1}`;

      const optionWrapper = document.createElement('div');
      optionWrapper.className = "option-container";

      const omitCheckbox = document.createElement('input');
      omitCheckbox.type = "checkbox";
      omitCheckbox.id = omitId;
      omitCheckbox.checked = (await getStoredValue(omitId)) !== "false";
      omitCheckbox.addEventListener('change', () => {
        setStoredValue(omitId, omitCheckbox.checked);
        generateDiscountInputs(); // Rebuild after change
      });

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
        discountInput.value = await getStoredValue(discountId) || "";
        discountInput.addEventListener('input', () => {
          const value = Math.min(100, Math.max(0, parseFloat(discountInput.value) || 0));
          discountInput.value = value;
          setStoredValue(discountId, value);
        });

        const paymentLabel = document.createElement('label');
        paymentLabel.innerHTML = `<strong>${optionName}</strong> Downpayment`;

        const paymentInput = document.createElement('input');
        paymentInput.type = "number";
        paymentInput.id = downId;
        paymentInput.className = "downpayment-input";
        paymentInput.value = await getStoredValue(downId) || "";
        paymentInput.addEventListener('input', () => {
          setStoredValue(downId, paymentInput.value);
        });

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
    });
  });
}

// Only show app after user is authenticated
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) app.style.display = 'none';

  auth.onAuthStateChanged((user) => {
    if (user) {
      window.location.href = 'login.html';
      return;
    }

    if (app) app.style.display = 'block';
    initSettingsPage();
  });
});
