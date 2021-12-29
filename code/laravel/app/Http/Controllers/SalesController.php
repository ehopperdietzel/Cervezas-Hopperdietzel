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
        return json_encode(Sales::createSale($request));
    }

    public function updateSale(UpdateSaleRequest $request)
    {
        return json_encode(Sales::updateSale($request));
    }

    public function deleteSale(DeleteSaleRequest $request)
    {

        Sales::deleteSale($request);
        return response()->json(['status' => "success"],200);
    }
}
