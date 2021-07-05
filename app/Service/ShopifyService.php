<?php


namespace App\Service;


use App\Repository\ApplicationRepositoryInterface;
use App\Repository\StoreRepositoryInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ShopifyService
{
    /**
     * @var StoreRepositoryInterface
     */
    private $storeRepo;

    /**
     * @var ApplicationRepositoryInterface
     */
    private $appRepo;

    /**
     * ShopifyApiController constructor.
     * @param StoreRepositoryInterface $storeRepository
     * @param ApplicationRepositoryInterface $applicationRepository
     */
    public function __construct(StoreRepositoryInterface $storeRepository, ApplicationRepositoryInterface $applicationRepository)
    {
        $this->storeRepo = $storeRepository;
        $this->appRepo = $applicationRepository;
    }

    /**
     * Getting id for active theme for given store.
     * @param $id
     * @return false|mixed
     */
    public function getActiveThemeForStore($id)
    {
        $store = $this->storeRepo->find($id);
        if (!$store)
            return false;

        $headers = [
            "X-Shopify-Access-Token" => "{$store->access_token}",
            "Content-Type" => "application/json"
        ];
        $url = "{$store->name}/admin/api/2021-07/themes.json";
        $result = Http::withHeaders($headers)->get($url);
        $allThemes = $result->json('themes');
        $mainTheme = array_filter($allThemes, function ($theme) {
            return $theme['role'] == 'main';
        });
        return $mainTheme[0]['id'];
    }

    /**
     * Uploading a Single Snippet to Shopify
     * @param $snippet
     * @param array $headers
     * @param string $url
     * @return bool
     */
    public function     uploadSingleSnippetToShopify($snippet, array $headers, string $url): bool
    {
        $fileName = $snippet->filename;
        $content = $snippet->content;

        $params = [
            'asset' => [
                'key' => $fileName,
                'value' => $content,
            ]
        ];
        $encodedParam = json_encode($params);

        $result = Http::withHeaders($headers)->withBody($encodedParam, 'application/json')->put($url);
        if ($result->failed()) {
            $error = $result->json('errors');
            Log::info('Issue uploading a Snippet');
            Log::error($error);
            return false;
        }
        Log::info('Successfully uploaded Snippet');
        Log::debug($result->json('asset.value'));
        return true;
    }

    /**
     * @param $storeId
     * @param $allSnippets
     * @return bool
     */
    public function uploadAllSnippetsToShopify($storeId, $allSnippets): bool
    {
        $store = $this->storeRepo->find($storeId);
        $storeName = $store->name;
        $activeTheme = $this->getActiveThemeForStore($storeId);
        if (!$activeTheme) {
            Log::error("Unable to fetch Active Theme for store {$storeName}");
            return false;
        }
        $headers = [
            "X-Shopify-Access-Token" => "{$store->access_token}",
            "Content-Type" => "application/json"
        ];
        $url = "{$storeName}/admin/api/2021-07/themes/{$activeTheme}/assets.json";

        foreach ($allSnippets as $snippet) {
            if ($snippet->content != '') {
                $uploadResult = $this->uploadSingleSnippetToShopify($snippet, $headers, $url);
                if (!$uploadResult) {
                    Log::error("Unable to Upload Snippet {$snippet->filename}");
                    return false;
                }
            }
        }
        Log::debug("All Snippets are updated successfully");
        return true;
    }

    /**
     * @param $appId
     * @param $storeId
     * @return array|bool
     */
    public function getAllSnippets($appId, $storeId)
    {
        $application = $this->appRepo->find($appId);
        $store = $this->storeRepo->find($storeId);
        $snippets = config('shopifyassets')[$application->name];
        $data = [];
        foreach ($snippets as $key => $snippet) {
            $singleSnippet = [
                'index' => $key,
                'filename' => $snippet,
                'content' => '',
            ];
            array_push($data, $singleSnippet);
        }

        //populating initial value for first snippet
        $fileName = $data[0]['filename'];
        $activeTheme = $this->getActiveThemeForStore($storeId);
        $url = "{$store->name}/admin/api/2021-07/themes/${activeTheme}/assets.json";
        $headers = [
            "X-Shopify-Access-Token" => "{$store->access_token}",
            "Content-Type" => "application/json"
        ];
        $result = Http::withHeaders($headers)->get($url, ["asset[key]" => "{$fileName}"]);

        if ($result->failed()) {
            Log::error($result->json('errors'));
            return false;
        } else {
            $data[0]['content'] = $result->json('asset.value');
        }
        return $data;
    }

    /**
     * @param $appId
     * @param $storeId
     * @param $snippetIndex
     */
    public function getSingleSnippetFromShopify($appId, $storeId, $snippetIndex)
    {
        $application = $this->appRepo->find($appId);
        $store = $this->storeRepo->find($storeId);
        $snippet = config('shopifyassets')[$application->name][$snippetIndex];
//        Log::info("Access Token ".$store->access_token);

        $activeTheme = $this->getActiveThemeForStore($storeId);
        $url = "{$store->name}/admin/api/2021-07/themes/${activeTheme}/assets.json";
        $headers = [
            "X-Shopify-Access-Token" => "{$store->access_token}",
            "Content-Type" => "application/json"
        ];
        $result = Http::withHeaders($headers)->get($url, ["asset[key]" => "{$snippet}"]);

        if ($result->failed()) {
            $error = $result->json('errors');
            Log::error($error);
            return false;
        } else {
            $content = $result->json('asset.value');
            return [
                ["filename" => $snippet, "content" => $content, "index" => $snippetIndex],
            ];
        }
    }
}
