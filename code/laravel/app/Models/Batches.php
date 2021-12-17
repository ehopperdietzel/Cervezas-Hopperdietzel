<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

use App\Http\Requests\CreateBatchRequest;
use App\Http\Requests\UpdateBatchRequest;
use App\Http\Requests\DeleteBatchRequest;
use DateTime;

class Batches extends Model
{
    public $fillable = ['batchNumber','product','quantity','comment','beginDate','endDate','lastModificationTime','lastModificationUser'];
    public $timestamps = false;

    public function getBatches()
    {
        $batches = DB::table('batches')
            ->join('products', 'products.id', '=', 'batches.product')
            ->join('users', 'users.id', '=', 'batches.lastModificationUser')
            ->select('batches.*', 'products.name AS productName','users.firstname AS userFirstname','users.lastname AS userLastname')
            ->orderBy('id', 'DESC')
            ->get()->toArray();

        return $batches;
    }

    public function createBatch(CreateBatchRequest $request)
    {
        $data = array(
            'batchNumber' => $request->batchNumber,
            'product' => $request->product,
            'quantity' => $request->quantity,
            'comment' => $request->comment,
            'beginDate' => DateTime::createFromFormat('Y-m-d\TH:i', $request->beginDate)->format('Y-m-d H:i:s'),
            'endDate' => DateTime::createFromFormat('Y-m-d\TH:i', $request->endDate)->format('Y-m-d H:i:s'),
            'lastModificationTime' => date('Y-m-d H:i:s'),
            'lastModificationUser' => $request->get('JWTID')
        );

        $batchId = Batches::create($data)->id;

        $currentStock = DB::table('products')->where('id',$request->product)->get()->toArray()[0]->stock;
        DB::table('products')->where('id',$request->product)->update(['stock'=>$currentStock + $request->quantity]);
        
        return $batchId;
    }

    public function updateBatch(UpdateBatchRequest $request)
    {
        $previousBatchData = DB::table('batches')->where('id',$request->id)->get()->toArray()[0];

        if($previousBatchData->product == $request->product)
        {
            $previousProductData = DB::table('products')->where('id',$request->product)->get()->toArray()[0];
            $stockDiff = $request->quantity - $previousBatchData->quantity + $previousProductData->stock;
            DB::table('products')->where('id',$request->id)->update(['stock' => $stockDiff]);
        }
        else
        {
            $previousProductData = DB::table('products')->where('id',$previousBatchData->product)->get()->toArray()[0];
            DB::table('products')->where('id',$previousBatchData->product)->update(['stock'=>$previousProductData->stock - $previousBatchData->quantity]);

            $curentProductData = DB::table('products')->where('id',$request->product)->get()->toArray()[0];
            DB::table('products')->where('id',$request->product)->update(['stock'=>$curentProductData->stock + $request->quantity]);
        }

        $changes = array(
            'batchNumber' => $request->batchNumber,
            'product' => $request->product,
            'quantity' => $request->quantity,
            'comment' => $request->comment,
            //'beginDate' => DateTime::createFromFormat('Y-m-d\TH:i', $request->beginDate)->format('Y-m-d H:i:s'),
            //'endDate' => DateTime::createFromFormat('Y-m-d\TH:i', $request->endDate)->format('Y-m-d H:i:s'),
            'lastModificationTime' => date('Y-m-d H:i:s'),
            'lastModificationUser' => $request->get('JWTID')
        );

        Batches::where('id',$request->id)->update($changes);
    }

    public function deleteBatch(DeleteBatchRequest $request)
    {
        $previousBatchData = DB::table('batches')->where('id',$request->id)->get()->toArray()[0];
        $currentStock = DB::table('products')->where('id',$previousBatchData->product)->get()->toArray()[0]->stock;
        DB::table('products')->where('id',$previousBatchData->product)->update(['stock'=>$currentStock - $previousBatchData->quantity]);
        Batches::where('id', $request->id)->delete();
        return;
    }
}
