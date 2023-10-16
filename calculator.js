// Function to generate a unique key based on the current page's URL
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




// JavaScript for calculations
document.getElementById('amountPaid').addEventListener('input', calculateCredit);
document.getElementById('programEndDate').addEventListener('input', calculateCredit);
document.getElementById('currentProgramLength').addEventListener('input', calculateCredit);
document.getElementById('programLength').addEventListener('input', calculateTotalProgramValue);
document.getElementById('baseMonthlyPayment').addEventListener('input', calculateTotalProgramValue);
document.getElementById('baseDownPayment').addEventListener('input', calculateTotalProgramValue);

// Add event listeners for the discount values for Options A, B, C, and D
document.getElementById('discountValueA').addEventListener('input', calculateDiscountA);
document.getElementById('discountValueB').addEventListener('input', calculateDiscountB);
document.getElementById('discountValueC').addEventListener('input', calculateDiscountC);
document.getElementById('discountValueD').addEventListener('input', calculateDiscountD);

// Add an event listener to the "Calculate" button at the top
document.getElementById('calculateButton').addEventListener('click', function () {
    // Trigger all calculations when the button is clicked
    calculateCredit();
    calculateTotalProgramValue();
    calculateDiscountA();
    calculateDiscountB();
    calculateDiscountC();
    calculateDiscountD();
    calculateOption1();
    calculateOption2();
    calculateOption3();
    calculateOption4();
});

const modeSwitch = document.getElementById('modeSwitch');
const regularCalculator = document.getElementById('regularCalculator');
const christmasEventCalculator = document.getElementById('christmasEventCalculator');

// Function to toggle display based on mode switch
function toggleCalculatorDisplay() {
    if (modeSwitch.checked) {
        // Christmas Event Mode is selected
        regularCalculator.style.display = 'none';
        christmasEventCalculator.style.display = 'block';
    } else {
        // Regular Mode is selected
        regularCalculator.style.display = 'block';
        christmasEventCalculator.style.display = 'none';
    }
}

// Add event listener for the mode switch
modeSwitch.addEventListener('change', toggleCalculatorDisplay);

// Call the toggle function initially to set the correct display
toggleCalculatorDisplay();


function calculateCredit() {
    const amountPaid = parseFloat(document.getElementById('amountPaid').value);
    const programEndDateInput = document.getElementById('programEndDate').value.trim();
    const currentProgramLengthInput = document.getElementById('currentProgramLength').value.trim();
    const programLength = parseFloat(document.getElementById('programLength').value);

    let creditAmount = amountPaid; // Default to amountPaid
    let timeLeftInMonths = 0;
    let timeLeftInDays = 0;

    if (programEndDateInput !== '') {
        const programEndDate = new Date(programEndDateInput);
        const currentDate = new Date();
        const timeLeftInMilliseconds = programEndDate - currentDate;
        timeLeftInDays = Math.ceil(timeLeftInMilliseconds / (1000 * 60 * 60 * 24));
        timeLeftInMonths = timeLeftInDays / 30.44; // An average month is approximately 30.44 days
    }

    if (currentProgramLengthInput !== '') {
        const currentProgramLength = parseFloat(currentProgramLengthInput);
        creditAmount = (amountPaid / currentProgramLength) * timeLeftInMonths;
    }

    // Calculate monthly credit by dividing creditAmount by programLength
    let monthlyCredit = creditAmount / programLength;

    // Update the "Time Left in Program" span with both time left in months and days
    document.getElementById('timeLeft').textContent = timeLeftInMonths.toFixed(2) + ' months (' + timeLeftInDays + ' days)';

    // Update the monthly credit and credit amount with the calculated values
    document.getElementById('monthlyCredit').textContent = monthlyCredit.toFixed(2);
    document.getElementById('creditAmount').textContent = creditAmount.toFixed(2);
}







function calculateTotalProgramValue() {
    const programLength = parseInt(document.getElementById('programLength').value);
    const baseMonthlyPayment = parseFloat(document.getElementById('baseMonthlyPayment').value);
    const baseDownPayment = parseFloat(document.getElementById('baseDownPayment').value);

    if (!isNaN(programLength) && !isNaN(baseMonthlyPayment) && !isNaN(baseDownPayment)) {
        const totalProgramValue = (programLength * baseMonthlyPayment) + baseDownPayment;
        document.getElementById('totalProgramValue').textContent = totalProgramValue.toFixed(2);
    } else {
        document.getElementById('totalProgramValue').textContent = 'Invalid input';
    }
}

function calculateDiscountA() {
    const programLength = parseInt(document.getElementById('programLength').value);
    const baseMonthlyPayment = parseFloat(document.getElementById('baseMonthlyPayment').value);
    const baseDownPayment = parseFloat(document.getElementById('baseDownPayment').value);
    const discountPercentage = parseFloat(document.getElementById('discountValueA').value);
    const creditAmount = parseFloat(document.getElementById('creditAmount').textContent);

    if (!isNaN(programLength) && !isNaN(baseMonthlyPayment) && !isNaN(baseDownPayment) && !isNaN(discountPercentage) && !isNaN(creditAmount)) {
        const discountedAmountA = (((baseMonthlyPayment * programLength) + baseDownPayment) * (1 - (discountPercentage / 100))) - creditAmount;
        document.getElementById('discountedAmountA').textContent = discountedAmountA.toFixed(2);
    } else {
        document.getElementById('discountedAmountA').textContent = 'Invalid input';
    }
}


// Function to calculate Option B discount
function calculateDiscountB() {
    const programLength = parseInt(document.getElementById('programLength').value);
    const baseMonthlyPayment = parseFloat(document.getElementById('baseMonthlyPayment').value);
    const baseDownPayment = parseFloat(document.getElementById('baseDownPayment').value);
    const discountValueB = parseFloat(document.getElementById('discountValueB').value);
    const downPaymentB = parseFloat(document.getElementById('downPaymentB').value);
    const creditAmount = parseFloat(document.getElementById('creditAmount').textContent);
    const monthlyCredit = parseFloat(document.getElementById('monthlyCredit').textContent);

    if (!isNaN(programLength) && !isNaN(baseMonthlyPayment) && !isNaN(baseDownPayment) && !isNaN(discountValueB) && !isNaN(downPaymentB) && !isNaN(creditAmount) && !isNaN(monthlyCredit) && programLength !== 0) {
        const totalValueBeforeDiscount = (baseMonthlyPayment * programLength) + baseDownPayment;
        const discountedValue = totalValueBeforeDiscount - (totalValueBeforeDiscount * (discountValueB / 100)) - downPaymentB;
        const discountedAmountB = (discountedValue / programLength) - monthlyCredit; // Include division by program length and subtraction of monthly credit
        document.getElementById('discountedAmountB').textContent = discountedAmountB.toFixed(2);
    } else {
        document.getElementById('discountedAmountB').textContent = 'Invalid input';
    }
}




// Function to calculate Option C discount
function calculateDiscountC() {
    const programLength = parseInt(document.getElementById('programLength').value);
    const baseMonthlyPayment = parseFloat(document.getElementById('baseMonthlyPayment').value);
    const baseDownPayment = parseFloat(document.getElementById('baseDownPayment').value);
    const discountValueC = parseFloat(document.getElementById('discountValueC').value);
    const downPaymentC = parseFloat(document.getElementById('downPaymentC').value);
    const creditAmount = parseFloat(document.getElementById('creditAmount').textContent);
    const monthlyCredit = parseFloat(document.getElementById('monthlyCredit').textContent);

    if (!isNaN(programLength) && !isNaN(baseMonthlyPayment) && !isNaN(baseDownPayment) && !isNaN(discountValueC) && !isNaN(downPaymentC) && !isNaN(creditAmount) && !isNaN(monthlyCredit) && programLength !== 0) {
        const totalValueBeforeDiscount = (baseMonthlyPayment * programLength) + baseDownPayment;
        const discountedValue = totalValueBeforeDiscount - (totalValueBeforeDiscount * (discountValueC / 100)) - downPaymentC;
        const discountedAmountC = (discountedValue / programLength) - monthlyCredit;
        document.getElementById('discountedAmountC').textContent = discountedAmountC.toFixed(2);
    } else {
        document.getElementById('discountedAmountC').textContent = 'Invalid input';
    }
}



// Function to calculate Option D discount
function calculateDiscountD() {
    const programLength = parseInt(document.getElementById('programLength').value);
    const baseMonthlyPayment = parseFloat(document.getElementById('baseMonthlyPayment').value);
    const baseDownPayment = parseFloat(document.getElementById('baseDownPayment').value);
    const discountValueD = parseFloat(document.getElementById('discountValueD').value);
    const downPaymentD = parseFloat(document.getElementById('downPaymentD').value);
    const creditAmount = parseFloat(document.getElementById('creditAmount').textContent);
    const monthlyCredit = parseFloat(document.getElementById('monthlyCredit').textContent);

    if (!isNaN(programLength) && !isNaN(baseMonthlyPayment) && !isNaN(baseDownPayment) && !isNaN(discountValueD) && !isNaN(downPaymentD) && !isNaN(creditAmount) && !isNaN(monthlyCredit) && programLength !== 0) {
        const totalValueBeforeDiscount = (baseMonthlyPayment * programLength) + baseDownPayment;
        const discountedValue = totalValueBeforeDiscount - (totalValueBeforeDiscount * (discountValueD / 100)) - downPaymentD;
        const discountedAmountD = (discountedValue / programLength) - monthlyCredit;
        document.getElementById('discountedAmountD').textContent = discountedAmountD.toFixed(2);
    } else {
        document.getElementById('discountedAmountD').textContent = 'Invalid input';
    }
}

// Holiday Event-------------------------------------------------------------------------------------
const holidayOptionOneInput = document.getElementById('holidayOptionOne');
const holidayOptionTwoInput = document.getElementById('holidayOptionTwo');
const holidayOptionThreeInput = document.getElementById('holidayOptionThree');
const holidayOptionFourInput = document.getElementById('holidayOptionFour');

holidayOptionOneInput.addEventListener('input', calculateOption1);
holidayOptionTwoInput.addEventListener('input', calculateOption2);
holidayOptionThreeInput.addEventListener('input', calculateOption3);
holidayOptionFourInput.addEventListener('input', calculateOption4);


// Function to calculate Option 1
function calculateOption1() {
    const holidayEventDiscountInput = document.getElementById('holidayEventDiscount');
    const option1ResultSpan = document.getElementById('holidayDiscountOneResult'); // Updated ID here
    const programLength = parseInt(document.getElementById('programLength').value);
    const baseMonthlyPayment = parseFloat(document.getElementById('baseMonthlyPayment').value);
    const baseDownPayment = parseFloat(document.getElementById('baseDownPayment').value);
    const holidayOptionOne = parseFloat(document.getElementById('holidayOptionOne').value); // Get the value of "holidayOptionOne" from the input field
    const holidayEventDiscount = parseFloat(holidayEventDiscountInput.value);
    const creditAmount = parseFloat(document.getElementById('creditAmount').textContent);

    if (!isNaN(holidayOptionOne) && !isNaN(holidayEventDiscount)) {
        // Calculate Option 1 based on the provided formula
        const discountedAmount = ((holidayOptionOne * baseMonthlyPayment) + (baseDownPayment / (programLength / holidayOptionOne))) * (1 - (holidayEventDiscount / 100));
        const finalValue = (discountedAmount - creditAmount)

        // Display the result for Option 1 within the "holidayDiscountOneResult" span
        option1ResultSpan.textContent = ' ' + discountedAmount.toFixed(2) + " - Credit = " + finalValue.toFixed(2);
    } else {
        // If invalid input, clear the result within the "holidayDiscountOneResult" span
        option1ResultSpan.textContent = '';
    }
}

// Function to calculate Option 2
function calculateOption2() {
    const holidayEventDiscountInput = document.getElementById('holidayEventDiscount');
    const option2ResultSpan = document.getElementById('holidayDiscountTwoResult');
    const programLength = parseInt(document.getElementById('programLength').value);
    const baseMonthlyPayment = parseFloat(document.getElementById('baseMonthlyPayment').value);
    const baseDownPayment = parseFloat(document.getElementById('baseDownPayment').value);
    const holidayOptionTwo = parseFloat(document.getElementById('holidayOptionTwo').value);
    const holidayEventDiscount = parseFloat(holidayEventDiscountInput.value);
    const creditAmount = parseFloat(document.getElementById('creditAmount').textContent);

    if (!isNaN(holidayOptionTwo) && !isNaN(holidayEventDiscount)) {
        const discountedAmount = ((holidayOptionTwo * baseMonthlyPayment) + (baseDownPayment / (programLength / holidayOptionTwo))) * (1 - (holidayEventDiscount / 100));
        option2ResultSpan.textContent = ' ' + discountedAmount.toFixed(2);
        const finalValue = (discountedAmount - creditAmount)
        option2ResultSpan.textContent = ' ' + discountedAmount.toFixed(2) + " - Credit = " + finalValue.toFixed(2);

    } else {
        option2ResultSpan.textContent = '';
    }
}

// Function to calculate Option 3
function calculateOption3() {
    const holidayEventDiscountInput = document.getElementById('holidayEventDiscount');
    const option3ResultSpan = document.getElementById('holidayDiscountThreeResult');
    const programLength = parseInt(document.getElementById('programLength').value);
    const baseMonthlyPayment = parseFloat(document.getElementById('baseMonthlyPayment').value);
    const baseDownPayment = parseFloat(document.getElementById('baseDownPayment').value);
    const holidayOptionThree = parseFloat(document.getElementById('holidayOptionThree').value);
    const holidayEventDiscount = parseFloat(holidayEventDiscountInput.value);
    const creditAmount = parseFloat(document.getElementById('creditAmount').textContent);

    if (!isNaN(holidayOptionThree) && !isNaN(holidayEventDiscount)) {
        const discountedAmount = ((holidayOptionThree * baseMonthlyPayment) + (baseDownPayment / (programLength / holidayOptionThree))) * (1 - (holidayEventDiscount / 100));
        option3ResultSpan.textContent = ' ' + discountedAmount.toFixed(2);
        const finalValue = (discountedAmount - creditAmount)
        option3ResultSpan.textContent = ' ' + discountedAmount.toFixed(2) + " - Credit = " + finalValue.toFixed(2);

    } else {
        option3ResultSpan.textContent = '';
    }
}

// Function to calculate Option 4
function calculateOption4() {
    const holidayEventDiscountInput = document.getElementById('holidayEventDiscount');
    const option4ResultSpan = document.getElementById('holidayDiscountFourResult');
    const programLength = parseInt(document.getElementById('programLength').value);
    const baseMonthlyPayment = parseFloat(document.getElementById('baseMonthlyPayment').value);
    const baseDownPayment = parseFloat(document.getElementById('baseDownPayment').value);
    const holidayOptionFour = parseFloat(document.getElementById('holidayOptionFour').value);
    const holidayEventDiscount = parseFloat(holidayEventDiscountInput.value);
    const creditAmount = parseFloat(document.getElementById('creditAmount').textContent);

    if (!isNaN(holidayOptionFour) && !isNaN(holidayEventDiscount)) {
        const discountedAmount = ((holidayOptionFour * baseMonthlyPayment) + (baseDownPayment / (programLength / holidayOptionFour))) * (1 - (holidayEventDiscount / 100));
        option4ResultSpan.textContent = ' ' + discountedAmount.toFixed(2);
        const finalValue = (discountedAmount - creditAmount)
        option4ResultSpan.textContent = ' ' + discountedAmount.toFixed(2) + " - Credit = " + finalValue.toFixed(2);

    } else {
        option4ResultSpan.textContent = '';
    }
}