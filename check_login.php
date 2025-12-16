
<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.html');
    exit();
}

// التحقق من مدة الجلسة (4 ساعات)
if (isset($_SESSION['login_time'])) {
    $session_timeout = 4 * 60 * 60; // 4 ساعات بالثواني
    if (time() - $_SESSION['login_time'] > $session_timeout) {
        session_destroy();
        header('Location: login.html?expired=1');
        exit();
    }
}
?>
