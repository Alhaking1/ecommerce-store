/*
==============================================
لوحة تحكم المتجر - مجيب العباب
نسخة نهائية مصححة - بدون حلقة لانهائية
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

// ==================== التحقق من الدخول (تنفيذ فوري) ====================
(function checkLoginImmediately() {
    console.log('🔐 التحقق الفوري من تسجيل الدخول...');
    
    const isLoggedIn = sessionStorage.getItem('admin_logged_in');
    const loginTime = sessionStorage.getItem('login_time');
    
    if (!isLoggedIn || !loginTime) {
        console.log('❌ لم يتم تسجيل الدخول - التوجيه للدخول');
        window.location.href = 'login.html';
        return;
    }
    
    // التحقق من انتهاء الجلسة (4 ساعات)
    const loginDate = new Date(loginTime);
    const currentDate = new Date();
    const sessionTimeout = 4 * 60 * 60 * 1000; // 4 ساعات
    
    if (currentDate - loginDate > sessionTimeout) {
        console.log('⏰ انتهت مدة الجلسة');
        sessionStorage.clear();
        window.location.href = 'login.html';
        return;
    }
    
    console.log('✅ التحقق من الدخول ناجح - جاهز للتشغيل');
})();

// ==================== تهيئة التطبيق (مرة واحدة فقط) ====================
let appInitialized = false;

function initializeApplication() {
    if (appInitialized) {
        console.log('⚠️ التطبيق مهيأ بالفعل');
        return;
    }
    
    console.log('🚀 بدء تهيئة التطبيق...');
    appInitialized = true;
    
    // تحميل البيانات الأساسية
    loadBasicData();
    
    // إعداد الواجهة
    setupUserInterface();
    
    // إعداد الأحداث (مرة واحدة فقط)
    setupAllEventListeners();
    
    // إضافة زر تغيير كلمة المرور
    setTimeout(addChangePasswordButton, 300);
    
    // إعداد القائمة الجانبية للهواتف
    setTimeout(setupMobileSidebar, 400);
    
    console.log('✅ تم تهيئة التطبيق بنجاح');
}

function loadBasicData() {
    console.log('📊 تحميل البيانات الأساسية...');
    
    // تحميل الجداول الأساسية
    setTimeout(() => {
        if (currentProducts && currentProducts.length > 0) {
            loadProductsTable();
        }
        
        if (currentOrders && currentOrders.length > 0) {
            loadOrdersTable();
            loadRecentOrders();
            updateOrdersBadge();
        }
        
        loadCustomersTable();
        loadDiscountCodes();
        loadStoreSettings();
        
        // تحديث الإحصائيات
        updateStatistics();
        
        // تحميل المخططات والمنتجات الأعلى مبيعاً
        setTimeout(() => {
            try {
                loadCharts();
                loadTopProducts();
            } catch (e) {
                console.log('⚠️ بعض المخططات لا تعمل:', e.message);
            }
        }, 200);
    }, 100);
}

function setupUserInterface() {
    console.log('🎨 إعداد واجهة المستخدم...');
    
    // تفعيل التبويب الأول
    setTimeout(() => {
        const dashboardTab = document.querySelector('.sidebar-menu li[data-tab="dashboard"]');
        if (dashboardTab) {
            activateTab('dashboard');
        } else {
            console.log('⚠️ تبويب لوحة التحكم غير موجود');
        }
    }, 150);
}

// ==================== إدارة التبويبات ====================
function activateTab(tabId) {
    console.log(`🎯 تفعيل التبويب: ${tabId}`);
    
    // إزالة النشاط من جميع عناصر القائمة
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    menuItems.forEach(li => {
        li.classList.remove('active');
    });
    
    // إخفاء جميع محتويات التبويبات
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
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
        
        // تحديث بيانات التبويب إذا لزم
        refreshTabData(tabId);
    }
}

function refreshTabData(tabId) {
    switch(tabId) {
        case 'dashboard':
            updateStatistics();
            loadRecentOrders();
            break;
        case 'products':
            loadProductsTable();
            break;
        case 'orders':
            loadOrdersTable();
            break;
        case 'customers':
            loadCustomersTable();
            break;
        case 'analytics':
            loadCharts();
            loadTopProducts();
            break;
        case 'settings':
            loadStoreSettings();
            loadDiscountCodes();
            break;
    }
}

// ==================== نظام تغيير كلمة المرور ====================
function addChangePasswordButton() {
    console.log('🔧 إضافة زر تغيير كلمة المرور...');
    
    // 1. في شريط المستخدم العلوي
    const userSection = document.querySelector('.admin-user');
    if (userSection && !userSection.querySelector('.btn-change-password')) {
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
            margin-left: 15px;
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
    
    // 2. في القائمة الجانبية
    const sidebarMenu = document.querySelector('.sidebar-menu');
    if (sidebarMenu && !sidebarMenu.querySelector('.change-password-item')) {
        const menuItem = document.createElement('li');
        menuItem.className = 'change-password-item';
        
        // بدون إزاحة إضافية
        menuItem.style.borderTop = '1px solid #eee';
        menuItem.style.marginTop = '5px';
        menuItem.style.paddingTop = '15px';
        
        menuItem.innerHTML = `
            <a href="#" style="color: #ff6b35;">
                <i class="fas fa-key" style="color: #ff6b35;"></i>
                <span>تغيير كلمة المرور</span>
            </a>
        `;
        
        // إضافة حدث النقر بشكل صحيح
        const link = menuItem.querySelector('a');
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openChangePasswordModal();
        });
        
        sidebarMenu.appendChild(menuItem);
    }
    
    console.log('✅ تم إضافة زر تغيير كلمة المرور');
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
                            <div class="password-hint">
                                <small><i class="fas fa-info-circle"></i> يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، رقم ورمز خاص</small>
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
    setupPasswordModalEvents();
}

function setupPasswordModalEvents() {
    // قوة كلمة المرور
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
    const closeButtons = document.querySelectorAll('#changePasswordModal .close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = document.getElementById('changePasswordModal');
            if (modal) modal.remove();
        });
    });
    
    // إغلاق عند النقر خارج النافذة
    const modalOverlay = document.querySelector('#changePasswordModal.modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.remove();
            }
        });
    }
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
    const currentPassword = document.getElementById('currentPassword')?.value;
    const newPassword = document.getElementById('newPassword')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    const errorDiv = document.getElementById('passwordError');
    
    if (!errorDiv || !currentPassword || !newPassword || !confirmPassword) return;
    
    errorDiv.style.display = 'none';
    
    // التحقق من كلمة المرور الحالية
    if (currentPassword !== adminCredentials.password) {
        errorDiv.textContent = 'كلمة المرور الحالية غير صحيحة';
        errorDiv.style.display = 'block';
        return;
    }
    
    // التحقق من تطابق كلمتي المرور الجديدتين
    if (newPassword !== confirmPassword) {
        errorDiv.textContent = 'كلمة المرور الجديدة غير متطابقة';
        errorDiv.style.display = 'block';
        return;
    }
    
    // التحقق من قوة كلمة المرور
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
    
    // حفظ كلمة المرور الجديدة
    adminCredentials.password = newPassword;
    adminCredentials.lastChanged = new Date().toISOString();
    localStorage.setItem('admin_credentials', JSON.stringify(adminCredentials));
    
    // إغلاق النافذة وإظهار رسالة النجاح
    const modal = document.getElementById('changePasswordModal');
    if (modal) modal.remove();
    
    showAdminNotification('تم تغيير كلمة المرور بنجاح', 'success');
    
    // تسجيل الخروج وإعادة التوجيه بعد ثانيتين
    setTimeout(logoutAdmin, 2000);
}

function logoutAdmin() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

// ==================== إعداد جميع الأحداث ====================
function setupAllEventListeners() {
    console.log('🔌 إعداد جميع الأحداث...');
    
    // 1. أحداث التبويبات
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    menuItems.forEach(item => {
        const tabId = item.getAttribute('data-tab');
        if (tabId) {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                activateTab(tabId);
            });
        }
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
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('close-modal')) {
            const modal = e.target.closest('.modal-overlay');
            if (modal) modal.classList.remove('active');
        }
        
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
        }
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
            if (orderId) {
                editOrderStatus(orderId);
                document.getElementById('orderDetailsModal').classList.remove('active');
            }
        });
    }
    
    // 7. أحداث أخرى
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
    
    console.log('✅ تم إعداد جميع الأحداث بنجاح');
}

// ==================== الدوال الأساسية ====================
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

// ==================== دالات تحميل الجداول ====================
function loadProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    if (!currentProducts || currentProducts.length === 0) {
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

function loadOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    
    const statusFilter = document.getElementById('orderStatusFilter')?.value || 'all';
    let filteredOrders = currentOrders || [];
    
    if (statusFilter !== 'all') {
        filteredOrders = (currentOrders || []).filter(order => order.status === statusFilter);
    }
    
    if (!filteredOrders || filteredOrders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-table">لا توجد طلبات حالياً</td></tr>`;
        return;
    }
    
    tbody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td>#${order.id?.toString().slice(-6) || '000000'}</td>
            <td>${order.customer?.name || 'غير معروف'}</td>
            <td>${order.date || 'غير معروف'}</td>
            <td>${order.cart?.length || 0} منتجات</td>
            <td>${order.total?.toFixed(2) || '0.00'} ر.س</td>
            <td><span class="status-badge status-${order.status || 'new'}">${getStatusText(order.status)}</span></td>
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

function loadCustomersTable() {
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;
    
    const customers = getUniqueCustomers();
    
    if (customers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-table">لا توجد عملاء حالياً</td></tr>`;
        return;
    }
    
    tbody.innerHTML = customers.map(customer => {
        const customerOrders = (currentOrders || []).filter(order => order.customer?.phone === customer.phone);
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

// ==================== دالات المساعدة ====================
function getUniqueCustomers() {
    if (!currentOrders) return [];
    const customersMap = new Map();
    currentOrders.forEach(order => {
        if (order.customer && order.customer.phone) {
            customersMap.set(order.customer.phone, order.customer);
        }
    });
    return Array.from(customersMap.values());
}

function updateStatistics() {
    if (!document.getElementById('totalOrders')) return;
    document.getElementById('totalOrders').textContent = currentOrders?.length || 0;
    document.getElementById('totalCustomers').textContent = getUniqueCustomers().length;
    document.getElementById('totalProducts').textContent = currentProducts?.length || 0;
    document.getElementById('totalRevenue').textContent = calculateTotalRevenue().toFixed(2) + ' ر.س';
}

function calculateTotalRevenue() {
    if (!currentOrders) return 0;
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
    if (!currentOrders) return;
    const newOrders = currentOrders.filter(order => order.status === 'new').length;
    const badges = document.querySelectorAll('.new-orders');
    badges.forEach(badge => {
        badge.textContent = newOrders;
        badge.style.display = newOrders > 0 ? 'inline-block' : 'none';
    });
}

function loadRecentOrders() {
    const tbody = document.getElementById('recentOrdersBody');
    if (!tbody || !currentOrders) return;
    
    const recentOrders = currentOrders.slice(-5).reverse();
    
    if (recentOrders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-table">لا توجد طلبات حالياً</td></tr>`;
        return;
    }
    
    tbody.innerHTML = recentOrders.map(order => `
        <tr>
            <td>#${order.id?.toString().slice(-6) || '000000'}</td>
            <td>${order.customer?.name || 'غير معروف'}</td>
            <td>${order.date || 'غير معروف'}</td>
            <td>${order.total?.toFixed(2) || '0.00'} ر.س</td>
            <td><span class="status-badge status-${order.status || 'new'}">${getStatusText(order.status)}</span></td>
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

// ==================== دالات الخدمات ====================
function addNewProduct() {
    document.getElementById('productForm')?.reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModalTitle').textContent = 'إضافة منتج جديد';
    document.getElementById('productModal')?.classList.add('active');
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
    const productId = document.getElementById('productId')?.value;
    const productName = document.getElementById('productName')?.value;
    const productCategory = document.getElementById('productCategory')?.value;
    const productPrice = document.getElementById('productPrice')?.value;
    const productDescription = document.getElementById('productDescription')?.value;
    
    if (!productName || !productCategory || !productPrice || !productDescription) {
        showAdminNotification('الرجاء تعبئة جميع الحقول المطلوبة', 'error');
        return;
    }
    
    const productData = {
        id: productId ? parseInt(productId) : Date.now(),
        name: productName,
        category: productCategory,
        price: parseFloat(productPrice),
        oldPrice: document.getElementById('productOldPrice').value ? 
                  parseFloat(document.getElementById('productOldPrice').value) : null,
        description: productDescription,
        image: document.getElementById('productImage').value || 'images/default.png',
        inStock: document.getElementById('productStock').value === 'true',
        featured: document.getElementById('productFeatured').checked
    };
    
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

// ==================== إعدادات المتجر ====================
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

// ==================== الإحصائيات والمخططات ====================
function loadCharts() {
    // مخططات بسيطة
    const ordersCtx = document.getElementById('ordersChart');
    const salesCtx = document.getElementById('salesChart');
    
    if (ordersCtx) {
        ordersCtx.innerHTML = '<p style="text-align:center;padding:40px;color:#666;">مخطط الطلبات</p>';
    }
    
    if (salesCtx) {
        salesCtx.innerHTML = '<p style="text-align:center;padding:40px;color:#666;">مخطط المبيعات</p>';
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

// ==================== فلترة المنتجات ====================
function filterProductsTable() {
    const searchTerm = document.getElementById('productSearch')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    
    const filteredProducts = (currentProducts || []).filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchTerm) ||
                            product.description?.toLowerCase().includes(searchTerm);
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
}

// ==================== بيانات تجريبية ====================
(function loadSampleData() {
    if (!currentProducts || currentProducts.length === 0) {
        currentProducts = [
            {
                id: 1,
                name: "سماعة رأس لاسلكية",
                category: "إلكترونيات",
                price: 250,
                description: "سماعة رأس لاسلكية عالية الجودة",
                image: "images/headphones.jpg",
                inStock: true,
                featured: true
            }
        ];
        localStorage.setItem('products', JSON.stringify(currentProducts));
    }
    
    if (!currentOrders || currentOrders.length === 0) {
        currentOrders = [
            {
                id: Date.now(),
                customer: {
                    name: "أحمد محمد",
                    phone: "0512345678",
                    email: "ahmed@example.com",
                    address: "الرياض"
                },
                cart: [
                    {
                        id: 1,
                        name: "سماعة رأس لاسلكية",
                        price: 250,
                        quantity: 1
                    }
                ],
                total: 250,
                date: new Date().toISOString().split('T')[0],
                status: "new"
            }
        ];
        localStorage.setItem('orders', JSON.stringify(currentOrders));
    }
})();

// ==================== بدء التطبيق ====================
// استخدام تحميل مختلف لمنع الحلقة
window.addEventListener('load', function() {
    console.log('📄 الصفحة محملة بالكامل - بدء التهيئة');
    
    // تأخير قصير للتأكد من تحميل جميع العناصر
    setTimeout(() => {
        initializeApplication();
    }, 100);
});

// ==================== معلومات المطور ====================
console.log(`
==============================================
🛠️ لوحة تحكم المتجر - الإصدار النهائي
👨‍💻 المطور: مجيب العباب
📧 التواصل: mjyblwan0@gmail.com
📱 الواتساب: 781238648
🌐 النسخة: 6.0.0 (مستقرة نهائية بدون حلقة)
==============================================
`);

// إضافة أنيميشن
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
