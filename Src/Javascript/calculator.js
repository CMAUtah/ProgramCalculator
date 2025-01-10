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
document.getElementById('amountPaid1').addEventListener('input', calculateCredit);
document.getElementById('programEndDate').addEventListener('input', calculateCredit);
document.getElementById('currentProgramLength').addEventListener('input', calculateCredit);
document.getElementById('programLength').addEventListener('input', calculateTotalProgramValue);
document.getElementById('dateFrom').addEventListener('input', calculateCredit);
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
    calculateOption2Basic();
    calculateOption3Basic();
    calculateOption4Basic();
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

const sliderSwitch = document.getElementById('sliderSwitch')
const calculatorInput = document.getElementById('calculatorInput')
const calculatorSlider = document.getElementById('calculatorSlider')

// function to toggle pricing slider
function toggleSliderDisplay() {
    if(sliderSwitch.checked) {
        //slider mode enabled
        calculatorInput.style.display = "none";
        calculatorSlider.style.display = "block";
    } else {
        // input mode enabled
        calculatorInput.style.display = "block";
        calculatorSlider.style.display = "none";
    }
}

// Add event listener for the mode switch
modeSwitch.addEventListener('change', toggleCalculatorDisplay);
sliderSwitch.addEventListener("change",toggleSliderDisplay);

// Call the toggle function initially to set the correct display
toggleCalculatorDisplay();
toggleSliderDisplay();


function calculateCredit() {
    let amountPaidInput1 = parseFloat(document.getElementById('amountPaid').value.replace(/[$,]/g, '').trim());
    let amountPaidInput2 = parseFloat(document.getElementById('amountPaid1').value.replace(/[$,]/g, '').trim());

    
    if (isNaN(amountPaidInput1)) {
        amountPaidInput1 = 0;
    }
    if (isNaN(amountPaidInput2)) {
        amountPaidInput2 = 0;
    }
    
    console.log(amountPaidInput1);
    console.log(amountPaidInput2);
    

    const amountPaid = amountPaidInput1 + amountPaidInput2;
    const programEndDateInput = document.getElementById('programEndDate').value.trim();
    const currentProgramLengthInput = document.getElementById('currentProgramLength').value.trim();
    const programLength = parseFloat(document.getElementById('programLength').value);
    const dateFromInput = document.getElementById('dateFrom').value.trim();


    let creditAmount = !isNaN(amountPaid) ? Math.abs(amountPaid) : 0; // Set to 0 if not a number or empty

    let timeLeftInMonths = 0;
    let timeLeftInDays = 0;

    if (programEndDateInput !== '') {
        const programEndDate = new Date(programEndDateInput);
        const currentDate = dateFromInput ? new Date(dateFromInput) : new Date();

        const timeLeftInMilliseconds = programEndDate - currentDate;
        timeLeftInDays = Math.ceil(timeLeftInMilliseconds / (1000 * 60 * 60 * 24));
        timeLeftInMonths = timeLeftInDays / 30.44; // An average month is approximately 30.44 days
    }

    if (currentProgramLengthInput !== '') {
        const currentProgramLength = parseFloat(currentProgramLengthInput);
        creditAmount = (!isNaN(amountPaid) && !isNaN(currentProgramLength)) ? (Math.abs(amountPaid) / currentProgramLength) * timeLeftInMonths : 0;
    }

    let monthlyCredit = (!isNaN(programLength) && programLength !== 0) ? creditAmount / programLength : 0;


    document.getElementById('timeLeft').textContent = timeLeftInMonths.toFixed(2) + ' months (' + timeLeftInDays + ' days)';
    document.getElementById('monthlyCredit').textContent =
    Number(monthlyCredit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    document.getElementById('creditAmount').textContent =
    Number(creditAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return creditAmount;
}




function calculateTotalProgramValue() {
    const programLength = parseInt(document.getElementById('programLength').value);
    const baseMonthlyPayment = parseFloat(document.getElementById('baseMonthlyPayment').value);
    const baseDownPayment = parseFloat(document.getElementById('baseDownPayment').value);

    if (!isNaN(programLength) && !isNaN(baseMonthlyPayment) && !isNaN(baseDownPayment)) {
        const totalProgramValue = (programLength * baseMonthlyPayment) + baseDownPayment;
        document.getElementById('totalProgramValue').textContent =  Number(totalProgramValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
        document.getElementById('totalProgramValue').textContent = 'Invalid input';
    }
}

// Helper to parse and sanitize numeric input
function getNumericValue(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID "${elementId}" not found.`);
        return null;
    }
    const value = element.value ? element.value.replace(/[$,]/g, '') : element.textContent.replace(/[$,]/g, '');
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
        console.error(`Invalid input for element: ${elementId} - Value: "${value}"`);
        return null;
    }
    return numericValue;
}

// Generic discount calculation function
function calculateDiscount(option) {
    // Handle unique logic for Discount A
    if (option === 'A') {
        const programLength = getNumericValue('programLength');
        const baseMonthlyPayment = getNumericValue('baseMonthlyPayment');
        const baseDownPayment = getNumericValue('baseDownPayment');
        const discountPercentage = getNumericValue('discountValueA');
        const creditAmount = getNumericValue('creditAmount');

        if (
            programLength === null ||
            baseMonthlyPayment === null ||
            baseDownPayment === null ||
            discountPercentage === null ||
            creditAmount === null
        ) {
            document.getElementById('discountedAmountA').textContent = 'Invalid input';
            return;
        }

        const totalCost = (baseMonthlyPayment * programLength) + baseDownPayment;
        const discountedAmountA = (totalCost * (1 - discountPercentage / 100)) - creditAmount;

        document.getElementById('discountedAmountA').textContent = Number(discountedAmountA).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return;
    }

    // Handle general logic for B, C, and D
    const programLength = getNumericValue('programLength');
    const baseMonthlyPayment = getNumericValue('baseMonthlyPayment');
    const baseDownPayment = getNumericValue('baseDownPayment');
    const discountValueId = `discountValue${option}`;
    const downPaymentId = `downPayment${option}`;
    const discountedAmountId = `discountedAmount${option}`;

    const discountValue = getNumericValue(discountValueId);
    const downPayment = getNumericValue(downPaymentId);
    const creditAmount = getNumericValue('creditAmount');
    const monthlyCredit = getNumericValue('monthlyCredit');

    if (
        programLength === null ||
        baseMonthlyPayment === null ||
        baseDownPayment === null ||
        discountValue === null ||
        downPayment === null ||
        creditAmount === null ||
        monthlyCredit === null ||
        programLength === 0
    ) {
        document.getElementById(discountedAmountId).textContent = 'Invalid input';
        return;
    }

    const totalValueBeforeDiscount = (baseMonthlyPayment * programLength) + baseDownPayment;
    const discountedValue = totalValueBeforeDiscount - (totalValueBeforeDiscount * (discountValue / 100)) - downPayment;
    const discountedAmount = (discountedValue / programLength) - monthlyCredit;

    document.getElementById(discountedAmountId).textContent = Number(discountedAmount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

// Specific functions for each option
function calculateDiscountA() {
    calculateDiscount('A');
}

function calculateDiscountB() {
    calculateDiscount('B');
}

function calculateDiscountC() {
    calculateDiscount('C');
}

function calculateDiscountD() {
    calculateDiscount('D');
}



// Holiday Event-------------------------------------------------------------------------------------
// Generic function to calculate holiday discount
function calculateHolidayOption(optionKey, isBasic = false) {
    console.log(`Calculating option ${optionKey}, isBasic: ${isBasic}`); // Debug log

    // Get all required values
    const holidayEventDiscount = getNumericValue('holidayDiscountPercent');
    const programLength = getNumericValue('programLength');
    const baseMonthlyPayment = getNumericValue('baseMonthlyPayment');
    const baseDownPayment = getNumericValue('baseDownPayment');
    const holidayOption = getNumericValue(`holidayOption${optionKey}`);
    const creditAmount = getNumericValue('creditAmount');

    // Determine the result span ID
    const resultSpanId = isBasic
        ? `holidayDiscount${optionKey}ResultBasic`
        : `holidayDiscount${optionKey}Result`;
    const resultSpan = document.getElementById(resultSpanId);

    // Ensure the result span exists
    if (!resultSpan) {
        console.error(`Result span with ID "${resultSpanId}" not found.`);
        return;
    }

    console.log(`Inputs for option ${optionKey}:`, {
        holidayEventDiscount,
        programLength,
        baseMonthlyPayment,
        baseDownPayment,
        holidayOption,
        creditAmount,
    }); // Debug log

    // Validate inputs
    if (
        holidayEventDiscount === null ||
        programLength === null ||
        baseMonthlyPayment === null ||
        baseDownPayment === null ||
        holidayOption === null
    ) {
        console.error(`Invalid input for option ${optionKey}`);
        resultSpan.textContent = 'Invalid input';
        return;
    }

    // Calculate discounted amount
    const discountedAmount =
        ((holidayOption * baseMonthlyPayment) +
            (baseDownPayment / (programLength / holidayOption))) *
        (1 - holidayEventDiscount / 100);

    console.log(`Discounted amount for option ${optionKey}: ${discountedAmount}`); // Debug log

    // Prepare result text
    let resultText = Number(discountedAmount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    // Include credit logic for Option 1 and all basic options
    if (isBasic || optionKey === 'One') {
        if (creditAmount !== null) {
            const finalValue = discountedAmount - creditAmount;
            console.log(`Final value after credit for option ${optionKey}: ${finalValue}`); // Debug log
            resultText += ` - Credit = ${Number(finalValue).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`;
        }
    }

    // Update the result span
    resultSpan.textContent = resultText;
    console.log(`Updated result for option ${optionKey}: ${resultText}`); // Debug log
}


// Function definitions for each option
function calculateOption1() {
    calculateHolidayOption('One');
}
function calculateOption2() {
    calculateHolidayOption('Two');
}
function calculateOption2Basic() {
    calculateHolidayOption('Two', true);
}
function calculateOption3() {
    calculateHolidayOption('Three');
}
function calculateOption3Basic() {
    calculateHolidayOption('Three', true);
}
function calculateOption4() {
    calculateHolidayOption('Four');
}
function calculateOption4Basic() {
    calculateHolidayOption('Four', true);
}









function copyToClipboard(elementId, parseBasic = false) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID "${elementId}" not found.`);
        alert(`Element with ID "${elementId}" not found.`);
        return;
    }

    let textToCopy = element.innerText;

    if (parseBasic) {
        // For "basic" cases, extract the value after "=" and preserve commas
        const content = element.textContent.trim();
        const parts = content.split('=');
        if (parts.length < 2) {
            console.error(`No '=' found in content for "${elementId}"`);
            alert("Invalid content format. Cannot copy.");
            return;
        }
        textToCopy = parts[1].trim(); // Keep the value after "=" as-is, including commas
    }

    if (navigator.clipboard) {
        // Use modern Clipboard API
        navigator.clipboard.writeText(textToCopy).then(() => {
            console.log(`Copied text: "${textToCopy}" from element ID: "${elementId}"`);
        }).catch(err => {
            console.error(`Failed to copy text: ${err}`);
            alert("Failed to copy text. Please try again.");
        });
    } else {
        // Fallback for older browsers
        const tempInput = document.createElement("input");
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        tempInput.setSelectionRange(0, 99999); // For mobile devices
        document.execCommand("copy");
        document.body.removeChild(tempInput);
    }
}



// General Usage
function copyCreditAmount() {
    copyToClipboard("creditAmount");
}

function copyMonthyCredit() {
    copyToClipboard("monthlyCredit");
}

function copyDiscountedAmountA() {
    copyToClipboard("discountedAmountA");
}

function copyDiscountedAmountB() {
    copyToClipboard("discountedAmountB");
}

function copyDiscountedAmountC() {
    copyToClipboard("discountedAmountC");
}

function copyDiscountedAmountD() {
    copyToClipboard("discountedAmountD");
}

// Holiday Amount Functions
function copyHolidayAmountOne() {
    copyToClipboard("holidayDiscountOneResult", true);
}

function copyHolidayAmountTwo() {
    copyToClipboard("holidayDiscountTwoResult");
}

function copyHolidayAmountTwoBasic() {
    copyToClipboard("holidayDiscountTwoResultBasic", true);
}

function copyHolidayAmountThree() {
    copyToClipboard("holidayDiscountThreeResult");
}

function copyHolidayAmountThreeBasic() {
    copyToClipboard("holidayDiscountThreeResultBasic", true);
}

function copyHolidayAmountFour() {
    copyToClipboard("holidayDiscountFourResult");
}

function copyHolidayAmountFourBasic() {
    copyToClipboard("holidayDiscountFourResultBasic", true);
}



//-----------------------------------------------------------------------------------------------------

// Get the necessary elements by their IDs
const decrementButton = document.getElementById("decrement");
const incrementButton = document.getElementById("increment");
const sliderValueInput = document.getElementById("sliderValue");
const sliderInput = document.getElementById("slider");
const baseMonthlyPayment = parseFloat(document.getElementById('baseMonthlyPayment').value);
const baseDownPayment = parseFloat(document.getElementById('baseDownPayment').value);
const programLength = parseFloat(document.getElementById('programLength').value);
const discountValueA = parseFloat(document.getElementById('discountValueA').value);
const discountValueB = parseFloat(document.getElementById('discountValueB').value);
const discountValueC = parseFloat(document.getElementById('discountValueC').value);
const discountValueD = parseFloat(document.getElementById('discountValueD').value);
const downPaymentB = parseFloat(document.getElementById('downPaymentB').value);
const downPaymentC = parseFloat(document.getElementById('downPaymentC').value);
const downPaymentD = parseFloat(document.getElementById('downPaymentD').value);
const totalValueBeforeDiscount = (baseMonthlyPayment * programLength) + baseDownPayment;

let sliderCredit = document.getElementById("sliderCredit");


// Calculate dValue and cValue based on provided variables, make sure downPaymentD and downPaymentC are defined
const dValue = (totalValueBeforeDiscount - (totalValueBeforeDiscount * (discountValueD / 100)) - downPaymentD) / programLength;
const cValue = Math.round(((totalValueBeforeDiscount - (totalValueBeforeDiscount * (discountValueC / 100)) - downPaymentC) / programLength)*100)/100;
const bValue = Math.round(((totalValueBeforeDiscount - (totalValueBeforeDiscount * (discountValueB / 100)) - downPaymentB) / programLength)*100)/100;
const aValue = Math.round((totalValueBeforeDiscount - (totalValueBeforeDiscount * (discountValueA / 100)))*100)/100;
const aThreshold = (((totalValueBeforeDiscount - (totalValueBeforeDiscount * (discountValueB / 100)))-aValue)/programLength).toFixed(3);


const sliderMin = parseFloat(aThreshold);
const sliderMax = baseMonthlyPayment;

sliderInput.min = sliderMin;
sliderInput.max = sliderMax;

// Function to update the slider value and input field
function updateSliderValue(increment) {
  let currentValue = parseFloat(sliderValueInput.value);
  const step = parseFloat(sliderValueInput.step);

  // Calculate the new value
  currentValue = Math.round(currentValue + increment);

  // Ensure the value is within the defined range
  if (currentValue < parseFloat(sliderInput.min)) {
    currentValue = parseFloat(sliderInput.min);
  } else if (currentValue > parseFloat(sliderInput.max)) {
    currentValue = parseFloat(sliderInput.max);
  }

  // Update the input field and slider position with two decimal places
  sliderValueInput.value = currentValue.toFixed(2);
  sliderInput.value = currentValue.toFixed(2);
  updateDisplay(currentValue);
  updateSliderMinMax();
}

sliderCredit.addEventListener('input', () => {
    updateSliderMinMax();
    updateSliderValue();
});

function updateSliderMinMax() {
    if (sliderCredit.value === '') {
        sliderInput.min = sliderMin;
        sliderInput.max = sliderMax;
    } else {
        const aThreshold = (((totalValueBeforeDiscount - (totalValueBeforeDiscount * (discountValueB / 100))) - aValue) / programLength).toFixed(3);
        sliderInput.min = parseFloat(aThreshold) + (parseFloat(sliderCredit.value) / programLength);
        sliderInput.max = sliderMax;
    }
}


function updateDisplay(currentValue) {
  let monthlyPayment = calculateMonthlyPayment(currentValue);
  let discountDisplay = calculateDiscountValue(monthlyPayment);
  let sliderDown = calculateSliderDown(monthlyPayment);
  let sliderMonthlyCredit = calculateSliderMonthlyCredit();

  if(monthlyPayment == 0){
    sliderDown -= sliderMonthlyCredit;
} else if(monthlyPayment > aThreshold){
    monthlyPayment -= sliderMonthlyCredit;
}
    console.log("min value:",sliderInput.min)
  document.getElementById('monthlyPaymentDisplay').textContent = `$${monthlyPayment.toFixed(2)}`;
  document.getElementById('discountDisplay').textContent = `%${discountDisplay}`;
  document.getElementById('downpaymentDisplay').textContent = `$${sliderDown.toFixed(2)}`;
  document.getElementById('sliderMonthlyCredit').textContent = `$${sliderMonthlyCredit.toFixed(2)}`;
}

// Add event listeners for the decrement and increment buttons
decrementButton.addEventListener("click", () => {
  updateSliderValue(-1);
});

incrementButton.addEventListener("click", () => {
  updateSliderValue(1);
});

// Add an event listener to update the input field when the slider is changed
sliderInput.addEventListener("input", () => {
  sliderValueInput.value = parseFloat(sliderInput.value).toFixed(2);
  updateDisplay(parseFloat(sliderInput.value));
});

sliderValueInput.addEventListener("change", () => {
    
    // Parse the input value and update the slider and display
    const newValue = parseFloat(sliderValueInput.value);
    sliderInput.value = newValue.toFixed(2);
    updateDisplay(newValue);
});


// Initialize the input field with the initial value
sliderValueInput.value = parseFloat(sliderInput.value).toFixed(2);


function calculateMonthlyPayment(value) {
    const tolerance = 0.001; // Adjust the tolerance based on your requirements

    if (Math.abs(value - parseFloat(sliderInput.min)) < tolerance) {
        return 0;
    } else {
        return value;
    }
}



function calculateDiscountValue(value){
    let discountValue;
    if (value > cValue) {
        discountValue = discountValueD;
    } else if (value > bValue) {
        discountValue = discountValueC;
    } else if (value > aThreshold) {
        discountValue = discountValueB;
    } else if (value >= 0) {
        discountValue = discountValueA;
    }
    return discountValue
}


function calculateSliderDown(value) {

    
    let downpayment;
    if (value == 0) {
        return aValue;
    } else if (0 < value && value < sliderMax-.01){
        // Calculate program value based on sliderValue
        let programValue;
        if (value > cValue) {
            programValue = totalValueBeforeDiscount * (1-(discountValueD / 100));
        } else if (value > bValue) {
            programValue = totalValueBeforeDiscount * (1-(discountValueC / 100));
        } else if (value > aThreshold) {
            programValue = totalValueBeforeDiscount * (1-(discountValueB / 100));
        } else if (value >= slider.min) {
            programValue = totalValueBeforeDiscount * (1-(discountValueA / 100));
        }
        programValue = Math.round(programValue * 100) / 100;


        if (value > cValue) {
            downpayment = -1 * (value * programLength - programValue);
        } else if (value > bValue) {
            downpayment = -1 * (value * programLength - programValue);
        } else if (value > aThreshold) {
            downpayment = -1 * (value * programLength - programValue);
        } else if (value >= sliderInput.min) {
            downpayment = aValue;
        }

        return downpayment; 
    }else{
        return downPaymentD;
    }
}

function calculateSliderMonthlyCredit(){
    const monthlyValue = sliderCredit.value/programLength;
    return monthlyValue
}
