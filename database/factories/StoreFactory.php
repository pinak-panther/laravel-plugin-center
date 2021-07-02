<?php

namespace Database\Factories;

use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

class StoreFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Store::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $applicationIds = ['12335400','1354500','1354600','1354800','1354745'];
        $domain = explode(".",$this->faker->domainName)[0];
        return [
            'application_id'=>$this->faker->randomElement($applicationIds),
//            'name'=>"https://{$domain}.myshopify.com",
            'name'=>"https://pinak-intellifil.myshopify.com",
            'email'=>$this->faker->email,
            'current_plan'=>$this->faker->randomElement(['plan1','plan2','plan3','plan4']),
            'access_token'=>'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',
            'status'=>$this->faker->randomElement(['1','0']),
        ];
    }
}
