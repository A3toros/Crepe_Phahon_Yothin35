import { useState } from 'react';
import { Header } from '@src/components/layout/Header';
import { useLanguage } from '@src/lib/hooks/useLanguage';

// Gallery data with images and descriptions from content.json
const galleryData = [
  {
    image: '/pics/crepes/Blueberry_Marshmallow_Chocolate.jpg',
    descriptionKey: 'gallery-text-1'
  },
  {
    image: '/pics/crepes/Blueberry_Raisins_Chocolate.jpg',
    descriptionKey: 'gallery-text-2'
  },
  {
    image: '/pics/crepes/Chili_Sauce_Pulled_Pork_Mayonnaise.jpg',
    descriptionKey: 'gallery-text-3'
  },
  {
    image: '/pics/crepes/IMG_20230214_200236.jpg',
    descriptionKey: 'gallery-text-4'
  },
  {
    image: '/pics/crepes/IMG_20230214_200819.jpg',
    descriptionKey: 'gallery-text-5'
  },
  {
    image: '/pics/crepes/IMG_20230214_202033.jpg',
    descriptionKey: 'gallery-text-6'
  },
  {
    image: '/pics/crepes/IMG_20230214_202439.jpg',
    descriptionKey: 'gallery-text-7'
  },
  {
    image: '/pics/crepes/IMG_20230214_202903.jpg',
    descriptionKey: 'gallery-text-8'
  },
  {
    image: '/pics/crepes/IMG_20230214_204701.jpg',
    descriptionKey: 'gallery-text-9'
  },
  {
    image: '/pics/crepes/IMG_20230214_205035.jpg',
    descriptionKey: 'gallery-text-10'
  },
  {
    image: '/pics/crepes/IMG_20230214_205333.jpg',
    descriptionKey: 'gallery-text-11'
  },
  {
    image: '/pics/crepes/IMG_20230214_210700.jpg',
    descriptionKey: 'gallery-text-12'
  },
  {
    image: '/pics/crepes/IMG_20230214_211622.jpg',
    descriptionKey: 'gallery-text-13'
  },
  {
    image: '/pics/crepes/IMG_20230214_214204.jpg',
    descriptionKey: 'gallery-text-14'
  },
  {
    image: '/pics/crepes/IMG_20230214_215020.jpg',
    descriptionKey: 'gallery-text-15'
  },
  {
    image: '/pics/crepes/IMG_20230214_220235.jpg',
    descriptionKey: 'gallery-text-16'
  }
];

// Language content
const content = {
  en: {
    'gallery-heading': 'Our Crepe Gallery',
    'gallery-text-1': 'Nutella, Ovaltine Powder, Cashew nuts',
    'gallery-text-2': 'Strawberry sauce, Strawberry jelly, Caramel',
    'gallery-text-3': 'Pizza sauce, Crabsticks, Spinach, Cheese',
    'gallery-text-4': 'Ham, Sausages, Pulled Pork',
    'gallery-text-5': 'Egg, Ham, Spinach',
    'gallery-text-6': 'Chili Paste, Spinach, Pulled pork',
    'gallery-text-7': 'Nutella, Oreo, Banana',
    'gallery-text-8': 'Nutella, Banana, Cornflakes',
    'gallery-text-9': 'Egg, Ham, Spinach, Cheese',
    'gallery-text-10': 'Nutella, Banana, Golden Thread',
    'gallery-text-11': 'Nutella, Banana, Marshmallow',
    'gallery-text-12': 'Nutella, Golden Thread, Ovaltine Flakes',
    'gallery-text-13': 'Egg, Ham, Crabsticks',
    'gallery-text-14': 'Chili Paste, Pulled Pork, Cheese',
    'gallery-text-15': 'Golden Thread, Marshmallow, Ovaltine Powder',
    'gallery-text-16': 'Banana, Oreo, Almonds',
    'gallery-text-17': 'Nutella, Banana, Ovaltine Flakes',
    'gallery-text-18': 'Nutella, Oreo, Ovaltine Powder'
  },
  th: {
    'gallery-heading': 'แกลเลอรี่เครปของเรา',
    'gallery-text-1': 'นูเทลล่า, ผงโอวัลติน, เม็ดมะม่วงหิมพานต์',
    'gallery-text-2': 'ฟิลลิ่งสตอเบอรี่, เยลลี่สตอเบอรี่, คาราเมล',
    'gallery-text-3': 'ซอสพิซซ่า, ปูอัด, ผักขม, ชีส',
    'gallery-text-4': 'แฮม, ไส้กรอก, หมูหยอง',
    'gallery-text-5': 'ไข่ไก่, แฮม, ผักโขม',
    'gallery-text-6': 'น้ำพริกเผา, ผักโขม, หมูหยอง',
    'gallery-text-7': 'นูเทลล่า, โอรีโอ, กล้วยหอม',
    'gallery-text-8': 'นูเทลล่า, กล้วยหอม, คอร์นเฟลก',
    'gallery-text-9': 'ไข่ไก่, แฮม, ผักโขม, ชีส',
    'gallery-text-10': 'นูเทลล่า, กล้วยหอม, ฝอยทอง',
    'gallery-text-11': 'นูเทลล่า, กล้วยหอม, มาร์ชเมลโลว์',
    'gallery-text-12': 'นูเทลลา, ฝอยทอง, โอวัลติน',
    'gallery-text-13': 'ไข่ไก่, แฮม, ปูอัด',
    'gallery-text-14': 'น้ำพริกเผา, หมูหยอง, ชีส',
    'gallery-text-15': 'ฝอยทอง, มาร์ชเมลโลว์, โอวัลติน',
    'gallery-text-16': 'กล้วย, โอรีโอ, อัลมอนด์',
    'gallery-text-17': 'นูเทลล่า, กล้วย, โอวัลติน',
    'gallery-text-18': 'นูเทลล่า, โอรีโอ, โอวัลติน'
  }
};

export function Gallery() {
  const { language } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const t = (key: string) => content[language][key as keyof typeof content.en] || key;

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryData.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryData.length) % galleryData.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{t('gallery-heading')}</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryData.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openLightbox(index)}>
              <div className="aspect-square overflow-hidden">
                <img 
                  src={item.image} 
                  alt={t(item.descriptionKey)}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t(item.descriptionKey)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
              >
                ×
              </button>
              
              {/* Left arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white w-12 h-12 rounded-full flex items-center justify-center z-20"
              >
                <span className="text-3xl font-bold leading-none">‹</span>
              </button>
              
              {/* Right arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white w-12 h-12 rounded-full flex items-center justify-center z-20"
              >
                <span className="text-3xl font-bold leading-none">›</span>
              </button>
              
              {/* Image */}
              <div className="flex flex-col items-center">
                <img
                  src={galleryData[currentImageIndex].image}
                  alt={t(galleryData[currentImageIndex].descriptionKey)}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
                
                {/* Image counter and description */}
                <div className="mt-4 text-center text-white">
                  <p className="text-lg font-medium">
                    {t(galleryData[currentImageIndex].descriptionKey)}
                  </p>
                  <p className="text-sm text-gray-300 mt-2">
                    {currentImageIndex + 1} of {galleryData.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


