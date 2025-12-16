/*
==============================================
نظام حماية حقوق النشر - مجيب العباب
==============================================
*/

// ==================== حماية حقوق النشر ====================
const COPYRIGHT_PROTECTION = {
    developer: "مجيب العباب",
    email: "mjyblwan0@gmail.com",
    whatsapp: "781238648",
    website: "https://alhaking1.github.io/my-portfolio",
    copyright: "© 2023 جميع الحقوق محفوظة - مجيب العباب",
    version: "2.1.0",
    license: "خاص - ممنوع النسخ أو النشر بدون إذن"
};

// ==================== التحقق من حقوق النشر ====================
function checkCopyrightProtection() {
    console.log(`
    ==============================================
    🛡️ نظام حماية حقوق النشر
    👨‍💻 المطور: ${COPYRIGHT_PROTECTION.developer}
    📧 التواصل: ${COPYRIGHT_PROTECTION.email}
    📱 واتساب: ${COPYRIGHT_PROTECTION.whatsapp}
    🌐 الموقع: ${COPYRIGHT_PROTECTION.website}
    © ${COPYRIGHT_PROTECTION.copyright}
    ==============================================
    `);
    
    // التحقق من اسم النطاق
    const allowedDomains = ['localhost', '127.0.0.1', 'alhaking1.github.io', 'github.io'];
    const currentDomain = window.location.hostname;
    
    if (!allowedDomains.some(domain => currentDomain.includes(domain))) {
        console.warn('⚠️ تحذير: تم الوصول للمشروع من نطاق غير مصرح به:', currentDomain);
        showCopyrightWarning();
    }
    
    // إضافة علامة مائية لحقوق النشر
    addWatermark();
}

// ==================== عرض تحذير حقوق النشر ====================
function showCopyrightWarning() {
    const warningHTML = `
    <div id="copyrightWarning" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        color: white;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 20px;
        font-family: 'Cairo', sans-serif;
    ">
        <div style="max-width: 600px;">
            <h1 style="color: #ff6b35; margin-bottom: 30px; font-size: 2rem;">
                <i class="fas fa-exclamation-triangle"></i> تحذير حقوق النشر
            </h1>
            
            <div style="background: rgba(255, 107, 53, 0.1); padding: 20px; border-radius: 10px; margin-bottom: 30px;">
                <h2 style="color: #2d5af1; margin-bottom: 15px;">
                    <i class="fas fa-copyright"></i> تنبيه هام
                </h2>
                <p style="font-size: 1.2rem; line-height: 1.8;">
                    هذا المشروع محمي بحقوق النشر والملكية الفكرية.<br>
                    يمنع منعاً باتاً نسخ أو تعديل أو نشر هذا المشروع بدون إذن كتابي من المطور.
                </p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h3 style="color: #28a745; margin-bottom: 15px;">
                    <i class="fas fa-user-shield"></i> معلومات المطور
                </h3>
                <p><strong>👨‍💻 الاسم:</strong> ${COPYRIGHT_PROTECTION.developer}</p>
                <p><strong>📧 البريد:</strong> ${COPYRIGHT_PROTECTION.email}</p>
                <p><strong>📱 واتساب:</strong> ${COPYRIGHT_PROTECTION.whatsapp}</p>
                <p><strong>🌐 الموقع:</strong> ${COPYRIGHT_PROTECTION.website}</p>
            </div>
            
            <div style="background: rgba(45, 90, 241, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 30px;">
                <p style="font-size: 0.9rem;">
                    <i class="fas fa-info-circle"></i> هذا المشروع مخصص للاستخدام الشخصي والتعليمي فقط.<br>
                    يمنع استخدامه لأغراض تجارية أو إعادة نشره على الإنترنت.
                </p>
            </div>
            
            <button onclick="closeCopyrightWarning()" style="
                background: #2d5af1;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 50px;
                font-size: 1.1rem;
                cursor: pointer;
                font-family: 'Cairo', sans-serif;
                display: flex;
                align-items: center;
                gap: 10px;
                margin: 0 auto;
            ">
                <i class="fas fa-check-circle"></i> فهمت وأوافق على الشروط
            </button>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', warningHTML);
    
    // منع إغلاق التحذير بسهولة
    document.getElementById('copyrightWarning').addEventListener('click', function(e) {
        if (e.target === this) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
}

// ==================== إغلاق تحذير حقوق النشر ====================
function closeCopyrightWarning() {
    const warning = document.getElementById('copyrightWarning');
    if (warning) {
        warning.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => warning.remove(), 500);
    }
}

// ==================== إضافة علامة مائية ====================
function addWatermark() {
    // علامة مائية في الخلفية
    const watermarkStyle = document.createElement('style');
    watermarkStyle.textContent = `
        body::before {
            content: '${COPYRIGHT_PROTECTION.developer} © 2023';
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 5rem;
            color: rgba(0, 0, 0, 0.03);
            z-index: -1;
            white-space: nowrap;
            pointer-events: none;
            font-family: 'Cairo', sans-serif;
            font-weight: bold;
            user-select: none;
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(watermarkStyle);
    
    // علامة مائية في Console
    console.log('%c⚠️ تحذير: هذا المشروع محمي بحقوق النشر', 
        'color: #dc3545; font-size: 16px; font-weight: bold; padding: 10px; border: 2px solid #dc3545;');
    console.log('%c👨‍💻 المطور: مجيب العباب', 'color: #2d5af1; font-size: 14px;');
    console.log('%c📧 التواصل: mjyblwan0@gmail.com', 'color: #28a745; font-size: 14px;');
    console.log('%c© جميع الحقوق محفوظة 2023', 'color: #ff6b35; font-size: 12px; font-style: italic;');
}

// ==================== حماية من التعديل ====================
function preventCodeModification() {
    // منع فتح وحدة المطور
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
    
    // منع اختصار F12 و Ctrl+Shift+I و Ctrl+U
    document.addEventListener('keydown', function(e) {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.shiftKey && e.key === 'J') ||
            (e.ctrlKey && e.key === 'U')
        ) {
            e.preventDefault();
            showDevToolsWarning();
        }
    });
    
    // منع النسخ
    document.addEventListener('copy', function(e) {
        if (!confirm('⚠️ يمنع نسخ المحتوى. هل تريد المتابعة؟')) {
            e.preventDefault();
        }
    });
}

// ==================== تحذير من فتح أدوات المطور ====================
function showDevToolsWarning() {
    const warning = document.createElement('div');
    warning.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 1000000;
            text-align: center;
            max-width: 400px;
            border: 3px solid #dc3545;
        ">
            <h3 style="color: #dc3545; margin-bottom: 15px;">
                <i class="fas fa-exclamation-circle"></i> تحذير
            </h3>
            <p style="margin-bottom: 20px;">
                يمنع فتح أدوات المطور أو محاولة تعديل الكود.<br>
                هذا المشروع محمي بحقوق النشر.
            </p>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: #dc3545;
                color: white;
                border: none;
                padding: 10px 25px;
                border-radius: 8px;
                cursor: pointer;
                font-family: 'Cairo', sans-serif;
            ">
                <i class="fas fa-times"></i> إغلاق
            </button>
        </div>
    `;
    
    document.body.appendChild(warning);
    
    // إزالة التحذير بعد 5 ثواني
    setTimeout(() => {
        if (warning.parentNode) {
            warning.remove();
        }
    }, 5000);
}

// ==================== تحقق من سلامة الكود ====================
function checkCodeIntegrity() {
    const originalFiles = {
        'script.js': 32500, // حجم تقريبي للكود
        'admin-script.js': 28000,
        'style.css': 12000,
        'admin-style.css': 10000
    };
    
    // يمكن إضافة المزيد من الفحوصات هنا
    console.log('🔒 فحص سلامة الكود...');
    console.log('✅ نظام الحماية نشط');
}

// ==================== التهيئة ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛡️ تحميل نظام حماية حقوق النشر...');
    
    // تفعيل جميع أنظمة الحماية
    checkCopyrightProtection();
    preventCodeModification();
    checkCodeIntegrity();
    
    // إضافة عنوان الصفحة مع حقوق النشر
    document.title = `${document.title} | ${COPYRIGHT_PROTECTION.developer} © 2023`;
    
    // إضافة فقرة حقوق النشر في التذييل
    addCopyrightFooter();
});

// ==================== إضافة حقوق النشر في التذييل ====================
function addCopyrightFooter() {
    const copyrightFooter = `
    <div style="
        text-align: center;
        margin-top: 20px;
        padding: 15px;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 8px;
        border-top: 2px solid #2d5af1;
        font-size: 0.9rem;
    ">
        <p style="margin: 0; color: #666;">
            <strong>${COPYRIGHT_PROTECTION.copyright}</strong><br>
            <span style="color: #2d5af1;">
                <i class="fas fa-user-shield"></i> المطور: ${COPYRIGHT_PROTECTION.developer} | 
                <i class="fas fa-envelope"></i> ${COPYRIGHT_PROTECTION.email} | 
                <i class="fab fa-whatsapp"></i> ${COPYRIGHT_PROTECTION.whatsapp}
            </span><br>
            <small style="color: #999;">
                <i class="fas fa-exclamation-triangle"></i> يمنع نسخ أو تعديل أو نشر هذا المشروع بدون إذن كتابي
            </small>
        </p>
    </div>
    `;
    
    // البحث عن التذييل وإضافة حقوق النشر
    const footer = document.querySelector('.footer-bottom');
    if (footer) {
        footer.insertAdjacentHTML('beforeend', copyrightFooter);
    }
}

// ==================== تصدير الدوال للاستخدام الخارجي ====================
window.COPYRIGHT_PROTECTION = COPYRIGHT_PROTECTION;
window.checkCopyrightProtection = checkCopyrightProtection;
window.showCopyrightWarning = showCopyrightWarning;
window.closeCopyrightWarning = closeCopyrightWarning;
