<?php

if (isset($_GET['dev'])) {
    echo json_encode(call_user_func('dev_' . $_GET['dev']));
    die;
}
