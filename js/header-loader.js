// Helper script to initialize header after jQuery loads it
// Include this script after jQuery and before loading the header

function loadHeaderWithInit(callback) {
    $("#header").load("components/header.html", function() {
        console.log("Header loaded successfully");

        // Call the provided callback if any
        if (typeof callback === 'function') {
            callback();
        }

        // Initialize header functionality
        if (typeof initializeHeader === 'function') {
            initializeHeader();
        } else {
            console.warn('initializeHeader function not found');
        }
    });
}

