import { Header } from '@src/components/layout/Header';
import { useLanguage } from '@src/lib/hooks/useLanguage';

// Language content
const content = {
  en: {
    'contact-heading': 'Our Location in Bangkok',
    'contact-intro': 'We are glad to hear from you.',
    'address-label': 'Address',
    'address': 'Phahon Yothin 35, Bangkok',
    'hours-label': 'Hours',
    'hours': 'Daily 10:00 - 21:00',
    'social-label': 'Add us on Social Media',
    'facebook': 'Facebook',
    'instagram': 'Instagram',
    'tiktok': 'TikTok',
    'address-title': 'เครปพหลโยธิน 35',
    'address-line1': 'เลขที่ 13/16 ถนนพหลโยธิน 35',
    'address-line2': 'ลาดยาว จตุจัตร Lat Yao, Chatuchak',
    'address-line3': 'Bangkok 10900'
  },
  th: {
    'contact-heading': 'ที่ตั้งของเราในกรุงเทพฯ',
    'contact-intro': 'เรายินดีรับฟังความคิดเห็นของคุณ',
    'address-label': 'ที่อยู่',
    'address': 'พหลโยธิน 35, กรุงเทพฯ',
    'hours-label': 'เวลาเปิดทำการ',
    'hours': 'ทุกวัน 10:00 - 21:00',
    'social-label': 'ติดตามเราบนโซเชียลมีเดีย',
    'facebook': 'เฟซบุ๊ก',
    'instagram': 'อินสตาแกรม',
    'tiktok': 'ติ๊กต็อก',
    'address-title': 'เครปพหลโยธิน 35',
    'address-line1': 'เลขที่ 13/16 ถนนพหลโยธิน 35',
    'address-line2': 'ลาดยาว จตุจัตร Lat Yao, Chatuchak',
    'address-line3': 'Bangkok 10900'
  }
};

export function Contact() {
  const { language } = useLanguage();
  
  const t = (key: string) => content[language][key as keyof typeof content.en] || key;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Banner */}
      <div className="relative h-48 bg-gray-300 overflow-hidden">
        <img
          src="/pics/banner.jpg"
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">{t('contact-heading')}</h1>
        
        {/* Google Maps */}
        <div className="mb-8">
          <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5478.723608574001!2d100.56576928407225!3d13.836484405434664!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29dc8a8cb9d19%3A0x45ea05a22730e832!2z4LmA4LiE4Lij4Lie4Lir4Lil4LmC4Lii4LiY4Li04LiZIDM1!5e0!3m2!1sen!2sth!4v1742429491397!5m2!1sen!2sth" 
              width="100%" 
              height="100%" 
              style={{border: 0}} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Crepe Shop Location"
            />
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">{t('social-label')}</h2>
          <div className="flex justify-center items-center gap-6">
            <a 
              href="https://www.instagram.com/crepe.35?igsh=ZGUzMzM3NWJiOQ==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform duration-200"
            >
              <img src="/pics/Instagram.png" alt="Instagram" className="h-12 w-12" />
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=100038993720639&mibextid=ZbWKwL" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform duration-200"
            >
              <img src="/pics/facebook.png" alt="Facebook" className="h-12 w-12" />
            </a>
            <a 
              href="https://www.tiktok.com/@crepe_phahonyothin35?_t=ZS-8u62ac03h10&_r=1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform duration-200"
            >
              <img src="/pics/tiktok.png" alt="TikTok" className="h-12 w-12" />
            </a>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="text-xl font-bold mb-4">{t('address-title')}</h3>
          <div className="space-y-2 text-gray-700">
            <p>{t('address-line1')}</p>
            <p>{t('address-line2')}</p>
            <p>{t('address-line3')}</p>
          </div>
        </div>
      </main>
    </div>
  );
}


