<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBatchesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('batches', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('batchNumber');
            $table->unsignedBigInteger('product');
            $table->unsignedBigInteger('quantity');
            $table->string('comment',256);
            $table->timestamp('beginDate', $precision = 0)->useCurrent();
            $table->timestamp('endDate', $precision = 0)->useCurrent();
            $table->timestamp('lastModificationTime', $precision = 0)->useCurrent();
            $table->unsignedBigInteger('lastModificationUser');
        });

        Schema::table('batches', function(Blueprint $table) {
            $table->foreign('product')->references('id')->on('products');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('batches');
    }
}
