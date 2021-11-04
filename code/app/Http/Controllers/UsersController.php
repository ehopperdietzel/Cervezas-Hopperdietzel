<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Middleware\JWT;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\GetUsersRequest;
use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\DeleteUserRequest;
use App\Models\Users;

class UsersController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt', ['except' => ['login']]);
    }

    public function createUser(CreateUserRequest $request)
    {
        if($request->jwtUserId == 0)
        {
            $id = Users::createNewUser($request);
            return response()->json(['userId' => $id], 200);
        }
        abort(401, 'Unauthorized user.');
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

    public function getUsers(GetUsersRequest $request)
    {
        if($request->jwtUserId == 0)
        {
            return json_encode(Users::getUsersWithPassword($request));
        }
        abort(401, 'Unauthorized user.');
    }

    public function updateUser(UpdateUserRequest $request)
    {
        if($request->jwtUserId == 0)
        {
            Users::updateUser($request);
            return response()->json(['status' => "success"],200);
        }
        abort(401, 'Unauthorized user.');
    }

    public function deleteUser(DeleteUserRequest $request)
    {
        if($request->jwtUserId == 0)
        {
            Users::deleteUser($request);
            return response()->json(['status' => "success"],200);
        }
        abort(401, 'Unauthorized user.');
    }
}
