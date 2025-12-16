/*
==============================================
لوحة تحكم المتجر - مجيب العباب
نسخة محمية - لا تظهر قبل الدخول
==============================================
*/

// ==================== ⚡ التحقق الفوري من الدخول ====================
(function immediateLoginCheck() {
    // هذا الكود ينفذ فور تحميل الملف
    console.log('🔐 التحقق الفوري من الدخول...');
    
    // 1. التحقق من sessionStorage
    if (!sessionStorage.getItem('admin_logged_in')) {
        console.log('❌ غير مسجل دخول - توجيه فوري');
        window.location.href = 'login.html';
        return;
    }
    
    // 2. التحقق من وقت الدخول
    const loginTime = sessionStorage.getItem('login_time');
    if (loginTime) {
        const loginDate = new Date(loginTime);
        const currentDate = new Date();
        const hoursDiff = (currentDate - loginDate) / (1000 * 60 * 60);
        
        if (hoursDiff > 4) { // 4 ساعات
            console.log('⏰ انتهت مدة الجلسة');
            sessionStorage.clear();
            window.location.href = 'login.html';
            return;
        }
    }
    
    console.log('✅ تم التحقق من الدخول');
    
    // إخفاء شاشة التحميل الأصلية بعد تأكيد الدخول
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                
                // إظهار المحتوى المخفي
                document.querySelectorAll('[style*="display:none"]').forEach(el => {
                    el.style.display = '';
                });
                
                // بدء تشغيل لوحة التحكم
                startAdminPanel();
            }, 300);
        }
    }, 800);
})();

// ==================== بدء لوحة التحكم ====================
let panelStarted = false;

function startAdminPanel() {
    if (panelStarted) return;
    panelStarted = true;
    
    console.log('🚀 بدء تشغيل لوحة التحكم');
    
    // تحميل البيانات الأساسية
    loadInitialData();
    
    // إعداد الواجهة
    setupInterface();
    
    // إعداد الأحداث
    setupEventListeners();
}

function loadInitialData() {
    console.log('📊 تحميل البيانات الأولية');
    
    // تحميل المنتجات
    const products = JSON.parse(localStorage.getItem('products')) || [];
    if (products.length > 0) {
        loadProductsTable();
    }
    
    // تحميل الطلبات
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    if (orders.length > 0) {
        loadOrdersTable();
        loadRecentOrders();
        updateOrdersBadge();
    }
    
    // تحميل العملاء
    loadCustomersTable();
    
    // تحديث الإحصائيات
    updateStatistics();
    
    // تحميل الإعدادات
    loadStoreSettings();
    loadDiscountCodes();
}

function setupInterface() {
    console.log('🎨 إعداد الواجهة');
    
    // تفعيل التبويب الأول
    setTimeout(() => {
        const firstTab = document.querySelector('.sidebar-menu li[data-tab="dashboard"]');
        if (firstTab) {
            activateTab('dashboard');
        }
    }, 50);
    
    // إضافة زر تغيير كلمة المرور
    setTimeout(addChangePasswordButton, 100);
    
    // إعداد القائمة الجانبية للهواتف
    setTimeout(setupMobileSidebar, 150);
    
    // تحميل المخططات
    setTimeout(() => {
        try {
            loadCharts();
            loadTopProducts();
        } catch (e) {
            console.log('⚠️ بعض المكونات غير متاحة:', e.message);
        }
    }, 200);
}

// ==================== الدوال الأساسية ====================
function activateTab(tabId) {
    console.log(`🎯 تفعيل: ${tabId}`);
    
    // إخفاء جميع المحتويات
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // إزالة النشاط من القائمة
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.classList.remove('active');
    });
    
    // إضافة النشاط للعنصر الحالي
    const activeItem = document.querySelector(`.sidebar-menu li[data-tab="${tabId}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
    
    // إظهار المحتوى المحدد
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.style.display = 'block';
    }
}

function loadProductsTable() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const tbody = document.getElementById('productsTableBody');
    
    if (!tbody) return;
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-table">لا توجد منتجات</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map(p => `
        <tr>
            <td><img src="${p.image || 'default.png'}" class="product-image" alt="${p.name}"></td>
            <td><strong>${p.name}</strong></td>
            <td>${p.category}</td>
            <td>${p.price} ر.س</td>
            <td>${p.inStock ? 'نعم' : 'لا'}</td>
            <td><span class="status-badge ${p.inStock ? 'status-available' : 'status-unavailable'}">${p.inStock ? 'متوفر' : 'غير متوفر'}</span></td>
            <td>
                <button class="btn-action btn-edit" onclick="editProduct(${p.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-action btn-delete" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function addNewProduct() {
    document.getElementById('productModal').classList.add('active');
}

function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id == productId);
    
    if (!product) {
        showNotification('المنتج غير موجود', 'error');
        return;
    }
    
    // تعبئة النموذج
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productDescription').value = product.description;
    
    // إظهار النافذة
    document.getElementById('productModal').classList.add('active');
}

function saveProduct() {
    const productId = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const price = document.getElementById('productPrice').value;
    const description = document.getElementById('productDescription').value;
    
    // التحقق من البيانات
    if (!name || !category || !price || !description) {
        showNotification('الرجاء تعبئة جميع الحقول', 'error');
        return;
    }
    
    // تحميل المنتجات الحالية
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // إنشاء كائن المنتج
    const newProduct = {
        id: productId ? parseInt(productId) : Date.now(),
        name: name,
        category: category,
        price: parseFloat(price),
        description: description,
        image: 'images/default.png',
        inStock: true,
        featured: false
    };
    
    // حفظ المنتج
    if (productId) {
        // تحديث منتج موجود
        const index = products.findIndex(p => p.id == productId);
        if (index !== -1) {
            products[index] = newProduct;
            showNotification('تم تحديث المنتج بنجاح');
        }
    } else {
        // إضافة منتج جديد
        products.push(newProduct);
        showNotification('تم إضافة المنتج بنجاح');
    }
    
    // حفظ في localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // تحديث الجدول
    loadProductsTable();
    
    // إغلاق النافذة
    document.getElementById('productModal').classList.remove('active');
}

function deleteProduct(productId) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const filtered = products.filter(p => p.id != productId);
    
    localStorage.setItem('products', JSON.stringify(filtered));
    loadProductsTable();
    
    showNotification('تم حذف المنتج بنجاح');
}

// ==================== نظام تغيير كلمة المرور ====================
function addChangePasswordButton() {
    console.log('🔑 إضافة زر تغيير كلمة المرور');
    
    // 1. في شريط المستخدم العلوي
    const userSection = document.querySelector('.admin-user');
    if (userSection) {
        const btn = document.createElement('button');
        btn.className = 'btn-change-password';
        btn.innerHTML = '<i class="fas fa-key"></i>';
        btn.title = 'تغيير كلمة المرور';
        btn.style.cssText = `
            background: none;
            border: none;
            color: #2d5af1;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: 15px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;
        
        btn.onclick = function() {
            openChangePasswordModal();
        };
        
        userSection.insertBefore(btn, userSection.firstChild);
    }
    
    // 2. في القائمة الجانبية (بدون إزاحة)
    const sidebarMenu = document.querySelector('.sidebar-menu');
    if (sidebarMenu) {
        const item = document.createElement('li');
        item.innerHTML = `
            <a href="#" style="color: #ff6b35;">
                <i class="fas fa-key" style="color: #ff6b35; margin-left: 15px;"></i>
                <span>تغيير كلمة المرور</span>
            </a>
        `;
        
        item.onclick = function(e) {
            e.preventDefault();
            openChangePasswordModal();
        };
        
        item.style.borderTop = '1px solid #eee';
        item.style.paddingTop = '10px';
        item.style.marginTop = '5px';
        
        sidebarMenu.appendChild(item);
    }
}

function openChangePasswordModal() {
    const modalHTML = `
        <div class="modal-overlay active">
            <div class="modal" style="max-width: 500px;">
                <div class="modal-header">
                    <h3><i class="fas fa-key"></i> تغيير كلمة المرور</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div id="passwordError" style="display:none; background:#fee; color:#dc3545; padding:10px; border-radius:5px; margin-bottom:15px;"></div>
                    
                    <div style="margin-bottom:15px;">
                        <label><i class="fas fa-lock"></i> كلمة المرور الحالية</label>
                        <input type="password" id="currentPassword" placeholder="أدخل كلمة المرور الحالية" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:5px;">
                    </div>
                    
                    <div style="margin-bottom:15px;">
                        <label><i class="fas fa-lock"></i> كلمة المرور الجديدة</label>
                        <input type="password" id="newPassword" placeholder="أدخل كلمة المرور الجديدة" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:5px;">
                    </div>
                    
                    <div style="margin-bottom:15px;">
                        <label><i class="fas fa-lock"></i> تأكيد كلمة المرور الجديدة</label>
                        <input type="password" id="confirmPassword" placeholder="أعد إدخال كلمة المرور الجديدة" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:5px;">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary close-modal">إلغاء</button>
                    <button class="btn btn-primary" id="savePassword">حفظ</button>
                </div>
            </div>
        </div>
    `;
    
    const div = document.createElement('div');
    div.innerHTML = modalHTML;
    document.body.appendChild(div);
    
    // إعداد الأحداث
    document.getElementById('savePassword').onclick = changePassword;
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.onclick = function() {
            this.closest('.modal-overlay').remove();
        };
    });
    
    document.querySelector('.modal-overlay').onclick = function(e) {
        if (e.target === this) this.remove();
    };
}

function changePassword() {
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    const errorDiv = document.getElementById('passwordError');
    
    // بيانات الدخول
    const credentials = JSON.parse(localStorage.getItem('admin_credentials')) || {
        username: 'admin',
        password: 'Admin@1234'
    };
    
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    
    // التحقق
    if (current !== credentials.password) {
        errorDiv.textContent = 'كلمة المرور الحالية غير صحيحة';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (newPass !== confirmPass) {
        errorDiv.textContent = 'كلمة المرور الجديدة غير متطابقة';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (newPass.length < 8) {
        errorDiv.textContent = 'يجب أن تكون 8 أحرف على الأقل';
        errorDiv.style.display = 'block';
        return;
    }
    
    // حفظ الجديدة
    credentials.password = newPass;
    localStorage.setItem('admin_credentials', JSON.stringify(credentials));
    
    // إغلاق النافذة
    document.querySelector('.modal-overlay').remove();
    
    // إظهار رسالة
    showNotification('تم تغيير كلمة المرور بنجاح', 'success');
    
    // تسجيل الخروج بعد ثانيتين
    setTimeout(() => {
        sessionStorage.clear();
        window.location.href = 'login.html';
    }, 2000);
}

// ==================== دوال المساعدة ====================
function showNotification(message, type = 'success') {
    const div = document.createElement('div');
    div.textContent = message;
    div.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 9999;
        animation: fadeIn 0.3s;
        font-family: 'Cairo', sans-serif;
    `;
    
    document.body.appendChild(div);
    
    setTimeout(() => {
        div.style.animation = 'fadeOut 0.3s';
        setTimeout(() => div.remove(), 300);
    }, 3000);
}

// ==================== إعداد الأحداث ====================
function setupEventListeners() {
    console.log('🔌 إعداد الأحداث');
    
    // أحداث التبويبات
    document.querySelectorAll('.sidebar-menu li[data-tab]').forEach(item => {
        item.onclick = function() {
            activateTab(this.getAttribute('data-tab'));
        };
    });
    
    // أحداث المنتجات
    document.getElementById('addProductBtn')?.addEventListener('click', addNewProduct);
    document.getElementById('saveProductBtn')?.addEventListener('click', saveProduct);
    
    // أحداث الإعدادات
    document.getElementById('storeSettingsForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // حفظ الإعدادات
        const settings = {
            storeName: document.getElementById('storeName').value,
            storeEmail: document.getElementById('storeEmail').value,
            storePhone: document.getElementById('storePhone').value,
            storeAddress: document.getElementById('storeAddress').value
        };
        
        localStorage.setItem('store_settings', JSON.stringify(settings));
        showNotification('تم حفظ الإعدادات بنجاح');
    });
    
    // أحداث النوافذ
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
        }
        if (e.target.classList.contains('close-modal')) {
            e.target.closest('.modal-overlay').classList.remove('active');
        }
    });
    
    // أحداث أخرى
    document.querySelector('.btn-store')?.addEventListener('click', function(e) {
        e.preventDefault();
        window.open('index.html', '_blank');
    });
    
    document.querySelector('.btn-logout')?.addEventListener('click', function() {
        if (confirm('هل تريد تسجيل الخروج؟')) {
            sessionStorage.clear();
            window.location.href = 'login.html';
        }
    });
}

// ==================== دالات إضافية ====================
function loadOrdersTable() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tbody = document.getElementById('ordersTableBody');
    
    if (!tbody) return;
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-table">لا توجد طلبات</td></tr>';
        return;
    }
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id?.toString().slice(-6) || '000000'}</td>
            <td>${order.customer?.name || 'غير معروف'}</td>
            <td>${order.date || 'غير معروف'}</td>
            <td>${order.cart?.length || 0}</td>
            <td>${order.total?.toFixed(2) || '0.00'} ر.س</td>
            <td><span class="status-badge status-${order.status || 'new'}">${getStatusText(order.status)}</span></td>
            <td>
                <button class="btn-action btn-view" onclick="viewOrder(${order.id})"><i class="fas fa-eye"></i></button>
            </td>
        </tr>
    `).join('');
}

function loadRecentOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tbody = document.getElementById('recentOrdersBody');
    
    if (!tbody) return;
    
    const recent = orders.slice(-5).reverse();
    
    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-table">لا توجد طلبات</td></tr>';
        return;
    }
    
    tbody.innerHTML = recent.map(order => `
        <tr>
            <td>#${order.id?.toString().slice(-6) || '000000'}</td>
            <td>${order.customer?.name || 'غير معروف'}</td>
            <td>${order.date || 'غير معروف'}</td>
            <td>${order.total?.toFixed(2) || '0.00'} ر.س</td>
            <td><span class="status-badge status-${order.status || 'new'}">${getStatusText(order.status)}</span></td>
            <td>
                <button class="btn-action btn-view" onclick="viewOrder(${order.id})"><i class="fas fa-eye"></i></button>
            </td>
        </tr>
    `).join('');
}

function updateOrdersBadge() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const newOrders = orders.filter(order => order.status === 'new').length;
    const badge = document.querySelector('.new-orders');
    
    if (badge) {
        badge.textContent = newOrders;
        badge.style.display = newOrders > 0 ? 'inline-block' : 'none';
    }
}

function loadCustomersTable() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tbody = document.getElementById('customersTableBody');
    
    if (!tbody) return;
    
    // استخراج العملاء
    const customersMap = new Map();
    orders.forEach(order => {
        if (order.customer && order.customer.phone) {
            customersMap.set(order.customer.phone, order.customer);
        }
    });
    
    const customers = Array.from(customersMap.values());
    
    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-table">لا توجد عملاء</td></tr>';
        return;
    }
    
    tbody.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.name || 'غير معروف'}</td>
            <td>${customer.phone || 'غير معروف'}</td>
            <td>${customer.email || 'لم يذكر'}</td>
            <td>${orders.filter(o => o.customer?.phone === customer.phone).length}</td>
            <td>${orders.filter(o => o.customer?.phone === customer.phone).reduce((sum, o) => sum + (o.total || 0), 0).toFixed(2)} ر.س</td>
            <td>${orders.find(o => o.customer?.phone === customer.phone)?.date || 'غير معروف'}</td>
            <td>
                <button class="btn-action btn-view" onclick="viewCustomer('${customer.phone}')"><i class="fas fa-eye"></i></button>
            </td>
        </tr>
    `).join('');
}

function updateStatistics() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // حساب العملاء
    const customersMap = new Map();
    orders.forEach(order => {
        if (order.customer && order.customer.phone) {
            customersMap.set(order.customer.phone, order.customer);
        }
    });
    
    // تحديث الإحصائيات
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalCustomers').textContent = customersMap.size;
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalRevenue').textContent = orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2) + ' ر.س';
}

function getStatusText(status) {
    const map = {
        'new': 'جديد',
        'processing': 'قيد المعالجة',
        'shipped': 'تم الشحن',
        'delivered': 'تم التوصيل',
        'cancelled': 'ملغي'
    };
    return map[status] || status;
}

function loadStoreSettings() {
    const settings = JSON.parse(localStorage.getItem('store_settings')) || {
        storeName: 'متجر تقني',
        storeEmail: 'mjyblwan0@gmail.com',
        storePhone: '781238648',
        storeAddress: 'المملكة العربية السعودية'
    };
    
    document.getElementById('storeName').value = settings.storeName;
    document.getElementById('storeEmail').value = settings.storeEmail;
    document.getElementById('storePhone').value = settings.storePhone;
    document.getElementById('storeAddress').value = settings.storeAddress;
}

function loadDiscountCodes() {
    const codes = JSON.parse(localStorage.getItem('discount_codes')) || {
        'TECH10': { discount: 10, active: true },
        'WELCOME20': { discount: 20, active: true }
    };
    
    const tbody = document.getElementById('discountCodesTable');
    if (!tbody) return;
    
    tbody.innerHTML = Object.entries(codes).map(([code, data]) => `
        <tr>
            <td><strong>${code}</strong></td>
            <td>${data.discount}%</td>
            <td><span class="status-badge ${data.active ? 'status-available' : 'status-unavailable'}">${data.active ? 'نشط' : 'غير نشط'}</span></td>
            <td>
                <button class="btn-action btn-edit" onclick="editDiscountCode('${code}')"><i class="fas fa-edit"></i></button>
                <button class="btn-action btn-delete" onclick="deleteDiscountCode('${code}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function setupMobileSidebar() {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (!toggle || !sidebar) return;
    
    toggle.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
    
    toggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    window.addEventListener('resize', function() {
        toggle.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
    });
}

// ==================== بيانات تجريبية ====================
(function createSampleData() {
    // بيانات المنتجات
    if (!localStorage.getItem('products') || JSON.parse(localStorage.getItem('products')).length === 0) {
        localStorage.setItem('products', JSON.stringify([
            {
                id: 1,
                name: "سماعة لاسلكية",
                category: "إلكترونيات",
                price: 250,
                description: "سماعة عالية الجودة",
                image: "images/headphones.jpg",
                inStock: true,
                featured: true
            }
        ]));
    }
    
    // بيانات الطلبات
    if (!localStorage.getItem('orders') || JSON.parse(localStorage.getItem('orders')).length === 0) {
        localStorage.setItem('orders', JSON.stringify([
            {
                id: Date.now(),
                customer: {
                    name: "أحمد محمد",
                    phone: "0512345678",
                    email: "ahmed@example.com"
                },
                cart: [
                    {
                        id: 1,
                        name: "سماعة لاسلكية",
                        price: 250,
                        quantity: 1
                    }
                ],
                total: 250,
                date: new Date().toLocaleDateString('ar-SA'),
                status: "new"
            }
        ]));
    }
    
    // بيانات الدخول
    if (!localStorage.getItem('admin_credentials')) {
        localStorage.setItem('admin_credentials', JSON.stringify({
            username: 'admin',
            password: 'Admin@1234',
            lastChanged: new Date().toISOString()
        }));
    }
})();

console.log('✅ لوحة التحكم جاهزة');

// ==================== دوال إضافية (مفقودة في الكود الأصلي) ====================
function loadCharts() {
    console.log('📈 تحميل المخططات (وظيفة تجريبية)');
}

function loadTopProducts() {
    console.log('🏆 تحميل أفضل المنتجات (وظيفة تجريبية)');
}

function viewOrder(orderId) {
    console.log('👁️ عرض الطلب:', orderId);
    showNotification('عرض تفاصيل الطلب (وظيفة تجريبية)');
}

function viewCustomer(phone) {
    console.log('👤 عرض العميل:', phone);
    showNotification('عرض تفاصيل العميل (وظيفة تجريبية)');
}

function editDiscountCode(code) {
    console.log('✏️ تعديل كود الخصم:', code);
    showNotification('تعديل كود الخصم (وظيفة تجريبية)');
}

function deleteDiscountCode(code) {
    if (confirm('هل تريد حذف كود الخصم؟')) {
        console.log('🗑️ حذف كود الخصم:', code);
        showNotification('تم حذف كود الخصم (وظيفة تجريبية)');
    }
}
