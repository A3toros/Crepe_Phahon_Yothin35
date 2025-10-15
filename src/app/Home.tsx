import { useState } from 'react';
import { Header } from '@src/components/layout/Header';
import { useLanguage } from '@src/lib/hooks/useLanguage';

// Language content
const content = {
  en: {
    'welcome-heading': 'Welcome to Our Crepe Shop',
    'welcome-text': 'We are glad to welcome you to our Crepe Shop! We always treat our guests with utmost care and respect and make crepes with love, trying to make sure we deliver the best experience possible.',
    'banner-text': 'Banner Placeholder',
    'build-crepe': 'Build your crepe',
    'menu-title': 'Menu',
    'menu-basic': 'Basic crepe – 20 baht, 1 Topping – 7 baht, 3 Toppings – 20 baht',
    'menu-sauces': 'Sauces are free, add as many as you like',
    'menu-cream': 'Whipped Cream – 20 baht',
    'menu-sweet': 'Sweet Topping',
    'menu-savory': 'Savory Topping',
    'menu-blueberry': 'Blueberry',
    'menu-golden-thread': 'Golden thread',
    'menu-pulled-pork': 'Pulled Pork',
    'menu-strawberry1': 'Strawberry',
    'menu-marshmallow': 'Marshmallow',
    'menu-crabsticks': 'Crabsticks',
    'menu-orange': 'Orange',
    'menu-strawberry-jelly': 'Strawberry Jelly',
    'menu-ham': 'Ham',
    'menu-vanilla': 'Vanilla',
    'menu-rainbow-sprinkles': 'Rainbow Sprinkles',
    'menu-sausage': 'Sausage',
    'menu-chocolate1': 'Chocolate',
    'menu-peanut-butter': 'Peanut butter',
    'menu-egg': 'Egg',
    'menu-banana-cream': 'Banana cream',
    'menu-oreo': 'Oreo',
    'menu-chili-paste': 'Chili Paste',
    'menu-pandan-custard': 'Pandan Custard',
    'menu-ovaltine-powder': 'Ovaltine Powder',
    'menu-pizza-sauce': 'Pizza sauce',
    'menu-raisins': 'Raisins',
    'menu-ovaltine-flakes': 'Ovaltine Flakes',
    'menu-spinach': 'Spinach',
    'menu-nutella': 'Nutella',
    'menu-banana': 'Banana',
    'menu-cheese': 'Cheese',
    'menu-cashew-nuts': 'Cashew Nuts',
    'menu-sauces-free': 'Sauces, free of charge',
    'menu-almond': 'Almond',
    'menu-condensed-milk': 'Condensed milk',
    'menu-tomato': 'Tomato',
    'menu-cornflakes': 'Cornflakes',
    'menu-caramel': 'Caramel',
    'menu-chili-sauce': 'Chili',
    'menu-star-cereal': 'Star Cereal',
    'menu-honey': 'Honey',
    'menu-chocolate-cereal': 'Chocolate Cereal',
    'menu-maggie-soy': 'Maggie Soy Sauce',
    'menu-dark-chocolate-chips': 'Dark Chocolate Chips',
    'menu-black-pepper': 'Black Pepper',
    'menu-white-chocolate-chips': 'White Chocolate Chips',
    'menu-no-sauce': 'No Sauce',
    'menu-oregano': 'Oregano',
    'menu-chocolate2': 'Chocolate',
    'menu-strawberry2': 'Strawberry',
    'menu-mayonnaise': 'Mayonnaise'
  },
  th: {
    'welcome-heading': 'ยินดีต้อนรับสู่ร้านเครปของเรา',
    'welcome-text': 'ยินดีต้อนรับสู่ร้านเครปของเรา! เรามุ่งมั่นให้บริการลูกค้าด้วยความเอาใจใส่และเคารพ พร้อมทั้งทำเครปด้วยความรัก เพื่อมอบประสบการณ์ที่ดีที่สุดให้กับทุกท่าน',
    'banner-text': 'แบนเนอร์',
    'build-crepe': 'สร้างเครปของคุณ',
    'menu-title': 'เมนู',
    'menu-basic': 'เครปพื้นฐาน – 20 บาท, 1 ท็อปปิ้ง – 7 บาท, 3 ท็อปปิ้ง – 20 บาท',
    'menu-sauces': 'ซอสฟรี สามารถเพิ่มได้ไม่จำกัด',
    'menu-cream': 'วิปครีม – 20 บาท',
    'menu-sweet': 'ท็อปปิ้งหวาน',
    'menu-savory': 'ท็อปปิ้งรสชาติ',
    'menu-blueberry': 'บลูเบอร์รี่',
    'menu-golden-thread': 'ฝอยทอง',
    'menu-pulled-pork': 'หมูฉีก',
    'menu-strawberry1': 'สตรอว์เบอร์รี่',
    'menu-marshmallow': 'มาร์ชเมลโลว์',
    'menu-crabsticks': 'ปูอัด',
    'menu-orange': 'ส้ม',
    'menu-strawberry-jelly': 'เยลลี่สตรอว์เบอร์รี่',
    'menu-ham': 'แฮม',
    'menu-vanilla': 'วานิลลา',
    'menu-rainbow-sprinkles': 'สเปรย์น้ำตาลหลากสี',
    'menu-sausage': 'ไส้กรอก',
    'menu-chocolate1': 'ช็อกโกแลต',
    'menu-peanut-butter': 'เนยถั่ว',
    'menu-egg': 'ไข่',
    'menu-banana-cream': 'ครีมกล้วย',
    'menu-oreo': 'โอรีโอ',
    'menu-chili-paste': 'น้ำพริกเผา',
    'menu-pandan-custard': 'คัสตาร์ดใบเตย',
    'menu-ovaltine-powder': 'ผงโอวัลติน',
    'menu-pizza-sauce': 'ซอสพิซซ่า',
    'menu-raisins': 'ลูกเกด',
    'menu-ovaltine-flakes': 'โอวัลตินเกล็ด',
    'menu-spinach': 'ผักขม',
    'menu-nutella': 'นูเทลลา',
    'menu-banana': 'กล้วย',
    'menu-cheese': 'ชีส',
    'menu-cashew-nuts': 'เม็ดมะม่วงหิมพานต์',
    'menu-sauces-free': 'ซอส, ฟรี',
    'menu-almond': 'อัลมอนด์',
    'menu-condensed-milk': 'นมข้นหวาน',
    'menu-tomato': 'มะเขือเทศ',
    'menu-cornflakes': 'คอร์นเฟลก',
    'menu-caramel': 'คาราเมล',
    'menu-chili-sauce': 'พริก',
    'menu-star-cereal': 'ซีเรียลดาว',
    'menu-honey': 'น้ำผึ้ง',
    'menu-chocolate-cereal': 'ซีเรียลช็อกโกแลต',
    'menu-maggie-soy': 'ซอสแม็กกี้',
    'menu-dark-chocolate-chips': 'ช็อกโกแลตชิพเข้ม',
    'menu-black-pepper': 'พริกไทยดำ',
    'menu-white-chocolate-chips': 'ช็อกโกแลตชิพขาว',
    'menu-no-sauce': 'ไม่ใส่ซอส',
    'menu-oregano': 'ออริกาโน',
    'menu-chocolate2': 'ช็อกโกแลต',
    'menu-strawberry2': 'สตรอว์เบอร์รี่',
    'menu-mayonnaise': 'มายองเนส'
  }
};

export function Home() {
  const { language } = useLanguage();
  
  const t = (key: string) => content[language][key as keyof typeof content.en] || key;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Banner */}
      <div className="relative h-48 bg-gray-300 overflow-hidden">
        <img 
          src="/pics/banner.jpg" 
          alt={t('banner-text')} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center px-4">
            {t('welcome-heading')}
          </h1>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="mb-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-2/5">
              <img 
                src="/pics/entrance.jpg" 
                alt="Crepe Shop Entrance" 
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="w-full md:w-3/5">
              <p className="text-gray-700 leading-relaxed text-center text-lg">
                {t('welcome-text')}
              </p>
            </div>
          </div>
        </section>

           {/* Menu Table */}
          <section className="mb-10">
            <div className="bg-sky-50 rounded-2xl p-6 shadow-sm overflow-hidden">
              <table className="w-full border-collapse font-sans text-[15px]">
                 <tbody>
                   <tr>
                    <td className="text-center p-3 border border-violet-100/40 bg-indigo-100 font-bold text-lg" colSpan={3}>
                       {t('menu-title')}
                     </td>
                   </tr>
                   <tr>
                    <td className="text-center p-2 border border-violet-100/40 bg-indigo-100 font-bold" colSpan={3}>
                       {t('menu-basic')}
                     </td>
                   </tr>
                   <tr>
                    <td className="text-center p-2 border border-violet-100/40 bg-indigo-100 font-bold" colSpan={3}>
                       {t('menu-sauces')}
                     </td>
                   </tr>
                   <tr>
                    <td className="text-center p-2 border border-violet-100/40 bg-indigo-100 font-bold" colSpan={3}>
                       {t('menu-cream')}
                     </td>
                   </tr>
                   <tr>
                    <td className="text-center p-2 border border-violet-100/40 bg-indigo-100 font-bold" colSpan={1}>
                       {t('menu-sweet')}
                     </td>
                    <td className="text-center p-2 border border-violet-100/40 bg-indigo-100 font-bold" colSpan={2}>
                       {t('menu-savory')}
                     </td>
                   </tr>
                   <tr>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-blueberry')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-golden-thread')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-pulled-pork')}</td>
                   </tr>
                   <tr>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-strawberry1')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-marshmallow')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-crabsticks')}</td>
                   </tr>
                   <tr>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-orange')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-strawberry-jelly')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-ham')}</td>
                   </tr>
                   <tr>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-vanilla')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-rainbow-sprinkles')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-sausage')}</td>
                   </tr>
                   <tr>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-chocolate1')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-peanut-butter')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-egg')}</td>
                   </tr>
                   <tr>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-banana-cream')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-oreo')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-chili-paste')}</td>
                   </tr>
                   <tr>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-pandan-custard')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-ovaltine-powder')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-pizza-sauce')}</td>
                   </tr>
                   <tr>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-raisins')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-ovaltine-flakes')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-spinach')}</td>
                   </tr>
                   <tr>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-nutella')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-banana')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-cheese')}</td>
                   </tr>
                   <tr>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-cashew-nuts')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-indigo-100 font-bold" colSpan={2}>
                       {t('menu-sauces-free')}
                     </td>
                   </tr>
                   <tr>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-almond')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-condensed-milk')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-tomato')}</td>
                   </tr>
                   <tr>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-cornflakes')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-caramel')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-chili-sauce')}</td>
                   </tr>
                   <tr>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-star-cereal')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-honey')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-mayonnaise')}</td>
                   </tr>
                   <tr>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-chocolate-cereal')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-chocolate2')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-maggie-soy')}</td>
                   </tr>
                   <tr>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-dark-chocolate-chips')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-strawberry2')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-black-pepper')}</td>
                   </tr>
                   <tr>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-white-chocolate-chips')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-no-sauce')}</td>
                    <td className="text-center p-2 border border-violet-100/40 bg-sky-50">{t('menu-oregano')}</td>
                   </tr>
                 </tbody>
               </table>
             </div>
           </section>

      </main>
    </div>
  );
}


