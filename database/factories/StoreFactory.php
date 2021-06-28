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
        $applicationIds = ['123354','1354500','1354600','1354800','1354745'];
        return [
            'application_id'=>$this->faker->randomElement($applicationIds),
            'name'=>$this->faker->domainName,
            'email'=>$this->faker->email,
            'current_plan'=>$this->faker->randomElement(['plan1','plan2','plan3','plan4']),
            'status'=>$this->faker->randomElement(['1','0']),
        ];
    }
}
