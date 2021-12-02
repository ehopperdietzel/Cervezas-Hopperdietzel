<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

use App\Http\Requests\CreateProductRequest;
use DateTime;

class Products extends Model
{    
    public $fillable = ['name','alias','color','image','defaultPrice','lastModificationTime','lastModificationUser'];
    public $timestamps = false;

    public function getProducts()
    {
        return DB::table('products')
            ->join('users', 'products.lastModificationUser', '=', 'users.id')
            ->select('products.*', 'users.firstname AS userFirstname','users.lastname AS userLastname')
            ->get();
    }

    public function createProduct(CreateProductRequest $request)
    {
        $productData = array(
            'name' => $request->name,
            'alias' => $request->alias,
            'color' => $request->color,
            'image' => false,
            'defaultPrice' => 0,
            'lastModificationTime' => date('Y-m-d H:i:s'),
            'lastModificationUser' => $request->get('JWTID')
        );
        return Products::create($productData)->id;
    }
}
