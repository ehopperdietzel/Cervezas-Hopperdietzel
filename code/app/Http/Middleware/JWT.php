<?php

namespace App\Http\Middleware;

use Closure;
use DateTime;
use DateInterval;
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
        # Check if auth header exists
        if(!$request->hasHeader('Authorization'))
            return response()->json(['error' => 'Missing authorization token.'], 404);

        # Reads token
        $token = $request->header('Authorization');

        # Read secret from env conf
        $JWTSecret = env("JWT_SECRET");

        # Splits token
        $tokenParts = explode(".",explode(" ",$token)[1]);

        # Must containt 3 parts
        if(count($tokenParts) != 3)
            response()->json(['error' => 'Token Invalido.'], 404);

        # Calculates hash
        $hash = hash_hmac("sha256",$tokenParts[0].".".$tokenParts[1],$JWTSecret);

        # If both hashes matche
        if($hash == $tokenParts[2])
        {
            # Reads token data
            $tokenData = json_decode(base64url_decode($tokenParts[1]));

            # Check if token expired
            if(DateTime::createFromFormat('Y-m-d H:i:s', $tokenData->expirationDate) > new DateTime('NOW'))
            {
                $request->jwtUserId = $tokenData->userId;
            }
            else
            {
                return response()->json(['error' => 'Expired token.'], 404);
            }
        }
        else
        {
            return response()->json(['error' => 'Invalid token.'], 404);
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

        # Token expires in 15 days
        $expireDate = (new DateTime('NOW'))->add(new DateInterval('P15D'));

        $payload = base64url_encode(json_encode(array
        (
            "userId" => $userId,
            "username" => $userName,
            "expirationDate" => $expireDate->format('Y-m-d H:i:s')
        )));

        return $header.".".$payload.".".hash_hmac("sha256",$header.".".$payload,$JWTSecret);
    }
}
