import { useMemo, useState, useRef, useEffect } from 'react';
import { Button } from '@src/components/ui/Button';
import { createOrder } from '@src/lib/api/orders';
import { createQR } from '@src/lib/api/netlify';
import { QrModal } from './QrModal';
import { useLanguage } from '@src/lib/hooks/useLanguage';
import { 
  saveDraftOrder, 
  loadDraftOrder, 
  clearDraftOrder,
  savePendingOrder,
  getPendingOrders,
  removePendingOrder,
  createOrderInDatabase,
  updateOrderStatus,
  initializeOrderPersistence,
  type StoredOrder,
  type OrderItem
} from '@src/lib/orders/persistence';

// Language content
const content = {
  en: {
    'toppings': 'Toppings',
    'sauces': 'Sauces',
    'whipped-cream': 'Whipped Cream (+20)',
    'summary': 'Summary',
    'basic-crepe': 'Basic crepe: 20',
    'toppings-count': 'Toppings:',
    'whipped-cream-count': 'Whipped Cream:',
    'total': 'Total:',
    'add-to-order': 'Add to Order',
    'order-generate-qr': 'Order & Generate QR',
    'add': 'Add',
    'select-topping': 'Select topping',
    'select-sauce': 'Select sauce',
    'order-items': 'Order Items',
    'order-notes': 'Order Notes',
    'order-notes-placeholder': 'Any special instructions or notes for your order...'
  },
  th: {
    'toppings': 'ท็อปปิ้ง',
    'sauces': 'ซอส',
    'whipped-cream': 'วิปครีม (+20)',
    'summary': 'สรุปคำสั่งซื้อ',
    'basic-crepe': 'เครปพื้นฐาน: 20',
    'toppings-count': 'ท็อปปิ้ง:',
    'whipped-cream-count': 'วิปครีม:',
    'total': 'ราคารวม:',
    'add-to-order': 'เพิ่มในคำสั่งซื้อ',
    'order-generate-qr': 'สั่งและสร้างคิวอาร์',
    'add': 'เพิ่ม',
    'select-topping': 'เลือกท็อปปิ้ง',
    'select-sauce': 'เลือกซอส',
    'order-items': 'รายการสั่งซื้อ',
    'order-notes': 'หมายเหตุคำสั่งซื้อ',
    'order-notes-placeholder': 'คำแนะนำพิเศษหรือหมายเหตุสำหรับคำสั่งซื้อของคุณ...'
  }
};

const PRICING = { base: 20, single: 7, bundle3: 20, whipped: 20 } as const;

// Toppings with translations
const TOPPINGS = {
  en: [
    // Fruits
    'Blueberry', 'Strawberry', 'Orange', 'Vanilla', 'Chocolate', 'Banana cream', 'Pandan Custard',
    // Nuts & Seeds
    'Raisins', 'Cashew Nuts', 'Almond', 'Cornflakes', 'Chocolate Cereal', 'Star Cereal',
    // Chocolate
    'Dark Chocolate Chips', 'White Chocolate Chips', 'Nutella',
    // Proteins
    'Ham', 'Pulled Pork', 'Crabsticks', 'Sausage', 'Egg', 'Chili Paste', 'Pizza sauce', 'Spinach', 'Cheese', 'Tomato'
  ],
  th: [
    // Fruits
    'บลูเบอร์รี่', 'สตรอว์เบอร์รี่', 'ส้ม', 'วานิลลา', 'ช็อกโกแลต', 'ครีมกล้วย', 'คัสตาร์ดใบเตย',
    // Nuts & Seeds
    'ลูกเกด', 'เม็ดมะม่วงหิมพานต์', 'อัลมอนด์', 'คอร์นเฟลก', 'ซีเรียลช็อกโกแลต', 'ซีเรียลดาว',
    // Chocolate
    'ช็อกโกแลตชิปเข้ม', 'ช็อกโกแลตชิปขาว', 'นูเทลล่า',
    // Proteins
    'แฮม', 'หมูฉีก', 'ปูอัด', 'ไส้กรอก', 'ไข่', 'พริกเผา', 'ซอสพิซซ่า', 'ผักโขม', 'ชีส', 'มะเขือเทศ'
  ]
};

// Sauces with translations  
const SAUCES = {
  en: [
    // Sweet sauces
    'Golden thread', 'Marshmallow', 'Strawberry Jelly', 'Rainbow Sprinkles', 'Oreo', 'Ovaltine Powder', 'Ovaltine Flakes',
    'Banana', 'Condensed milk', 'Caramel', 'Honey', 'Chocolate', 'Strawberry',
    // Savory sauces
    'Chili', 'Mayonnaise', 'Maggie Soy Sauce', 'Black Pepper', 'Oregano', 'No Sauce'
  ],
  th: [
    // Sweet sauces
    'ไหมทอง', 'มาร์ชแมลโลว์', 'เยลลี่สตรอว์เบอร์รี่', 'สปริงเคิลสีรุ้ง', 'โอรีโอ', 'ผงโอวัลติน', 'เกล็ดโอวัลติน',
    'กล้วย', 'นมข้น', 'คาราเมล', 'น้ำผึ้ง', 'ช็อกโกแลต', 'สตรอว์เบอร์รี่',
    // Savory sauces
    'พริก', 'มายองเนส', 'ซอสแม็กกี้', 'พริกไทยดำ', 'ออริกาโน่', 'ไม่ใส่ซอส'
  ]
};

function calculateTotalBaht(toppingsCount: number, whipped: boolean) {
  const bundles = Math.floor(toppingsCount / 3);
  const remainder = toppingsCount % 3;
  const toppingCost = bundles * PRICING.bundle3 + remainder * PRICING.single;
  return PRICING.base + toppingCost + (whipped ? PRICING.whipped : 0);
}

export function OrderBuilder() {
  const { language } = useLanguage();
  const [toppings, setToppings] = useState<string[]>([]);
  const [sauces, setSauces] = useState<string[]>([]);
  const [whipped, setWhipped] = useState(false);
  const total = useMemo(() => calculateTotalBaht(toppings.length, whipped), [toppings, whipped]);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrText, setQrText] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  
  // Order list state
  const [orderItems, setOrderItems] = useState<Array<{
    id: string;
    toppings: string[];
    sauces: string[];
    whipped: boolean;
    total: number;
    createdAt: string;
  }>>([]);
  
  // Refs for select elements
  const toppingSelectRef = useRef<HTMLSelectElement>(null);
  const sauceSelectRef = useRef<HTMLSelectElement>(null);

  // Initialize persistence on component mount
  useEffect(() => {
    initializeOrderPersistence();
    
    // Load any existing draft order
    const draftOrder = loadDraftOrder();
    if (draftOrder && draftOrder.items.length > 0) {
      setOrderItems(draftOrder.items);
    }
  }, []);

  // Save draft order whenever orderItems change
  useEffect(() => {
    if (orderItems.length > 0) {
      const draftOrder: StoredOrder = {
        id: `draft-${Date.now()}`,
        items: orderItems,
        totalAmount: orderItems.reduce((sum, item) => sum + item.total, 0),
        status: 'draft',
        createdAt: new Date().toISOString()
      };
      saveDraftOrder(draftOrder);
    } else {
      clearDraftOrder();
    }
  }, [orderItems]);

  const t = (key: string) => content[language][key as keyof typeof content.en] || key;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t('toppings')}</label>
          <div className="flex gap-2">
            <select 
              ref={toppingSelectRef}
              className="border rounded px-3 py-2 flex-1"
              defaultValue=""
            >
              <option value="" disabled>{t('select-topping')}</option>
              {TOPPINGS[language].filter(x=>!toppings.includes(x)).map(x=> <option key={x} value={x}>{x}</option>)}
            </select>
            <Button onClick={()=>{ 
              const value = toppingSelectRef.current?.value;
              if(value && !toppings.includes(value)) {
                setToppings([...toppings, value]);
                if(toppingSelectRef.current) toppingSelectRef.current.value = '';
              }
            }}>{t('add')}</Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {toppings.map(x => (
              <span key={x} className="inline-flex items-center gap-1 bg-blueSoft rounded px-2 py-1 text-sm">{x}<button onClick={()=>setToppings(toppings.filter(t=>t!==x))}>×</button></span>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('sauces')}</label>
          <div className="flex gap-2">
            <select 
              ref={sauceSelectRef}
              className="border rounded px-3 py-2 flex-1"
              defaultValue=""
            >
              <option value="" disabled>{t('select-sauce')}</option>
              {SAUCES[language].filter(x=>!sauces.includes(x)).map(x=> <option key={x} value={x}>{x}</option>)}
            </select>
            <Button onClick={()=>{ 
              const value = sauceSelectRef.current?.value;
              if(value && !sauces.includes(value)) {
                setSauces([...sauces, value]);
                if(sauceSelectRef.current) sauceSelectRef.current.value = '';
              }
            }}>{t('add')}</Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {sauces.map(x => (
              <span key={x} className="inline-flex items-center gap-1 bg-blueSoft rounded px-2 py-1 text-sm">{x}<button onClick={()=>setSauces(sauces.filter(s=>s!==x))}>×</button></span>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-3"><input type="checkbox" checked={whipped} onChange={e=>setWhipped(e.target.checked)} /> {t('whipped-cream')}</label>
      </div>

      <div className="rounded border border-borderSoft p-4 h-max">
        <h3 className="font-semibold mb-2">{t('summary')}</h3>
        <ul className="text-sm space-y-1">
          <li>{t('basic-crepe')}</li>
          <li>{t('toppings-count')} {toppings.length}</li>
          <li>{t('whipped-cream-count')} {whipped ? 20 : 0}</li>
        </ul>
        <div className="mt-3 text-lg font-bold">{t('total')} {total} THB</div>
        
        {/* Order Items List */}
        {orderItems.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">{t('order-items')}:</h3>
            {orderItems.map((item, index) => (
              <div key={item.id} className="mb-2 p-2 bg-white rounded border">
                <div className="text-sm">
                  <strong>Crepe {index + 1}:</strong> {item.total} THB
                  {item.toppings.length > 0 && <div>Toppings: {item.toppings.join(', ')}</div>}
                  {item.sauces.length > 0 && <div>Sauces: {item.sauces.join(', ')}</div>}
                  {item.whipped && <div>Whipped Cream</div>}
                </div>
                <button 
                  onClick={() => setOrderItems(orderItems.filter(i => i.id !== item.id))}
                  className="text-red-500 text-xs mt-1"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="font-bold text-lg mt-2">
              Order Total: {orderItems.reduce((sum, item) => sum + item.total, 0)} THB
            </div>
          </div>
        )}
        
        {/* Order Notes */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">{t('order-notes')}</label>
          <textarea
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder={t('order-notes-placeholder')}
            className="w-full border rounded px-3 py-2 text-sm resize-none"
            rows={3}
          />
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" onClick={() => {
            // Add current crepe to order list
            const newItem = {
              id: `crepe-${Date.now()}`,
              toppings: [...toppings],
              sauces: [...sauces],
              whipped,
              total,
              createdAt: new Date().toISOString()
            };
            setOrderItems([...orderItems, newItem]);
            
            // Reset current crepe
            setToppings([]);
            setSauces([]);
            setWhipped(false);
            if(toppingSelectRef.current) toppingSelectRef.current.value = '';
            if(sauceSelectRef.current) sauceSelectRef.current.value = '';
          }}>{t('add-to-order')}</Button>
          <Button onClick={async () => {
            if (orderItems.length === 0) {
              alert('Please add at least one crepe to your order first!');
              return;
            }
            
            const orderTotal = orderItems.reduce((sum, item) => sum + item.total, 0);
            const orderId = `order-${Date.now()}`;
            const qrText = `PROMPTPAY|ORDER:${orderId}|AMOUNT:${orderTotal}|CURRENCY:THB`;
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
            
            // Create order in database
            const storedOrder: StoredOrder = {
              id: orderId,
              items: orderItems,
              totalAmount: orderTotal,
              status: 'qr_issued',
              qrCode: qrText,
              notes: orderNotes.trim() || undefined,
              createdAt: new Date().toISOString()
            };
            
            // Save to localStorage first
            savePendingOrder(storedOrder);
            
            // Try to save to database
            const dbResult = await createOrderInDatabase(storedOrder);
            if (dbResult.success) {
              console.log('Order saved to database:', dbResult.orderId);
            } else {
              console.warn('Failed to save to database, kept in localStorage:', dbResult.error);
            }
            
            // Clear draft order and notes
            clearDraftOrder();
            setOrderNotes('');
            
            // Show QR modal
            setQrText(qrText);
            setExpiresAt(expiresAt);
            setQrOpen(true);
          }}>{t('order-generate-qr')}</Button>
        </div>
      </div>
      <QrModal open={qrOpen} onClose={()=>setQrOpen(false)} qrText={qrText} expiresAt={expiresAt} />
    </div>
  );
}

// QR modal
// Rendered at the end to avoid layout shifts
export function OrderBuilderQrContainer({ open, onClose, qrText, expiresAt }: { open: boolean, onClose: ()=>void, qrText: string, expiresAt: string }) {
  return <QrModal open={open} onClose={onClose} qrText={qrText} expiresAt={expiresAt} />;
}


