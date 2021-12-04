<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Middleware\JWT;
use App\Http\Requests\CreateProductRequest;
use App\Http\Requests\GetProductsRequest;
use App\Http\Requests\DeleteProductRequest;
use App\Models\Products;

class ProductsController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt');
    }

    public function createProduct(CreateProductRequest $request)
    {
        $productId = Products::createProduct($request);
        return response()->json(['id' => $productId],200);
    }

    public function getProducts(GetProductsRequest $request)
    {
        return json_encode(Products::getProducts());
    }

    public function deleteProduct(DeleteProductRequest $request)
    {

        Products::deleteProduct($request);
        return response()->json(['status' => "success"],200);
    }
}
