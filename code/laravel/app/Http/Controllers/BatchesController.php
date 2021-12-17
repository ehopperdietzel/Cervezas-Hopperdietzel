<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Middleware\JWT;
use App\Http\Requests\CreateBatchRequest;
use App\Http\Requests\UpdateBatchRequest;
use App\Http\Requests\GetBatchesRequest;
use App\Http\Requests\DeleteBatchRequest;
use App\Models\Batches;

class BatchesController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt');
    }

    public function createBatch(CreateBatchRequest $request)
    {
        $batchId = Batches::createBatch($request);
        return response()->json(['id' => $batchId],200);
    }

    public function getBatches(GetBatchesRequest $request)
    {
        return json_encode(Batches::getBatches());
    }

    public function updateBatch(UpdateBatchRequest $request)
    {
        Batches::updateBatch($request);
        return response()->json(['status' => "success"],200);
    }

    public function deleteBatch(DeleteBatchRequest $request)
    {
        Batches::deleteBatch($request);
        return response()->json(['status' => "success"],200);
    }
}
