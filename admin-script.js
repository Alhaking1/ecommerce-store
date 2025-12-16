/*
==============================================
لوحة تحكم المتجر - مجيب العباب
نسخة مبسطة - بدون حلقة لانهائية
==============================================
*/

// ==================== متغير التحكم ====================
let isAppRunning = false;

// ==================== التحقق من الدخول ====================
(function() {
    console.log('🔐 التحقق من تسجيل الدخول...');
    
    if (!sessionStorage.getItem('admin_logged_in')) {
        console.log('❌ غير مسجل دخول');
        window.location.href = 'login.html';
        return;
    }
    
    console.log('✅ مسجل دخول');
})();

// ==================== التهيئة الرئيسية (مرة واحدة فقط) ====================
window.onload = function() {
    if (isAppRunning) return;
    isAppRunning = true;
    
    console.log('🚀 بدء تشغيل لوحة التحكم');
    
    // انتظر نصف ثانية للتأكد من تحميل الصفحة
    setTimeout(initializeApp, 500);
};

function initializeApp() {
    console.log('🎯 تهيئة التطبيق...');
    
    // 1. تحميل البيانات
    loadAllData();
    
    // 2. إعداد الواجهة
    setupInterface();
    
    // 3. إعداد الأحداث
    setupEventListeners();
    
    console.log('✅ التطبيق جاهز');
}

function loadAllData() {
    // تحميل المنتجات
    setTimeout(loadProductsTable, 100);
    
    // تحميل الطلبات
    setTimeout(function() {
        loadOrdersTable();
        loadRecentOrders();
        updateOrdersBadge();
    }, 150);
    
    // تحميل العملاء
    setTimeout(loadCustomersTable, 200);
    
    // تحميل الإعدادات
    setTimeout(function() {
        loadStoreSettings();
        loadDiscountCodes();
    }, 250);
    
    // تحديث الإحصائيات
    setTimeout(updateStatistics, 300);
}

function setupInterface() {
    // تفعيل التبويب الأول
    setTimeout(function() {
        activateTab('dashboard');
    }, 350);
    
    // إضافة زر تغيير كلمة المرور
    setTimeout(addChangePasswordButton, 400);
    
    // إعداد القائمة الجانبية للهواتف
    setTimeout(setupMobileSidebar, 450);
    
    // تحميل المخططات
    setTimeout(function() {
        loadCharts();
        loadTopProducts();
    }, 500);
}

// ==================== إدارة التبويبات ====================
function activateTab(tabId) {
    // إخفاء جميع المحتويات
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // إظهار المحتوى المحدد
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.style.display = 'block';
        
        // تحديث بيانات التبويب
        switch(tabId) {
            case 'dashboard':
                updateStatistics();
                break;
            case 'products':
                loadProductsTable();
                break;
            case 'orders':
                loadOrdersTable();
                break;
        }
    }
}

// ==================== المنتجات ====================
function loadProductsTable() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const tbody = document.getElementById('productsTableBody');
    
    if (!tbody) return;
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-table">لا توجد منتجات</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image || 'default.png'}" class="product-image" alt="${product.name}"></td>
            <td><strong>${product.name}</strong></td>
            <td>${product.category}</td>
            <td>${product.price} ر.س</td>
            <td>${product.inStock ? 'نعم' : 'لا'}</td>
            <td><span class="status-badge ${product.inStock ? 'status-available' : 'status-unavailable'}">${product.inStock ? 'متوفر' : 'غير متوفر'}</span></td>
            <td>
                <button class="btn-action btn-edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-delete" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
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
    
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productModal').classList.add('active');
    }
}

function saveProduct() {
    const productId = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const price = document.getElementById('productPrice').value;
    
    if (!name || !category || !price) {
        alert('الرجاء تعبئة جميع الحقول');
        return;
    }
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const newProduct = {
        id: productId || Date.now(),
        name: name,
        category: category,
        price: parseFloat(price),
        description: document.getElementById('productDescription').value,
        image: 'images/default.png',
        inStock: true
    };
    
    if (productId) {
        // تحديث
        const index = products.findIndex(p => p.id == productId);
        if (index > -1) {
            products[index] = newProduct;
        }
    } else {
        // إضافة جديدة
        products.push(newProduct);
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    loadProductsTable();
    document.getElementById('productModal').classList.remove('active');
    
    showNotification('تم حفظ المنتج بنجاح');
}

function deleteProduct(productId) {
    if (!confirm('هل تريد حذف هذا المنتج؟')) return;
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const filtered = products.filter(p => p.id != productId);
    
    localStorage.setItem('products', JSON.stringify(filtered));
    loadProductsTable();
    
    showNotification('تم حذف المنتج');
}

// ==================== الطلبات ====================
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
            <td>#${order.id.toString().slice(-6)}</td>
            <td>${order.customer?.name || 'غير معروف'}</td>
            <td>${order.date || 'غير معروف'}</td>
            <td>${order.cart?.length || 0}</td>
            <td>${order.total?.toFixed(2) || '0'} ر.س</td>
            <td><span class="status-badge status-${order.status || 'new'}">${getStatusText(order.status)}</span></td>
            <td>
                <button class="btn-action btn-view" onclick="viewOrder(${order.id})">
                    <i class="fas fa-eye"></i>
                </button>
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
            <td>#${order.id.toString().slice(-6)}</td>
            <td>${order.customer?.name || 'غير معروف'}</td>
            <td>${order.date || 'غير معروف'}</td>
            <td>${order.total?.toFixed(2) || '0'} ر.س</td>
            <td><span class="status-badge status-${order.status || 'new'}">${getStatusText(order.status)}</span></td>
            <td>
                <button class="btn-action btn-view" onclick="viewOrder(${order.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewOrder(orderId) {
    showNotification('عرض تفاصيل الطلب #' + orderId.toString().slice(-6));
}

// ==================== العملاء ====================
function loadCustomersTable() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tbody = document.getElementById('customersTableBody');
    
    if (!tbody) return;
    
    // استخراج العملاء من الطلبات
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
                <button class="btn-action btn-view" onclick="viewCustomer('${customer.phone}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewCustomer(phone) {
    showNotification('عرض تفاصيل العميل: ' + phone);
}

// ==================== الإحصائيات ====================
function updateStatistics() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // حساب العملاء الفريدين
    const customersMap = new Map();
    orders.forEach(order => {
        if (order.customer && order.customer.phone) {
            customersMap.set(order.customer.phone, order.customer);
        }
    });
    
    // تحديث الأرقام
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalCustomers').textContent = customersMap.size;
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalRevenue').textContent = orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2) + ' ر.س';
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

// ==================== الإعدادات ====================
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

function saveStoreSettings(e) {
    e.preventDefault();
    
    const settings = {
        storeName: document.getElementById('storeName').value,
        storeEmail: document.getElementById('storeEmail').value,
        storePhone: document.getElementById('storePhone').value,
        storeAddress: document.getElementById('storeAddress').value
    };
    
    localStorage.setItem('store_settings', JSON.stringify(settings));
    showNotification('تم حفظ الإعدادات');
}

// ==================== أكواد الخصم ====================
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
                <button class="btn-action btn-edit" onclick="editDiscountCode('${code}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-delete" onclick="deleteDiscountCode('${code}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function addDiscountCode() {
    const code = prompt('أدخل كود الخصم:');
    if (!code) return;
    
    const discount = prompt('أدخل نسبة الخصم:');
    if (!discount) return;
    
    const codes = JSON.parse(localStorage.getItem('discount_codes')) || {};
    codes[code.toUpperCase()] = {
        discount: parseFloat(discount),
        active: true
    };
    
    localStorage.setItem('discount_codes', JSON.stringify(codes));
    loadDiscountCodes();
    showNotification('تم إضافة كود الخصم');
}

function editDiscountCode(code) {
    const codes = JSON.parse(localStorage.getItem('discount_codes')) || {};
    const current = codes[code];
    
    if (!current) return;
    
    const newStatus = confirm(`كود: ${code}\nخصم: ${current.discount}%\n\n${current.active ? 'تعطيل' : 'تفعيل'} الكود؟`);
    
    if (newStatus !== null) {
        codes[code].active = !current.active;
        localStorage.setItem('discount_codes', JSON.stringify(codes));
        loadDiscountCodes();
        showNotification('تم تحديث الكود');
    }
}

function deleteDiscountCode(code) {
    if (!confirm(`حذف كود الخصم ${code}؟`)) return;
    
    const codes = JSON.parse(localStorage.getItem('discount_codes')) || {};
    delete codes[code];
    
    localStorage.setItem('discount_codes', JSON.stringify(codes));
    loadDiscountCodes();
    showNotification('تم حذف الكود');
}

// ==================== نظام تغيير كلمة المرور ====================
function addChangePasswordButton() {
    // في الشريط العلوي
    const userSection = document.querySelector('.admin-user');
    if (userSection) {
        const btn = document.createElement('button');
        btn.innerHTML = '<i class="fas fa-key"></i>';
        btn.title = 'تغيير كلمة المرور';
        btn.style.cssText = `
            background: none;
            border: none;
            color: #2d5af1;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: 10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;
        
        btn.onclick = openChangePasswordModal;
        userSection.insertBefore(btn, userSection.firstChild);
    }
    
    // في القائمة الجانبية
    const sidebarMenu = document.querySelector('.sidebar-menu');
    if (sidebarMenu) {
        const item = document.createElement('li');
        item.innerHTML = `
            <a href="#" style="color: #ff6b35;">
                <i class="fas fa-key" style="color: #ff6b35;"></i>
                <span>تغيير كلمة المرور</span>
            </a>
        `;
        
        item.onclick = openChangePasswordModal;
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
                    <button class="close-modal" onclick="this.closest('.modal-overlay').classList.remove('active')">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 15px;" id="passwordError"></div>
                    
                    <div style="margin-bottom: 15px;">
                        <label>كلمة المرور الحالية</label>
                        <input type="password" id="currentPass" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:5px;">
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <label>كلمة المرور الجديدة</label>
                        <input type="password" id="newPass" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:5px;">
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <label>تأكيد كلمة المرور الجديدة</label>
                        <input type="password" id="confirmPass" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:5px;">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').classList.remove('active')">إلغاء</button>
                    <button class="btn btn-primary" onclick="changePassword()">حفظ</button>
                </div>
            </div>
        </div>
    `;
    
    const div = document.createElement('div');
    div.innerHTML = modalHTML;
    document.body.appendChild(div);
}

function changePassword() {
    const current = document.getElementById('currentPass').value;
    const newPass = document.getElementById('newPass').value;
    const confirmPass = document.getElementById('confirmPass').value;
    const errorDiv = document.getElementById('passwordError');
    
    // بيانات افتراضية
    const credentials = JSON.parse(localStorage.getItem('admin_credentials')) || {
        username: 'admin',
        password: 'Admin@1234'
    };
    
    errorDiv.innerHTML = '';
    errorDiv.style.color = 'red';
    errorDiv.style.padding = '10px';
    errorDiv.style.background = '#fee';
    errorDiv.style.borderRadius = '5px';
    
    if (current !== credentials.password) {
        errorDiv.innerHTML = 'كلمة المرور الحالية غير صحيحة';
        return;
    }
    
    if (newPass !== confirmPass) {
        errorDiv.innerHTML = 'كلمات المرور غير متطابقة';
        return;
    }
    
    if (newPass.length < 8) {
        errorDiv.innerHTML = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
        return;
    }
    
    // حفظ كلمة المرور الجديدة
    credentials.password = newPass;
    localStorage.setItem('admin_credentials', JSON.stringify(credentials));
    
    // إغلاق النافذة
    document.querySelector('.modal-overlay.active').remove();
    
    showNotification('تم تغيير كلمة المرور بنجاح');
    
    // تسجيل الخروج بعد 2 ثانية
    setTimeout(() => {
        sessionStorage.clear();
        window.location.href = 'login.html';
    }, 2000);
}

// ==================== الأدوات المساعدة ====================
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

function showNotification(message) {
    const div = document.createElement('div');
    div.textContent = message;
    div.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 9999;
        animation: fadeIn 0.3s;
    `;
    
    document.body.appendChild(div);
    
    setTimeout(() => {
        div.style.animation = 'fadeOut 0.3s';
        setTimeout(() => div.remove(), 300);
    }, 3000);
}

// ==================== إعداد الأحداث ====================
function setupEventListeners() {
    console.log('🔌 إعداد الأحداث...');
    
    // 1. أحداث القائمة الجانبية
    document.querySelectorAll('.sidebar-menu li[data-tab]').forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            activateTab(tabId);
        });
    });
    
    // 2. أحداث المنتجات
    document.getElementById('addProductBtn')?.addEventListener('click', addNewProduct);
    document.getElementById('saveProductBtn')?.addEventListener('click', saveProduct);
    
    // 3. أحداث الإعدادات
    document.getElementById('storeSettingsForm')?.addEventListener('submit', saveStoreSettings);
    document.getElementById('addDiscountCode')?.addEventListener('click', addDiscountCode);
    
    // 4. أحداث الفلترة
    document.getElementById('orderStatusFilter')?.addEventListener('change', loadOrdersTable);
    document.getElementById('productSearch')?.addEventListener('input', filterProducts);
    
    // 5. أحداث النوافذ
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('close-modal')) {
            e.target.closest('.modal-overlay')?.classList.remove('active');
        }
    });
    
    // 6. أحداث أخرى
    document.querySelector('.btn-store')?.addEventListener('click', function(e) {
        e.preventDefault();
        window.open('index.html', '_blank');
    });
    
    document.querySelector('.btn-logout')?.addEventListener('click', function() {
        if (confirm('تسجيل الخروج؟')) {
            sessionStorage.clear();
            window.location.href = 'login.html';
        }
    });
    
    console.log('✅ الأحداث جاهزة');
}

function filterProducts() {
    const search = document.getElementById('productSearch')?.value.toLowerCase() || '';
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const tbody = document.getElementById('productsTableBody');
    
    if (!tbody) return;
    
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description.toLowerCase().includes(search)
    );
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-table">لا توجد نتائج</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(product => `
        <tr>
            <td><img src="${product.image || 'default.png'}" class="product-image" alt="${product.name}"></td>
            <td><strong>${product.name}</strong></td>
            <td>${product.category}</td>
            <td>${product.price} ر.س</td>
            <td>${product.inStock ? 'نعم' : 'لا'}</td>
            <td><span class="status-badge ${product.inStock ? 'status-available' : 'status-unavailable'}">${product.inStock ? 'متوفر' : 'غير متوفر'}</span></td>
            <td>
                <button class="btn-action btn-edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-delete" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ==================== القائمة الجانبية للهواتف ====================
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

// ==================== المخططات ====================
function loadCharts() {
    // مخططات بسيطة
    console.log('📊 تحميل المخططات...');
}

function loadTopProducts() {
    const container = document.getElementById('topProductsList');
    if (container) {
        container.innerHTML = `
            <div class="top-product-item">
                <div class="product-rank">1</div>
                <div class="product-info">
                    <h4>منتج 1</h4>
                    <p>10 مبيعات</p>
                </div>
                <div class="product-sales">1,000 ر.س</div>
            </div>
        `;
    }
}

// ==================== بيانات تجريبية ====================
(function createSampleData() {
    // بيانات المنتجات
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify([
            {
                id: 1,
                name: "سماعة لاسلكية",
                category: "إلكترونيات",
                price: 250,
                description: "سماعة عالية الجودة",
                image: "images/headphones.jpg",
                inStock: true
            }
        ]));
    }
    
    // بيانات الطلبات
    if (!localStorage.getItem('orders')) {
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

console.log('✅ لوحة التحكم جاهزة للتشغيل');
