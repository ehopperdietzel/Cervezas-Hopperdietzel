<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
{
    public function rules()
    {
        return [
            'firstname' => 'required|max:32',
            'lastname' => 'required|max:32',
            'email' => 'required|max:64|email',
            'password' => 'required|max:64',
            'status' => 'required|max:64'
        ];
    }
}
