<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePricesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('prices', function (Blueprint $table) {
            $table->id();
            $table->string('name',32);
            $table->unsignedInteger('price');
            $table->unsignedBigInteger('product');
        });

        Schema::table('prices', function(Blueprint $table) {
            $table->foreign('product')->references('id')->on('products');
        });

        Schema::table('products', function(Blueprint $table) {
            $table->foreign('defaultPrice')->references('id')->on('prices');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('prices');
    }
}
