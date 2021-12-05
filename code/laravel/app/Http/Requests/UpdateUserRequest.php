<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'id' => 'numeric|required|exists:users',
            'firstname' => 'alpha|max:32',
            'lastname' => 'alpha|max:32',
            'email' => 'unique:users|max:64|email',
            'password' => 'alpha_dash|max:64',
            'status' => 'max:64|in:0,1'
        ];
    }
}
