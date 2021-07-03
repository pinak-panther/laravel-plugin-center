<?php

namespace App\Http\Controllers\API\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class SanctumApiTokenController extends Controller
{
    /**
     * Creating auth token for given user. [login]
     * @param Request $request
     * @return array
     */
    public function createAuthToken(Request $request)
    {
        $inputs = $request->only(['email','password']);
        if(!Auth::attempt($inputs)){
            abort(403);
        }
        $token = Auth::user()->createToken('authentication-token');
        return ['token' => $token->plainTextToken];
    }

    /**
     * Deleting auth token for current authenticated user [logout]
     * @param Request $request
     * @return mixed
     */
    public function destroyAuthToken(Request $request){
        return Auth::user()->tokens()->where('name','authentication-token')->delete();
    }

    /**
     * Getting currently logged in user.
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCurrentUser(Request $request){
        return $this->sendResponse(Auth::user(),'Current Logged in user retrieved successfully ');
    }
}
