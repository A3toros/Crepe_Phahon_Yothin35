$(document).ready(function() {
    let selections = { sauce: null, filling: null, topping: null };
    let translations = {}; // To store translations

    // Food options stored in JS (keys remain in English)
    let foodOptions = {
        sauce: ["Nutella", "Caramel", "Chocolate", "Strawberry", "Maple Syrup", "Honey", "Butterscotch"],
        filling: ["Banana", "Strawberry", "Blueberry", "Custard", "Jam", "Cream", "Apple"],
        topping: ["Sprinkles", "Almonds", "Coconut", "Powdered Sugar", "Fresh Fruits", "Chocolate Chips", "Hazelnuts"]
    };

    let defaultDropdownText = "Select an option"; // fallback

    // Load translations from JSON (content.json)
    function loadContent(lang) {
        $.getJSON("content.json", function(data) {
            if (data[lang]) {
                translations = data[lang]; // Save translations
    
                // Update headings and button texts
                $("#sauce-title").text(translations["sauce-title"]);
                $("#filling-title").text(translations["filling-title"]);
                $("#topping-title").text(translations["topping-title"]);
                $("#make-crepe").text(translations.makeCrepe);
                $("#hide-photo").text(translations.hidePhoto);
                $("#error-message").text(""); // clear error message
    
                // Update dropdown buttons' text
                $(".choose-btn").each(function() {
                    let type = $(this).data("type");
                    $(this).text(translations[`choose-${type}-btn`] || `Choose ${type}`);
                });
                
                // Update selected display texts to use the translated "none"
                $("#selected-sauce").text(translations.none || "None");
                $("#selected-filling").text(translations.none || "None");
                $("#selected-topping").text(translations.none || "None");

                // Update contact page content
                updateContent();
            }
        });
    }

    // Get saved language preference or default to Thai
    const savedLang = localStorage.getItem('preferredLanguage') || 'th';
    loadContent(savedLang);

    // Language switch buttons
    $("#btn-en").click(() => {
        localStorage.setItem('preferredLanguage', 'en');
        loadContent('en');
    });
    $("#btn-th").click(() => {
        localStorage.setItem('preferredLanguage', 'th');
        loadContent('th');
    });

    // Function to translate food names (using translations from JSON)
    function translateFoodNames(type) {
        return foodOptions[type].map(food => translations[food] || food);
    }

    // When a "choose" button is clicked, open a dropdown with food names (no "Select an option" line)
    $(".choose-btn").click(function() {
        let type = $(this).data("type");

        // Remove any existing dropdowns
        $(".form-select").remove();

        if ($(this).next("select").length === 0) {
            let translatedOptions = translateFoodNames(type);
            let dropdownHtml = `<select class='form-select'>`;
            translatedOptions.forEach(food => {
                dropdownHtml += `<option value='${food}'>${food}</option>`;
            });
            dropdownHtml += "</select>";

            $(this).after(dropdownHtml);

            // Auto-select the first option immediately
            let defaultSelection = translatedOptions[0];
            selections[type] = foodOptions[type][0].replace(/\s+/g, "_");
            $(`#selected-${type}`).text(defaultSelection);

            // Allow user to change selection
            $(this).next("select").one("change", function() {
                let selectedValue = $(this).val();
                if (selectedValue !== "") {
                    // Get index of the selected value in translatedOptions
                    let index = translatedOptions.indexOf(selectedValue);
                    selections[type] = foodOptions[type][index].replace(/\s+/g, "_");
                    $(`#selected-${type}`).text(selectedValue);
                }
                $(this).remove();
            });
        }
    });

    // "Make a Crepe" button: Check selections and show error if any are missing.
    $("#make-crepe").click(function() {
        if (!selections.sauce || !selections.filling || !selections.topping) {
            $("#error-message")
              .text(translations.errorSelect)
              .css({ "color": "red", "font-weight": "bold", "margin-top": "10px" });
            $("#result-img").hide();
            $("#hide-photo").hide();
        } else {
            $("#error-message").text(""); // Clear error
            let imageUrl = `images/crepes/${selections.sauce}_${selections.filling}_${selections.topping}.jpg`;
            $("#result-img").attr("src", imageUrl).show();
            $("#hide-photo").show();
            $("#make-crepe").hide();  // Hide the "Make a Crepe" button
        }
    });

    $("#hide-photo").click(function() {
        selections = { sauce: null, filling: null, topping: null };
        $("#result-img").hide();
        $("#selected-sauce").text(translations.none || "None");
        $("#selected-filling").text(translations.none || "None");
        $("#selected-topping").text(translations.none || "None");
        $("#error-message").text("");
        $("#hide-photo").hide();
        $(".form-select").remove();
        $("#make-crepe").show();  // Show the "Make a Crepe" button again
    });
    
    function updateContent() {
        console.log('Updating content with translations:', translations); // Debug log
        
        // Update all navigation items
        document.querySelectorAll('[id^="nav-"]').forEach(element => {
            const key = element.id;
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });

        // Update address section
        const addressTitle = document.getElementById('address-title');
        const addressLine1 = document.getElementById('address-line1');
        const addressLine2 = document.getElementById('address-line2');
        const addressLine3 = document.getElementById('address-line3');
        
        if (addressTitle) addressTitle.textContent = translations['address-title'];
        if (addressLine1) addressLine1.textContent = translations['address-line1'];
        if (addressLine2) addressLine2.textContent = translations['address-line2'];
        if (addressLine3) addressLine3.textContent = translations['address-line3'];

        // Update location heading
        const locationHeading = document.querySelector('h1');
        if (locationHeading) {
            locationHeading.textContent = translations['location-heading'];
        }
    }
});
