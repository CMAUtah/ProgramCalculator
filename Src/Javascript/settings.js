
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

    // Recalculate program values after saving
    calculateProgramValues();

    // Show "Saved" message
    const savedMessage = document.getElementById('savedMessage');
    savedMessage.style.opacity = '1';
    savedMessage.style.transition = 'opacity 1s ease-in-out';

    // Fade out after 1.5 seconds
    setTimeout(() => {
        savedMessage.style.opacity = '0';
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

    // Calculate total program values after settings are loaded
    calculateProgramValues();
}

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

        // Format with commas and always show .00
        document.getElementById(program.totalId).textContent = `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    });
}


document.addEventListener('DOMContentLoaded', () => {
    loadSettings();

    // Attach event listeners to recalculate on input change
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', calculateProgramValues);
    });
});

