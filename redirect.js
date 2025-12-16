// ملف: redirect.js
// ضعه في نفس مجلد admin.html

// هذا الملف يعمل قبل تحميل أي شيء
(function() {
    // التحقق الفوري من الدخول
    if (!sessionStorage.getItem('admin_logged_in')) {
        // إعادة التوجيه فوراً دون انتظار
        window.location.replace('login.html');
        // منع استمرار تحميل الصفحة
        throw new Error('غير مصرح - توجيه إلى صفحة الدخول');
    }
})();
