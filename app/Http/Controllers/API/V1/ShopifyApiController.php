<?php

namespace App\Http\Controllers\API\V1;


use App\Service\ShopifyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
class ShopifyApiController extends Controller
{
    //
    /**
     * @var ShopifyService
     */
    private $shopifyService;

    /**
     * ShopifyApiController constructor.
     * @param ShopifyService $shopifyService
     */
    public function __construct( ShopifyService $shopifyService)
    {
        $this->shopifyService = $shopifyService;
    }

    /**
     * Getting all Snippets from Shopify for current active theme.
     * @param Request $request
     * @return JsonResponse
     */
    public function getAllSnippets(Request $request)
    {
        $appId = $request->query('appId');
        $storeId = $request->query('storeId');
        $allSnippets = $this->shopifyService->getAllSnippets($appId, $storeId);

        return $this->sendResponse($allSnippets,'All Snippets find Successfully');

    }

    /**
     * Fetching a single Snippet from Shopify
     * @param Request $request
     * @return JsonResponse
     */
    public function getSingleSnippet(Request $request)
    {
        $appId = $request->query('appId');
        $storeId = $request->query('storeId');
        $snippetIndex = $request->query('snippetIndex');

        $singleSnippet =  $this->shopifyService->getSingleSnippetFromShopify($appId, $storeId, $snippetIndex);
        if(!$singleSnippet){
            return $this->sendError("Something went wrong retriving Snippet");
        }
        return $this->sendResponse($singleSnippet, "All snippets fetched successfully", 200);
    }

    /**
     * All files provided in the request will get updated in Shopify
     * @param Request $request
     * @return JsonResponse
     */
    public function updateAllSnippets(Request $request)
    {
        $storeId = $request->get('storeId');
        $allSnippets = json_decode($request->get('files'));
        $uploadSnippetsResult = $this->shopifyService->uploadAllSnippetsToShopify($storeId, $allSnippets);
        if (!$uploadSnippetsResult) {
            return $this->sendErrorResponse("Some thing went wrong uploading Snippets to Shopify");
        }
        return $this->sendSuccess("All Snippets are updated successfully");

    }
}
