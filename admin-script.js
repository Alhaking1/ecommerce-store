/*
==============================================
لوحة تحكم المتجر - مجيب العباب
الإصدار النهائي مع دعم التحديث المباشر
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

// ==================== تهيئة لوحة التحكم ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 لوحة تحكم المتجر - جاهزة للعمل');
    console.log('📊 عدد المنتجات:', currentProducts.length);
    console.log('📦 عدد الطلبات:', currentOrders.length);
    
    // تحميل البيانات الأولية
    initDashboard();
    loadProductsTable();
    loadOrdersTable();
    loadCustomersTable();
    loadStoreSettings();
    loadDiscountCodes();
    
    // إعداد الأحداث
    setupAdminEventListeners();
    
    // تحديث العداد
    updateOrdersBadge();
    
    // إضافة زر تحديث المتجر
    addStoreRefreshButton();
});

// ==================== لوحة التحكم الرئيسية ====================
function initDashboard() {
    updateStatistics();
    loadRecentOrders();
    loadTopProducts();
    loadCharts();
}

function updateStatistics() {
    document.getElementById('totalOrders').textContent = currentOrders.length;
    document.getElementById('totalCustomers').textContent = getUniqueCustomers().length;
    document.getElementById('totalProducts').textContent = currentProducts.length;
    document.getElementById('totalRevenue').textContent = calculateTotalRevenue().toFixed(2) + ' ر.س';
}

function loadRecentOrders() {
    const tbody = document.getElementById('recentOrdersBody');
    const recentOrders = currentOrders.slice(-5).reverse();
    
    if (recentOrders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-table">لا توجد طلبات حالياً</td></tr>`;
        return;
    }
    
    tbody.innerHTML = recentOrders.map(order => `
        <tr>
            <td>#${order.id.toString().slice(-6)}</td>
            <td>${order.customer.name}</td>
            <td>${order.date}</td>
            <td>${order.total.toFixed(2)} ر.س</td>
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

// ==================== إدارة المنتجات ====================
function loadProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    
    if (currentProducts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-table">لا توجد منتجات حالياً</td></tr>`;
        return;
    }
    
    tbody.innerHTML = currentProducts.map(product => `
        <tr>
            <td>
                <img src="${product.image || 'images/default.png'}" alt="${product.name}" class="product-image"
                     onerror="this.src='https://via.placeholder.com/50x50/e0e0e0/666666?text=${encodeURIComponent(product.name.substring(0, 5))}'">
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
    if (!product) return;
    
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
        }
    } else {
        currentProducts.push(productData);
    }
    
    // حفظ في localStorage
    localStorage.setItem('products', JSON.stringify(currentProducts));
    
    // 🔥 **الإضافة المهمة:** تحديث جميع النوافذ المفتوحة
    updateAllStoreWindows();
    
    // تحديث العرض
    loadProductsTable();
    updateStatistics();
    
    // إغلاق النافذة
    document.getElementById('productModal').classList.remove('active');
    
    showAdminNotification(productId ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح');
}

function deleteProduct(productId) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    
    currentProducts = currentProducts.filter(p => p.id != productId);
    localStorage.setItem('products', JSON.stringify(currentProducts));
    
    // 🔥 **الإضافة المهمة:** تحديث جميع النوافذ المفتوحة
    updateAllStoreWindows();
    
    loadProductsTable();
    updateStatistics();
    showAdminNotification('تم حذف المنتج بنجاح');
}

// ==================== تحديث المتجر الرئيسي ====================
function updateAllStoreWindows() {
    console.log('🔄 إرسال تحديث المنتجات لجميع النوافذ...');
    
    // تحديث localStorage الذي سيستشعر به المتجر الرئيسي
    localStorage.setItem('products', JSON.stringify(currentProducts));
    
    // إرسال حدث storage لتحديث الصفحات الأخرى
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'products',
        newValue: JSON.stringify(currentProducts),
        oldValue: localStorage.getItem('products'),
        url: window.location.href
    }));
    
    // محاولة الاتصال بالنوافذ الأخرى
    try {
        // إذا كان المتجر مفتوحاً في نفس المتصفح
        if (window.opener && !window.opener.closed) {
            window.opener.postMessage({
                type: 'PRODUCTS_UPDATED',
                products: currentProducts,
                timestamp: Date.now()
            }, '*');
        }
        
        // بث للجميع
        window.postMessage({
            type: 'PRODUCTS_UPDATED_ADMIN',
            products: currentProducts,
            source: 'admin'
        }, '*');
        
        console.log('✅ تم إرسال تحديث المنتجات');
    } catch (error) {
        console.warn('⚠️ لا يمكن الاتصال بالنوافذ الأخرى:', error);
    }
}

// ==================== إدارة الطلبات ====================
function loadOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    const statusFilter = document.getElementById('orderStatusFilter').value;
    
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
            <td>${order.customer.name}</td>
            <td>${order.date}</td>
            <td>${order.cart.length} منتجات</td>
            <td>${order.total.toFixed(2)} ر.س</td>
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
    if (!order) return;
    
    const modalContent = `
        <div class="order-details-section">
            <h4><i class="fas fa-user"></i> معلومات العميل</h4>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
                <p><strong>الاسم:</strong> ${order.customer.name}</p>
                <p><strong>الهاتف:</strong> ${order.customer.phone}</p>
                <p><strong>البريد:</strong> ${order.customer.email}</p>
                <p><strong>العنوان:</strong> ${order.customer.address}</p>
                <p><strong>ملاحظات:</strong> ${order.customer.notes}</p>
            </div>
        </div>
        
        <div class="order-details-section">
            <h4><i class="fas fa-box"></i> المنتجات</h4>
            <div class="order-products">
                ${order.cart.map(item => `
                    <div class="order-product-item">
                        <img src="${item.image || 'images/default.png'}" alt="${item.name}" class="order-product-img"
                             onerror="this.src='https://via.placeholder.com/60x60/e0e0e0/666666?text=${encodeURIComponent(item.name.substring(0, 5))}'">
                        <div class="order-product-info">
                            <h5>${item.name}</h5>
                            <p>الكمية: ${item.quantity} × ${item.price} ر.س</p>
                        </div>
                        <div class="order-product-price">
                            ${(item.quantity * item.price).toFixed(2)} ر.س
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="order-details-section">
            <h4><i class="fas fa-receipt"></i> معلومات الطلب</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <p><strong>رقم الطلب:</strong> #${order.id.toString().slice(-6)}</p>
                    <p><strong>التاريخ:</strong> ${order.date}</p>
                    <p><strong>الحالة:</strong> <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></p>
                </div>
                <div style="background-color: #f0f7ff; padding: 15px; border-radius: 8px;">
                    <p><strong>عدد المنتجات:</strong> ${order.cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
                    <p><strong>المجموع:</strong> ${order.total.toFixed(2)} ر.س</p>
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
    
    const statuses = [
        { value: 'new', label: 'جديد' },
        { value: 'processing', label: 'قيد المعالجة' },
        { value: 'shipped', label: 'تم الشحن' },
        { value: 'delivered', label: 'تم التوصيل' },
        { value: 'cancelled', label: 'ملغي' }
    ];
    
    let statusOptions = statuses.map(s => 
        `<option value="${s.value}" ${order.status === s.value ? 'selected' : ''}>${s.label}</option>`
    ).join('');
    
    const newStatus = prompt(
        `تغيير حالة الطلب #${order.id.toString().slice(-6)}\n\nاختر الحالة الجديدة:`,
        order.status
    );
    
    if (newStatus && newStatus !== order.status && ['new', 'processing', 'shipped', 'delivered', 'cancelled'].includes(newStatus)) {
        order.status = newStatus;
        localStorage.setItem('orders', JSON.stringify(currentOrders));
        
        loadOrdersTable();
        loadRecentOrders();
        updateOrdersBadge();
        
        showAdminNotification('تم تحديث حالة الطلب بنجاح');
    }
}

// ==================== الإعدادات ====================
function loadStoreSettings() {
    document.getElementById('storeName').value = storeSettings.storeName;
    document.getElementById('storeEmail').value = storeSettings.storeEmail;
    document.getElementById('storePhone').value = storeSettings.storePhone;
    document.getElementById('storeAddress').value = storeSettings.storeAddress;
}

function saveStoreSettings(event) {
    event.preventDefault();
    
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

// ==================== الأدوات المساعدة ====================
function getUniqueCustomers() {
    const customersMap = new Map();
    currentOrders.forEach(order => {
        customersMap.set(order.customer.phone, order.customer);
    });
    return Array.from(customersMap.values());
}

function calculateTotalRevenue() {
    return currentOrders.reduce((total, order) => total + order.total, 0);
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
    const badge = document.querySelector('.new-orders');
    if (badge) {
        badge.textContent = newOrders;
        badge.style.display = newOrders > 0 ? 'inline-block' : 'none';
    }
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
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutLeft 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function setupAdminEventListeners() {
    // التنقل بين التبويبات
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            document.querySelectorAll('.sidebar-menu li').forEach(li => {
                li.classList.remove('active');
            });
            this.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
            
            if (tabId === 'analytics') {
                loadCharts();
                loadTopProducts();
            } else if (tabId === 'settings') {
                loadStoreSettings();
                loadDiscountCodes();
            }
        });
    });
    
    // المنتجات
    document.getElementById('addProductBtn')?.addEventListener('click', addNewProduct);
    document.getElementById('saveProductBtn')?.addEventListener('click', saveProduct);
    
    // النوافذ
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal-overlay').classList.remove('active');
        });
    });
    
    // الفلترة
    document.getElementById('orderStatusFilter')?.addEventListener('change', loadOrdersTable);
    document.getElementById('productSearch')?.addEventListener('input', filterProductsTable);
    document.getElementById('categoryFilter')?.addEventListener('change', filterProductsTable);
    document.getElementById('statusFilter')?.addEventListener('change', filterProductsTable);
    
    // الإعدادات
    document.getElementById('storeSettingsForm')?.addEventListener('submit', saveStoreSettings);
    document.getElementById('addDiscountCode')?.addEventListener('click', addDiscountCode);
    
    // الطلبات
    document.getElementById('updateOrderStatusBtn')?.addEventListener('click', function() {
        const orderId = this.dataset.orderId;
        editOrderStatus(orderId);
        document.getElementById('orderDetailsModal').classList.remove('active');
    });
    
    // الروابط
    document.querySelector('.btn-store')?.addEventListener('click', function(e) {
        e.preventDefault();
        window.open('index.html', '_blank');
    });
    
    document.querySelector('.btn-logout')?.addEventListener('click', function() {
        if (confirm('هل تريد تسجيل الخروج؟')) {
            window.location.href = 'index.html';
        }
    });
    
    // تحديث المتجر
    document.getElementById('refreshStoreBtn')?.addEventListener('click', function() {
        updateAllStoreWindows();
        showAdminNotification('تم إرسال تحديث المنتجات للمتجر الرئيسي');
    });
    
    // استمع لرسائل المتجر
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'GET_PRODUCTS') {
            console.log('📨 استلام طلب المنتجات من المتجر');
            event.source.postMessage({
                type: 'PRODUCTS_DATA',
                products: currentProducts
            }, event.origin);
        }
    });
}

function filterProductsTable() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
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
    
    if (filteredProducts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-table">لا توجد منتجات تطابق معايير البحث</td></tr>`;
        return;
    }
    
    tbody.innerHTML = filteredProducts.map(product => `
        <tr>
            <td>
                <img src="${product.image || 'images/default.png'}" alt="${product.name}" class="product-image"
                     onerror="this.src='https://via.placeholder.com/50x50/e0e0e0/666666?text=${encodeURIComponent(product.name.substring(0, 5))}'">
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

function addStoreRefreshButton() {
    const refreshBtn = document.createElement('button');
    refreshBtn.id = 'refreshStoreBtn';
    refreshBtn.className = 'btn btn-primary';
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> تحديث المتجر';
    refreshBtn.style.marginRight = '15px';
    
    const headerActions = document.querySelector('.products-content .header-actions');
    if (headerActions) {
        headerActions.prepend(refreshBtn);
    }
}

// ==================== المخططات والاحصائيات ====================
function loadCharts() {
    // مخطط بسيط للطلبات
    const ordersCtx = document.getElementById('ordersChart')?.getContext('2d');
    if (ordersCtx) {
        new Chart(ordersCtx, {
            type: 'bar',
            data: {
                labels: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
                datasets: [{
                    label: 'عدد الطلبات',
                    data: [12, 19, 8, 15, 12, 25, 18],
                    backgroundColor: '#2d5af1'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
    
    // مخطط الفئات
    const salesCtx = document.getElementById('salesChart')?.getContext('2d');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'pie',
            data: {
                labels: ['إلكترونيات', 'إكسسوارات'],
                datasets: [{
                    data: [75, 25],
                    backgroundColor: ['#2d5af1', '#ff6b35']
                }]
            }
        });
    }
}

function loadTopProducts() {
    const container = document.getElementById('topProductsList');
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

// ==================== أكواد الخصم ====================
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

// ==================== تحميل العملاء ====================
function loadCustomersTable() {
    const tbody = document.getElementById('customersTableBody');
    const customers = getUniqueCustomers();
    
    if (customers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-table">لا توجد عملاء حالياً</td></tr>`;
        return;
    }
    
    tbody.innerHTML = customers.map(customer => {
        const customerOrders = currentOrders.filter(order => order.customer.phone === customer.phone);
        const totalSpent = customerOrders.reduce((total, order) => total + order.total, 0);
        
        return `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.phone}</td>
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
    const customerOrders = currentOrders.filter(order => order.customer.phone === phone);
    
    let message = `👤 معلومات العميل:\n`;
    message += `الاسم: ${customer.name}\n`;
    message += `الهاتف: ${customer.phone}\n`;
    message += `البريد: ${customer.email || 'لم يذكر'}\n`;
    message += `عدد الطلبات: ${customerOrders.length}\n`;
    message += `إجمالي المشتريات: ${customerOrders.reduce((total, order) => total + order.total, 0).toFixed(2)} ر.س\n\n`;
    message += `📋 تاريخ الطلبات:\n`;
    
    customerOrders.slice(-5).reverse().forEach(order => {
        message += `- الطلب #${order.id.toString().slice(-6)}: ${order.date} (${order.total.toFixed(2)} ر.س)\n`;
    });
    
    alert(message);
}

// ==================== معلومات المطور ====================
console.log(`
==============================================
🛠️ لوحة تحكم المتجر - الإصدار النهائي
👨‍💻 المطور: مجيب العباب
📧 التواصل: mjyblwan0@gmail.com
📱 واتساب: 781238648
🌐 النسخة: 2.1.0
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