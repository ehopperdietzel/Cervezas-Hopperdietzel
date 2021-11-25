<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name',32);
            $table->string('alias',32);
            $table->string('color',7);
            $table->boolean('image');
            $table->unsignedBigInteger('defaultPrice');
            $table->timestamp('lastModificationTime', $precision = 0);
            $table->unsignedBigInteger('lastModificationUser');
        });

        Schema::table('products', function(Blueprint $table) {
            $table->foreign('lastModificationUser')->references('id')->on('users');
            //$table->foreign('defaultPrice')->references('id')->on('prices');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
}
