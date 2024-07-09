document.getElementById('programEndDate').addEventListener('input', calculateDays);
document.getElementById('returnDate').addEventListener('input', calculateDays);
document.getElementById('dateFrom').addEventListener('input', calculateDays);

function calculateDays() {
    const programEndDateInput = document.getElementById('programEndDate').value.trim();
    const returnDateInput = document.getElementById('returnDate').value.trim();
    const dateFromInput = document.getElementById('dateFrom').value.trim();

    let timeLeftInDays = 0;
    let extendedTimeUsed = 0;
    let oldEndDate = '';

    if (programEndDateInput !== '') {
        const programEndDate = new Date(programEndDateInput);
        oldEndDate = programEndDate.toLocaleDateString(); // Format old end date for display

        const currentDate = new Date();

        if (returnDateInput !== '') {
            const returnDate = new Date(returnDateInput);
            if (dateFromInput !== '') {
                const dateFrom = new Date(dateFromInput);
                extendedTimeUsed = Math.ceil((returnDate - dateFrom) / (1000 * 60 * 60 * 24));
                timeLeftInDays = Math.ceil((returnDate - dateFrom) / (1000 * 60 * 60 * 24));
            } else {
                extendedTimeUsed = Math.ceil((returnDate - currentDate) / (1000 * 60 * 60 * 24));
                timeLeftInDays = Math.ceil((returnDate - currentDate) / (1000 * 60 * 60 * 24));
            }
        }
    }

    // Calculate new end date
    const newEndDate = new Date(programEndDateInput);
    newEndDate.setDate(newEndDate.getDate() + extendedTimeUsed);
    const formattedNewEndDate = newEndDate.toLocaleDateString();

    document.getElementById('timeLeft').textContent = timeLeftInDays;
    document.getElementById('extendedTimeUsed').textContent = extendedTimeUsed;
    document.getElementById('oldEndDate').textContent = oldEndDate;
    document.getElementById('newEndDate').textContent = formattedNewEndDate;
}


function copyText() {
    // Get the text to copy
    const extendedTimeUsed = document.getElementById('extendedTimeUsed').textContent;
    const oldEndDate = document.getElementById('oldEndDate').textContent;
    const newEndDate = document.getElementById('newEndDate').textContent;

    // Concatenate the text with new lines
    const textToCopy = `Extended Time Used: ${extendedTimeUsed} days\nOld End Date: ${oldEndDate}\nNew End Date: ${newEndDate}`;

    // Create a textarea element to copy the text to clipboard
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    document.body.appendChild(textarea);

    // Select the text in the textarea
    textarea.select();
    textarea.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text to clipboard
    document.execCommand('copy');

    // Remove the textarea from the DOM
    document.body.removeChild(textarea);

    // Alert the user that text has been copied
    alert('Text copied to clipboard!');
}


