<?php

#use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::group(['middleware' => ['cors']], function () {
    Route::post('/login', 'App\Http\Controllers\UsersController@login');
    Route::get('/test', 'App\Http\Controllers\UsersController@test');

    Route::post('/users', 'App\Http\Controllers\UsersController@createUser');
    Route::get('/users', 'App\Http\Controllers\UsersController@getUsers');
    Route::patch('/users', 'App\Http\Controllers\UsersController@updateUser');
    Route::delete('/users/{id}', 'App\Http\Controllers\UsersController@deleteUser');

    Route::post('/products', 'App\Http\Controllers\ProductsController@createProduct');
    Route::get('/products', 'App\Http\Controllers\ProductsController@getProducts');
    Route::delete('/products/{id}', 'App\Http\Controllers\ProductsController@deleteProduct');

    Route::post('/clients', 'App\Http\Controllers\ClientsController@createClient');
    Route::get('/clients', 'App\Http\Controllers\ClientsController@getClients');
    Route::patch('/clients', 'App\Http\Controllers\ClientsController@updateClient');
    Route::delete('/clients/{id}', 'App\Http\Controllers\ClientsController@deleteClient');

    Route::post('/batches', 'App\Http\Controllers\BatchesController@createBatch');
    Route::get('/batches', 'App\Http\Controllers\BatchesController@getBatches');
    Route::patch('/batches', 'App\Http\Controllers\BatchesController@updateBatch');
    Route::delete('/batches/{id}', 'App\Http\Controllers\BatchesController@deleteBatch');

    Route::post('/sales', 'App\Http\Controllers\SalesController@createSale');
    Route::get('/sales', 'App\Http\Controllers\SalesController@getSales');
    Route::patch('/sales', 'App\Http\Controllers\SalesController@updateSale');
    Route::delete('/sales/{id}', 'App\Http\Controllers\SalesController@deleteSale');

    Route::get('/columnsSettings', 'App\Http\Controllers\ColumnsSettingsController@getColumnsSettings');
    Route::patch('/columnsSettings', 'App\Http\Controllers\ColumnsSettingsController@updateColumnSetting');
});

