<?php

function kiu_auth($user, $pass)
{
    $r = kiu_request('auth', true, ["username" => "@$user", "password" => $pass]);
    if ($r == 'Unauthorized') return false;
    return json_decode($r, true);
}

function kiu_schedule($token)
{
    return kiu_request('schedule', false, [], $token);
}

function kiu_request($action, $post = false, $args = [], $bearer = null, $code = false)
{
    $header = ["Content-Type: application/json; charset=UTF-8"];
    if ($bearer != null) $header[] = "Authorization: Bearer $bearer";
    $curl = curl_init("https://idp.ieml.ru/kiudekanatapi/$action");
    if ($post) curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
    curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 10);
    if (count($args) > 0) curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($args));
    $resp = curl_exec($curl);
    curl_close($curl);
    $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    //if($httpcode != 200) return null;
    return $code ? $httpcode : $resp;
}

function kiu_ping()
{
    return kiu_request('auth', true, ["username" => "@ping", "password" => '123']) != null;
}
