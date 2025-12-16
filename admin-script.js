// ==================== نظام لوحة التحكم الكامل ====================
console.log('🛡️ لوحة تحكم المتجر - مجيب العباب');

// متغيرات عامة
let adminProducts = [];
let adminOrders = [];
let adminCustomers = [];

// تهيئة لوحة التحكم
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 بدء تحميل لوحة التحكم...');
    
    // التحقق من تسجيل الدخول
    if (!sessionStorage.getItem('admin_logged_in')) {
        console.log('❌ غير مسجل دخول - توجيه إلى login.html');
        window.location.href = 'login.html';
        return;
    }
    
    console.log('✅ مسجل دخول بنجاح');
    
    // إخفاء شاشة التحميل بعد ثانيتين
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            console.log('✅ تم إخفاء شاشة التحميل');
        }
        
        // تحميل البيانات
        loadAllAdminData();
        
        // إعداد الأحداث
        setupAdminEvents();
        
        // تفعيل التبويب الأول
        activateTab('dashboard');
    }, 2000);
});

// ==================== دوال تحميل البيانات ====================

/**
 * تحميل جميع البيانات
 */
function loadAllAdminData() {
    console.log('📊 جاري تحميل جميع البيانات...');
    
    // 1. تحميل المنتجات (بدون مسح البيانات الموجودة)
    loadAdminProducts();
    
    // 2. تحميل الطلبات
    loadAdminOrders();
    
    // 3. تحميل العملاء
    loadAdminCustomers();
    
    // 4. تحديث الإحصائيات
    updateAdminStats();
    
    console.log('✅ تم تحميل جميع البيانات');
}

/**
 * تحميل المنتجات - يحافظ على البيانات الحالية
 */
function loadAdminProducts() {
    console.log('📦 جاري تحميل المنتجات...');
    
    // 1. أولاً: تحميل من localStorage
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    console.log(`📦 المنتجات في localStorage: ${storedProducts.length}`);
    
    // 2. إذا كانت هناك منتجات في localStorage، استخدمها
    if (storedProducts.length > 0) {
        adminProducts = storedProducts;
        console.log(`✅ تم استخدام ${adminProducts.length} منتج من localStorage`);
    } else {
        // 3. فقط إذا لم يكن هناك منتجات في localStorage، استخدم المنتجات الافتراضية
        console.log('⚠️ لا توجد منتجات في localStorage، جلب المنتجات من script.js');
        
        try {
            // محاولة الحصول على المنتجات من script.js (إذا كان متاحاً)
            if (typeof window.products !== 'undefined' && window.products.length > 0) {
                adminProducts = window.products;
                console.log(`✅ تم تحميل ${adminProducts.length} منتج من script.js`);
            } else {
                // استخدام المنتجات الافتراضية كحل أخير
                console.log('⚠️ لا يمكن الوصول إلى script.js، استخدام المنتجات الافتراضية');
                adminProducts = getDefaultProducts();
            }
            
            // حفظ المنتجات في localStorage
            localStorage.setItem('products', JSON.stringify(adminProducts));
            console.log(`💾 تم حفظ ${adminProducts.length} منتج في localStorage`);
            
        } catch (error) {
            console.error('❌ خطأ في تحميل المنتجات:', error);
            adminProducts = getDefaultProducts();
            localStorage.setItem('products', JSON.stringify(adminProducts));
        }
    }
    
    // عرض المنتجات
    displayAdminProducts();
}

/**
 * الحصول على المنتجات الافتراضية
 */
function getDefaultProducts() {
    return [
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
}

/**
 * عرض المنتجات في الجدول
 */
function displayAdminProducts() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) {
        console.error('❌ لم يتم العثور على جدول المنتجات');
        return;
    }
    
    if (adminProducts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-table">
                    <i class="fas fa-box-open"></i>
                    لا توجد منتجات
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = adminProducts.map(product => `
        <tr>
            <td>
                <img src="${product.image || 'images/default.png'}" 
                     class="product-image" 
                     alt="${product.name}"
                     style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"
                     onerror="this.src='https://via.placeholder.com/50x50/2d5af1/FFFFFF?text=${product.name.substring(0, 5)}'">
            </td>
            <td><strong>${product.name}</strong></td>
            <td>${product.category}</td>
            <td>${product.price} ر.س</td>
            <td>${product.inStock ? 'نعم' : 'لا'}</td>
            <td>
                <span class="status-badge ${product.inStock ? 'status-available' : 'status-unavailable'}" 
                      style="padding: 5px 10px; border-radius: 5px; display: inline-block; color: white; font-size: 0.8rem; background-color: ${product.inStock ? '#28a745' : '#dc3545'}">
                    ${product.inStock ? 'متوفر' : 'غير متوفر'}
                </span>
            </td>
            <td>
                <button class="btn-action btn-edit" onclick="editAdminProduct(${product.id})" style="width:35px;height:35px;border-radius:50%;border:none;background:#28a745;color:white;cursor:pointer;margin:2px;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-delete" onclick="deleteAdminProduct(${product.id})" style="width:35px;height:35px;border-radius:50%;border:none;background:#dc3545;color:white;margin:2px;cursor:pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    console.log(`✅ تم عرض ${adminProducts.length} منتج في الجدول`);
}

/**
 * تحميل الطلبات
 */
function loadAdminOrders() {
    console.log('📦 جاري تحميل الطلبات...');
    
    adminOrders = JSON.parse(localStorage.getItem('orders')) || [];
    console.log(`📦 تم تحميل ${adminOrders.length} طلب`);
    
    // عرض الطلبات
    displayAdminOrders();
    displayRecentOrders();
}

/**
 * عرض الطلبات الكاملة
 */
function displayAdminOrders() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    
    if (adminOrders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-table">
                    <i class="fas fa-shopping-cart"></i>
                    لا توجد طلبات
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = adminOrders.map(order => `
        <tr>
            <td>#${order.id ? order.id.toString().slice(-6) : '000000'}</td>
            <td>${order.customer?.name || 'غير معروف'}</td>
            <td>${order.date || 'غير معروف'}</td>
            <td>${order.cart?.length || 0} منتج</td>
            <td>${order.total ? order.total.toFixed(2) : '0.00'} ر.س</td>
            <td>
                <span class="status-badge status-${order.status || 'new'}" 
                      style="padding: 5px 10px; border-radius: 5px; display: inline-block; color: white; font-size: 0.8rem; background-color: #2d5af1">
                    ${order.status || 'جديد'}
                </span>
            </td>
            <td>
                <button class="btn-action btn-view" onclick="viewOrderDetails(${order.id})" style="width:35px;height:35px;border-radius:50%;border:none;background:#2d5af1;color:white;cursor:pointer;margin:2px;">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-action btn-edit" onclick="editOrderStatus(${order.id})" style="width:35px;height:35px;border-radius:50%;border:none;background:#ffc107;color:white;margin:2px;cursor:pointer;">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * عرض الطلبات الأخيرة
 */
function displayRecentOrders() {
    const tbody = document.getElementById('recentOrdersBody');
    if (!tbody) return;
    
    if (adminOrders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-table">
                    <i class="fas fa-clock"></i>
                    لا توجد طلبات أخيرة
                </td>
            </tr>
        `;
        return;
    }
    
    // أخذ آخر 5 طلبات
    const recentOrders = adminOrders.slice(-5).reverse();
    
    tbody.innerHTML = recentOrders.map(order => `
        <tr>
            <td>#${order.id ? order.id.toString().slice(-6) : '000000'}</td>
            <td>${order.customer?.name || 'غير معروف'}</td>
            <td>${order.date || 'غير معروف'}</td>
            <td>${order.total ? order.total.toFixed(2) : '0.00'} ر.س</td>
            <td>
                <span class="status-badge" style="padding: 5px 10px; border-radius: 5px; display: inline-block; color: white; font-size: 0.8rem; background-color: #2d5af1">
                    ${order.status || 'جديد'}
                </span>
            </td>
            <td>
                <button class="btn-action btn-view" onclick="viewOrderDetails(${order.id})" style="width:35px;height:35px;border-radius:50%;border:none;background:#2d5af1;color:white;cursor:pointer;margin:2px;">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * تحميل العملاء
 */
function loadAdminCustomers() {
    console.log('👥 جاري تحميل العملاء...');
    
    // استخراج العملاء من الطلبات
    const customersMap = new Map();
    adminOrders.forEach(order => {
        if (order.customer && order.customer.phone) {
            customersMap.set(order.customer.phone, {
                ...order.customer,
                orders: (customersMap.get(order.customer.phone)?.orders || 0) + 1,
                totalSpent: (customersMap.get(order.customer.phone)?.totalSpent || 0) + (order.total || 0),
                date: order.date || 'غير معروف'
            });
        }
    });
    
    adminCustomers = Array.from(customersMap.values());
    console.log(`👥 تم تحميل ${adminCustomers.length} عميل`);
    
    // عرض العملاء
    displayAdminCustomers();
}

/**
 * عرض العملاء
 */
function displayAdminCustomers() {
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;
    
    if (adminCustomers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-table">
                    <i class="fas fa-users"></i>
                    لا توجد عملاء
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = adminCustomers.map(customer => `
        <tr>
            <td>${customer.name || 'غير معروف'}</td>
            <td>${customer.phone || 'غير معروف'}</td>
            <td>${customer.email || 'غير معروف'}</td>
            <td>${customer.orders || 1}</td>
            <td>${customer.totalSpent ? customer.totalSpent.toFixed(2) : '0.00'} ر.س</td>
            <td>${customer.date || 'غير معروف'}</td>
            <td>
                <button class="btn-action btn-view" onclick="viewCustomerDetails('${customer.phone}')" style="width:35px;height:35px;border-radius:50%;border:none;background:#2d5af1;color:white;cursor:pointer;margin:2px;">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * تحديث الإحصائيات
 */
function updateAdminStats() {
    console.log('📈 تحديث الإحصائيات...');
    
    // عدد المنتجات
    const totalProductsEl = document.getElementById('totalProducts');
    if (totalProductsEl) totalProductsEl.textContent = adminProducts.length;
    
    // عدد الطلبات
    const totalOrdersEl = document.getElementById('totalOrders');
    if (totalOrdersEl) totalOrdersEl.textContent = adminOrders.length;
    
    // الإيرادات
    const totalRevenue = adminOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalRevenueEl = document.getElementById('totalRevenue');
    if (totalRevenueEl) totalRevenueEl.textContent = totalRevenue.toFixed(2) + ' ر.س';
    
    // عدد العملاء
    const totalCustomersEl = document.getElementById('totalCustomers');
    if (totalCustomersEl) totalCustomersEl.textContent = adminCustomers.length;
    
    console.log(`📊 الإحصائيات: ${adminProducts.length} منتج | ${adminOrders.length} طلب | ${totalRevenue} ر.س | ${adminCustomers.length} عميل`);
}

// ==================== دوال إدارة المنتجات ====================

/**
 * تعديل منتج
 */
function editAdminProduct(id) {
    console.log('✏️ تعديل المنتج:', id);
    
    const product = adminProducts.find(p => p.id == id);
    if (!product) {
        alert('المنتج غير موجود');
        return;
    }
    
    // ملء النموذج
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productOldPrice').value = product.oldPrice || '';
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productImage').value = product.image || '';
    document.getElementById('productStock').value = product.inStock.toString();
    document.getElementById('productFeatured').checked = product.featured || false;
    document.getElementById('productModalTitle').textContent = 'تعديل المنتج';
    
    // إظهار النافذة
    document.getElementById('productModal').style.display = 'flex';
}

/**
 * حذف منتج
 */
function deleteAdminProduct(id) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    
    console.log('🗑️ حذف المنتج:', id);
    
    // تصفية المنتجات
    adminProducts = adminProducts.filter(p => p.id != id);
    
    // حفظ في localStorage
    localStorage.setItem('products', JSON.stringify(adminProducts));
    
    // تحديث العرض
    displayAdminProducts();
    updateAdminStats();
    
    alert('✅ تم حذف المنتج بنجاح');
}

/**
 * إضافة منتج جديد
 */
function addNewProduct() {
    console.log('➕ إضافة منتج جديد');
    
    // إعادة تعيين النموذج
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModalTitle').textContent = 'إضافة منتج جديد';
    
    // إظهار النافذة
    document.getElementById('productModal').style.display = 'flex';
}

/**
 * حفظ المنتج
 */
function saveProduct() {
    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const oldPrice = document.getElementById('productOldPrice').value ? parseFloat(document.getElementById('productOldPrice').value) : null;
    const description = document.getElementById('productDescription').value.trim();
    const image = document.getElementById('productImage').value.trim() || 'default.png';
    const inStock = document.getElementById('productStock').value === 'true';
    const featured = document.getElementById('productFeatured').checked;
    
    // التحقق من البيانات
    if (!name || !category || isNaN(price) || !description) {
        alert('الرجاء تعبئة جميع الحقول المطلوبة');
        return;
    }
    
    if (id) {
        // تحديث منتج موجود
        const index = adminProducts.findIndex(p => p.id == id);
        if (index !== -1) {
            adminProducts[index] = {
                ...adminProducts[index],
                name,
                category,
                price,
                oldPrice,
                description,
                image,
                inStock,
                featured
            };
            console.log('✅ تم تحديث المنتج:', id);
        }
    } else {
        // إضافة منتج جديد
        const newId = adminProducts.length > 0 ? Math.max(...adminProducts.map(p => p.id)) + 1 : 1;
        adminProducts.push({
            id: newId,
            name,
            category,
            price,
            oldPrice,
            description,
            image,
            inStock,
            featured
        });
        console.log('✅ تم إضافة منتج جديد:', newId);
    }
    
    // حفظ في localStorage
    localStorage.setItem('products', JSON.stringify(adminProducts));
    
    // إغلاق النافذة
    document.getElementById('productModal').style.display = 'none';
    
    // تحديث العرض
    displayAdminProducts();
    updateAdminStats();
    
    alert(id ? '✅ تم تحديث المنتج بنجاح' : '✅ تم إضافة المنتج بنجاح');
}

// ==================== دوال إدارة الطلبات ====================

/**
 * عرض تفاصيل الطلب
 */
function viewOrderDetails(id) {
    console.log('👁️ عرض تفاصيل الطلب:', id);
    
    const order = adminOrders.find(o => o.id == id);
    if (!order) {
        alert('الطلب غير موجود');
        return;
    }
    
    // تحديث العنوان
    document.getElementById('orderDetailsTitle').textContent = `تفاصيل الطلب #${order.id.toString().slice(-6)}`;
    
    // تحديث المحتوى
    const content = document.getElementById('orderDetailsContent');
    content.innerHTML = `
        <div class="order-summary">
            <p><strong>رقم الطلب:</strong> #${order.id.toString().slice(-6)}</p>
            <p><strong>العميل:</strong> ${order.customer?.name || 'غير معروف'}</p>
            <p><strong>الهاتف:</strong> ${order.customer?.phone || 'غير معروف'}</p>
            <p><strong>البريد الإلكتروني:</strong> ${order.customer?.email || 'غير معروف'}</p>
            <p><strong>العنوان:</strong> ${order.customer?.address || 'غير معروف'}</p>
            <p><strong>التاريخ:</strong> ${order.date || 'غير معروف'}</p>
            <p><strong>الحالة:</strong> ${order.status || 'جديد'}</p>
            <p><strong>الإجمالي:</strong> ${order.total ? order.total.toFixed(2) : '0.00'} ر.س</p>
            <p><strong>ملاحظات:</strong> ${order.customer?.notes || 'لا توجد'}</p>
        </div>
        
        <h4>المنتجات:</h4>
        <div class="order-products" style="margin-top: 20px;">
            ${(order.cart || []).map(item => `
                <div style="padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small>${item.description || ''}</small>
                    </div>
                    <div style="text-align: left;">
                        ${item.quantity || 1} × ${item.price} ر.س<br>
                        <strong>${((item.quantity || 1) * item.price).toFixed(2)} ر.س</strong>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // إظهار النافذة
    document.getElementById('orderDetailsModal').style.display = 'flex';
}

/**
 * تعديل حالة الطلب
 */
function editOrderStatus(id) {
    console.log('✏️ تعديل حالة الطلب:', id);
    
    const order = adminOrders.find(o => o.id == id);
    if (!order) return;
    
    const newStatus = prompt('أدخل الحالة الجديدة للطلب:', order.status || 'جديد');
    if (newStatus) {
        order.status = newStatus;
        localStorage.setItem('orders', JSON.stringify(adminOrders));
        displayAdminOrders();
        displayRecentOrders();
        alert('✅ تم تحديث حالة الطلب');
    }
}

// ==================== دوال إدارة العملاء ====================

/**
 * عرض تفاصيل العميل
 */
function viewCustomerDetails(phone) {
    console.log('👁️ عرض تفاصيل العميل:', phone);
    
    const customer = adminCustomers.find(c => c.phone == phone);
    if (!customer) {
        alert('العميل غير موجود');
        return;
    }
    
    // الحصول على طلبات العميل
    const customerOrders = adminOrders.filter(o => o.customer?.phone == phone);
    
    alert(`تفاصيل العميل:
👤 الاسم: ${customer.name}
📞 الهاتف: ${customer.phone}
📧 البريد: ${customer.email}
📍 العنوان: ${customer.address}
📦 عدد الطلبات: ${customer.orders}
💰 إجمالي المشتريات: ${customer.totalSpent.toFixed(2)} ر.س`);
}

// ==================== دوال النظام ====================

/**
 * تفعيل تبويب
 */
function activateTab(tabId) {
    // إخفاء جميع المحتويات
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.style.display = 'none';
    });
    
    // إزالة النشاط من القائمة
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.classList.remove('active');
    });
    
    // إظهار المحتوى المحدد
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.add('active');
        activeTab.style.display = 'block';
    }
    
    // تفعيل العنصر في القائمة
    const menuItem = document.querySelector(`.sidebar-menu li[data-tab="${tabId}"]`);
    if (menuItem) {
        menuItem.classList.add('active');
    }
    
    console.log(`🎯 تم تفعيل التبويب: ${tabId}`);
}

/**
 * تسجيل الخروج
 */
function logout() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        sessionStorage.removeItem('admin_logged_in');
        window.location.href = 'login.html';
    }
}

// ==================== إعداد الأحداث ====================

function setupAdminEvents() {
    console.log('🔧 إعداد الأحداث...');
    
    // أحداث القائمة الجانبية
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            activateTab(tabId);
        });
    });
    
    // زر إضافة منتج
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', addNewProduct);
    }
    
    // زر حفظ المنتج
    const saveProductBtn = document.getElementById('saveProductBtn');
    if (saveProductBtn) {
        saveProductBtn.addEventListener('click', saveProduct);
    }
    
    // أزرار إغلاق النوافذ
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal-overlay');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // زر تسجيل الخروج
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // زر القائمة للهواتف
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            const sidebar = document.querySelector('.admin-sidebar');
            if (sidebar) {
                sidebar.classList.toggle('active');
            }
        });
    }
    
    // فلتر المنتجات
    const productSearch = document.getElementById('productSearch');
    if (productSearch) {
        productSearch.addEventListener('input', filterProducts);
    }
    
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterProducts);
    }
    
    console.log('✅ تم إعداد جميع الأحداث');
}

/**
 * فلترة المنتجات
 */
function filterProducts() {
    const search = document.getElementById('productSearch').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const status = document.getElementById('statusFilter').value;
    
    let filtered = adminProducts;
    
    // فلترة حسب البحث
    if (search) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(search) || 
            p.description.toLowerCase().includes(search)
        );
    }
    
    // فلترة حسب الفئة
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }
    
    // فلترة حسب الحالة
    if (status !== 'all') {
        if (status === 'available') {
            filtered = filtered.filter(p => p.inStock);
        } else if (status === 'unavailable') {
            filtered = filtered.filter(p => !p.inStock);
        }
    }
    
    // تحديث العرض
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-table">
                    <i class="fas fa-search"></i>
                    لا توجد نتائج
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filtered.map(product => `
        <tr>
            <td>
                <img src="${product.image || 'images/default.png'}" 
                     class="product-image" 
                     alt="${product.name}"
                     style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"
                     onerror="this.src='https://via.placeholder.com/50x50/2d5af1/FFFFFF?text=${product.name.substring(0, 5)}'">
            </td>
            <td><strong>${product.name}</strong></td>
            <td>${product.category}</td>
            <td>${product.price} ر.س</td>
            <td>${product.inStock ? 'نعم' : 'لا'}</td>
            <td>
                <span class="status-badge ${product.inStock ? 'status-available' : 'status-unavailable'}">
                    ${product.inStock ? 'متوفر' : 'غير متوفر'}
                </span>
            </td>
            <td>
                <button class="btn-action btn-edit" onclick="editAdminProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-delete" onclick="deleteAdminProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ==================== جعل الدوال متاحة عالمياً ====================
window.editAdminProduct = editAdminProduct;
window.deleteAdminProduct = deleteAdminProduct;
window.viewOrderDetails = viewOrderDetails;
window.editOrderStatus = editOrderStatus;
window.viewCustomerDetails = viewCustomerDetails;
window.logout = logout;
