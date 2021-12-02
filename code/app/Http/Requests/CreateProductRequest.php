<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProductRequest extends FormRequest
{
    public function rules()
    {
        return [
            'name' => 'regex:/^[a-zA-Z0-9\s]+$/|required|max:32',
            'alias' => 'regex:/^[a-zA-Z0-9\s]+$/|required|max:32',
            'image' => [ 'nullable','image','mimes:jpg,png,jpeg' ],
            'color' => 'required',
            'prices' => 'required',
        ];
    }
}
