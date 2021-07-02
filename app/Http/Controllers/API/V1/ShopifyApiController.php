<?php

namespace App\Http\Controllers\API\V1;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;

use App\Repository\StoreRepositoryInterface;
use App\Repository\ApplicationRepositoryInterface;
class ShopifyApiController extends Controller
{
    //
    /**
     * @var StoreRepositoryInterface
     */
    private $storeRepo;

    /**
     * @var ApplicationRepositoryInterface
     */
    private $appRepo;

    public function __construct(StoreRepositoryInterface $storeRepository, ApplicationRepositoryInterface $applicationRepository)
    {
        $this->storeRepo = $storeRepository;
        $this->appRepo = $applicationRepository;
    }

    public function getAllSnippets(Request $request)
    {
        $appId = $request->query('appId');
        $storeId = $request->query('storeId');
        $application = $this->appRepo->find($appId);
        $store = $this->storeRepo->find($storeId);
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
        $activeTheme = $this->getActiveThemeForStore($storeId);
        $url = "{$store->name}/admin/api/2021-07/themes/${activeTheme}/assets.json";
        $headers = [
            "X-Shopify-Access-Token"=>"{$store->access_token}",
            "Content-Type"=>"application/json"
        ];
        $result = Http::withHeaders($headers)->get($url,["asset[key]"=>"{$fileName}"]);

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

        $application = $this->appRepo->find($appId);
        $store = $this->storeRepo->find($storeId);
        $snippet = config('shopifyassets')[$application->name][$snippetIndex];
//        Log::info("Access Token ".$store->access_token);

        $activeTheme = $this->getActiveThemeForStore($storeId);
        $url = "{$store->name}/admin/api/2021-07/themes/${activeTheme}/assets.json";
        $headers = [
            "X-Shopify-Access-Token"=>"{$store->access_token}",
            "Content-Type"=>"application/json"
        ];
        $result = Http::withHeaders($headers)->get($url,["asset[key]"=>"{$snippet}"]);

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
        $store = $this->storeRepo->find($storeId);
        $allFiles = json_decode($request->get('files'));

        $storeName = $store->name;
        $headers = [
            "X-Shopify-Access-Token"=>"{$store->access_token}",
            "Content-Type"=>"application/json"
        ];
        $activeTheme = $this->getActiveThemeForStore($storeId);
        $url ="{$storeName}/admin/api/2021-07/themes/{$activeTheme}/assets.json";

        foreach ($allFiles as $file)
        {
            if($file->content != ''){
                $fileName = $file->filename;
                $content = $file->content;

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
    public function getActiveThemeForStore($id){
        $store = $this->storeRepo->find($id);
        if(!$store)
            return false;

        $headers = [
            "X-Shopify-Access-Token"=>"{$store->access_token}",
            "Content-Type"=>"application/json"
        ];
        $url ="{$store->name}/admin/api/2021-07/themes.json";
        $result = Http::withHeaders($headers)->get($url);
        $allThemes =  $result->json('themes');
        $mainTheme = array_filter($allThemes,function($theme){
            return $theme['role']=='main';
        });
        return $mainTheme[0]['id'];
    }
}
