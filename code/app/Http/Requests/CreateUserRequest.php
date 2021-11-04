<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
{
    public function rules()
    {
        return [
            'firstname' => 'alpha|required|max:32',
            'lastname' => 'alpha|required|max:32',
            'email' => 'unique:users|required|max:64|email',
            'password' => 'alpha_dash|required|max:64',
            'status' => 'required|max:64|in:0,1'
        ];
    }
}
