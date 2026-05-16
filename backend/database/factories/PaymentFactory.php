<?php

namespace Database\Factories;

use App\Models\Athlete;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'athlete_id' => Athlete::factory(),
            'amount' => fake()->randomFloat(2, 50, 200),
            'period_month' => fake()->month(),
            'period_year' => 2026,
            'due_date' => fake()->dateTimeBetween('now', '+1 month'),
            'paid_at' => fake()->boolean(80) ? now() : null,
            'payment_method' => fake()->randomElement(['Cash', 'Transfer', 'Card']),
            'status' => 'paid',
            'registered_by' => User::factory(),
        ];
    }
}
