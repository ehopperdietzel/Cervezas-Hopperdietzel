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
            ->join('cities', 'clients.city', '=', 'cities.id')
            ->join('phones', 'clients.defaultPhone', '=', 'phones.id')
            ->join('emails', 'clients.defaultEmail', '=', 'emails.id')
            ->select('sales.*', 
            'users.firstname AS userFirstname',
            'users.lastname AS userLastname',
            'clients.firstname as clientFirstname',
            'clients.lastname as clientLastname',
            'clients.address',
            'cities.city as cityName',
            'phones.phone',
            'emails.email')
            ->get()->toArray();

        for($i = 0; $i < count($sales); $i++)
        {
            $sales[$i]->products = DB::table('sales_products')
            ->where('sale',$sales[$i]->id)
            ->join('prices', 'sales_products.priceType', '=', 'prices.id')
            ->select('sales_products.*','prices.price')
            ->get()
            ->toArray();
            
            $total = 0;
            for($j = 0; $j < count($sales[$i]->products); $j++)
            {
                $total += $sales[$i]->products[$j]->price * $sales[$i]->products[$j]->quantity;
            }

            $sales[$i]->cost = $total;
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

            $productStock = DB::table('products')->where('id',$product->product)->select('products.stock')->get()->toArray()[0]->stock;
            DB::table('products')->where('id',$product->product)->update(['stock'=>$productStock - $product->quantity]);
        }
        
        $sales = DB::table('sales')
            ->where('sales.id',$saleId)
            ->join('users', 'sales.lastModificationUser', '=', 'users.id')
            ->join('clients', 'sales.client', '=', 'clients.id')
            ->join('cities', 'clients.city', '=', 'cities.id')
            ->join('phones', 'clients.defaultPhone', '=', 'phones.id')
            ->join('emails', 'clients.defaultEmail', '=', 'emails.id')
            ->select('sales.*', 
            'users.firstname AS userFirstname',
            'users.lastname AS userLastname',
            'clients.firstname as clientFirstname',
            'clients.lastname as clientLastname',
            'clients.address',
            'cities.city as cityName',
            'phones.phone',
            'emails.email')
            ->get()->toArray();

        for($i = 0; $i < count($sales); $i++)
        {
            $sales[$i]->products = DB::table('sales_products')
            ->where('sales_products.sale',$sales[$i]->id)
            ->join('prices', 'sales_products.priceType', '=', 'prices.id')
            ->select('sales_products.*','prices.price')
            ->get()
            ->toArray();
            
            $total = 0;
            for($j = 0; $j < count($sales[$i]->products); $j++)
            {
                $total += $sales[$i]->products[$j]->price * $sales[$i]->products[$j]->quantity;
            }

            $sales[$i]->cost = $total;
        }

        return $sales[0];
    }

    public function updateSale(UpdateSaleRequest $request)
    {
        $req = json_decode($request->changes,true);

        // Productos eliminados
        foreach($req['productDeletions'] as $saleProductId)
        {
            $saleProduct = DB::table('sales_products')->where('id',$saleProductId)->select('sales_products.product','sales_products.quantity')->get()->toArray()[0];
            $productStock = DB::table('products')->where('id',$saleProduct->product)->select('products.stock')->get()->toArray()[0]->stock;

            // Actualiza stock
            DB::table('products')->where('id',$saleProduct->product)->update(['stock'=>$saleProduct->quantity + $productStock]);

            // Elimina el producto de la venta
            DB::table('sales_products')->where('id', $saleProductId)->delete();
        }

        // Productos Modificados
        foreach($req['productChanges'] as $saleProduct)
        {
            $saleProductData = DB::table('sales_products')->where('id',$saleProduct['id'])->select('sales_products.product','sales_products.quantity')->get()->toArray()[0];

            // Actualiza stock
            if($saleProduct['product'] == $saleProductData->product && $saleProduct['quantity'] != $saleProductData->quantity)
            {
                $productStock = DB::table('products')->where('id',$saleProductData->product)->select('products.stock')->get()->toArray()[0]->stock;
                DB::table('products')->where('id',$saleProductData->product)->update(['stock'=>$productStock +  $saleProductData->quantity - $saleProduct['quantity'] ]);
            }

            if($saleProduct['product'] != $saleProductData->product)
            {
                $productStock = DB::table('products')->where('id',$saleProductData->product)->select('products.stock')->get()->toArray()[0]->stock;
                DB::table('products')->where('id',$saleProductData->product)->update(['stock'=>$productStock +  $saleProductData->quantity]);

                $productStock = DB::table('products')->where('id',$saleProduct['product'])->select('products.stock')->get()->toArray()[0]->stock;
                DB::table('products')->where('id',$saleProduct['product'])->update(['stock'=>$productStock - $saleProduct['quantity']]);
            }

            // Modifica producto de la venta
            DB::table('sales_products')->where('id', $saleProduct['id'])->update(['quantity'=>$saleProduct['quantity'],'product'=>$saleProduct['product'],'priceType'=>$saleProduct['priceType']]);
        }

        // Añade nuevos pruductos
        foreach($req['productAditions'] as $saleProduct)
        {
            DB::table('sales_products')->insert([
                'sale'=>$req['sale'],
                'product'=>$saleProduct['product'],
                'priceType'=>$saleProduct['priceType'],
                'quantity'=>$saleProduct['quantity']
            ]);

            $productStock = DB::table('products')->where('id',$saleProduct['product'])->select('products.stock')->get()->toArray()[0]->stock;
            DB::table('products')->where('id',$saleProduct['product'])->update(['stock'=>$productStock - $saleProduct['quantity']]);
        }


        // Modifica venta
        $keys = ['client','comment','deliverDate','paidDate','delivered','paid','documentType'];

        $saleData = array(
            'lastModificationTime' => date('Y-m-d H:i:s'),
            'lastModificationUser' => $request->get('JWTID')
        );

        foreach($keys as $key)
        {
            if(isset($req[$key]))
                $saleData[$key] = $req[$key];
        }
        
        Sales::where('id',$req['sale'])->update($saleData);

        $sales = DB::table('sales')
        ->where('sales.id',$req['sale'])
        ->join('users', 'sales.lastModificationUser', '=', 'users.id')
        ->join('clients', 'sales.client', '=', 'clients.id')
        ->join('cities', 'clients.city', '=', 'cities.id')
        ->join('phones', 'clients.defaultPhone', '=', 'phones.id')
        ->join('emails', 'clients.defaultEmail', '=', 'emails.id')
        ->select('sales.*', 
        'users.firstname AS userFirstname',
        'users.lastname AS userLastname',
        'clients.firstname as clientFirstname',
        'clients.lastname as clientLastname',
        'clients.address',
        'cities.city as cityName',
        'phones.phone',
        'emails.email')
        ->get()->toArray();

        for($i = 0; $i < count($sales); $i++)
        {
            $sales[$i]->products = DB::table('sales_products')
            ->where('sale',$sales[$i]->id)
            ->join('prices', 'sales_products.priceType', '=', 'prices.id')
            ->select('sales_products.*','prices.price')
            ->get()
            ->toArray();
            
            $total = 0;
            for($j = 0; $j < count($sales[$i]->products); $j++)
            {
                $total += $sales[$i]->products[$j]->price * $sales[$i]->products[$j]->quantity;
            }

            $sales[$i]->cost = $total;
        }

        return $sales[0];
    }

    public function deleteSale(DeleteSaleRequest $request)
    {
        $saleProducts = DB::table('sales_products')->where('sale',$request->id)->select('sales_products.product','sales_products.quantity')->get()->toArray();

        foreach($saleProducts as $saleProduct)
        {
            $productStock = DB::table('products')->where('id',$saleProduct->product)->select('products.stock')->get()->toArray()[0]->stock;
            DB::table('products')->where('id',$saleProduct->product)->update(['stock'=>$productStock + $saleProduct->quantity]);
        }

        DB::table('sales_products')->where('sale', $request->id)->delete();
        Sales::where('id', $request->id)->delete();
        return;
    }
}
