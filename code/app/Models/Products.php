<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Http\Requests\CreateProductRequest;

class Products extends Model
{    
    public function createProduct(CreateProductRequest $request)
    {
        echo $request->name;
        echo $request->alias;
    }
}
