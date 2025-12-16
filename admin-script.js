/*
==============================================
لوحة تحكم المتجر - مجيب العباب
نسخة مصححة - بدون أخطاء
==============================================
*/

// ==================== المتغيرات العامة ====================
let currentProducts = JSON.parse(localStorage.getItem('products')) || [];
let currentOrders = JSON.parse(localStorage.getItem('orders')) || [];
let storeSettings = JSON.parse(localStorage.getItem('store_settings')) || {
    storeName: "متجر تقني",
    storeEmail: "mjyblwan0@gmail.com",
    storePhone: "781238648",
    storeAddress: "المملكة العربية السعودية"
};

let discountCodes = JSON.parse(localStorage.getItem('discount_codes')) || {
    'TECH10': { discount: 10, active: true },
    'WELCOME20': { discount: 20, active: true },
    'SAVE30': { discount: 30, active: false }
};

// بيانات الدخول
let adminCredentials = JSON.parse(localStorage.getItem('admin_credentials')) || {
    username: 'admin',
    password: 'Admin@1234',
    lastChanged: new Date().toISOString()
};

// ==================== 🔐 التحقق من تسجيل الدخول ====================
(function checkLogin() {
    console.log('🔐 التحقق من تسجيل الدخول...');
    
    const isLoggedIn = sessionStorage.getItem('admin_logged_in');
    const loginTime = sessionStorage.getItem('login_time');
    
    if (!isLoggedIn || !loginTime) {
        console.log('❌ لم يتم تسجيل الدخول');
        window.location.href = 'login.html';
        return;
    }
    
    // التحقق من انتهاء الجلسة (4 ساعات)
    const loginDate = new Date(loginTime);
    const currentDate = new Date();
    const sessionTimeout = 4 * 60 * 60 * 1000; // 4 ساعات
    
    if (currentDate - loginDate > sessionTimeout) {
        console.log('⏰ انتهت مدة الجلسة');
        sessionStorage.removeItem('admin_logged_in');
        sessionStorage.removeItem('login_time');
        window.location.href = 'login.html';
        return;
    }
    
    console.log('✅ مستخدم مسجل الدخول');
})();

// ==================== تهيئة لوحة التحكم ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 لوحة تحكم المتجر - جاهزة للعمل');
    
    // تحميل البيانات
    loadProductsTable();
    loadOrdersTable();
    loadCustomersTable();
    loadStoreSettings();
    loadDiscountCodes();
    
    // تحديث الإحصائيات
    updateStatistics();
    loadRecentOrders();
    
    // تحديث عداد الطلبات
    updateOrdersBadge();
    
    // إعداد الأحداث
    setupEventListeners();
    setupMobileSidebar();
    addChangePasswordButton();
    
    // تحميل المخططات (بعد التأكد من تحميل DOM)
    setTimeout(() => {
        loadCharts();
        loadTopProducts();
    }, 500);
    
    // تفعيل التبويب الأول
    activateTab('dashboard');
    
    console.log('✅ تم تحميل لوحة التحكم بنجاح');
});

// ==================== إدارة التبويبات ====================
function activateTab(tabId) {
    console.log(`🎯 تفعيل التبويب: ${tabId}`);
    
    // إزالة النشاط من جميع عناصر القائمة
    document.querySelectorAll('.sidebar-menu li').forEach(li => {
        li.classList.remove('active');
    });
    
    // إخفاء جميع محتويات التبويبات
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // إضافة النشاط للعنصر المحدد
    const targetMenuItem = document.querySelector(`.sidebar-menu li[data-tab="${tabId}"]`);
    if (targetMenuItem) {
        targetMenuItem.classList.add('active');
    }
    
    // إظهار محتوى التبويب المحدد
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

// ==================== إدارة المنتجات ====================
function loadProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    if (currentProducts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-table">لا توجد منتجات حالياً</td></tr>`;
        return;
    }
    
    tbody.innerHTML = currentProducts.map(product => `
        <tr>
            <td>
                <img src="${product.image || 'default.png'}" alt="${product.name}" class="product-image"
                     onerror="this.src='https://via.placeholder.com/50x50/e0e0e0/666666?text=PROD'">
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
                <div class="action-buttons">
                    <button class="btn-action btn-edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function addNewProduct() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModalTitle').textContent = 'إضافة منتج جديد';
    document.getElementById('productModal').classList.add('active');
}

function editProduct(productId) {
    const product = currentProducts.find(p => p.id == productId);
    if (!product) {
        showAdminNotification('المنتج غير موجود', 'error');
        return;
    }
    
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
    document.getElementById('productModal').classList.add('active');
}

function saveProduct() {
    const productId = document.getElementById('productId').value;
    const productData = {
        id: productId ? parseInt(productId) : Date.now(),
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        oldPrice: document.getElementById('productOldPrice').value ? 
                  parseFloat(document.getElementById('productOldPrice').value) : null,
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value || 'images/default.png',
        inStock: document.getElementById('productStock').value === 'true',
        featured: document.getElementById('productFeatured').checked
    };
    
    if (!productData.name || !productData.category || !productData.price || !productData.description) {
        showAdminNotification('الرجاء تعبئة جميع الحقول المطلوبة', 'error');
        return;
    }
    
    if (productId) {
        const index = currentProducts.findIndex(p => p.id == productId);
        if (index !== -1) {
            currentProducts[index] = productData;
            showAdminNotification('تم تحديث المنتج بنجاح');
        }
    } else {
        currentProducts.push(productData);
        showAdminNotification('تم إضافة المنتج بنجاح');
    }
    
    localStorage.setItem('products', JSON.stringify(currentProducts));
    loadProductsTable();
    updateStatistics();
    
    document.getElementById('productModal').classList.remove('active');
}

function deleteProduct(productId) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    
    currentProducts = currentProducts.filter(p => p.id != productId);
    localStorage.setItem('products', JSON.stringify(currentProducts));
    
    loadProductsTable();
    updateStatistics();
    showAdminNotification('تم حذف المنتج بنجاح');
}

// ==================== إدارة الطلبات ====================
function loadOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    
    const statusFilter = document.getElementById('orderStatusFilter')?.value || 'all';
    let filteredOrders = currentOrders;
    
    if (statusFilter !== 'all') {
        filteredOrders = currentOrders.filter(order => order.status === statusFilter);
    }
    
    if (filteredOrders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-table">لا توجد طلبات حالياً</td></tr>`;
        return;
    }
    
    tbody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td>#${order.id.toString().slice(-6)}</td>
            <td>${order.customer?.name || 'غير معروف'}</td>
            <td>${order.date || 'غير معروف'}</td>
            <td>${order.cart?.length || 0} منتجات</td>
            <td>${order.total?.toFixed(2) || '0.00'} ر.س</td>
            <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-view" onclick="viewOrderDetails(${order.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-edit" onclick="editOrderStatus(${order.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function loadRecentOrders() {
    const tbody = document.getElementById('recentOrdersBody');
    if (!tbody) return;
    
    const recentOrders = currentOrders.slice(-5).reverse();
    
    if (recentOrders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-table">لا توجد طلبات حالياً</td></tr>`;
        return;
    }
    
    tbody.innerHTML = recentOrders.map(order => `
        <tr>
            <td>#${order.id.toString().slice(-6)}</td>
            <td>${order.customer?.name || 'غير معروف'}</td>
            <td>${order.date || 'غير معروف'}</td>
            <td>${order.total?.toFixed(2) || '0.00'} ر.س</td>
            <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-view" onclick="viewOrderDetails(${order.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-edit" onclick="editOrderStatus(${order.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function viewOrderDetails(orderId) {
    const order = currentOrders.find(o => o.id == orderId);
    if (!order) {
        showAdminNotification('الطلب غير موجود', 'error');
        return;
    }
    
    const modalContent = `
        <div class="order-details-section">
            <h4><i class="fas fa-user"></i> معلومات العميل</h4>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
                <p><strong>الاسم:</strong> ${order.customer?.name || 'غير معروف'}</p>
                <p><strong>الهاتف:</strong> ${order.customer?.phone || 'غير معروف'}</p>
                <p><strong>البريد:</strong> ${order.customer?.email || 'غير معروف'}</p>
                <p><strong>العنوان:</strong> ${order.customer?.address || 'غير معروف'}</p>
                <p><strong>ملاحظات:</strong> ${order.customer?.notes || 'لا يوجد'}</p>
            </div>
        </div>
        
        <div class="order-details-section">
            <h4><i class="fas fa-box"></i> المنتجات</h4>
            <div class="order-products">
                ${order.cart?.map(item => `
                    <div class="order-product-item">
                        <img src="${item.image || 'images/default.png'}" alt="${item.name}" class="order-product-img"
                             onerror="this.src='https://via.placeholder.com/60x60/e0e0e0/666666?text=PROD'">
                        <div class="order-product-info">
                            <h5>${item.name || 'منتج'}</h5>
                            <p>الكمية: ${item.quantity || 1} × ${item.price || 0} ر.س</p>
                        </div>
                        <div class="order-product-price">
                            ${((item.quantity || 1) * (item.price || 0)).toFixed(2)} ر.س
                        </div>
                    </div>
                `).join('') || '<p>لا توجد منتجات</p>'}
            </div>
        </div>
        
        <div class="order-details-section">
            <h4><i class="fas fa-receipt"></i> معلومات الطلب</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <p><strong>رقم الطلب:</strong> #${order.id.toString().slice(-6)}</p>
                    <p><strong>التاريخ:</strong> ${order.date || 'غير معروف'}</p>
                    <p><strong>الحالة:</strong> <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></p>
                </div>
                <div style="background-color: #f0f7ff; padding: 15px; border-radius: 8px;">
                    <p><strong>عدد المنتجات:</strong> ${order.cart?.length || 0}</p>
                    <p><strong>المجموع:</strong> ${order.total?.toFixed(2) || '0.00'} ر.س</p>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('orderDetailsTitle').textContent = `تفاصيل الطلب #${order.id.toString().slice(-6)}`;
    document.getElementById('orderDetailsContent').innerHTML = modalContent;
    document.getElementById('orderDetailsModal').classList.add('active');
    document.getElementById('updateOrderStatusBtn').dataset.orderId = orderId;
}

function editOrderStatus(orderId) {
    const order = currentOrders.find(o => o.id == orderId);
    if (!order) return;
    
    const statuses = ['جديد', 'قيد المعالجة', 'تم الشحن', 'تم التوصيل', 'ملغي'];
    const newStatus = prompt(`تغيير حالة الطلب #${order.id.toString().slice(-6)}\n\n${statuses.join('\n')}\n\nأدخل الحالة الجديدة:`, order.status);
    
    if (newStatus && newStatus !== order.status && ['new', 'processing', 'shipped', 'delivered', 'cancelled'].includes(newStatus)) {
        order.status = newStatus;
        localStorage.setItem('orders', JSON.stringify(currentOrders));
        
        loadOrdersTable();
        loadRecentOrders();
        updateOrdersBadge();
        
        showAdminNotification('تم تحديث حالة الطلب بنجاح');
    }
}

// ==================== إدارة العملاء ====================
function loadCustomersTable() {
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;
    
    const customers = getUniqueCustomers();
    
    if (customers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-table">لا توجد عملاء حالياً</td></tr>`;
        return;
    }
    
    tbody.innerHTML = customers.map(customer => {
        const customerOrders = currentOrders.filter(order => order.customer?.phone === customer.phone);
        const totalSpent = customerOrders.reduce((total, order) => total + (order.total || 0), 0);
        
        return `
            <tr>
                <td>${customer.name || 'غير معروف'}</td>
                <td>${customer.phone || 'غير معروف'}</td>
                <td>${customer.email || 'لم يذكر'}</td>
                <td>${customerOrders.length}</td>
                <td>${totalSpent.toFixed(2)} ر.س</td>
                <td>${customerOrders[0]?.date || 'غير معروف'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-view" onclick="viewCustomerDetails('${customer.phone}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function viewCustomerDetails(phone) {
    const customer = getUniqueCustomers().find(c => c.phone === phone);
    const customerOrders = currentOrders.filter(order => order.customer?.phone === phone);
    
    let message = `👤 معلومات العميل:\n`;
    message += `الاسم: ${customer?.name || 'غير معروف'}\n`;
    message += `الهاتف: ${phone}\n`;
    message += `البريد: ${customer?.email || 'لم يذكر'}\n`;
    message += `عدد الطلبات: ${customerOrders.length}\n`;
    message += `إجمالي المشتريات: ${customerOrders.reduce((total, order) => total + (order.total || 0), 0).toFixed(2)} ر.س\n\n`;
    message += `📋 تاريخ الطلبات:\n`;
    
    customerOrders.slice(-5).reverse().forEach(order => {
        message += `- الطلب #${order.id.toString().slice(-6)}: ${order.date} (${order.total?.toFixed(2) || '0.00'} ر.س)\n`;
    });
    
    alert(message);
}

// ==================== الإعدادات ====================
function loadStoreSettings() {
    const storeName = document.getElementById('storeName');
    const storeEmail = document.getElementById('storeEmail');
    const storePhone = document.getElementById('storePhone');
    const storeAddress = document.getElementById('storeAddress');
    
    if (storeName) storeName.value = storeSettings.storeName;
    if (storeEmail) storeEmail.value = storeSettings.storeEmail;
    if (storePhone) storePhone.value = storeSettings.storePhone;
    if (storeAddress) storeAddress.value = storeSettings.storeAddress;
}

function saveStoreSettings(event) {
    if (event) event.preventDefault();
    
    storeSettings = {
        storeName: document.getElementById('storeName').value,
        storeEmail: document.getElementById('storeEmail').value,
        storePhone: document.getElementById('storePhone').value,
        storeAddress: document.getElementById('storeAddress').value
    };
    
    localStorage.setItem('store_settings', JSON.stringify(storeSettings));
    showAdminNotification('تم حفظ الإعدادات بنجاح');
}

function loadDiscountCodes() {
    const tbody = document.getElementById('discountCodesTable');
    if (!tbody) return;
    
    tbody.innerHTML = Object.entries(discountCodes).map(([code, data]) => `
        <tr>
            <td><strong>${code}</strong></td>
            <td>${data.discount}%</td>
            <td>
                <span class="status-badge ${data.active ? 'status-available' : 'status-unavailable'}">
                    ${data.active ? 'نشط' : 'غير نشط'}
                </span>
            </td>
            <td>
                <button class="btn-action btn-edit btn-sm" onclick="editDiscountCode('${code}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-delete btn-sm" onclick="deleteDiscountCode('${code}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function addDiscountCode() {
    const code = prompt('أدخل كود الخصم الجديد (أحرف كبيرة فقط):', '');
    if (!code) return;
    
    const discount = parseFloat(prompt('أدخل نسبة الخصم:', '10'));
    if (isNaN(discount) || discount < 1 || discount > 100) {
        showAdminNotification('نسبة الخصم يجب أن تكون بين 1 و 100', 'error');
        return;
    }
    
    discountCodes[code.toUpperCase()] = {
        discount: discount,
        active: true
    };
    
    localStorage.setItem('discount_codes', JSON.stringify(discountCodes));
    loadDiscountCodes();
    showAdminNotification('تم إضافة كود الخصم بنجاح');
}

function editDiscountCode(code) {
    const newStatus = confirm(`كود الخصم: ${code}\n\nهل تريد ${discountCodes[code].active ? 'تعطيل' : 'تفعيل'} هذا الكود؟`);
    if (newStatus !== null) {
        discountCodes[code].active = newStatus;
        localStorage.setItem('discount_codes', JSON.stringify(discountCodes));
        loadDiscountCodes();
        showAdminNotification('تم تحديث حالة كود الخصم');
    }
}

function deleteDiscountCode(code) {
    if (confirm(`هل أنت متأكد من حذف كود الخصم ${code}؟`)) {
        delete discountCodes[code];
        localStorage.setItem('discount_codes', JSON.stringify(discountCodes));
        loadDiscountCodes();
        showAdminNotification('تم حذف كود الخصم بنجاح');
    }
}

// ==================== الإحصائيات ====================
function updateStatistics() {
    document.getElementById('totalOrders').textContent = currentOrders.length;
    document.getElementById('totalCustomers').textContent = getUniqueCustomers().length;
    document.getElementById('totalProducts').textContent = currentProducts.length;
    document.getElementById('totalRevenue').textContent = calculateTotalRevenue().toFixed(2) + ' ر.س';
}

function loadCharts() {
    // مخطط الطلبات
    const ordersCtx = document.getElementById('ordersChart');
    if (ordersCtx) {
        try {
            ordersCtx.getContext('2d');
        } catch (e) {
            // تجاهل الخطأ
        }
    }
}

function loadTopProducts() {
    const container = document.getElementById('topProductsList');
    if (!container) return;
    
    container.innerHTML = `
        <div class="top-product-item">
            <div class="product-rank">1</div>
            <div class="product-info">
                <h4>سماعة رأس لاسلكية</h4>
                <p>25 وحدة مباعة</p>
            </div>
            <div class="product-sales">6,250 ر.س</div>
        </div>
        <div class="top-product-item">
            <div class="product-rank">2</div>
            <div class="product-info">
                <h4>هاتف ذكي</h4>
                <p>18 وحدة مباعة</p>
            </div>
            <div class="product-sales">21,600 ر.س</div>
        </div>
    `;
}

// ==================== الأدوات المساعدة ====================
function getUniqueCustomers() {
    const customersMap = new Map();
    currentOrders.forEach(order => {
        if (order.customer && order.customer.phone) {
            customersMap.set(order.customer.phone, order.customer);
        }
    });
    return Array.from(customersMap.values());
}

function calculateTotalRevenue() {
    return currentOrders.reduce((total, order) => total + (order.total || 0), 0);
}

function getStatusText(status) {
    const statusMap = {
        'new': 'جديد',
        'processing': 'قيد المعالجة',
        'shipped': 'تم الشحن',
        'delivered': 'تم التوصيل',
        'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
}

function updateOrdersBadge() {
    const newOrders = currentOrders.filter(order => order.status === 'new').length;
    const badges = document.querySelectorAll('.new-orders');
    badges.forEach(badge => {
        badge.textContent = newOrders;
        badge.style.display = newOrders > 0 ? 'inline-block' : 'none';
    });
}

function showAdminNotification(message, type = 'success') {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background-color: ${colors[type] || colors.success};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInLeft 0.3s ease;
        font-family: 'Cairo', sans-serif;
        direction: rtl;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutLeft 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== نظام تغيير كلمة المرور ====================
function addChangePasswordButton() {
    console.log('🔧 إضافة زر تغيير كلمة المرور...');
    
    // 1. في شريط المستخدم
    const userSection = document.querySelector('.admin-user');
    if (userSection) {
        const existingBtn = userSection.querySelector('.btn-change-password');
        if (!existingBtn) {
            const changePasswordBtn = document.createElement('button');
            changePasswordBtn.className = 'btn-change-password';
            changePasswordBtn.innerHTML = '<i class="fas fa-key"></i>';
            changePasswordBtn.title = 'تغيير كلمة المرور';
            changePasswordBtn.style.cssText = `
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
            
            changePasswordBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openChangePasswordModal();
            });
            
            userSection.insertBefore(changePasswordBtn, userSection.firstChild);
        }
    }
    
    // 2. في القائمة الجانبية
    const sidebarMenu = document.querySelector('.sidebar-menu');
    if (sidebarMenu && !sidebarMenu.querySelector('.change-password-item')) {
        const menuItem = document.createElement('li');
        menuItem.className = 'change-password-item';
        menuItem.style.borderTop = '1px solid #eee';
        menuItem.style.marginTop = '10px';
        menuItem.style.paddingTop = '10px';
        
        menuItem.innerHTML = `
            <a href="#" onclick="openChangePasswordModal(); return false;" style="color: #ff6b35;">
                <i class="fas fa-key" style="color: #ff6b35;"></i>
                <span>تغيير كلمة المرور</span>
            </a>
        `;
        
        sidebarMenu.appendChild(menuItem);
    }
}

function openChangePasswordModal() {
    console.log('🔓 فتح نافذة تغيير كلمة المرور');
    
    // إزالة النافذة إذا كانت موجودة
    const existingModal = document.getElementById('changePasswordModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modalHTML = `
        <div class="modal-overlay active" id="changePasswordModal">
            <div class="modal" style="max-width: 500px;">
                <div class="modal-header">
                    <h3><i class="fas fa-key"></i> تغيير كلمة المرور</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div id="passwordError" class="error-message" style="display: none; margin-bottom: 15px;"></div>
                    
                    <form id="changePasswordForm">
                        <div class="form-group">
                            <label for="currentPassword"><i class="fas fa-lock"></i> كلمة المرور الحالية *</label>
                            <input type="password" id="currentPassword" placeholder="أدخل كلمة المرور الحالية" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="newPassword"><i class="fas fa-lock"></i> كلمة المرور الجديدة *</label>
                            <input type="password" id="newPassword" placeholder="أدخل كلمة المرور الجديدة" required>
                            <div style="font-size: 0.85rem; color: #666; margin-top: 5px;">
                                يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، رقم ورمز خاص
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="confirmPassword"><i class="fas fa-lock"></i> تأكيد كلمة المرور الجديدة *</label>
                            <input type="password" id="confirmPassword" placeholder="أعد إدخال كلمة المرور الجديدة" required>
                        </div>
                        
                        <div class="password-strength" style="margin-top: 15px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <span>قوة كلمة المرور:</span>
                                <span id="passwordStrengthText" style="font-weight: 600;">ضعيفة</span>
                            </div>
                            <div style="height: 6px; background: #eee; border-radius: 3px; overflow: hidden;">
                                <div id="passwordStrengthBar" style="height: 100%; width: 10%; background: #dc3545; transition: all 0.3s ease;"></div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary close-modal">إلغاء</button>
                    <button class="btn btn-primary" id="savePasswordBtn">
                        <i class="fas fa-save"></i> حفظ التغييرات
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // إعداد الأحداث
    setupPasswordModalEvents();
}

function setupPasswordModalEvents() {
    // التحقق من قوة كلمة المرور
    const newPasswordInput = document.getElementById('newPassword');
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
    }
    
    // حفظ كلمة المرور
    const savePasswordBtn = document.getElementById('savePasswordBtn');
    if (savePasswordBtn) {
        savePasswordBtn.addEventListener('click', changeAdminPassword);
    }
    
    // إغلاق النافذة
    document.querySelectorAll('#changePasswordModal .close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('changePasswordModal').remove();
        });
    });
}

function checkPasswordStrength(password) {
    let strength = 0;
    const text = document.getElementById('passwordStrengthText');
    const bar = document.getElementById('passwordStrengthBar');
    
    if (!text || !bar) return;
    
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    bar.style.width = strength + '%';
    
    if (strength < 50) {
        bar.style.background = '#dc3545';
        text.textContent = 'ضعيفة';
        text.style.color = '#dc3545';
    } else if (strength < 75) {
        bar.style.background = '#ffc107';
        text.textContent = 'متوسطة';
        text.style.color = '#ffc107';
    } else {
        bar.style.background = '#28a745';
        text.textContent = 'قوية';
        text.style.color = '#28a745';
    }
}

function changeAdminPassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorDiv = document.getElementById('passwordError');
    
    if (!errorDiv) return;
    
    errorDiv.style.display = 'none';
    
    if (currentPassword !== adminCredentials.password) {
        errorDiv.textContent = 'كلمة المرور الحالية غير صحيحة';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (newPassword !== confirmPassword) {
        errorDiv.textContent = 'كلمة المرور الجديدة غير متطابقة';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (newPassword.length < 8) {
        errorDiv.textContent = 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (!/[A-Z]/.test(newPassword)) {
        errorDiv.textContent = 'يجب أن تحتوي كلمة المرور على حرف كبير على الأقل';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (!/[0-9]/.test(newPassword)) {
        errorDiv.textContent = 'يجب أن تحتوي كلمة المرور على رقم على الأقل';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (!/[^A-Za-z0-9]/.test(newPassword)) {
        errorDiv.textContent = 'يجب أن تحتوي كلمة المرور على رمز خاص على الأقل (!@#$%^&*)';
        errorDiv.style.display = 'block';
        return;
    }
    
    adminCredentials.password = newPassword;
    adminCredentials.lastChanged = new Date().toISOString();
    localStorage.setItem('admin_credentials', JSON.stringify(adminCredentials));
    
    document.getElementById('changePasswordModal').remove();
    showAdminNotification('تم تغيير كلمة المرور بنجاح', 'success');
    
    setTimeout(() => {
        logoutAdmin();
    }, 2000);
}

function logoutAdmin() {
    sessionStorage.removeItem('admin_logged_in');
    sessionStorage.removeItem('login_time');
    window.location.href = 'login.html';
}

// ==================== فلترة المنتجات ====================
function filterProductsTable() {
    const searchTerm = document.getElementById('productSearch')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    
    const filteredProducts = currentProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        let matchesStatus = true;
        
        if (statusFilter === 'available') {
            matchesStatus = product.inStock === true;
        } else if (statusFilter === 'unavailable') {
            matchesStatus = product.inStock === false;
        }
        
        return matchesSearch && matchesCategory && matchesStatus;
    });
    
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    if (filteredProducts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-table">لا توجد منتجات تطابق معايير البحث</td></tr>`;
        return;
    }
    
    tbody.innerHTML = filteredProducts.map(product => `
        <tr>
            <td>
                <img src="${product.image || 'default.png'}" alt="${product.name}" class="product-image"
                     onerror="this.src='https://via.placeholder.com/50x50/e0e0e0/666666?text=PROD'">
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
                <div class="action-buttons">
                    <button class="btn-action btn-edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ==================== إعداد الأحداث ====================
function setupEventListeners() {
    console.log('🔧 إعداد الأحداث...');
    
    // 1. أحداث التبويبات
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            if (tabId) {
                activateTab(tabId);
            }
        });
    });
    
    // 2. أحداث المنتجات
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', addNewProduct);
    }
    
    const saveProductBtn = document.getElementById('saveProductBtn');
    if (saveProductBtn) {
        saveProductBtn.addEventListener('click', saveProduct);
    }
    
    // 3. أحداث النوافذ المنبثقة
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal-overlay');
            if (modal) modal.classList.remove('active');
        });
    });
    
    // 4. أحداث الفلترة
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', loadOrdersTable);
    }
    
    const productSearch = document.getElementById('productSearch');
    if (productSearch) {
        productSearch.addEventListener('input', filterProductsTable);
    }
    
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProductsTable);
    }
    
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterProductsTable);
    }
    
    // 5. أحداث الإعدادات
    const storeSettingsForm = document.getElementById('storeSettingsForm');
    if (storeSettingsForm) {
        storeSettingsForm.addEventListener('submit', saveStoreSettings);
    }
    
    const addDiscountCodeBtn = document.getElementById('addDiscountCode');
    if (addDiscountCodeBtn) {
        addDiscountCodeBtn.addEventListener('click', addDiscountCode);
    }
    
    // 6. أحداث الطلبات
    const updateOrderStatusBtn = document.getElementById('updateOrderStatusBtn');
    if (updateOrderStatusBtn) {
        updateOrderStatusBtn.addEventListener('click', function() {
            const orderId = this.dataset.orderId;
            editOrderStatus(orderId);
            document.getElementById('orderDetailsModal').classList.remove('active');
        });
    }
    
    // 7. أحداث الروابط والأزرار
    const viewStoreBtn = document.querySelector('.btn-store');
    if (viewStoreBtn) {
        viewStoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('index.html', '_blank');
        });
    }
    
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutAdmin);
    }
    
    // إغلاق النوافذ عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
        }
    });
}

// ==================== القائمة الجانبية للهواتف ====================
function setupMobileSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (!sidebarToggle || !sidebar) return;
    
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            sidebarToggle.style.display = 'flex';
            sidebar.classList.remove('active');
        } else {
            sidebarToggle.style.display = 'none';
            sidebar.classList.add('active');
        }
    }
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    sidebarToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        sidebar.classList.toggle('active');
        this.innerHTML = sidebar.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && 
            sidebar.classList.contains('active') &&
            !sidebar.contains(event.target) && 
            event.target !== sidebarToggle &&
            !sidebarToggle.contains(event.target)) {
            sidebar.classList.remove('active');
            sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// ==================== تحميل بيانات تجريبية ====================
(function loadSampleData() {
    if (currentProducts.length === 0) {
        currentProducts = [
            {
                id: 1,
                name: "سماعة رأس لاسلكية",
                category: "إلكترونيات",
                price: 250,
                oldPrice: 300,
                description: "سماعة رأس لاسلكية عالية الجودة",
                image: "images/headphones.jpg",
                inStock: true,
                featured: true
            },
            {
                id: 2,
                name: "هاتف ذكي",
                category: "إلكترونيات",
                price: 1200,
                oldPrice: 1500,
                description: "هاتف ذكي بشاشة كبيرة",
                image: "images/phone.jpg",
                inStock: true,
                featured: true
            }
        ];
        localStorage.setItem('products', JSON.stringify(currentProducts));
    }
    
    if (currentOrders.length === 0) {
        currentOrders = [
            {
                id: Date.now(),
                customer: {
                    name: "أحمد محمد",
                    phone: "0512345678",
                    email: "ahmed@example.com",
                    address: "الرياض، المملكة العربية السعودية",
                    notes: "التوصيل في الصباح"
                },
                cart: [
                    {
                        id: 1,
                        name: "سماعة رأس لاسلكية",
                        price: 250,
                        quantity: 2,
                        image: "images/headphones.jpg"
                    }
                ],
                total: 500,
                date: new Date().toISOString().split('T')[0],
                status: "new"
            }
        ];
        localStorage.setItem('orders', JSON.stringify(currentOrders));
    }
})();

// ==================== معلومات المطور ====================
console.log(`
==============================================
🛠️ لوحة تحكم المتجر - الإصدار المصحح
👨‍💻 المطور: مجيب العباب
📧 التواصل: mjyblwan0@gmail.com
📱 الواتساب: 781238648
🌐 النسخة: 4.0.0 (مستقرة)
==============================================
`);

// إضافة الأنيميشن
const adminStyle = document.createElement('style');
adminStyle.textContent = `
    @keyframes slideInLeft {
        from { transform: translateX(-100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutLeft {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(-100px); opacity: 0; }
    }
`;
document.head.appendChild(adminStyle);
