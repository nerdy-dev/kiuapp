<?php

if (isset($_GET['online'])) {
    if ($_USER_ID > 0) {
        if ($_GET['app'] == '1') {
            DB::query("UPDATE `kiu_users` SET `app_installed`=1, `app_platform`='{$_GET['platform']}', `last_seen_app`=NOW() WHERE `id`=$_USER_ID LIMIT 1");
        } else {
            DB::query("UPDATE `kiu_users` SET `last_seen_web`=NOW() WHERE `id`=$_USER_ID LIMIT 1");
        }
        echo 'ok';
    } else {
        echo 'no';
    }
    die;
}

if ($_USER_ID > 0 && isset($_GET['ping'])) {
    if (kiu_ping()) echo 'ok';
    else echo 'no';
    die;
}

if ($_USER_ID > 0 && isset($_POST['action']) && $_POST['action'] == 'update') {
    $result = 0;
    $error = 0;
    $force = $_POST['force'] == '1';
    if ($force || time() - strtotime($_USER_INFO['last_update']) > $_USER_INFO['pref_update_time'] * 3600) {
        $result = -1;
        $r = kiu_schedule($_USER_INFO['token']);
        $json = json_decode($r, true);
        if ($r != null && $json != null) {
            if ($json['err'] != null) {
                $result = -2;
                $error = $json['err']['errorNum'];
            } else {
                $result = 1;
                for ($i = 0; $i < count($json); $i++) {
                    $json[$i]['title'] = $json[$i]['discipline'];
                    $json[$i]['fio'] = '';
                    $json[$i]['activityTheme'] = str_replace("\n", "<hr class='br'>", $json[$i]['activityTheme']);
                    $json[$i]['teacherComment'] = str_replace("\n", "<hr class='br'>", $json[$i]['teacherComment']);
                }
                DB::query("UPDATE `kiu_users` SET `last_update`=NOW() WHERE `id`=$_USER_ID LIMIT 1");
                $r = str_replace("'", "\\'", json_encode($json, JSON_UNESCAPED_UNICODE));
                DB::query("INSERT INTO `kiu_classes`(`user`, `data`) VALUES ($_USER_ID, '$r')");
            }
        }
    }
    $classes = DB::queryFirstRow("SELECT `loaded`,`data` FROM `kiu_classes` WHERE `user`=$_USER_ID ORDER BY `id` DESC LIMIT 1");
    //$classes['data'] = '[]';
    $force = $force ? 'true' : 'false';
    echo '{"result":' . $result . ',"error":' . $error . ',"forced":' . $force . ',"loaded":' . strtotime($classes['loaded']) * 1000 . ',"classes":' . $classes['data'] . '}';
    die;
}
