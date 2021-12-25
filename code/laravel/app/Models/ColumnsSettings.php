<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

use App\Http\Requests\GetColumnsSettingsRequest;
use App\Http\Requests\UpdateColumnSettingRequest;
use DateTime;

class ColumnsSettings extends Model
{
    public $fillable = ['user','section','title','type','key','order','visible','width'];
    public $timestamps = false;

    public function getColumnsSettings(GetColumnsSettingsRequest $request)
    {
        return [
            'sales'=>DB::table('columns_settings')->where('user',$request->get('JWTID'))->where('section',0)->orderBy('order')->get()->toArray(),
            'batches'=>DB::table('columns_settings')->where('user',$request->get('JWTID'))->where('section',1)->orderBy('order')->get()->toArray(),
            'products'=>DB::table('columns_settings')->where('user',$request->get('JWTID'))->where('section',2)->orderBy('order')->get()->toArray(),
            'clients'=>DB::table('columns_settings')->where('user',$request->get('JWTID'))->where('section',3)->orderBy('order')->get()->toArray(),
        ];

    }

    public function createDefaultColumns($userId)
    {
        
        $default = [
            // Sales
            ['user'=>$userId,'section'=>0,'title'=>'Cliente',               'type'=>'text',         'key'=>'clientName',            'order'=>0,'visible'=>true,'width'=>200],
            ['user'=>$userId,'section'=>0,'title'=>'Pagado',                'type'=>'paid',         'key'=>'paid',                  'order'=>1,'visible'=>true,'width'=>130],
            ['user'=>$userId,'section'=>0,'title'=>'Entregado',             'type'=>'delivered',    'key'=>'delivered',             'order'=>2,'visible'=>true,'width'=>130],
            ['user'=>$userId,'section'=>0,'title'=>'Última Modificación',   'type'=>'text',         'key'=>'lastModificationTime',  'order'=>3,'visible'=>true,'width'=>130],
            ['user'=>$userId,'section'=>0,'title'=>'Modificado por',        'type'=>'text',         'key'=>'modifiedBy',            'order'=>4,'visible'=>true,'width'=>150],

            // Batches
            ['user'=>$userId,'section'=>1,'title'=>'Nº Tanda',              'type'=>'text',         'key'=>'batchNumber',           'order'=>0,'visible'=>true,'width'=>50],
            ['user'=>$userId,'section'=>1,'title'=>'Producto',              'type'=>'text',         'key'=>'productName',           'order'=>1,'visible'=>true,'width'=>150],
            ['user'=>$userId,'section'=>1,'title'=>'Unidades Producidas',   'type'=>'text',         'key'=>'quantity',              'order'=>2,'visible'=>true,'width'=>50],
            ['user'=>$userId,'section'=>1,'title'=>'Fecha Inicio',          'type'=>'text',         'key'=>'beginDateN',            'order'=>3,'visible'=>true,'width'=>120],
            ['user'=>$userId,'section'=>1,'title'=>'Fecha Termino',         'type'=>'text',         'key'=>'endDateN',              'order'=>4,'visible'=>true,'width'=>120],
            ['user'=>$userId,'section'=>1,'title'=>'Duración(mins)',        'type'=>'text',         'key'=>'duration',              'order'=>5,'visible'=>true,'width'=>90],
            ['user'=>$userId,'section'=>1,'title'=>'Última Modificación',   'type'=>'text',         'key'=>'lastModificationTime',  'order'=>6,'visible'=>true,'width'=>120],
            ['user'=>$userId,'section'=>1,'title'=>'Modificado por',        'type'=>'text',         'key'=>'modifiedBy',            'order'=>7,'visible'=>true,'width'=>150],

            // Products
            ['user'=>$userId,'section'=>2,'title'=>'Producto',              'type'=>'text',         'key'=>'name',                  'order'=>0,'visible'=>true,'width'=>150],
            ['user'=>$userId,'section'=>2,'title'=>'Unidades disponibles',  'type'=>'text',         'key'=>'stock',                 'order'=>1,'visible'=>true,'width'=>100],
            ['user'=>$userId,'section'=>2,'title'=>'Alias',                 'type'=>'colorText',    'key'=>'aliasColor',            'order'=>2,'visible'=>true,'width'=>50],
            ['user'=>$userId,'section'=>2,'title'=>'Precio por defecto',    'type'=>'money',        'key'=>'defaultPriceValue',     'order'=>3,'visible'=>true,'width'=>150],
            ['user'=>$userId,'section'=>2,'title'=>'Última Modificación',   'type'=>'text',         'key'=>'lastModificationTime',  'order'=>4,'visible'=>true,'width'=>50],
            ['user'=>$userId,'section'=>2,'title'=>'Modificado por',        'type'=>'text',         'key'=>'modifiedBy',            'order'=>5,'visible'=>true,'width'=>50],

            // Clients
            ['user'=>$userId,'section'=>3,'title'=>'Nombre',                'type'=>'text',         'key'=>'clientName',            'order'=>0,'visible'=>true,'width'=>150],
            ['user'=>$userId,'section'=>3,'title'=>'RUT',                   'type'=>'text',         'key'=>'rut',                   'order'=>1,'visible'=>true,'width'=>120],
            ['user'=>$userId,'section'=>3,'title'=>'Teléfono',              'type'=>'text',         'key'=>'defaultPhoneValue',     'order'=>2,'visible'=>true,'width'=>100],
            ['user'=>$userId,'section'=>3,'title'=>'Email',                 'type'=>'text',         'key'=>'defaultEmailValue',     'order'=>3,'visible'=>true,'width'=>120],
            ['user'=>$userId,'section'=>3,'title'=>'Ciudad',                'type'=>'text',         'key'=>'cityName',              'order'=>4,'visible'=>true,'width'=>100],
            ['user'=>$userId,'section'=>3,'title'=>'Dirección',             'type'=>'text',         'key'=>'address',               'order'=>5,'visible'=>true,'width'=>180],
            ['user'=>$userId,'section'=>3,'title'=>'Última Modificación',   'type'=>'text',         'key'=>'lastModificationTime',  'order'=>6,'visible'=>true,'width'=>150],
            ['user'=>$userId,'section'=>3,'title'=>'Modificado por',        'type'=>'text',         'key'=>'modifiedBy',            'order'=>7,'visible'=>true,'width'=>150]

        ];

        foreach($default as $column)
        {
            DB::table('columns_settings')->insert($column);
        }
    }

    public function updateColumnSetting(UpdateColumnSettingRequest $request)
    {
        $changes = json_decode($request->changes);

        if(array_key_exists('order',$changes))
        {
            $column = DB::table('columns_settings')->where('id',$request->id)->get()->toArray()[0];

            // Update affected column
            ColumnsSettings::where('user',$request->get('JWTID'))->where('section',$column->section)->where('order',$changes->order)->update(['order'=>$column->order]);

        }
        ColumnsSettings::where('id',$request->id)->update((array)$changes);
    }
}
