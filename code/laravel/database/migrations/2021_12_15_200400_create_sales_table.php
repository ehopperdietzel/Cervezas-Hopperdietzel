<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('client');
            $table->unsignedBigInteger('documentType');
            $table->unsignedBigInteger('documentNumber');
            $table->boolean('documentIsSigned')->default(false);

            $table->boolean('paid')->default(false);
            $table->boolean('delivered')->default(false);

            $table->timestamp('deliverDate', $precision = 0)->useCurrent();
            $table->timestamp('paidDate', $precision = 0)->useCurrent();

            $table->string('comment',256);

            $table->timestamp('lastModificationTime', $precision = 0)->useCurrent();
            $table->unsignedBigInteger('lastModificationUser');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sales');
    }
}
