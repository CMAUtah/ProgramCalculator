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

    const user = firebase.auth().currentUser;

    if (user) {
        db.collection("userSettings").doc(user.uid).get().then(doc => {
            if (doc.exists) {
                const settings = doc.data();
                applyGeneralSettings(settings);
            } else {
                console.log("No settings found in Firestore for this user.");
            }
        }).catch(error => {
            console.error("Error fetching user settings from Firestore:", error);
        });
    } else {
        // fallback to localStorage
        let savedSettings;
        try {
            savedSettings = JSON.parse(localStorage.getItem('calculatorSettings')) || { options: [], names: [], values: [] };
        } catch (error) {
            console.error("Error parsing localStorage settings:", error);
            savedSettings = { options: [], names: [], values: [] };
        }
        applyGeneralSettings(savedSettings);
    }
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

