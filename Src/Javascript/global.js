//Navbar switch for mobile


document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger-menu");
    const navbar = document.querySelector(".navbar");

    if (hamburger && navbar) {
        hamburger.addEventListener("click", function () {
            navbar.classList.toggle("show");
        });
    } else {
    }
});

window.onload = function() {
    document.getElementById("content").style.visibility = "visible";
}


document.addEventListener('DOMContentLoaded', () => {
    console.log("Global settings loaded.");

    let savedSettings;
    try {
        savedSettings = JSON.parse(localStorage.getItem('calculatorSettings')) || { options: [], names: [], values: [] };
    } catch (error) {
        console.error("Error parsing saved settings:", error);
        savedSettings = { options: [], names: [], values: [] };
    }

    // Apply general settings after loading
    applyGeneralSettings(savedSettings);
});

// Apply general checkbox, text, and number settings
function applyGeneralSettings(settings) {
    settings.options.forEach(setting => {
        const input = document.getElementById(setting.id);
        if (input) input.checked = setting.enabled;
    });

    settings.names.forEach(setting => {
        const input = document.getElementById(setting.id);
        if (input) input.value = setting.value;
    });

    settings.values.forEach(setting => {
        const input = document.getElementById(setting.id);
        if (input) input.value = setting.value;
    });
}

