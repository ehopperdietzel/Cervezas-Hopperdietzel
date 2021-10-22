<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    public function handle(Request $request, Closure $next)
    {
        return $next($request)
       //Url a la que se le dará acceso en las peticiones
      ->header("Access-Control-Allow-Origin", "*")
      //Métodos que a los que se da acceso
      ->header("Access-Control-Allow-Methods", "*")
      //Headers de la petición
      ->header("Access-Control-Allow-Headers", "*"); 
    }
}
