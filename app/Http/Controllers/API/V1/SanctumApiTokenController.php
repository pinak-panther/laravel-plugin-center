<?php

namespace App\Http\Controllers\API\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class SanctumApiTokenController extends Controller
{
    //
    public function createAuthToken(Request $request)
    {
        $inputs = $request->only(['email','password']);
        if(!Auth::attempt($inputs)){
            abort(403);
        }
        $token = Auth::user()->createToken('authentication-token');
        return ['token' => $token->plainTextToken];
    }

    public function destroyAuthToken(Request $request){
        return Auth::user()->tokens()->where('name','authentication-token')->delete();
    }
    public function getCurrentUser(Request $request){
        return $this->sendResponse(Auth::user(),'Current Logged in user retrieved successfully ');
    }
}
