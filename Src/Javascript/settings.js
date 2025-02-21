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
        }))
    };
    
    localStorage.setItem('calculatorSettings', JSON.stringify(settings));

    // Debug: Confirm settings are saved
    console.log('Settings saved:', settings);

    // Recalculate program values after saving
    calculateProgramValues();

    // Debug: Check if the function runs
    console.log("Save Settings clicked!");

    // Show "Saved" message
    const savedMessage = document.getElementById('savedMessage');
    if (savedMessage) {
        savedMessage.style.opacity = '1';
        savedMessage.style.transition = 'opacity 0.5s ease-in-out';
    } else {
        console.error('Saved message element not found!');
    }

    // Fade out after 1.5 seconds
    setTimeout(() => {
        if (savedMessage) {
            savedMessage.style.opacity = '0';
        }
    }, 1500);
}



function loadSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('calculatorSettings'));
    if (!savedSettings) return;

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

    // Generate discount/downpayment inputs based on loaded settings
    generateDiscountInputs();
}

// Generalized Function to Dynamically Generate Discount Inputs for All Programs
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

                // Create wrapper for the inputs
                const optionWrapper = document.createElement('div');
                optionWrapper.className = "option-container";

                const isOption1 = index === 0;

                // Discount Label
                const discountLabel = document.createElement('label');
                discountLabel.innerHTML = isOption1 
                    ? `<strong>${optionName}</strong> Discount (Paid In Full) %`
                    : `<strong>${optionName}</strong> Discount %`;

                // Discount Input
                const discountInput = document.createElement('input');
                discountInput.type = "number";
                discountInput.id = `${program.prefix}_discount_${index + 1}`;
                discountInput.value = localStorage.getItem(discountInput.id) || "";
                discountInput.className = "discount-input";

                // Payment Label
                const paymentLabel = document.createElement('label');
                paymentLabel.innerHTML = isOption1 
                    ? `<strong>${optionName}</strong> Payment`
                    : `<strong>${optionName}</strong> Downpayment`;

                // Payment Input
                const paymentInput = document.createElement('input');
                paymentInput.type = "number";
                paymentInput.id = isOption1 
                    ? `${program.prefix}_payment_${index + 1}` 
                    : `${program.prefix}_downpayment_${index + 1}`;
                paymentInput.value = localStorage.getItem(paymentInput.id) || "";
                paymentInput.className = "downpayment-input";

                // Append to wrapper
                optionWrapper.appendChild(discountLabel);
                optionWrapper.appendChild(discountInput);
                optionWrapper.appendChild(paymentLabel);
                optionWrapper.appendChild(paymentInput);

                // Add separator line
                const separator = document.createElement('hr');
                separator.className = "option-separator";
                optionWrapper.appendChild(separator);

                // Append to the program's container
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

