<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Middleware\JWT;
use App\Http\Requests\CreateSaleRequest;
use App\Http\Requests\GetSalesRequest;
use App\Http\Requests\DeleteSaleRequest;
use App\Http\Requests\UpdateSaleRequest;
use App\Models\Sales;

class SalesController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt');
    }

    public function getSales(GetSalesRequest $request)
    {
        return json_encode(Sales::getSales($request));
    }

    public function createSale(CreateSaleRequest $request)
    {
        $saleId = Sales::createSale($request);
        return response()->json(['id' => $saleId],200);
    }
}
