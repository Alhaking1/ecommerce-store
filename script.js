/*
==============================================
متجر تقني - مجيب العباب
إصدار كامل مع جميع الميزات
==============================================
ملاحظات هامة للتعديلات المستقبلية:

1. تغيير بيانات المنتجات: عدل المصفوفة `products` في بداية الملف
2. تغيير ألوان التصميم: عدل ملف style.css
3. تغيير معلومات التواصل: ابحث عن "معلومات التواصل" في الكود
4. إضافة ميزات جديدة: ابحث عن الأقسام المناسبة وأضف الكود
==============================================
*/
// ==================== حماية حقوق النشر ====================
console.log(`
==============================================
🛡️ مشروع محمي بحقوق النشر
👨‍💻 المطور: مجيب العباب
📧 التواصل: mjyblwan0@gmail.com
📱 واتساب: 781238648
🌐 الموقع: https://alhaking1.github.io/my-portfolio
© 2023 جميع الحقوق محفوظة
==============================================
`);

// منع النسخ
document.addEventListener('copy', function(e) {
    if (!confirm('⚠️ يمنع نسخ محتوى هذا المشروع. هل تريد المتابعة؟')) {
        e.preventDefault();
        alert('هذا المشروع محمي بحقوق النشر والملكية الفكرية.');
    }
});

// فحص النطاق
function checkDomain() {
    const allowedDomains = ['localhost', '127.0.0.1', 'alhaking1.github.io', 'github.io'];
    const currentDomain = window.location.hostname;
    
    if (!allowedDomains.some(domain => currentDomain.includes(domain))) {
        console.warn('⚠️ تحذير: تم الوصول للمشروع من نطاق غير مصرح به:', currentDomain);
        
        // يمكنك إضافة رد فعل إضافي هنا
        const warning = confirm('⚠️ هذا المشروع محمي بحقوق النشر.\n\nالمطور: مجيب العباب\nالتواصل: mjyblwan0@gmail.com\n\nهل تريد المتابعة؟');
        if (!warning) {
            window.location.href = 'about:blank';
        }
    }
}

// استدعاء فحص النطاق عند التحميل
document.addEventListener('DOMContentLoaded', checkDomain);
// ==================== قسم 1: بيانات المنتجات ====================
// لتعديل المنتجات: أضف/احذف/عدل الكائنات في هذه المصفوفة
let products = [
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
  
  // ==================== قسم 2: المتغيرات العامة ====================
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  
  // ==================== قسم 3: عناصر DOM ====================
  // جميع العناصر المهمة في الصفحة
  const productsContainer = document.getElementById('productsContainer');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalPrice = document.getElementById('cartTotalPrice');
  const cartCount = document.querySelector('.cart-count');
  const cartToggle = document.getElementById('cartToggle');
  const closeCart = document.getElementById('closeCart');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const clearCartBtn = document.getElementById('clearCart');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const themeToggle = document.getElementById('themeToggle');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const discountCodeInput = document.getElementById('discountCode');
  const applyDiscountBtn = document.getElementById('applyDiscount');
  
  // ==================== قسم 4: تهيئة المتجر ====================
  document.addEventListener('DOMContentLoaded', () => {
      console.log('✅ متجر تقني - تم التحميل بنجاح!');
      console.log('👨‍💻 المطور: مجيب العباب');
      
      displayProducts(products);
      updateCartUI();
      setupEventListeners();
      
      // تحميل الوضع الداكن من الذاكرة
      if (localStorage.getItem('theme') === 'dark') {
          document.body.classList.add('dark-mode');
          themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
      }
      
      console.log(`📦 تم تحميل ${products.length} منتج`);
      console.log(`🛒 عناصر السلة: ${cart.length}`);
      console.log(`📋 عدد الطلبات السابقة: ${orders.length}`);
  });
  
  // ==================== قسم 5: عرض المنتجات ====================
  /**
   * دالة لعرض المنتجات في الصفحة
   * @param {Array} productsToDisplay - مصفوفة المنتجات المطلوب عرضها
   */
  function displayProducts(productsToDisplay) {
      if (!productsToDisplay || productsToDisplay.length === 0) {
          productsContainer.innerHTML = '<p class="empty">لا توجد منتجات في هذه الفئة.</p>';
          return;
      }
  
      productsContainer.innerHTML = productsToDisplay.map(product => {
          const placeholder = `https://via.placeholder.com/300x200/e0e0e0/666666?text=${encodeURIComponent(product.name.substring(0, 15))}`;
          
          return `
          <div class="product-card" data-category="${product.category}" data-featured="${product.featured}">
              <div class="product-img-container">
                  <img src="${placeholder}" 
                       alt="${product.name}" 
                       class="product-img"
                       data-real-src="${product.image}"
                       onerror="this.src='https://via.placeholder.com/300x200/ff6b35/FFFFFF?text=${encodeURIComponent(product.name.substring(0, 15))}'">
                  ${!product.inStock ? '<span class="out-of-stock-badge">نفذت الكمية</span>' : ''}
              </div>
              <div class="product-info">
                  <span class="product-category">${product.category}</span>
                  <h3 class="product-title">${product.name}</h3>
                  <p class="product-description">${product.description}</p>
                  
                  <div class="product-price">
                      <span class="current-price">${product.price} ر.س</span>
                      ${product.oldPrice ? `<span class="old-price">${product.oldPrice} ر.س</span>` : ''}
                  </div>
                  
                  <div class="product-actions">
                      <button class="add-to-cart ${!product.inStock ? 'out-of-stock' : ''}" 
                              data-id="${product.id}"
                              ${!product.inStock ? 'disabled' : ''}>
                          ${!product.inStock ? 'نفذت الكمية' : '<i class="fas fa-cart-plus"></i> أضف للسلة'}
                      </button>
                      <button class="details-btn" data-id="${product.id}">
                          <i class="fas fa-info-circle"></i> تفاصيل
                      </button>
                  </div>
              </div>
          </div>
          `;
      }).join('');
  
      // تحميل الصور المحلية بعد عرض المنتجات
      setTimeout(loadProductImages, 100);
  
      // إضافة مستمعي الأحداث للأزرار
      document.querySelectorAll('.add-to-cart').forEach(button => {
          button.addEventListener('click', (e) => {
              const productId = e.target.closest('button').dataset.id;
              addToCart(productId);
          });
      });
      
      document.querySelectorAll('.details-btn').forEach(button => {
          button.addEventListener('click', (e) => {
              const productId = e.target.closest('button').dataset.id;
              showProductDetails(productId);
          });
      });
  }
  
  // ==================== قسم 6: إدارة السلة ====================
  /**
   * إضافة منتج إلى سلة التسوق
   * @param {number} productId - معرف المنتج
   */
  function addToCart(productId) {
      const product = products.find(p => p.id == productId);
      
      if (!product) {
          console.error('المنتج غير موجود:', productId);
          return;
      }
      
      if (!product.inStock) {
          alert('هذا المنتج غير متوفر حالياً');
          return;
      }
      
      const existingItem = cart.find(item => item.id == productId);
      
      if (existingItem) {
          existingItem.quantity++;
      } else {
          cart.push({
              ...product,
              quantity: 1
          });
      }
      
      updateCartUI();
      showNotification(`تم إضافة "${product.name}" إلى سلة التسوق`);
  }
  
  /**
   * تحديث واجهة سلة التسوق
   */
  function updateCartUI() {
      // حفظ السلة في localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // تحديث العداد
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
      
      // تحديث عناصر السلة
      if (cart.length === 0) {
          cartItemsContainer.innerHTML = '<p class="empty-cart-msg">سلة التسوق فارغة</p>';
          cartTotalPrice.textContent = '0.00';
          return;
      }
      
      cartItemsContainer.innerHTML = cart.map(item => {
          const imageId = `cart-img-${item.id}-${Date.now()}`;
          
          return `
          <div class="cart-item" data-id="${item.id}">
              <img id="${imageId}" 
                   src="https://via.placeholder.com/100x100/e0e0e0/666666?text=جار+التحميل" 
                   alt="${item.name}" 
                   class="cart-item-img"
                   data-real-src="${item.image}">
              <div class="cart-item-info">
                  <h4 class="cart-item-title">${item.name}</h4>
                  <p class="cart-item-price">${item.price} ر.س × ${item.quantity}</p>
              </div>
              <div class="cart-item-actions">
                  <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                  <span class="quantity">${item.quantity}</span>
                  <button class="quantity-btn increase" data-id="${item.id}">+</button>
                  <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
              </div>
          </div>
          `;
      }).join('');
      
      // تحميل صور السلة المحلية
      setTimeout(() => {
          cart.forEach((item, index) => {
              const imgElement = document.querySelector(`.cart-item:nth-child(${index + 1}) .cart-item-img`);
              if (imgElement && item.image) {
                  loadCartImage(imgElement, item.image, item.name);
              }
          });
      }, 150);
      
      // حساب الإجمالي
      const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      cartTotalPrice.textContent = totalPrice.toFixed(2);
      
      // إضافة مستمعي الأحداث لعناصر السلة
      document.querySelectorAll('.decrease').forEach(btn => {
          btn.addEventListener('click', (e) => updateQuantity(e.target.dataset.id, -1));
      });
      
      document.querySelectorAll('.increase').forEach(btn => {
          btn.addEventListener('click', (e) => updateQuantity(e.target.dataset.id, 1));
      });
      
      document.querySelectorAll('.remove-item').forEach(btn => {
          btn.addEventListener('click', (e) => removeFromCart(e.target.closest('button').dataset.id));
      });
  }
  
  /**
   * تحديث كمية المنتج في السلة
   */
  function updateQuantity(productId, change) {
      const item = cart.find(item => item.id == productId);
      
      if (!item) return;
      
      item.quantity += change;
      
      if (item.quantity <= 0) {
          cart = cart.filter(item => item.id != productId);
      }
      
      updateCartUI();
  }
  
  /**
   * حذف منتج من السلة
   */
  function removeFromCart(productId) {
      cart = cart.filter(item => item.id != productId);
      updateCartUI();
      showNotification('تم حذف المنتج من السلة');
  }
  
  /**
   * تفريغ سلة التسوق
   */
  function clearCart() {
      if (cart.length === 0) return;
      
      if (confirm('هل أنت متأكد من تفريغ سلة التسوق؟')) {
          cart = [];
          updateCartUI();
          showNotification('تم تفريغ سلة التسوق');
      }
  }
  
  // ==================== قسم 7: عملية الشراء ====================
  /**
   * بدء عملية الشراء
   */
  function checkout() {
      if (cart.length === 0) {
          alert('سلة التسوق فارغة. أضف منتجات أولاً.');
          return;
      }
      
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      
      showContactForm(total, totalItems);
  }
  
  /**
   * عرض نموذج معلومات العميل
   */
  function showContactForm(total, totalItems) {
      const modalHTML = `
          <div class="modal-overlay" id="contactModal">
              <div class="modal">
                  <div class="modal-header">
                      <h3><i class="fas fa-user-circle"></i> معلومات الاتصال للطلب</h3>
                      <button class="close-modal">&times;</button>
                  </div>
                  <div class="modal-body">
                      <div class="order-summary">
                          <p><strong>إجمالي الطلب:</strong> ${total.toFixed(2)} ر.س</p>
                          <p><strong>عدد المنتجات:</strong> ${totalItems}</p>
                          <hr>
                          <p style="color: #666; font-size: 0.9rem;">
                              <i class="fas fa-info-circle"></i> سيتم حفظ طلبك وإرسال تفاصيل الاتصال
                          </p>
                      </div>
                      
                      <form id="customerForm">
                          <div class="form-group">
                              <label for="customerName"><i class="fas fa-user"></i> الاسم الكامل *</label>
                              <input type="text" id="customerName" required placeholder="أدخل اسمك الكامل">
                          </div>
                          <div class="form-group">
                              <label for="customerPhone"><i class="fas fa-phone"></i> رقم الهاتف *</label>
                              <input type="tel" id="customerPhone" required placeholder="مثال: 05xxxxxxxx">
                          </div>
                          <div class="form-group">
                              <label for="customerEmail"><i class="fas fa-envelope"></i> البريد الإلكتروني</label>
                              <input type="email" id="customerEmail" placeholder="اختياري - للإرسال التلقائي">
                          </div>
                          <div class="form-group">
                              <label for="customerAddress"><i class="fas fa-map-marker-alt"></i> العنوان</label>
                              <textarea id="customerAddress" rows="2" placeholder="المدينة، الحي، الشارع (اختياري)"></textarea>
                          </div>
                          <div class="form-group">
                              <label for="customerNotes"><i class="fas fa-sticky-note"></i> ملاحظات إضافية</label>
                              <textarea id="customerNotes" rows="2" placeholder="ملاحظات حول التوصيل أو الطلب"></textarea>
                          </div>
                      </form>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary close-modal" style="flex: 1;">
                          <i class="fas fa-times"></i> إلغاء
                      </button>
                      <button type="button" class="btn" id="submitOrderBtn" style="flex: 2;">
                          <i class="fas fa-paper-plane"></i> إرسال الطلب
                      </button>
                  </div>
              </div>
          </div>
      `;
      
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      
      // مستمعي الأحداث للنموذج
      document.getElementById('submitOrderBtn').addEventListener('click', submitOrder);
      
      document.querySelectorAll('.close-modal').forEach(btn => {
          btn.addEventListener('click', () => {
              document.getElementById('contactModal').remove();
          });
      });
  }
  
  /**
   * إرسال الطلب وحفظ البيانات
   */
  function submitOrder() {
      const customerName = document.getElementById('customerName').value.trim();
      const customerPhone = document.getElementById('customerPhone').value.trim();
      const customerEmail = document.getElementById('customerEmail').value.trim();
      const customerAddress = document.getElementById('customerAddress').value.trim();
      const customerNotes = document.getElementById('customerNotes').value.trim();
      
      // التحقق من البيانات المطلوبة
      if (!customerName || !customerPhone) {
          alert('الرجاء إدخال الاسم ورقم الهاتف');
          return;
      }
      
      // إنشاء كائن الطلب
      const orderDetails = {
          id: Date.now(), // معرف فريد للطلب
          customer: {
              name: customerName,
              phone: customerPhone,
              email: customerEmail || 'لم يذكر',
              address: customerAddress || 'لم يذكر',
              notes: customerNotes || 'لا توجد'
          },
          cart: [...cart], // نسخة من السلة
          total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          date: new Date().toLocaleString('ar-SA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
          }),
          status: 'جديد'
      };
      
      // حفظ الطلب في localStorage
      orders.push(orderDetails);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // عرض خيارات الإرسال
      showDeliveryOptions(orderDetails);
  }
  
  /**
   * عرض خيارات توصيل الطلب
   */
  function showDeliveryOptions(orderDetails) {
      document.getElementById('contactModal').remove();
      
      const optionsHTML = `
          <div class="modal-overlay" id="deliveryModal">
              <div class="modal">
                  <div class="modal-header">
                      <h3><i class="fas fa-shipping-fast"></i> خيارات استلام الطلب</h3>
                      <button class="close-modal">&times;</button>
                  </div>
                  <div class="modal-body">
                      <div class="order-summary">
                          <p><strong>رقم الطلب:</strong> #${orderDetails.id.toString().slice(-6)}</p>
                          <p><strong>العميل:</strong> ${orderDetails.customer.name}</p>
                          <p><strong>الإجمالي:</strong> ${orderDetails.total.toFixed(2)} ر.س</p>
                      </div>
                      
                      <div style="margin: 25px 0;">
                          <h4 style="color: #2d5af1; margin-bottom: 15px;">اختر طريقة التواصل:</h4>
                          
                          <div class="delivery-option" data-method="whatsapp">
                              <div class="option-icon" style="background-color: #25D366;">
                                  <i class="fab fa-whatsapp"></i>
                              </div>
                              <div class="option-info">
                                  <h5>إرسال طلب واتساب</h5>
                                  <p>سيتم إرسال تفاصيل طلبك عبر واتساب</p>
                              </div>
                              <div class="option-arrow">
                                  <i class="fas fa-arrow-left"></i>
                              </div>
                          </div>
                          
                          <div class="delivery-option" data-method="email" style="margin-top: 15px;">
                              <div class="option-icon" style="background-color: #D44638;">
                                  <i class="fas fa-envelope"></i>
                              </div>
                              <div class="option-info">
                                  <h5>إرسال بريد إلكتروني</h5>
                                  <p>سيتم إرسال تفاصيل طلبك عبر الإيميل</p>
                              </div>
                              <div class="option-arrow">
                                  <i class="fas fa-arrow-left"></i>
                              </div>
                          </div>
                          
                          <div class="delivery-option" data-method="manual" style="margin-top: 15px;">
                              <div class="option-icon" style="background-color: #6c757d;">
                                  <i class="fas fa-save"></i>
                              </div>
                              <div class="option-info">
                                  <h5>حفظ الطلب فقط</h5>
                                  <p>سيتم حفظ الطلب وسأتصل بك لاحقاً</p>
                              </div>
                              <div class="option-arrow">
                                  <i class="fas fa-arrow-left"></i>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary close-modal">
                          <i class="fas fa-times"></i> إغلاق
                      </button>
                  </div>
              </div>
          </div>
      `;
      
      document.body.insertAdjacentHTML('beforeend', optionsHTML);
      
      // إضافة الأنماط للخيارات
      const style = document.createElement('style');
      style.textContent = `
          .delivery-option {
              display: flex;
              align-items: center;
              padding: 15px;
              border: 2px solid #ddd;
              border-radius: 10px;
              cursor: pointer;
              transition: all 0.3s ease;
          }
          
          .delivery-option:hover {
              border-color: #2d5af1;
              transform: translateX(-5px);
          }
          
          .option-icon {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 1.5rem;
              margin-left: 15px;
          }
          
          .option-info {
              flex: 1;
          }
          
          .option-info h5 {
              margin: 0 0 5px 0;
              color: #333;
          }
          
          .option-info p {
              margin: 0;
              color: #666;
              font-size: 0.9rem;
          }
          
          .option-arrow {
              color: #999;
              font-size: 1.2rem;
          }
          
          .dark-mode .delivery-option {
              border-color: #444;
          }
          
          .dark-mode .delivery-option:hover {
              border-color: #5d8aff;
          }
          
          .dark-mode .option-info h5 {
              color: #eee;
          }
          
          .dark-mode .option-info p {
              color: #bbb;
          }
      `;
      document.head.appendChild(style);
      
      // مستمعي الأحداث للخيارات
      document.querySelectorAll('.delivery-option').forEach(option => {
          option.addEventListener('click', () => {
              const method = option.getAttribute('data-method');
              handleDeliveryMethod(method, orderDetails);
          });
      });
      
      document.querySelectorAll('.close-modal').forEach(btn => {
          btn.addEventListener('click', () => {
              document.getElementById('deliveryModal').remove();
              completeOrder();
          });
      });
  }
  
  /**
   * معالجة طريقة التوصيل المختارة
   */
  function handleDeliveryMethod(method, orderDetails) {
      switch(method) {
          case 'whatsapp':
              sendWhatsAppOrder(orderDetails);
              break;
          case 'email':
              sendEmailOrder(orderDetails);
              break;
          case 'manual':
              saveOrderOnly(orderDetails);
              break;
      }
      
      document.getElementById('deliveryModal').remove();
      completeOrder();
  }
  
  /**
   * إرسال الطلب عبر واتساب
   */
  function sendWhatsAppOrder(orderDetails) {
      const message = `📋 *طلب جديد من المتجر الإلكتروني*
      
  👤 *العميل:* ${orderDetails.customer.name}
  📞 *الهاتف:* ${orderDetails.customer.phone}
  📧 *الإيميل:* ${orderDetails.customer.email}
  📍 *العنوان:* ${orderDetails.customer.address}
  📝 *ملاحظات:* ${orderDetails.customer.notes}
  
  🛒 *المنتجات:*
  ${orderDetails.cart.map(item => `▫️ ${item.name} (${item.quantity} × ${item.price} ر.س) = ${item.quantity * item.price} ر.س`).join('\n')}
  
  💰 *الإجمالي:* ${orderDetails.total.toFixed(2)} ر.س
  📅 *التاريخ:* ${orderDetails.date}
  🆔 *رقم الطلب:* #${orderDetails.id.toString().slice(-6)}`;
  
      const whatsappLink = `https://wa.me/781238648?text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, '_blank');
  }
  
  /**
   * إرسال الطلب عبر البريد الإلكتروني
   */
  function sendEmailOrder(orderDetails) {
      const subject = `طلب جديد #${orderDetails.id.toString().slice(-6)} - ${orderDetails.customer.name}`;
      const body = `طلب جديد من المتجر الإلكتروني:
  
  معلومات العميل:
  الاسم: ${orderDetails.customer.name}
  الهاتف: ${orderDetails.customer.phone}
  البريد الإلكتروني: ${orderDetails.customer.email}
  العنوان: ${orderDetails.customer.address}
  ملاحظات: ${orderDetails.customer.notes}
  
  تفاصيل الطلب:
  ${orderDetails.cart.map(item => `- ${item.name} (الكمية: ${item.quantity}, السعر: ${item.price} ر.س)`).join('\n')}
  
  الإجمالي: ${orderDetails.total.toFixed(2)} ر.س
  التاريخ: ${orderDetails.date}
  رقم الطلب: #${orderDetails.id.toString().slice(-6)}
  
  ---
  هذا الطلب تم إنشاؤه تلقائياً من المتجر الإلكتروني.`;
  
      const mailtoLink = `mailto:mjyblwan0@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
  }
  
  /**
   * حفظ الطلب فقط بدون إرسال
   */
  function saveOrderOnly(orderDetails) {
      showNotification(`✅ تم حفظ الطلب #${orderDetails.id.toString().slice(-6)} بنجاح`);
  }
  
  /**
   * إكمال عملية الطلب
   */
  function completeOrder() {
      // تفريغ السلة
      cart = [];
      updateCartUI();
      
      // إغلاق سلة التسوق
      cartSidebar.classList.remove('active');
      cartOverlay.classList.remove('active');
      
      // رسالة نجاح
      const successMsg = `🎉 تم إتمام الطلب بنجاح!
  
  شكراً لتسوقك من متجرنا. 
  سنتواصل معك قريباً لتأكيد تفاصيل الطلب.
  
  للتواصل المباشر:
  📱 واتساب: 781238648
  📧 إيميل: mjyblwan0@gmail.com`;
      
      alert(successMsg);
  }
  
  // ==================== قسم 8: الميزات الإضافية ====================
  /**
   * تطبيق كود الخصم
   */
  function applyDiscount() {
      const code = discountCodeInput.value.trim().toUpperCase();
      
      if (!code) {
          alert('الرجاء إدخال كود الخصم');
          return;
      }
      
      const discountCodes = {
          'TECH10': 10,
          'WELCOME20': 20,
          'SAVE30': 30
      };
      
      if (discountCodes[code]) {
          const discountPercent = discountCodes[code];
          const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const discountAmount = (total * discountPercent) / 100;
          const finalPrice = total - discountAmount;
          
          cartTotalPrice.innerHTML = `
              <span style="text-decoration: line-through; color: #6c757d; margin-left: 10px;">
                  ${total.toFixed(2)}
              </span>
              ${finalPrice.toFixed(2)}
              <small style="display: block; font-size: 0.8rem; color: #28a745;">
                  (وفرت ${discountPercent}% = ${discountAmount.toFixed(2)} ر.س)
              </small>
          `;
          
          showNotification(`تم تطبيق خصم ${discountPercent}% بنجاح!`);
          discountCodeInput.value = '';
      } else {
          alert('كود الخصم غير صالح أو منتهي الصلاحية');
      }
  }
  
  /**
   * عرض تفاصيل المنتج
   */
  function showProductDetails(productId) {
      const product = products.find(p => p.id == productId);
      
      if (!product) return;
      
      const modalHTML = `
          <div class="modal-overlay" id="productModalOverlay">
              <div class="modal">
                  <div class="modal-header">
                      <h3>${product.name}</h3>
                      <button class="close-modal">&times;</button>
                  </div>
                  <div class="modal-body">
                      <img src="${product.image}" alt="${product.name}" 
                           style="width: 100%; max-height: 300px; object-fit: contain; background-color: #f5f5f5; padding: 15px; border-radius: 10px;"
                           onerror="this.src='https://via.placeholder.com/400x300/2d5af1/FFFFFF?text=${encodeURIComponent(product.name)}'">
                      
                      <div style="margin-top: 20px;">
                          <p><strong><i class="fas fa-tag"></i> الفئة:</strong> ${product.category}</p>
                          <p><strong><i class="fas fa-info-circle"></i> الوصف:</strong> ${product.description}</p>
                          <p><strong><i class="fas fa-money-bill-wave"></i> السعر:</strong> 
                              <span style="font-size: 1.3rem; color: #2d5af1; font-weight: bold;">${product.price} ر.س</span>
                              ${product.oldPrice ? `<span style="text-decoration: line-through; color: #999; margin-right: 15px;">${product.oldPrice} ر.س</span>` : ''}
                          </p>
                          <p><strong><i class="fas fa-box"></i> الحالة:</strong> 
                              <span style="color: ${product.inStock ? '#28a745' : '#dc3545'}; font-weight: bold;">
                                  ${product.inStock ? '🟢 متوفر' : '🔴 نفذت الكمية'}
                              </span>
                          </p>
                      </div>
                  </div>
                  <div class="modal-footer">
                      <button class="btn btn-secondary close-modal" style="flex: 1;">
                          <i class="fas fa-times"></i> إغلاق
                      </button>
                      <button class="btn add-to-cart-modal" data-id="${product.id}" 
                              ${!product.inStock ? 'disabled' : ''} style="flex: 2;">
                          ${!product.inStock ? 'نفذت الكمية' : '<i class="fas fa-cart-plus"></i> أضف إلى السلة'}
                      </button>
                  </div>
              </div>
          </div>
      `;
      
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      
      document.querySelectorAll('.close-modal').forEach(btn => {
          btn.addEventListener('click', () => {
              document.getElementById('productModalOverlay').remove();
          });
      });
      
      document.querySelector('.add-to-cart-modal')?.addEventListener('click', () => {
          addToCart(productId);
          document.getElementById('productModalOverlay').remove();
      });
  }
  
  /**
   * فلترة المنتجات حسب الفئة
   */
  function filterProducts(filter) {
      let filteredProducts = products;
      
      if (filter === 'إلكترونيات' || filter === 'إكسسوارات') {
          filteredProducts = products.filter(p => p.category === filter);
      } else if (filter === 'featured') {
          filteredProducts = products.filter(p => p.featured);
      }
      
      displayProducts(filteredProducts);
      
      filterButtons.forEach(btn => {
          if (btn.dataset.filter === filter) {
              btn.classList.add('active');
          } else {
              btn.classList.remove('active');
          }
      });
  }
  
  /**
   * التبديل بين الوضع الداكن والفاتح
   */
  function toggleTheme() {
      document.body.classList.toggle('dark-mode');
      const icon = themeToggle.querySelector('i');
      
      if (document.body.classList.contains('dark-mode')) {
          icon.classList.replace('fa-moon', 'fa-sun');
          localStorage.setItem('theme', 'dark');
      } else {
          icon.classList.replace('fa-sun', 'fa-moon');
          localStorage.setItem('theme', 'light');
      }
  }
  
  // ==================== قسم 9: معالجة الصور ====================
  /**
   * تحميل صور المنتجات المحلية
   */
  function loadProductImages() {
      document.querySelectorAll('.product-img[data-real-src]').forEach(img => {
          const realSrc = img.getAttribute('data-real-src');
          const tempImg = new Image();
          
          tempImg.onload = function() {
              img.src = realSrc;
              img.style.objectFit = "contain";
              img.style.backgroundColor = "#f5f5f5";
              img.style.padding = "15px";
          };
          
          tempImg.onerror = function() {
              img.src = `https://via.placeholder.com/300x200/2d5af1/FFFFFF?text=${encodeURIComponent(img.alt.substring(0, 15))}`;
          };
          
          tempImg.src = realSrc;
      });
  }
  
  /**
   * تحميل صور السلة المحلية
   */
  function loadCartImage(imgElement, imageSrc, productName) {
      const tempImg = new Image();
      
      tempImg.onload = function() {
          imgElement.src = imageSrc;
          imgElement.style.objectFit = "contain";
          imgElement.style.backgroundColor = "#f5f5f5";
          imgElement.style.padding = "5px";
      };
      
      tempImg.onerror = function() {
          imgElement.src = `https://via.placeholder.com/100x100/2d5af1/FFFFFF?text=${encodeURIComponent(productName.substring(0, 10))}`;
      };
      
      tempImg.src = imageSrc;
  }
  
  // ==================== قسم 10: الأدوات المساعدة ====================
  /**
   * عرض إشعار للمستخدم
   */
  function showNotification(message) {
      const existingNotification = document.querySelector('.notification');
      if (existingNotification) {
          existingNotification.remove();
      }
      
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = message;
      notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background-color: #28a745;
          color: white;
          padding: 15px 25px;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          z-index: 3000;
          animation: slideIn 0.3s ease;
      `;
      
      // إضافة أنيميشن
      const animationStyle = document.createElement('style');
      animationStyle.textContent = `
          @keyframes slideIn {
              from { transform: translateX(100px); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
              from { transform: translateX(0); opacity: 1; }
              to { transform: translateX(100px); opacity: 0; }
          }
      `;
      document.head.appendChild(animationStyle);
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
          notification.style.animation = 'slideOut 0.3s ease';
          setTimeout(() => notification.remove(), 300);
      }, 3000);
  }
  
  /**
   * إعداد جميع مستمعي الأحداث
   */
  function setupEventListeners() {
      // سلة التسوق
      cartToggle.addEventListener('click', () => {
          cartSidebar.classList.add('active');
          cartOverlay.classList.add('active');
      });
      
      closeCart.addEventListener('click', () => {
          cartSidebar.classList.remove('active');
          cartOverlay.classList.remove('active');
      });
      
      cartOverlay.addEventListener('click', () => {
          cartSidebar.classList.remove('active');
          cartOverlay.classList.remove('active');
      });
      
      // الفلترة
      filterButtons.forEach(btn => {
          btn.addEventListener('click', () => filterProducts(btn.dataset.filter));
      });
      
      // الأزرار
      clearCartBtn.addEventListener('click', clearCart);
      checkoutBtn.addEventListener('click', checkout);
      themeToggle.addEventListener('click', toggleTheme);
      applyDiscountBtn.addEventListener('click', applyDiscount);
      
      // إدخال كود الخصم
      discountCodeInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') applyDiscount();
      });
      
      // إغلاق النوافذ عند الضغط على ESC
      document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
              document.querySelectorAll('.modal-overlay').forEach(modal => {
                  modal.remove();
              });
              cartSidebar.classList.remove('active');
              cartOverlay.classList.remove('active');
          }
      });
  }
  
  // ==================== قسم 11: التحسينات الإضافية ====================
  // تحسينات الأداء والتجربة
  setTimeout(() => {
      // تحديث الصور بعد تحميل الصفحة
      loadProductImages();
      
      // تسجيل الإحصائيات
      console.log('📊 إحصائيات المتجر:');
      console.log(`   - المنتجات: ${products.length}`);
      console.log(`   - الطلبات السابقة: ${orders.length}`);
      console.log(`   - السعة التخزينية: ${JSON.stringify(localStorage).length} حرف`);
  }, 1000);
  
  // ==================== قسم 12: معلومات المطور ====================
  console.log(`
  ==============================================
  🎉 متجر تقني - الإصدار النهائي
  👨‍💻 المطور: مجيب العباب
  📧 التواصل: mjyblwan0@gmail.com
  📱 واتساب: 781238648
  🌐 الموقع الشخصي: https://alhaking1.github.io/my-portfolio
  ==============================================
  `);
  
  // إظهار رسالة ترحيب عند فتح Console
  window.addEventListener('load', () => {
      console.log('%cمرحباً في متجر تقني! 🔧', 'color: #2d5af1; font-size: 16px; font-weight: bold;');
      console.log('%cجميع الحقوق محفوظة © 2023 مجيب العباب', 'color: #666; font-style: italic;');
      // ==================== قسم 13: مزامنة المنتجات مع لوحة التحكم ====================
/**
 * حفظ المنتجات الحالية في localStorage للتتوافق مع لوحة التحكم
 */
function syncProductsToLocalStorage() {
    console.log('💾 حفظ المنتجات في localStorage للتوافق مع لوحة التحكم...');
    
    // تحقق مما إذا كانت المنتجات في localStorage مختلفة عن المنتجات الحالية
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    const currentProductsJSON = JSON.stringify(products);
    const storedProductsJSON = JSON.stringify(storedProducts);
    
    if (currentProductsJSON !== storedProductsJSON) {
        console.log('🔄 تحديث localStorage بالمنتجات الحالية...');
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('products_last_update', Date.now());
        console.log(`✅ تم حفظ ${products.length} منتج في localStorage`);
    }
}

/**
 * تحميل المنتجات من localStorage إذا كانت موجودة
 */
function loadProductsFromLocalStorage() {
    console.log('📥 تحميل المنتجات من localStorage...');
    
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    
    if (storedProducts.length > 0) {
        console.log(`📦 تم العثور على ${storedProducts.length} منتج في localStorage`);
        
        // دمج المنتجات من localStorage مع المنتجات الافتراضية
        const defaultProducts = products;
        const mergedProducts = [];
        
        // استخدام معرف المنتج كمعرّف فريد للدمج
        const allProductIds = new Set();
        
        // أولاً: إضافة المنتجات من localStorage
        storedProducts.forEach(product => {
            mergedProducts.push(product);
            allProductIds.add(product.id);
        });
        
        // ثانياً: إضافة المنتجات الافتراضية غير الموجودة في localStorage
        defaultProducts.forEach(product => {
            if (!allProductIds.has(product.id)) {
                mergedProducts.push(product);
            }
        });
        
        // تحديث متغير products
        products = mergedProducts;
        console.log(`🔄 تم دمج المنتجات. العدد النهائي: ${products.length} منتج`);
        
        // إعادة عرض المنتجات المدمجة
        displayProducts(products);
    } else {
        console.log('⚠️ لا توجد منتجات في localStorage، سيتم استخدام المنتجات الافتراضية');
        // حفظ المنتجات الافتراضية في localStorage لأول مرة
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('products_last_update', Date.now());
    }
}

// ==================== قسم 14: تحديث المنتجات من لوحة التحكم ====================
/**
 * التحقق من تحديث المنتجات من لوحة التحكم
 */
function checkForAdminProductUpdates() {
    const lastUpdate = localStorage.getItem('products_last_update');
    const now = Date.now();
    
    if (lastUpdate) {
        const timeDiff = (now - parseInt(lastUpdate)) / 1000; // الفرق بالثواني
        console.log(`⏰ آخر تحديث: منذ ${Math.floor(timeDiff)} ثانية`);
        
        // إذا تم التحديث خلال آخر 60 ثانية
        if (timeDiff < 60) {
            console.log('🔄 تم تحديث المنتجات مؤخراً، جاري التحديث...');
            refreshProductsFromAdmin();
        }
    }
}

/**
 * تحديث المنتجات من localStorage (يتم استدعاؤه من لوحة التحكم)
 */
function refreshProductsFromAdmin() {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    console.log(`🔄 تحديث ${storedProducts.length} منتج من لوحة التحكم`);
    
    if (storedProducts.length > 0) {
        // تحديث المنتجات الحالية
        products = storedProducts;
        
        // إعادة عرض المنتجات المحدثة
        displayProducts(products);
        
        // إظهار إشعار للمستخدم
        showNotification('تم تحديث المنتجات بنجاح ✓');
        
        console.log('✅ تم تحديث المنتجات من لوحة التحكم');
    }
}

// ==================== قسم 15: إشعار تحديث المنتجات ====================
/**
 * إظهار إشعار عند تحديث المنتجات في لوحة التحكم
 */
function showProductUpdateNotification() {
    // إزالة أي إشعار سابق
    const existingNotification = document.getElementById('productUpdateNotification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.id = 'productUpdateNotification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #2d5af1 0%, #1a47c9 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(45, 90, 241, 0.3);
            z-index: 4000;
            display: flex;
            align-items: center;
            gap: 15px;
            animation: slideInRight 0.3s ease;
            font-family: 'Cairo', sans-serif;
            max-width: 400px;
        ">
            <i class="fas fa-sync-alt" style="font-size: 1.5rem;"></i>
            <div>
                <strong>تم تحديث المنتجات</strong>
                <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.9;">
                    تم تحديث المنتجات من لوحة التحكم
                </p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; color: white; cursor: pointer; margin-right: auto;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار تلقائياً بعد 5 ثواني
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ==================== قسم 16: التهيئة النهائية ====================
// تعديل تهيئة المتجر لتحميل المنتجات من localStorage
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ متجر تقني - تم التحميل بنجاح!');
    console.log('👨‍💻 المطور: مجيب العباب');
    
    // 1. أولاً: تحميل المنتجات من localStorage
    loadProductsFromLocalStorage();
    
    // 2. عرض المنتجات
    displayProducts(products);
    
    // 3. تحديث السلة
    updateCartUI();
    
    // 4. إعداد الأحداث
    setupEventListeners();
    
    // 5. تحميل الوضع الداكن من الذاكرة
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }
    
    console.log(`📦 تم تحميل ${products.length} منتج`);
    console.log(`🛒 عناصر السلة: ${cart.length}`);
    console.log(`📋 عدد الطلبات السابقة: ${orders.length}`);
    
    // 6. التحقق من تحديثات المنتجات
    setTimeout(checkForAdminProductUpdates, 2000);
    
    // 7. فحص التحديثات كل 30 ثانية
    setInterval(checkForAdminProductUpdates, 30000);
});

// ==================== قسم 17: حماية متقدمة ====================
// جعل الدوال متاحة عالمياً للوحة التحكم
window.refreshProductsFromAdmin = refreshProductsFromAdmin;
window.showProductUpdateNotification = showProductUpdateNotification;
window.syncProductsToLocalStorage = syncProductsToLocalStorage;

// حفظ المنتجات في localStorage عند إضافة منتج جديد (لوحة التحكم)
if (typeof window !== 'undefined') {
    window.addEventListener('storage', function(event) {
        if (event.key === 'products') {
            console.log('📦 تم تحديث المنتجات في localStorage');
            refreshProductsFromAdmin();
            showProductUpdateNotification();
        }
    });
}

// حفظ المنتجات في localStorage عند مغادرة الصفحة
window.addEventListener('beforeunload', function() {
    syncProductsToLocalStorage();
});
  });

  // ========== حفظ المنتجات في localStorage عند تحميل المتجر ==========
window.addEventListener('load', function() {
    console.log('💾 حفظ المنتجات في localStorage...');
    
    // تحقق إذا كانت المنتجات موجودة في localStorage
    const storedProducts = localStorage.getItem('products');
    
    // إذا لم تكن موجودة، احفظها
    if (!storedProducts || storedProducts === '[]' || storedProducts === 'null') {
        console.log('✅ حفظ المنتجات في localStorage لأول مرة');
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('products_last_update', Date.now());
    }
    
    console.log('📦 المنتجات جاهزة للوحة التحكم');
});






