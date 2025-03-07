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
        section2Values: {}  // Store Section 2 inputs separately
    };

    // Save Section 2 (Holiday Sale) inputs
    document.querySelectorAll('#section2 input').forEach(input => {
        settings.section2Values[input.id] = input.type === "checkbox" ? input.checked : input.value;
    });

    localStorage.setItem('calculatorSettings', JSON.stringify(settings));

    console.log("Settings saved:", settings);

    calculateProgramValues();

    // Show "Saved" message
    const savedMessage = document.getElementById('savedMessage');
    if (savedMessage) {
        savedMessage.style.opacity = '1';
        savedMessage.style.transition = 'opacity 0.5s ease-in-out';
    }

    setTimeout(() => {
        if (savedMessage) {
            savedMessage.style.opacity = '0';
        }
    }, 1500);
}




function loadSettings(reloadSection2 = false) {
    const savedSettings = JSON.parse(localStorage.getItem('calculatorSettings'));
    if (!savedSettings) return;

    // Load standard checkboxes and text inputs (only if NOT reloading Section 2)
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

        generateDiscountInputs(); // Load dynamically generated inputs
    }

    // Load Section 2 settings after ensuring the DOM is ready
    setTimeout(() => {
        if (savedSettings.section2Values) {
            Object.keys(savedSettings.section2Values).forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    if (input.type === "checkbox") {
                        input.checked = savedSettings.section2Values[id];
                    } else {
                        input.value = savedSettings.section2Values[id];
                    }
                }
            });
        }
    }, 100); // Ensure Section 2 elements exist

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
        container.innerHTML = ""; // Clear previous inputs

        document.querySelectorAll('.settings input[type="checkbox"]').forEach((checkbox, index) => {
            if (checkbox.checked) {
                const optionName = document.getElementById(`basicOption${index + 1}Name`).value;
                const optionId = `${program.prefix}_omit_option_${index + 1}`; // Unique ID for omission

                // Create wrapper with flexbox
                const optionWrapper = document.createElement('div');
                optionWrapper.className = "option-container";

                // Left-side: Omit Checkbox & Label
                const omitContainer = document.createElement('div');
                omitContainer.className = "omit-container";

                const omitCheckbox = document.createElement('input');
                omitCheckbox.type = "checkbox";
                omitCheckbox.id = optionId;
                
                // Check localStorage for saved state, default to checked if not found
                omitCheckbox.checked = localStorage.getItem(optionId) === null ? true : localStorage.getItem(optionId) === "true";
                
                // Save state when checkbox is changed
                omitCheckbox.addEventListener('change', () => {
                    localStorage.setItem(optionId, omitCheckbox.checked);
                    generateDiscountInputs(); // Refresh display
                });
                
                omitCheckbox.addEventListener('change', () => {
                    localStorage.setItem(optionId, omitCheckbox.checked);
                    generateDiscountInputs(); // Refresh display
                });

                const omitLabel = document.createElement('label');
                omitLabel.setAttribute("for", optionId);                

                omitContainer.appendChild(omitCheckbox);
                omitContainer.appendChild(omitLabel);

                // Right-side: Discount and Payment Inputs
                const inputContainer = document.createElement('div');
                inputContainer.className = "input-container";

                // Apply (Paid In Full) only for the first option
                const discountLabel = document.createElement('label');
                discountLabel.innerHTML = index === 0 
                    ? `<strong>${optionName}</strong> Discount (Paid In Full) %` 
                    : `<strong>${optionName}</strong> Discount %`;

                const discountInput = document.createElement('input');
                discountInput.type = "number";
                discountInput.id = `${program.prefix}_discount_${index + 1}`;
                discountInput.value = localStorage.getItem(discountInput.id) || "";
                discountInput.className = "discount-input";
                discountInput.min = 0;  // Set minimum value to 0
                discountInput.max = 100; // Set maximum value to 100

                // Enforce min/max on input change
                discountInput.addEventListener('input', () => {
                    let value = parseFloat(discountInput.value);
                    
                    if (isNaN(value)) {
                        value = 0;
                    } else if (value < 0) {
                        value = 0;
                    } else if (value > 100) {
                        value = 100;
                    }
                    
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

                // Hide inputs if omitted
                if (omitCheckbox.checked) {
                    inputContainer.appendChild(discountLabel);
                    inputContainer.appendChild(discountInput);
                    inputContainer.appendChild(paymentLabel);
                    inputContainer.appendChild(paymentInput);
                }

                // Apply flex styling
                optionWrapper.appendChild(omitContainer);
                optionWrapper.appendChild(inputContainer);
                // Append to container (before the separator)
                container.appendChild(optionWrapper);

                // Add separator line only if it's not the last element
                const separator = document.createElement('hr');
                separator.className = "option-separator";
                container.appendChild(separator);


                // Append to container
                container.appendChild(optionWrapper);

                // Save values to localStorage on input change
                [discountInput, paymentInput].forEach(input => {
                    input.addEventListener('input', () => {
                        localStorage.setItem(input.id, input.value);
                    });
                });
            }
        });
    });
}


// Attach event listeners to checkboxes to dynamically update inputs
document.querySelectorAll('.settings input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', generateDiscountInputs);
});

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    generateDiscountInputs(); // Run on page load

    // Only run calculations if on the settings page
    if (document.getElementById('bTotalProgramValue')) {
       calculateProgramValues();

        // Attach event listeners to recalculate on input change
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', calculateProgramValues);
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".subNav-button");
    const sections = document.querySelectorAll(".content-section");

    // Set Section 1 and its button as the default active elements
    document.getElementById("section1").classList.add("active");
    document.querySelector('[data-target="section1"]').classList.add("active");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const target = this.getAttribute("data-target");

            // Hide all sections
            sections.forEach(section => section.classList.remove("active"));

            // Show the selected section
            document.getElementById(target).classList.add("active");

            // Remove active class from all buttons
            buttons.forEach(btn => btn.classList.remove("active"));

            // Add active class to the clicked button
            this.classList.add("active");
        });
    });
});


