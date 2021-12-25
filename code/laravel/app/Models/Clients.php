<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

use App\Http\Requests\GetClientsRequest;
use App\Http\Requests\CreateClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Requests\DeleteClientRequest;
use DateTime;

class Clients extends Model
{
    public $fillable = ['firstname','lastname','company','rut','comment','address','city','defaultPhone','defaultEmail','status','lastModificationTime','lastModificationUser'];
    public $timestamps = false;

    public function getClients(GetClientsRequest $request)
    {
        // Check for extra options
        if($request->has('options'))
        {
            $options = json_decode($request->options);

            if(isset($options->query))
            {
                $words = preg_split('/\s+/', $options->query);

                $res = Clients::query()
                ->join('cities', 'clients.city', '=', 'cities.id');

                foreach($words as $word)
                {
                    $res = $res->orWhere('lastname', 'LIKE', '%'.$word.'%')
                    ->orWhere('firstname', 'LIKE', '%'.$word.'%')
                    ->orWhere('company', 'LIKE', '%'.$word.'%')
                    ->orWhere('comment', 'LIKE', '%'.$word.'%')
                    ->orWhere('rut', 'LIKE', '%'.$word.'%') 
                    ->orWhere('cities.city', 'LIKE', '%'.$word.'%');
                }
                
                $res = $res->select('clients.*','cities.city as cityName')
                ->take(15)
                ->get()
                ->toArray();

                return $res;
            }
        }

        $clients = DB::table('clients')
            ->join('users', 'clients.lastModificationUser', '=', 'users.id')
            ->join('cities', 'clients.city', '=', 'cities.id')
            ->select('clients.*', 'users.firstname AS userFirstname','users.lastname AS userLastname','cities.city as cityName')
            ->get()->toArray();

        // Obtiene teléfonos e emails
        for($i = 0; $i < count($clients); $i++)
        {
            $clients[$i]->phones = DB::table('phones')->where('client',$clients[$i]->id)->get()->toArray();
            $clients[$i]->emails = DB::table('emails')->where('client',$clients[$i]->id)->get()->toArray();
        }

        return $clients;
    }

    public function createClient(CreateClientRequest $request)
    {

        $city = DB::table('cities')->where('city',$request->cityName)->get()->toArray();
        $cityId = 0;

        if(count($city) == 0)
        {
            $cityId = DB::table('cities')->insertGetId([
                'city'=>$request->cityName
            ]);
        }
        else
        {
            $cityId = $city[0]->id;
        }

        $data = array(
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'company' => $request->company,
            'rut' => $request->rut,
            'comment' => $request->comment,
            'address' => $request->address,
            'city' => $cityId,
            'defaultPhone' => 0,
            'defaultEmail' => 0,
            'lastModificationTime' => date('Y-m-d H:i:s'),
            'lastModificationUser' => $request->get('JWTID')
        );

        $clientId = Clients::create($data)->id;

        $phones = json_decode($request->phones);
        $defaultPhoneId = 0;

        foreach($phones as $phone)
        {
            $phoneId = DB::table('phones')->insertGetId([
                'phone'=>$phone->phone,
                'client'=>$clientId
            ]);
            if($phone->default)
                $defaultPhoneId = $phoneId;
        }

        Clients::where('id',$clientId)->update(['defaultPhone'=>$defaultPhoneId]);

        $emails = json_decode($request->emails);
        $defaultEmailId = 0;

        foreach($emails as $email)
        {
            $emailId = DB::table('emails')->insertGetId([
                'email'=>$email->email,
                'client'=>$clientId
            ]);
            if($email->default)
                $defaultEmailId = $emailId;
        }

        Clients::where('id',$clientId)->update(['defaultEmail'=>$defaultEmailId]);
        
        return $clientId;
    }

    public function updateClient(UpdateClientRequest $request)
    {
        DB::table('phones')->where('client', $request->id)->delete();
        DB::table('emails')->where('client', $request->id)->delete();

        $city = DB::table('cities')->where('city',$request->cityName)->get()->toArray();
        $cityId = 0;

        if(count($city) == 0)
        {
            $cityId = DB::table('cities')->insertGetId([
                'city'=>$request->cityName
            ]);
        }
        else
        {
            $cityId = $city[0]->id;
        }

        $changes = array(
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'company' => $request->company,
            'rut' => $request->rut,
            'comment' => $request->comment,
            'address' => $request->address,
            'city' => $cityId,
            'lastModificationTime' => date('Y-m-d H:i:s'),
            'lastModificationUser' => $request->get('JWTID')
        );

        Clients::where('id',$request->id)->update($changes);

        $clientId = $request->id;

        $phones = json_decode($request->phones);
        $defaultPhoneId = 0;

        foreach($phones as $phone)
        {
            $phoneId = DB::table('phones')->insertGetId([
                'phone'=>$phone->phone,
                'client'=>$clientId
            ]);
            if($phone->default)
                $defaultPhoneId = $phoneId;
        }

        Clients::where('id',$clientId)->update(['defaultPhone'=>$defaultPhoneId]);

        $emails = json_decode($request->emails);
        $defaultEmailId = 0;

        foreach($emails as $email)
        {
            $emailId = DB::table('emails')->insertGetId([
                'email'=>$email->email,
                'client'=>$clientId
            ]);
            if($email->default)
                $defaultEmailId = $emailId;
        }

        Clients::where('id',$clientId)->update(['defaultEmail'=>$defaultEmailId]);
    }

    public function deleteClient(DeleteClientRequest $request)
    {
        DB::table('phones')->where('client', $request->id)->delete();
        DB::table('emails')->where('client', $request->id)->delete();
        Clients::where('id', $request->id)->delete();
        return;
    }
}
