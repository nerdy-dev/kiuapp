<?php


$_STRINGS = [
    'SIGN_IN' => [
        'RU' => 'Войти',
        'EN' => 'Sign In',
    ],
    'SIGN_OUT' => [
        'RU' => 'Войти',
        'EN' => 'Sign Out',
    ],
    'USERNAME' => [
        'RU' => 'Имя Пользователя',
        'EN' => 'Username',
    ],
    'PASSWORD' => [
        'RU' => 'Пароль',
        'EN' => 'Password',
    ],
    'SIGN_IN_FAIL' => [
        'RU' => 'Неправильное имя пользователя или пароль',
        'EN' => 'Invalid username or password',
    ],
    'SETTINGS' => [
        'RU' => 'Настройки',
        'EN' => 'Settings',
    ],
    'SAVE' => [
        'RU' => 'Сохранить',
        'EN' => 'Save',
    ],
];


function loc($name)
{
    global $_STRINGS, $_LANG;
    out($_STRINGS[$name][$_LANG]);
}
