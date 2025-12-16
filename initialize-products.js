
// ملف: initialize-products.js
// ضعه في نفس مجلد المشروع

console.log('🔄 تهيئة منتجات المتجر...');

// المنتجات الأصلية الكاملة
const initialProducts = [
    {
        "id": 1,
        "name": "سماعة رأس لاسلكية",
        "category": "إلكترونيات",
        "price": 250,
        "oldPrice": 300,
        "image": "headphones.png",
        "description": "سماعة رأس عالية الجودة مع إلغاء الضوضاء النشط، بطارية تدوم 30 ساعة.",
        "inStock": true,
        "featured": true
    },
    {
        "id": 2,
        "name": "هاتف ذكي",
        "category": "إلكترونيات",
        "price": 1200,
        "oldPrice": 1400,
        "image": "phone.png",
        "description": "أحدث هاتف ذكي بكاميرا رباعية، شاشة 6.7 بوصة، ذاكرة 128 جيجابايت.",
        "inStock": true,
        "featured": true
    },
    {
        "id": 3,
        "name": "ساعة ذكية",
        "category": "إلكترونيات",
        "price": 180,
        "oldPrice": 220,
        "image": "smartwatch.png",
        "description": "ساعة ذكية تتبع اللياقة، معدل ضربات القلب، النوم، مقاومة للماء.",
        "inStock": true,
        "featured": false
    },
    {
        "id": 4,
        "name": "لوحة مفاتيح ميكانيكية",
        "category": "إلكترونيات",
        "price": 90,
        "oldPrice": 120,
        "image": "keyboard.png",
        "description": "لوحة مفاتيح ميكانيكية بإضاءة RGB، مفاتيح حمراء، توصيل USB.",
        "inStock": true,
        "featured": true
    },
    {
        "id": 5,
        "name": "ماوس ألعاب",
        "category": "إكسسوارات",
        "price": 45,
        "oldPrice": 60,
        "image": "mouse.png",
        "description": "ماوس ألعاب بدقة 16000 نقطة في البوصة، 8 أزرار قابلة للبرمجة.",
        "inStock": true,
        "featured": false
    },
    {
        "id": 6,
        "name": "حقيبة كمبيوتر محمول",
        "category": "إكسسوارات",
        "price": 35,
        "oldPrice": 50,
        "image": "laptop-bag.png",
        "description": "حقيبة كمبيوتر محمول مقاومة للماء، جيوب متعددة، شاحن محمول.",
        "inStock": false,
        "featured": false
    }
];

// فحص وحفظ المنتجات
function initializeProducts() {
    const currentProducts = JSON.parse(localStorage.getItem('products')) || [];
    
    if (currentProducts.length === 0) {
        console.log('⚠️ لا توجد منتجات، جاري التهيئة...');
        localStorage.setItem('products', JSON.stringify(initialProducts));
        console.log(`✅ تم تهيئة ${initialProducts.length} منتج`);
        
        // إعادة تحميل الصفحة بعد ثانيتين
        setTimeout(() => {
            alert('✅ تم تهيئة المنتجات بنجاح!\nسيتم إعادة تحميل الصفحة...');
            location.reload();
        }, 2000);
    } else {
        console.log(`✅ المنتجات موجودة (${currentProducts.length} منتج)`);
    }
}

// تشغيل التهيئة عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', initializeProducts);
