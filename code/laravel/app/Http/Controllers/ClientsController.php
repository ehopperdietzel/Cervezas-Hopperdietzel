<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\GetClientsRequest;
use App\Http\Requests\CreateClientRequest;
use App\Http\Requests\DeleteClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Models\Clients;

class ClientsController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt');
    }

    public function getClients(GetClientsRequest $request)
    {
        return json_encode(Clients::getClients());
    }

    public function createClient(CreateClientRequest $request)
    {
        $clientId = Clients::createClient($request);
        return response()->json(['id' => $clientId],200);
    }

    public function updateClient(UpdateClientRequest $request)
    {
        Clients::updateClient($request);
        return response()->json(['status' => "success"],200);
    }

    public function deleteClient(DeleteClientRequest $request)
    {
        Clients::deleteClient($request);
        return response()->json(['status' => "success"],200);
    }
}
