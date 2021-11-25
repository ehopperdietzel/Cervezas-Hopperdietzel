<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProductRequest extends FormRequest
{
    public function rules()
    {
        return [
            'name' => 'alpha|required|max:32',
            'alias' => 'alpha|required|max:32',
            'image' => [ 'nullable','image','mimes:jpg,png,jpeg' ],
            'color' => 'required',
            'prices' => 'required',
        ];
    }
}
