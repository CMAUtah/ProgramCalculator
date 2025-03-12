// Ensure script runs only after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    function getPageKey() {
        return window.location.pathname;
    }
    // Save and retrieve input values and span values for all relevant elements
    const inputElements = document.querySelectorAll('input[type="text"]');
    const spanElements = document.querySelectorAll('span');

    // Save input values to localStorage when they change
    inputElements.forEach(function (inputElement) {
        inputElement.addEventListener('input', function () {
            const pageKey = getPageKey();
            const inputId = inputElement.id;
            localStorage.setItem(`${inputId}_${pageKey}`, this.value);
        });
    });

    // Retrieve saved input values from localStorage and populate the inputs on page load
    inputElements.forEach(function (inputElement) {
        const pageKey = getPageKey();
        const inputId = inputElement.id;
        if (localStorage.getItem(`${inputId}_${pageKey}`)) {
            inputElement.value = localStorage.getItem(`${inputId}_${pageKey}`);
        }
    });

    // Retrieve saved span values from localStorage and populate the spans on page load
    spanElements.forEach(function (spanElement) {
        const pageKey = getPageKey();
        const spanId = spanElement.id;
        if (localStorage.getItem(`${spanId}_${pageKey}`)) {
            spanElement.textContent = localStorage.getItem(`${spanId}_${pageKey}`);
        }
    });

    // Select input elements
    const amountPaid1 = document.getElementById('amountPaid');
    const amountPaid2 = document.getElementById('amountPaid1');
    const programEndDate = document.getElementById('programEndDate');
    const currentProgramLength = document.getElementById('currentProgramLength');
    const dateFrom = document.getElementById('dateFrom');
    const timeLeft = document.getElementById('timeLeft');
    const legacyCredit = document.getElementById('legacyCredit');
    const calculateButton = document.getElementById('calculateButton');
    const legacyDown = document.getElementById('legacyDown');
    const discountedAmountA = document.getElementById('discountedAmountA');

    // Ensure elements exist before adding event listeners
    function addInputListener(element) {
        if (element) element.addEventListener('input', calculateCredit);
    }

    addInputListener(amountPaid1);
    addInputListener(amountPaid2);
    addInputListener(programEndDate);
    addInputListener(currentProgramLength);
    addInputListener(dateFrom);

    if (calculateButton) {
        calculateButton.addEventListener("click", function () {
            calculateCredit();
            calculateDiscount();
        });
    }

    function getNumericValue(id) {
        const element = document.getElementById(id);
        if (!element) return 0;
        const value = element.value ? element.value : element.textContent;
        return parseFloat(value.replace(/[$,]/g, '').trim()) || 0;
    }

    function calculateCredit() {

        // Ensure elements exist before accessing them
        if (!amountPaid1 || !amountPaid2 || !legacyCredit || !timeLeft) {
            console.error("One or more required elements are missing from the DOM.");
            return;
        }

        let amountPaidInput1 = getNumericValue('amountPaid');
        let amountPaidInput2 = getNumericValue('amountPaid1');
        const amountPaid = amountPaidInput1 + amountPaidInput2;

        let programEndDateInput = programEndDate?.value.trim() || "";
        let currentProgramLengthInput = currentProgramLength?.value.trim() || "";
        let dateFromInput = dateFrom?.value.trim() || "";

        let creditAmount = Math.abs(amountPaid);
        let timeLeftInMonths = 0;
        let timeLeftInDays = 0;

        if (programEndDateInput !== '') {
            const programEndDateValue = new Date(programEndDateInput);
            const currentDate = dateFromInput ? new Date(dateFromInput) : new Date();

            const timeLeftInMilliseconds = programEndDateValue - currentDate;
            timeLeftInDays = Math.ceil(timeLeftInMilliseconds / (1000 * 60 * 60 * 24));
            timeLeftInMonths = timeLeftInDays / 30.44; // Approximate average month length
        }

        if (currentProgramLengthInput !== '') {
            const currentProgramLengthValue = parseFloat(currentProgramLengthInput);
            creditAmount = (!isNaN(amountPaid) && !isNaN(currentProgramLengthValue)) ? 
                (Math.abs(amountPaid) / currentProgramLengthValue) * timeLeftInMonths : 0;
        }

        // Update the UI with the calculated values
        timeLeft.textContent = `${timeLeftInMonths.toFixed(2)} months (${timeLeftInDays} days)`;
        legacyCredit.textContent = Number(creditAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        return creditAmount;
    }

    function calculateDiscount() {

        const totalCost = getNumericValue('legacyDown');
        const creditAmount = getNumericValue('legacyCredit');


        if (isNaN(totalCost) || isNaN(creditAmount)) {
            discountedAmountA.textContent = 'Invalid input';
            return;
        }

        const discountedAmount = totalCost - creditAmount;

        legacyOutput.textContent = Number(discountedAmount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    }
    
    
});


function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error("Element not found:", elementId);
        return;
    }

    const textToCopy = element.textContent.trim();

    if (!textToCopy) {
        console.warn("Nothing to copy from:", elementId);
        return;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
    }).catch(err => {
        console.error("Failed to copy text:", err);
    });
}


