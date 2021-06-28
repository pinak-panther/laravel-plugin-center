<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\V1\SanctumApiTokenController;
use App\Http\Controllers\API\V1\ApplicationController;
use App\Http\Controllers\API\V1\StoreController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post('/login', [SanctumApiTokenController::class,'createAuthToken']);
Route::group(['middleware'=>'auth:sanctum'],function(){
    Route::get('/test',function (Request $request){return 'sanctum is working.';});
    Route::get('/user', [SanctumApiTokenController::class,'getCurrentUser']);
    Route::post('/logout', [SanctumApiTokenController::class,'destroyAuthToken']);

    Route::resource('application',ApplicationController::class);
    Route::resource('store',StoreController::class);

});