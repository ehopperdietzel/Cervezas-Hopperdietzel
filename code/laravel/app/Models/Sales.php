<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

use App\Http\Requests\GetSalesRequest;
use App\Http\Requests\CreateSaleRequest;
use App\Http\Requests\UpdateSaleRequest;
use App\Http\Requests\DeleteSaleRequest;
use DateTime;

class Sales extends Model
{

    public $fillable = ['client','documentType','documentNumber','documentIsSigned', 'paid','delivered', 'deliverDate', 'paidDate', 'comment','lastModificationTime','lastModificationUser'];
    public $timestamps = false;

    public function getSales(GetSalesRequest $request)
    {
        $sales = DB::table('sales')
            ->join('users', 'sales.lastModificationUser', '=', 'users.id')
            ->join('clients', 'sales.client', '=', 'clients.id')
            ->select('sales.*', 'users.firstname AS userFirstname','users.lastname AS userLastname','clients.firstname as clientFirstname','clients.lastname as clientLastname')
            ->get()->toArray();

        for($i = 0; $i < count($sales); $i++)
        {
            $sales[$i]->products = DB::table('sales_products')
            ->where('sale',$sales[$i]->id)
            ->get()
            ->toArray();
        }

        return $sales;
    }

    public function createSale(CreateSaleRequest $request)
    {
        
        $saleData = array(
            'client' => $request->client,
            'documentType' => $request->documentType,
            'documentNumber' => 0,
            'paid' => $request->paid,
            'delivered' => $request->delivered,
            'deliverDate' => $request->deliverDate,
            'paidDate' => $request->paidDate,
            'comment' => $request->comment,
            'lastModificationTime' => date('Y-m-d H:i:s'),
            'lastModificationUser' => $request->get('JWTID')
        );

        $saleId = Sales::create($saleData)->id;

        $products = json_decode($request->products);

        foreach($products as $product)
        {
            DB::table('sales_products')->insertGetId([
                'sale'=>$saleId,
                'product'=>$product->product,
                'priceType'=>$product->priceType,
                'quantity'=>$product->quantity
            ]);
        }
        
        return $saleId;
    }
}
