<?php

#use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::group(['middleware' => ['cors']], function () {
    Route::post('/login', 'App\Http\Controllers\UsersController@login');
    Route::post('/users', 'App\Http\Controllers\UsersController@createUser');
    Route::get('/users', 'App\Http\Controllers\UsersController@getUsers');
    Route::patch('/users', 'App\Http\Controllers\UsersController@updateUser');
    Route::delete('/users/{id}', 'App\Http\Controllers\UsersController@deleteUser');

    Route::post('/products', 'App\Http\Controllers\ProductsController@createProduct');
    Route::get('/products', 'App\Http\Controllers\ProductsController@getProducts');
});

