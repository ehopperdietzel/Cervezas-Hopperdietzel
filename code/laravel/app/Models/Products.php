<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

use App\Http\Requests\CreateProductRequest;
use App\Http\Requests\DeleteProductRequest;
use App\Http\Requests\UpdateProductRequest;
use DateTime;

class Products extends Model
{    
    public $fillable = ['name','alias','color','image', 'stock','defaultPrice','lastModificationTime','lastModificationUser'];
    public $timestamps = false;

    public function getProducts()
    {
        $products = DB::table('products')
            ->join('users', 'products.lastModificationUser', '=', 'users.id')
            ->select('products.*', 'users.firstname AS userFirstname','users.lastname AS userLastname')
            ->get()->toArray();

        for($i = 0; $i < count($products); $i++)
        {
            $products[$i]->prices = DB::table('prices')->where('product',$products[$i]->id)->get()->toArray();

            for($j = 0; $j < count($products[$i]->prices); $j++)
            {
                $products[$i]->prices[$j]->inUse = count(DB::table('sales_products')
                ->join('sales', 'sales.id', '=', 'sales_products.sale')
                ->select('sales_products.id','sales.documentIsSigned')
                ->where('sales_products.priceType',$products[$i]->prices[$j]->id)
                ->where('sales.documentIsSigned',0)
                ->take(1)
                ->get()->toArray()) > 0;
            }
        }

        return $products;
    }

    public function createProduct(CreateProductRequest $request)
    {
        $containsImage = isset($_FILES['image']);
    
        $productData = array(
            'name' => $request->name,
            'alias' => $request->alias,
            'color' => $request->color,
            'stock' => $request->stock,
            'image' => $containsImage,
            'defaultPrice' => 0,
            'lastModificationTime' => date('Y-m-d H:i:s'),
            'lastModificationUser' => $request->get('JWTID')
        );

        $productId = Products::create($productData)->id;

        if($containsImage)
            copy($_FILES['image']['tmp_name'], public_path("assets/img/products/".strval($productId).".jpg"));
            //move_uploaded_file($_FILES['image']['tmp_name'], "../../public/assets/img/products/".strval($productId).".jpg");

        $prices = json_decode($request->prices);
        $defaultPriceId = 0;

        foreach($prices as $price)
        {
            $priceId = DB::table('prices')->insertGetId([
                'name'=>$price->name,
                'price'=>$price->price,
                'product'=>$productId
            ]);
            if($price->default)
            {
                $defaultPriceId = $priceId;
            }
        }

        Products::where('id',$productId)->update(['defaultPrice'=>$defaultPriceId]);

        $users = DB::table('users')->select("users.id")->get()->toArray();

        foreach($users as $user)
        {
            $lastOrder = DB::table('columns_settings')->where('user',$user->id)->where('section',0)->orderBy('order', 'desc')->take(1)->select("columns_settings.order")->get()->toArray()[0]->order;

            // Columns
            DB::table('columns_settings')->insert([
                'user'=>$user->id,
                'section'=>0,
                'title'=>$request->alias,
                'type'=>'productQuantity',
                'key'=>strval($productId),
                'order'=>$lastOrder + 1,
                'visible'=>true, 
                'width'=>50]);
        }

        return $productId;
    }

    public function deleteProduct(DeleteProductRequest $request)
    {
        DB::table('prices')->where('product', $request->id)->delete();
        Products::where('id', $request->id)->delete();
        return;
    }

    public function updateProduct(UpdateProductRequest $request)
    {

        $changes = json_decode($request->changes,true);

        $keys = ['name','alias','stock','color'];

        $productData = array(
            'lastModificationTime' => date('Y-m-d H:i:s'),
            'lastModificationUser' => $request->get('JWTID')
        );

        foreach($keys as $key)
        {
            if(isset($changes[$key]))
            {
                $productData[$key] = $changes[$key];
            }
        }

        if(isset($changes['image']))
        {
            $productData['image'] = ($changes['image'] != 0);

            if(isset($_FILES['image']))
            {
                copy($_FILES['image']['tmp_name'], public_path("assets/img/products/".strval($changes['id']).".jpg"));
            }
        }

        DB::table('products')->where('id',$changes['id'])->update($productData);

    }
}
