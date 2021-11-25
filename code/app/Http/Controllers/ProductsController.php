<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Middleware\JWT;
use App\Http\Requests\CreateProductRequest;
use App\Models\Products;

class ProductsController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt');
    }

    public function createProduct(CreateProductRequest $request)
    {
        Products::createProduct($request);
    }
}
