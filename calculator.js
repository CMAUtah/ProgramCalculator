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
document.getElementById('creditPlus').addEventListener('input', calculateCredit);
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
    const amountPaidInput = document.getElementById('amountPaid').value.trim();
    const amountPaid = parseFloat(amountPaidInput);

    const programEndDateInput = document.getElementById('programEndDate').value.trim();
    const currentProgramLengthInput = document.getElementById('currentProgramLength').value.trim();
    const programLength = parseFloat(document.getElementById('programLength').value);
    const dateFromInput = document.getElementById('dateFrom').value.trim();
    let creditPlus = parseFloat(document.getElementById('creditPlus').value);
    if (creditPlus == '' || isNaN(creditPlus)){
        creditPlus = 0;
    }

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

    creditAmount = creditAmount + creditPlus;
    monthlyCredit += (creditPlus/programLength);
    console.log("Credit Amount:",creditAmount);


    document.getElementById('timeLeft').textContent = timeLeftInMonths.toFixed(2) + ' months (' + timeLeftInDays + ' days)';
    document.getElementById('monthlyCredit').textContent = monthlyCredit.toFixed(2);
    document.getElementById('creditAmount').textContent = creditAmount.toFixed(2);

    return creditAmount;
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
