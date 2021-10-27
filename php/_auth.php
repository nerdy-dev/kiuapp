<?php

if (isset($_GET['session'])) {
    setcookie('kiu_session', $_GET['session'], time() + 86400 * 365, '/', '.badm.dev');
    header("Location: /kiu");
    die;
}

if (isset($_GET['out'])) {
    setcookie('kiu_session', 'logout', time() - 3600, '/', '.badm.dev');
    header("Location: /kiu");
    die;
}

$_USER_SESSION = $_COOKIE['kiu_session'];
$_USER_ID = intval(DB::queryFirstField("SELECT `user` FROM `kiu_sessions` WHERE `id`='$_USER_SESSION' AND `expires`>NOW() LIMIT 1"));
$_USER_INFO = [];
if ($_USER_ID > 0) {
    $_USER_INFO = DB::queryFirstRow("SELECT `u`.*, `f`.`name` AS `field_name`, `g`.`name` AS `group_name` 
    FROM `kiu_users` `u` 
    LEFT JOIN `kiu_fields` `f` ON `u`.`field_id`=`f`.`id` 
    LEFT JOIN `kiu_groups` `g` ON `u`.`group_id`=`g`.`id` 
    WHERE `u`.`id`=$_USER_ID LIMIT 1");
    $_USER_INFO['full_name'] = $_USER_INFO['first_name'] . ' ' . $_USER_INFO['middle_name'] . ' ' . $_USER_INFO['last_name'];
}
$sign_in_result = -1;
if ($_USER_ID < 1 && isset($_POST['s_user']) && isset($_POST['s_pass'])) {
    $_POST['s_user'] = str_replace('@', '', $_POST['s_user']);
    $r = kiu_auth($_POST['s_user'], $_POST['s_pass']);
    if ($r === false) {
        $sign_in_result = 0;
    } else {
        $sign_in_result = $r != null && !isset($r['error']) ? 1 : 2;
    }
    if ($sign_in_result == 1) {
        $kiu = strval($r['personId']);
        $data = [
            'kiu_username' => str_replace('@', '', $r['username']),
            'first_name' => strval($r['firstname']),
            'middle_name' => strval($r['middlename']),
            'last_name' => strval($r['lastname']),
            'is_teacher' => strval($r['isTeacher']),
            'is_student' => strval($r['isStudent']),
            'is_male' => $r['sex'] == 'М',
            'field_id' => strval($r['specChildCode']),
            'group_id' => strval($r['groupId']),
            'year_started' => strval($r['planYearBegin']),
            'zachetka' => strval($r['zachetka']),
            'phone' => strval($r['phone']),
            'last_login' => DB::sqlEval("NOW()"),
            'bday' => date('Y-m-d H:i:s', strtotime($r['birthdate'])),
            'kiu_id' => $kiu,
            'kiu_student_id' => strval($r['studentId']),
            'kiu_uuid' => strval($r['uuid']),
            'token' => strval($r['token']),
        ];
        $exists = DB::queryFirstField("SELECT COUNT(*) FROM `kiu_users` WHERE `kiu_id`='$kiu' LIMIT 1");
        if ($exists) {
            DB::update('kiu_users', $data, 'kiu_id=%s', $kiu);
            $id = DB::queryFirstField("SELECT `id` FROM `kiu_users` WHERE `kiu_id`='$kiu' LIMIT 1");
        } else {
            DB::insert('kiu_users', $data);
            $id = DB::insertId();
        }
        if ($r['specChildCode'] != null && $r['specChildName'] != null) {
            DB::insertUpdate('kiu_fields', [
                'id' => $r['specChildCode'],
                'name' => $r['specChildName'],
            ]);
        }
        if ($r['groupId'] != null && $r['groupName'] != null) {
            DB::insertUpdate('kiu_groups', [
                'id' => $r['groupId'],
                'name' => $r['groupName'],
            ]);
        }
        DB::query("DELETE FROM `kiu_sessions` WHERE `expires` < NOW()");
        $session = random_string(32);
        while (DB::queryFirstField("SELECT COUNT(*) FROM `kiu_sessions` WHERE `id`='$session' LIMIT 1") > 0) {
            $session = random_string(32);
        }
        setcookie('kiu_session', $session, time() + 86400 * 365, '/', '.badm.dev');
        DB::insert('kiu_sessions', [
            'id' => $session,
            'user' => $id,
            'ip' => $_IP,
            'expires' => DB::sqlEval("DATE_ADD(NOW(), INTERVAL 360 DAY)"),
        ]);
        header("Location: /kiu");
        die;
    }
}
