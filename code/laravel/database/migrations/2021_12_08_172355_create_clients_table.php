<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('firstname',32);
            $table->string('lastname',32)->nullable();
            $table->string('company',32)->nullable();
            $table->string('rut',16)->nullable();
            $table->string('comment',256)->nullable();
            $table->string('address',128)->nullable();

            $table->unsignedBigInteger('city');
            $table->unsignedBigInteger('defaultPhone');
            $table->unsignedBigInteger('defaultEmail');
            
            $table->unsignedTinyInteger('status')->default(1);

            $table->timestamp('lastModificationTime', $precision = 0);
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
        Schema::dropIfExists('clients');
    }
}
