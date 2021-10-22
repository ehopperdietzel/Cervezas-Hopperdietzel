<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Middleware\JWT;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\CreateUserRequest;


class UsersController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt', ['except' => ['login','test']]);
    }

    public function create(CreateUserRequest $request)
    {
        return "1";
    }

    public function login(LoginRequest $request)
    {

        // Valida credenciales de usuario root
        if($request->email == env("ROOT_EMAIL") && $request->password == env("ROOT_PASSWORD"))
        {
            return response()->json([
                'access_token' => JWT::createToken(0,"Usuario Root")
            ]);
        }
        else
        {
            abort(401, 'Invalid credentials.');
        }


        return $hostname;
    }

    public function test()
    {
        return "hola";
    }

}
