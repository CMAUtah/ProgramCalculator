auth.onAuthStateChanged((user) => {
  if (!user) {
    // Not logged in, redirect to login
    window.location.href = 'login.html';
  }
});


function calculateProgramValues() {
    const programs = [
        { lengthId: "bProgramLength", paymentId: "bBaseMonthlyPayment", downId: "bBaseDownPayment", totalId: "bTotalProgramValue" },
        { lengthId: "bbcProgramLength", paymentId: "bbcBaseMonthlyPayment", downId: "bbcBaseDownPayment", totalId: "bbcTotalProgramValue" },
        { lengthId: "mcProgramLength", paymentId: "mcBaseMonthlyPayment", downId: "mcBaseDownPayment", totalId: "mcTotalProgramValue" }
    ];

    programs.forEach(program => {
        const length = parseFloat(document.getElementById(program.lengthId).value) || 0;
        const monthlyPayment = parseFloat(document.getElementById(program.paymentId).value) || 0;
        const downPayment = parseFloat(document.getElementById(program.downId).value) || 0;
        const totalValue = downPayment + (monthlyPayment * length);
        document.getElementById(program.totalId).textContent = `$${totalValue.toFixed(2)}`;
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

    const user = firebase.auth().currentUser;
    if (!user) {
        localStorage.setItem('calculatorSettings', JSON.stringify(settings));
        console.log("Settings saved locally:", settings);
        return;
    }

    localStorage.setItem('calculatorSettings', JSON.stringify(settings)); // Optional fallback
    db.collection("userSettings").doc(user.uid).set(settings)
        .then(() => console.log("Settings saved to Firestore"))
        .catch((err) => console.error("Firestore save failed:", err));

    calculateProgramValues();

    const savedMessage = document.getElementById('savedMessage');
    if (savedMessage) {
        savedMessage.style.opacity = '1';
        savedMessage.style.transition = 'opacity 0.5s ease-in-out';
    }

    setTimeout(() => {
        if (savedMessage) savedMessage.style.opacity = '0';
    }, 1500);
}


function loadSettings(reloadSection2 = false) {
    const user = firebase.auth().currentUser;

    const applySettings = (savedSettings) => {
        if (!savedSettings) return;

        if (!reloadSection2) {
            savedSettings.options?.forEach(setting => {
                const input = document.getElementById(setting.id);
                if (input) input.checked = setting.enabled;
            });

            savedSettings.names?.forEach(setting => {
                const input = document.getElementById(setting.id);
                if (input) input.value = setting.value;
            });

            savedSettings.values?.forEach(setting => {
                const input = document.getElementById(setting.id);
                if (input) input.value = setting.value;
            });

            generateDiscountInputs();
        }

        setTimeout(() => {
            if (savedSettings.section2Values) {
                Object.keys(savedSettings.section2Values).forEach(id => {
                    const input = document.getElementById(id);
                    if (input) {
                        input.type === "checkbox"
                            ? input.checked = savedSettings.section2Values[id]
                            : input.value = savedSettings.section2Values[id];
                    }
                });
            }
        }, 100);

        console.log(`Settings ${reloadSection2 ? "for Section 2" : "fully"} loaded successfully!`);
    };

    if (user) {
        db.collection("userSettings").doc(user.uid).get()
            .then(doc => {
                if (doc.exists) {
                    applySettings(doc.data());
                } else {
                    console.log("No Firestore settings found. Falling back to localStorage.");
                    const localSettings = JSON.parse(localStorage.getItem('calculatorSettings'));
                    applySettings(localSettings);
                }
            })
            .catch(err => {
                console.error("Error fetching Firestore settings:", err);
                const localSettings = JSON.parse(localStorage.getItem('calculatorSettings'));
                applySettings(localSettings);
            });
    } else {
        const localSettings = JSON.parse(localStorage.getItem('calculatorSettings'));
        applySettings(localSettings);
    }
}


function generateDiscountInputs() {
    const user = firebase.auth().currentUser;
    const useFirestore = !!user;

    const programs = [
        { containerId: 'basicDiscountsContainer', prefix: 'basic' },
        { containerId: 'bbcDiscountsContainer', prefix: 'bbc' },
        { containerId: 'mcDiscountsContainer', prefix: 'mc' }
    ];

    const getStoredValue = async (key) => {
        if (!useFirestore) {
            return localStorage.getItem(key);
        }
        try {
            const doc = await db.collection("userSettings").doc(user.uid).get();
            return doc.exists && doc.data()?.firestoreValues?.[key];
        } catch (err) {
            console.error("Failed to load value from Firestore:", err);
            return null;
        }
    };

    const setStoredValue = (key, value) => {
        if (!useFirestore) {
            localStorage.setItem(key, value);
        } else {
            db.collection("userSettings").doc(user.uid).set({
                firestoreValues: { [key]: value }
            }, { merge: true });
        }
    };

    programs.forEach(program => {
        const container = document.getElementById(program.containerId);
        container.innerHTML = "";

        document.querySelectorAll('.settings input[type="checkbox"]').forEach(async (checkbox, index) => {
            if (checkbox.checked) {
                const optionName = document.getElementById(`basicOption${index + 1}Name`).value;
                const omitId = `${program.prefix}_omit_option_${index + 1}`;
                const discountId = `${program.prefix}_discount_${index + 1}`;
                const downId = `${program.prefix}_downpayment_${index + 1}`;

                const optionWrapper = document.createElement('div');
                optionWrapper.className = "option-container";

                const omitContainer = document.createElement('div');
                omitContainer.className = "omit-container";

                const omitCheckbox = document.createElement('input');
                omitCheckbox.type = "checkbox";
                omitCheckbox.id = omitId;
                omitCheckbox.checked = (await getStoredValue(omitId)) === "false" ? false : true;

                omitCheckbox.addEventListener('change', () => {
                    setStoredValue(omitId, omitCheckbox.checked);
                    generateDiscountInputs(); // Re-render UI
                });

                const omitLabel = document.createElement('label');
                omitLabel.setAttribute("for", omitId);

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
            }
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    generateDiscountInputs();

    if (document.getElementById('bTotalProgramValue')) {
        calculateProgramValues();
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', calculateProgramValues);
        });
    }

    // Toggle sections
    const buttons = document.querySelectorAll(".subNav-button");
    const sections = document.querySelectorAll(".content-section");

    document.getElementById("section1").classList.add("active");
    document.querySelector('[data-target="section1"]').classList.add("active");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const target = this.getAttribute("data-target");

            sections.forEach(section => section.classList.remove("active"));
            document.getElementById(target).classList.add("active");

            buttons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Dynamically update inputs when checkboxes are toggled
    document.querySelectorAll('.settings input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', generateDiscountInputs);
    });
});
