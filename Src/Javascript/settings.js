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

    localStorage.setItem('calculatorSettings', JSON.stringify(settings));
    console.log("Settings saved:", settings);
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
    const savedSettings = JSON.parse(localStorage.getItem('calculatorSettings'));
    if (!savedSettings) return;

    if (!reloadSection2) {
        savedSettings.options.forEach(setting => {
            const input = document.getElementById(setting.id);
            if (input) input.checked = setting.enabled;
        });

        savedSettings.names.forEach(setting => {
            const input = document.getElementById(setting.id);
            if (input) input.value = setting.value;
        });

        savedSettings.values.forEach(setting => {
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
}

function generateDiscountInputs() {
    const programs = [
        { containerId: 'basicDiscountsContainer', prefix: 'basic' },
        { containerId: 'bbcDiscountsContainer', prefix: 'bbc' },
        { containerId: 'mcDiscountsContainer', prefix: 'mc' }
    ];

    programs.forEach(program => {
        const container = document.getElementById(program.containerId);
        container.innerHTML = "";

        document.querySelectorAll('.settings input[type="checkbox"]').forEach((checkbox, index) => {
            if (checkbox.checked) {
                const optionName = document.getElementById(`basicOption${index + 1}Name`).value;
                const optionId = `${program.prefix}_omit_option_${index + 1}`;

                const optionWrapper = document.createElement('div');
                optionWrapper.className = "option-container";

                const omitContainer = document.createElement('div');
                omitContainer.className = "omit-container";

                const omitCheckbox = document.createElement('input');
                omitCheckbox.type = "checkbox";
                omitCheckbox.id = optionId;
                omitCheckbox.checked = localStorage.getItem(optionId) === null ? true : localStorage.getItem(optionId) === "true";

                omitCheckbox.addEventListener('change', () => {
                    localStorage.setItem(optionId, omitCheckbox.checked);
                    generateDiscountInputs();
                });

                const omitLabel = document.createElement('label');
                omitLabel.setAttribute("for", optionId);

                omitContainer.appendChild(omitCheckbox);
                omitContainer.appendChild(omitLabel);

                const inputContainer = document.createElement('div');
                inputContainer.className = "input-container";

                const discountLabel = document.createElement('label');
                discountLabel.innerHTML = index === 0
                    ? `<strong>${optionName}</strong> Discount (Paid In Full) %`
                    : `<strong>${optionName}</strong> Discount %`;

                const discountInput = document.createElement('input');
                discountInput.type = "number";
                discountInput.id = `${program.prefix}_discount_${index + 1}`;
                discountInput.value = localStorage.getItem(discountInput.id) || "";
                discountInput.className = "discount-input";
                discountInput.min = 0;
                discountInput.max = 100;

                discountInput.addEventListener('input', () => {
                    let value = parseFloat(discountInput.value);
                    value = isNaN(value) ? 0 : Math.max(0, Math.min(100, value));
                    discountInput.value = value;
                    localStorage.setItem(discountInput.id, value);
                });

                const paymentLabel = document.createElement('label');
                paymentLabel.innerHTML = `<strong>${optionName}</strong> Downpayment`;

                const paymentInput = document.createElement('input');
                paymentInput.type = "number";
                paymentInput.id = `${program.prefix}_downpayment_${index + 1}`;
                paymentInput.value = localStorage.getItem(paymentInput.id) || "";
                paymentInput.className = "downpayment-input";

                if (!omitCheckbox.checked) {
                    // Just show the label with (disabled), no inputs
                    const disabledLabel = document.createElement('p');
                    disabledLabel.innerHTML = `<strong>${optionName}</strong> (disabled)`;
                    disabledLabel.className = "disabled-label";
                    inputContainer.appendChild(disabledLabel);
                } else {
                    // Show the actual inputs
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

                [discountInput, paymentInput].forEach(input => {
                    input.addEventListener('input', () => {
                        localStorage.setItem(input.id, input.value);
                    });
                });
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
