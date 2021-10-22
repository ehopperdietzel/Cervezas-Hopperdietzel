<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

function base64url_encode($data)
{
    $b64 = base64_encode($data);
    if ($b64 === false)
        return false;
    $url = strtr($b64, '+/', '-_');
    return rtrim($url, '=');
}

function base64url_decode($data, $strict = false)
{
    $b64 = strtr($data, '-_', '+/');
    return base64_decode($b64, $strict);
}

class JWT
{

    public function handle(Request $request, Closure $next)
    {

        if(!$request->token)
            return response()->json(['error' => 'Token Invalido.'], 404);

        $JWTSecret = env("JWT_SECRET");

        $tokenParts = explode(".", $request->token);

        if(count($tokenParts) != 3)
            response()->json(['error' => 'Token Invalido.'], 404);

        $hash = hash_hmac("sha256",$tokenParts[0].".".$tokenParts[1],$JWTSecret);

        if($hash == $tokenParts[2])
        {
            $request->jwtUserId = strval(json_decode(base64url_decode($tokenParts[1]))->usr);
        }
        else
        {
            return response()->json(['error' => 'Token Invalido.'], 404);
        }

        return $next($request);
    }


    // Genera un token a partir del id de un usuario
    public function createToken($userId,$userName)
    {
        $JWTSecret = env("JWT_SECRET");

        $header = base64url_encode(json_encode(array
        (
            "alg" => "HS256",
            "typ" => "JWT"
        )));

        $payload = base64url_encode(json_encode(array
        (
            "id" => strval($userId),
            "name" => $userName
        )));

        return $header.".".$payload.".".hash_hmac("sha256",$header.".".$payload,$JWTSecret);
    }
}
