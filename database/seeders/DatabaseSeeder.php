<?php

namespace Database\Seeders;



use App\Models\Application;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

use Illuminate\Database\Seeder;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        
        //User Seeder
        \App\Models\User::create([
            'name' => 'Panther Codx',
            'email' => 'admin@demo.com',
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
        ]);


        //Application Seeder
        $applications = [
            ['name'=>'Dinosell', 'description'=>'Checkout Upsell, Cross sell,Birthday collect, Reviews 10+ apps','shopify_app_id'=>'1233354','shopify_app_url'=>'https://apps.shopify.com/dinosell-post-purchase-upsell-widgets'],
            ['name'=>'One Click Upsell', 'description'=>'Build Upsells & Cross Sells - Pre & Post Purchase Funnels :-)','shopify_app_id'=>'1354500','shopify_app_url'=>'https://apps.shopify.com/zipify-oneclickupsell'],
            ['name'=>'Shop Codes', 'description'=>'Market products and link to checkout with Shopify QR codes.','shopify_app_id'=>'1354600','shopify_app_url'=>'https://apps.shopify.com/shopcodes'],
            ['name'=>'Smart Messenger', 'description'=>'Use FB Messenger for abandoned carts, followups, and receipts','shopify_app_id'=>'1354800','shopify_app_url'=>'https://apps.shopify.com/fb-messenger-remarketing'],
            ['name'=>'Shyplite', 'description'=>'Single Dashboard For All Your Shipping Needs','shopify_app_id'=>'1354745','shopify_app_url'=>'https://apps.shopify.com/shyplite-1'],

        ];
        foreach ($applications as $application)
        {
            \App\Models\Application::create([
                'name'=>$application['name'],
                'shopify_app_id'=>$application['shopify_app_id'],
                'shopify_app_url'=>$application['shopify_app_url'],
                'description'=>$application['description']
            ]);
        }

        \App\Models\Store::factory(10)->create();
    }
}
