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

    const isValidDate = (dateStr) => !isNaN(new Date(dateStr));

    if (programEndDateInput !== '' && isValidDate(programEndDateInput)) {
        const programEndDate = new Date(programEndDateInput);
        oldEndDate = programEndDate.toLocaleDateString();

        const currentDate = new Date();

        if (returnDateInput !== '' && isValidDate(returnDateInput)) {
            const returnDate = new Date(returnDateInput);
            const dateFrom = (dateFromInput !== '' && isValidDate(dateFromInput)) ? new Date(dateFromInput) : currentDate;

            const diffInDays = Math.ceil((returnDate - dateFrom) / (1000 * 60 * 60 * 24));
            extendedTimeUsed = timeLeftInDays = diffInDays;

            const newEndDate = new Date(programEndDateInput);
            newEndDate.setDate(newEndDate.getDate() + extendedTimeUsed);
            const formattedNewEndDate = newEndDate.toLocaleDateString();

            document.getElementById('newEndDate').textContent = formattedNewEndDate;
        }
    }

    document.getElementById('timeLeft').textContent = timeLeftInDays;
    document.getElementById('extendedTimeUsed').textContent = extendedTimeUsed;
    document.getElementById('oldEndDate').textContent = oldEndDate;
}

async function copyText() {
    const dateFromInput = document.getElementById('dateFrom').value.trim();
    const returnDateInput = document.getElementById('returnDate').value.trim();
    const extendedTimeUsed = document.getElementById('extendedTimeUsed').textContent;
    const oldEndDate = document.getElementById('oldEndDate').textContent;
    const newEndDate = document.getElementById('newEndDate').textContent;

    const dateFrom = dateFromInput ? new Date(dateFromInput) : new Date();
    const returnDate = returnDateInput ? new Date(returnDateInput) : null;

    let formattedDatesGone = '-';
    if (returnDate) {
        const fromFormatted = dateFrom.toLocaleDateString();
        const returnFormatted = returnDate.toLocaleDateString();
        formattedDatesGone = `${fromFormatted} - ${returnFormatted}`;
    }

    const textToCopy =
`Extended Time Reason: 
Dates Gone: ${formattedDatesGone}

Time Extended: ${extendedTimeUsed} days
Old End Date: ${oldEndDate}
New End Date: ${newEndDate}`;

    try {
        await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
        // do nothing
    }
}

