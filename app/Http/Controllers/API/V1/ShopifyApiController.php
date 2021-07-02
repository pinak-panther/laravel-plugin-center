<?php

namespace App\Http\Controllers\API\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Store;
use App\Models\Application;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class ShopifyApiController extends Controller
{
    //
    public function getAllSnippets(Request $request)
    {
        $appId = $request->query('appId');
        $storeId = $request->query('storeId');
        $application = Application::find($appId);
        $store = Store::find($storeId);
        $snippets = config('shopifyassets')[$application->name];
        $data = [];
        foreach ($snippets as $key=>$snippet){
            $singleSnippet = [
                'index'=>$key,
                'filename'=>$snippet,
                'content'=>'',
            ];
            array_push($data,$singleSnippet);
        }

        //populating initial value for first snippet
        $fileName = $data[0]['filename'];
//        $result = Http::withHeaders(
//            ["X-Shopify-Access-Token"=>"{$store->access_token}"],
//            ["Content-Type"=>"application/json"]
//        )->get('https://pinak-intellifil.myshopify.com/admin/api/2021-07/themes/123044823220/assets.json',
//            ['asset[key]'=>"{$fileName}"]
//        );
        $result = Http::withHeaders(
            ["X-Shopify-Access-Token"=>"{$store->access_token}"],
            ["Content-Type"=>"application/json"]
        )->get("{$store->name}/admin/api/2021-07/themes/123044823220/assets.json",
            ["asset[key]"=>"{$fileName}"]
        );

        if($result->failed()){
            Log::error($result->json('errors'));
        }else{
            $data[0]['content']=$result->json('asset.value');
        }

        return $this->sendResponse($data,'All Snippets find Successfully');

    }

    public function getSingleSnippet(Request $request)
    {
        $appId = $request->query('appId');
        $storeId = $request->query('storeId');
        $snippetIndex = $request->query('snippetIndex');

        $application = Application::find($appId);
        $store = Store::find($storeId);
        $snippet = config('shopifyassets')[$application->name][$snippetIndex];
        Log::info("Access Token ".$store->access_token);

        $result = Http::withHeaders(
            ["X-Shopify-Access-Token"=>"{$store->access_token}"],
            ["Content-Type"=>"application/json"]
        )->get("{$store->name}/admin/api/2021-07/themes/123044823220/assets.json",
            ["asset[key]"=>"{$snippet}"]
        );
        if($result->failed()){
            $error = $result->json('errors');
            return $this->sendErrorResponse($error,'Some thing went wrong with request');
        }else{
            $content =  $result->json('asset.value');
            $data = [
                ["filename"=>$snippet,"content"=>$content,"index"=> $snippetIndex],
            ];
            return $this->sendResponse($data,"All snippets fetched successfully",200);
        }

    }

    public function updateAllSnippets(Request $request)
    {
        $storeId = $request->get('storeId');
        $store = Store::find($storeId);
        $allFiles = json_decode($request->get('files'));
        foreach ($allFiles as $file)
        {
            if($file->content != ''){
                $fileName = $file->filename;
                $content = $file->content;
                $storeName = $store->name;

                $headers = [
                    "X-Shopify-Access-Token"=>"{$store->access_token}",
                    "Content-Type"=>"application/json"
                ];

                $url ="{$storeName}/admin/api/2021-07/themes/123044823220/assets.json";

                $params = [
                    'asset'=>[
                        'key'=>$fileName,
                        'value'=>$content,
                    ]
                ];
                $encodedParam = json_encode($params);

                $result = Http::withHeaders($headers)->withBody($encodedParam,'application/json')->put($url);
                Log::debug($result->json());
            }
        }
        return $this->sendSuccess("All Snippets are updated successfully");
    }
}
