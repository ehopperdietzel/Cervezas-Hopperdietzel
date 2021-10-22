<?php

#use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::group(['middleware' => ['cors']], function () {
    Route::post('/login', 'App\Http\Controllers\UsersController@login');
    Route::post('/users/create', 'App\Http\Controllers\UsersController@createUser');
    Route::get('/test', 'App\Http\Controllers\UsersController@test');
});

