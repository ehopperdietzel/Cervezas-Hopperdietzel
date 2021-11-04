<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Http\Requests\GetUsersRequest;
use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateUserRequest;

class Users extends Model
{

    public $fillable = ['firstname','lastname','email','password','status'];
    public $timestamps = false;

    public function createNewUser(CreateUserRequest $request)
    {
        $userData = array(
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'password' => $request->password,
            'status' => $request->status
        );
        return Users::create($userData)->id;
    }

    public function getUsersWithPassword(GetUsersRequest $request)
    {
        if(isset($request['query']))
        {
            return Users::query()
            ->where('firstname', 'LIKE', '%'.$request['query'].'%') 
            ->orWhere('lastname', 'LIKE', '%'.$request['query'].'%')
            ->orWhere('email', 'LIKE', '%'.$request['query'].'%') 
            ->get();
        }
        return Users::all();
    }

    public function updateUser(UpdateUserRequest $request)
    {
        $keys = ['firstname','lastname','email','password','status'];

        $changes = array();

        foreach($keys as $key)
        {
            if(isset($request[$key]))
            {
                $changes[$key] = $request[$key];
            }
        }

        Users::where('id',$request->id)->update($changes);

        return;
    }

    public function deleteUser($userId)
    {
        Users::where('id', $userId->id)->delete();
        return;
    }
}


