// Array of crepe images (18 images total)
const crepeImages = [
    'Nutella_Cashew_Nut_Chocolate.jpg',
    'Strawberry_Strawberry_Jelly_Honey.jpg',
    'Nutella_Banana_Sprinkles.jpg',
    'IMG_20230508_175205.jpg',
    'IMG_20230508_180822.jpg',
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

// Function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to create gallery items
function createGallery() {
    const galleryRow = document.querySelector('.row');
    const shuffledImages = shuffleArray([...crepeImages]);

    // Create 6 rows with 3 images each
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'row g-4 mb-4';

        for (let j = 0; j < 3; j++) {
            const col = document.createElement('div');
            col.className = 'col-md-4';

            const imageIndex = i * 3 + j;
            const imagePath = `images/crepes/${shuffledImages[imageIndex]}`;

            col.innerHTML = `
                <div class="gallery-item">
                    <a href="${imagePath}" data-lightbox="gallery" data-title="There will be description here later">
                        <img src="${imagePath}" alt="Crepe ${imageIndex + 1}" class="img-fluid rounded">
                    </a>
                    <div class="text-center mt-2">
                        <p class="mb-0" style="border: none; text-decoration: none;">text here</p>
                    </div>
                </div>
            `;

            row.appendChild(col);
        }

        galleryRow.appendChild(row);
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createGallery();
    
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
}); 