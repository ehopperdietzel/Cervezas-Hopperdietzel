<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

use App\Http\Requests\CreateProductRequest;
use App\Http\Requests\DeleteProductRequest;
use DateTime;

class Products extends Model
{    
    public $fillable = ['name','alias','color','image','defaultPrice','lastModificationTime','lastModificationUser'];
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
        
        return $productId;
    }

    public function deleteProduct(DeleteProductRequest $request)
    {
        DB::table('prices')->where('product', $request->id)->delete();
        Products::where('id', $request->id)->delete();
        return;
    }
}
