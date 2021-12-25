<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests\GetColumnsSettingsRequest;
use App\Http\Requests\UpdateColumnSettingRequest;
use App\Models\ColumnsSettings;

class ColumnsSettingsController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt');
    }

    public function getColumnsSettings(GetColumnsSettingsRequest $request)
    {
        return json_encode(ColumnsSettings::getColumnsSettings($request));
    }

    public function updateColumnSetting(UpdateColumnSettingRequest $request)
    {
        ColumnsSettings::updateColumnSetting($request);
        return response()->json(['status' => "success"],200);
    }
}
