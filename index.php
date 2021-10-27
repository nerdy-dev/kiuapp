<?php
$_TITLE = 'KIU';
$_DESC = 'Привет! Это неофициальное (и гораздо более удобное) приложение для мониторинга твоего расписания в КИУ. Просто. Красиво. Удобно.';
$_KEYWORDS = 'KIU, КИУ, приложение, расписание, пары, лекции, преподаватели, студенты, университет, институт, app, schedule, classes, lectures, professors, students, university';
$_LANG = 'RU';
$_SETTINGS = array_map_key_value(DB::query("SELECT * FROM `kiu_settings`"), 'name', 'value');


include_once 'php/_fn.php';
include_once 'php/_auth.php';
include_once 'php/_update.php';

if ($_USER_ID > 0) {
    $_LANG = $_USER_INFO['pref_language'];
    if (isset($_GET['pref'])) {
        DB::query("UPDATE `kiu_users` SET `pref_{$_POST['name']}`='{$_POST['value']}' WHERE id=$_USER_ID LIMIT 1");
        echo 'ok';
        die;
    }
} else {
    if ($_COOKIE['kiu_lang'] == 'EN') {
        $_LANG = 'EN';
    }
}

if ($_LANG != 'RU' && $_LANG != 'EN') {
    $_LANG = 'RU';
}



$_STATIC = $_SETTINGS['static_public'];
$_DEV = $_USER_INFO['dev'] == 1;
$_TEST = $_USER_INFO['tester'] == 1;
if ($_TEST) $_STATIC = $_SETTINGS['static_tester'];
if ($_DEV) $_STATIC = $_SETTINGS['static_dev'];
if ($_STATIC == 'time') $_STATIC = time();

if ($_DEV) include_once 'php/_dev.php';

$is_reload = isset($_GET['reload']);


?>


<!DOCTYPE html>
<html lang="<?php echo strtolower($_LANG); ?>">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta name="theme-color" content="#222222" id="theme_color">
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-touch-fullscreen" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="<?php echo $_TITLE; ?>">
    <meta name="description" content="<?php echo $_DESC; ?>">
    <meta property="og:title" content="<?php echo $_TITLE; ?>" />
    <meta property="og:description" content="<?php echo $_DESC; ?>" />
    <meta name="keywords" content="<?php echo $_KEYWORDS; ?>">
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/kiu/img/icon/180.png" />
    <meta property="og:image:width" content="180" />
    <meta property="og:image:height" content="180" />
    <meta property="og:url" content="https://badm.dev/kiu/" />
    <meta property="og:site_name" content="<?php echo $_TITLE; ?>" />
    <meta property="og:locale" content="ru_RU" />
    <meta property="og:locale:alternate" content="en_US" />
    <meta name="twitter:card" content="summary">
    <meta name="twitter:site" content="badm.dev">
    <meta name="twitter:title" content="<?php echo $_TITLE; ?>">
    <meta name="twitter:description" content="<?php echo $_DESC; ?>">
    <meta name="twitter:image" content="/kiu/img/icon/180.png">
    <meta itemprop="name" content="<?php echo $_TITLE; ?>" />
    <meta itemprop="description" content="<?php echo $_DESC; ?>" />
    <meta itemprop="image" content="/kiu/img/icon/180.png" />
    <link rel="apple-touch-startup-image" media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="img/splash/1.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="img/splash/2.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="img/splash/3.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="img/splash/4.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="img/splash/5.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="img/splash/6.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="img/splash/7.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="img/splash/8.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="img/splash/9.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="img/splash/10.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="img/splash/11.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="img/splash/12.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="img/splash/13.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="img/splash/14.png">
    <link rel="apple-touch-startup-image" media="screen and (width: 834px) and (height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="img/splash/15.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="img/splash/16.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="img/splash/17.png">
    <link rel="apple-touch-startup-image" media="screen and (width: 834px) and (height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="img/splash/18.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="img/splash/19.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="img/splash/20.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="img/splash/21.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="img/splash/22.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="img/splash/23.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="img/splash/24.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="img/splash/25.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="img/splash/26.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 360px) and (device-height: 780px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="img/splash/27.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 360px) and (device-height: 780px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="img/splash/28.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="img/splash/29.png">
    <link rel="apple-touch-startup-image" media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="img/splash/30.png">
    <link rel="icon" type="image/png" href="img/favicon.png">
    <link rel="apple-touch-icon" href="img/icon/120.png">
    <link rel="apple-touch-icon" sizes="152x152" href="img/icon/152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="img/icon/180.png">
    <link rel="apple-touch-icon" sizes="167x167" href="img/icon/167.png">
    <link rel="stylesheet" href="/static/css/bs5.css">
    <link rel="stylesheet" href="/static/css/common.css">
    <link rel="stylesheet" href="/static/css/scrollbar.css">
    <link rel="stylesheet" href="https://kit-free.fontawesome.com/releases/latest/css/free.min.css">
    <link rel="stylesheet" href="css/style.css?<?php echo $_STATIC; ?>">
    <link rel="manifest" href="manifest.json">
    <title><?php echo $_TITLE; ?></title>
    <?php gtag(); ?>
</head>

<body>
    <div id="meta" style="display: block; position: fixed; top: 0; left: 0; width: 0; height: 0; overflow: hidden; opacity: 0; pointer-events: none;">
        <h1><?php echo $_TITLE; ?></h1>
        <p><?php echo $_DESC; ?></p>
        <img src="/kiu/img/icon/180.png">
    </div>
    <div class="loader-container<?php echo (($is_reload || $_USER_ID > 0) ? ' show' : ''); ?>" id="loader">
        <div class="text-center text-white mx-auto position-relative">
            <div class="spinner-border text-bm" role="status" style="width: 4rem; height: 4rem;"></div>
            <div class="loader-text" id="loader_text"></div>
        </div>
    </div>
    <div class="modal fade" tabindex="-1" id="comment_md">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="comment"></div>
            </div>
        </div>
    </div>
    <?php include_once 'php/_nav.php'; ?>
    <div class="cnt ovl" id="overlay"></div>
    <div class="cnt" id="container">
        <?php if ($_USER_ID < 1) include_once 'php/_welcome.php' ?>
    </div>
    <?php include_once 'php/_settings.php'; ?>
    <?php if ($_USER_ID < 1) static_html('bm_copyright'); ?>
    <script src="https://badm.dev/static/js/badm.js?<?php echo $_STATIC; ?>"></script>
    <script src="https://cdn.jsdelivr.net/npm/autolinker@3.14.3/dist/Autolinker.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js"></script>
    <?php if ($sign_in_result == 0 || $sign_in_result == 2) { ?>
        <script>
            $(function() {
                $('#sign_in').modal('show');
            });
        </script>
    <?php } ?>
    <script>
        const USER_ID = <?php echo intval($_USER_ID); ?>;
        var UPDATE_TIMEOUT = <?php echo intval($_USER_INFO['pref_update_time']); ?>;
        var LANG = {};
    </script>
    <script src="js/lang/<?php echo $_LANG; ?>.js?<?php echo $_STATIC; ?>" id="lang"></script>
    <script src="js/functions.js?<?php echo $_STATIC; ?>"></script>
    <script src="js/common.js?<?php echo $_STATIC; ?>"></script>
    <?php if ($_USER_ID > 0) { ?>
        <script src="js/script.js?<?php echo $_STATIC; ?>"></script>
        <script src="js/day.js?<?php echo $_STATIC; ?>"></script>
        <script src="js/week.js?<?php echo $_STATIC; ?>"></script>
    <?php } else { ?>
        <script>
            if (!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                lightmode_set(true);
            }
        </script>
    <?php } ?>
    <?php if ($is_reload) { ?>
        <script>
            window.history.replaceState({}, document.title, location.href.replace('?reload', ''));
        </script>
    <?php } ?>
</body>

</html>