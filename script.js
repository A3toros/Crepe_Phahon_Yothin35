$(document).ready(function() {
    let selections = { type: null, sauce: null, filling: null, topping: null };
    let translations = {}; // To store translations
    let currentLang = 'en';

    // Array of crepe images (18 images total)
    const crepeImages = [
        'Nutella_Cashew_Nut_Chocolate.jpg',
        'Strawberry_Strawberry_Jelly_Honey.jpg',
        'Nutella_Banana_Sprinkles.jpg',
        'No_Sauce_Pulled_Pork_Ketchup.jpg',
        'No_Sauce_Ham_Chili.jpg',
        'IMG_20230508_180956.jpg',
        'IMG_20230508_185544.jpg',
        'IMG_20230508_193434.jpg',
        'IMG_20230508_202037.jpg',
        'IMG_20230428_185718.jpg',
        'IMG_20230428_185722.jpg',
        'IMG_20230428_204714.jpg',
        'IMG_20230502_193434.jpg',
        'IMG_20230504_183223.jpg',
        'IMG_20230504_192042.jpg',
        'IMG_20230504_193641.jpg',
        'IMG_20230324_202822.jpg',
        'IMG_20230324_211506.jpg'
    ];

    // Food options stored in JS (keys remain in English)
    const sweetOptions = {
        sauce: ["Nutella", "Caramel", "Chocolate", "Strawberry", "Maple Syrup", "Honey", "Butterscotch"],
        filling: ["Banana", "Strawberry", "Blueberry", "Custard", "Jam", "Cream", "Apple"],
        topping: ["Sprinkles", "Almonds", "Coconut", "Powdered Sugar", "Fresh Fruits", "Chocolate Chips", "Hazelnuts"]
    };

    const savoryOptions = {
        sauce: ["No Sauce", "Chili Sauce", "Pizza Sauce"],
        filling: ["Pulled Pork", "Crabstick", "Ham", "Sausage", "Egg", "Spinach", "Cheese"],
        topping: ["Ketchup", "Chili", "Mayonnaise"]
    };

    let foodOptions = {}; // Will be set based on selection

    // Initially hide the main content
    $("#main-content").hide();

    // Add type selection HTML
    const typeSelectionHtml = `
        <div id="type-selection" class="text-center mb-4">
            <h3 id="what-crepe" class="mb-3">What kind of Crepe do you want?</h3>
            <button id="sweet-btn" class="btn btn-primary mx-2">Sweet</button>
            <button id="savory-btn" class="btn btn-primary mx-2">Savory</button>
        </div>
    `;
    $("#title").after(typeSelectionHtml);

    // Type selection button handlers
    $("#sweet-btn").click(function() {
        selections.type = "sweet";
        foodOptions = sweetOptions;
        $("#type-selection").hide();
        $("#main-content").show();
        $("#ingredient-selection").show();
        resetSelections();
    });

    $("#savory-btn").click(function() {
        selections.type = "savory";
        foodOptions = savoryOptions;
        $("#type-selection").hide();
        $("#main-content").show();
        $("#ingredient-selection").show();
        resetSelections();
    });

    function resetSelections() {
        selections.sauce = null;
        selections.filling = null;
        selections.topping = null;
        $("#selected-sauce").text(translations.none || "None");
        $("#selected-filling").text(translations.none || "None");
        $("#selected-topping").text(translations.none || "None");
        $("#error-message").text("");
        $("#result-img").hide();
        $("#hide-photo").hide();
        $("#make-crepe").show();
        $(".form-select").remove();
    }

    let defaultDropdownText = "Select an option"; // fallback

    // Function to create gallery items
    function createGallery() {
        const galleryRow = document.querySelector('.gallery-container .row');
        if (!galleryRow) return; // Exit if row not found

        // Clear existing gallery items
        galleryRow.innerHTML = '';

        // Create 6 rows with 3 images each
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('div');
            row.className = 'row g-4 mb-4';

            for (let j = 0; j < 3; j++) {
                const col = document.createElement('div');
                col.className = 'col-md-4';

                const imageIndex = i * 3 + j;
                const imagePath = `images/crepes/${crepeImages[imageIndex]}`;

                col.innerHTML = `
                    <div class="gallery-item">
                        <a href="${imagePath}" data-lightbox="gallery" data-title="${translations[`gallery-description-${imageIndex + 1}`] || `Description ${imageIndex + 1}`}">
                            <img src="${imagePath}" alt="Crepe ${imageIndex + 1}" class="img-fluid rounded">
                        </a>
                        <div class="text-center mt-2">
                            <p id="gallery-text-${imageIndex + 1}" class="mb-0" style="border: none; text-decoration: none;">${translations[`gallery-text-${imageIndex + 1}`] || `text here ${imageIndex + 1}`}</p>
                        </div>
                    </div>
                `;

                row.appendChild(col);
            }

            galleryRow.appendChild(row);
        }

        // Configure lightbox
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'albumLabel': 'Image %1 of %2',
            'fadeDuration': 300,
            'imageFadeDuration': 300,
            'positionFromTop': 50,
            'showImageNumberLabel': true
        });
    }

    // Load translations from JSON (content.json)
    function loadContent(lang) {
        $.getJSON("content.json", function(data) {
            if (data[lang]) {
                translations = data[lang]; // Save translations
                currentLang = lang;
    
                // Update type selection texts
                $("#what-crepe").text(translations["what-crepe"]);
                $("#sweet-btn").text(translations["sweet-crepe"]);
                $("#savory-btn").text(translations["savory-crepe"]);
    
                // Update headings and button texts
                $("#title").text(translations.title);
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

                // Create gallery if on gallery page
                if (document.querySelector('.gallery-container')) {
                    createGallery();
                }
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

    // When a "choose" button is clicked, open a dropdown with food names
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
        // Reset all selections
        selections = { type: null, sauce: null, filling: null, topping: null };
        
        // Hide result image and hide photo button
        $("#result-img").hide();
        $("#hide-photo").hide();
        
        // Reset all selected text displays
        $("#selected-sauce").text(translations.none || "None");
        $("#selected-filling").text(translations.none || "None");
        $("#selected-topping").text(translations.none || "None");
        $("#error-message").text("");
        
        // Remove any dropdowns
        $(".form-select").remove();
        
        // Show the make crepe button
        $("#make-crepe").show();
        
        // Hide the main content and show type selection
        $("#main-content").hide();
        $("#type-selection").show();
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

        // Update gallery heading
        const galleryHeading = document.getElementById('gallery-heading');
        if (galleryHeading && translations['gallery-heading']) {
            galleryHeading.textContent = translations['gallery-heading'];
        }

        // Update welcome text
        const welcomeText = document.getElementById('welcome-text');
        if (welcomeText && translations['welcome-text']) {
            welcomeText.textContent = translations['welcome-text'];
        }

        // Update address section - only on contact page
        const addressTitle = document.getElementById('address-title');
        const addressLine1 = document.getElementById('address-line1');
        const addressLine2 = document.getElementById('address-line2');
        const addressLine3 = document.getElementById('address-line3');
        const social_media = document.getElementById('social_media');
        
        if (addressTitle) addressTitle.textContent = translations['address-title'];
        if (addressLine1) addressLine1.textContent = translations['address-line1'];
        if (addressLine2) addressLine2.textContent = translations['address-line2'];
        if (addressLine3) addressLine3.textContent = translations['address-line3'];
        if (social_media) social_media.textContent = translations['social_media'];

        // Update location heading - only on contact page
        const locationHeading = document.getElementById('location-heading');
        if (locationHeading) {
            locationHeading.textContent = translations['location-heading'];
        }

        // Update welcome heading
        const welcomeHeading = document.getElementById('welcome-heading');
        if (welcomeHeading && translations['welcome-heading']) {
            welcomeHeading.textContent = translations['welcome-heading'];
        }

        // Update menu table items
        document.querySelectorAll('[id^="menu-"]').forEach(element => {
            const key = element.id;
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
    }
    document.getElementById('menu-sauces-free').style.backgroundColor = '#5a9eec';
    document.getElementById('menu-sweet').style.backgroundColor = '#5a9eec';
    document.getElementById('menu-savory').style.backgroundColor = '#5a9eec';
    function centerGalleryImages() {
        if ($(window).width() <= 768) {
            $('.gallery-container .row').css({
                'display': 'flex',
                'flex-wrap': 'wrap',
                'justify-content': 'center'
            });

            $('.gallery-container .col-md-4').css({
                'display': 'flex',
                'justify-content': 'center',
                'align-items': 'center',
                'width': '100%',
                'margin-bottom': '1rem'
            });

            $('.gallery-item img').css({
                'max-width': '100%',
                'height': 'auto',
                'display': 'block',
                'margin': '0 auto'
            });
        } else {
            // Reset styles for larger screens
            $('.gallery-container .row, .gallery-container .col-md-4, .gallery-item img').removeAttr('style');
        }
    }

    // Initial call
    centerGalleryImages();

    // Reapply on window resize
    $(window).resize(centerGalleryImages);

    // Add bottom margin to Make Your Own Crepe section
    document.addEventListener('DOMContentLoaded', function() {
        // Apply margins to main content and ingredient selection
        const mainContent = document.getElementById('main-content');
        const ingredientSelection = document.getElementById('ingredient-selection');
        
        if (mainContent) {
            mainContent.style.marginBottom = '20vh';
        }
        
        if (ingredientSelection) {
            ingredientSelection.style.marginBottom = '20vh';
        }
        
        // Apply margins to menu sweet and savory sections
        const menuSweet = document.getElementById('menu-sweet');
        const menuSavory = document.getElementById('menu-savory');
        
        if (menuSweet) {
            menuSweet.style.marginBottom = '20vh';
        }
        
        if (menuSavory) {
            menuSavory.style.marginBottom = '20vh';
        }
        
        // Apply margins to menu table
        const menuTable = document.querySelector('.menu-table');
        if (menuTable) {
            menuTable.style.marginTop = '5rem';
            menuTable.style.marginBottom = '5rem';
        }
    });
});
