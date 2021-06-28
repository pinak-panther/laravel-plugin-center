<?php

namespace App\Providers;

use App\Repository\ApplicationRepository;
use App\Repository\ApplicationRepositoryInterface;
use App\Repository\PlanRepository;
use App\Repository\PlanRepositoryInterface;
use App\Repository\ProductRepository;
use App\Repository\ProductRepositoryInterface;
use App\Repository\StoreRepository;
use App\Repository\StoreRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class RepositoryProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);
        $this->app->bind(ApplicationRepositoryInterface::class, ApplicationRepository::class);
        $this->app->bind(StoreRepositoryInterface::class, StoreRepository::class);
        $this->app->bind(PlanRepositoryInterface::class, PlanRepository::class);
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //

    }
}
