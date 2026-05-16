<?php

namespace Database\Factories;

use App\Models\Athlete;
use App\Models\Club;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Athlete>
 */
class AthleteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'club_id' => Club::factory(),
            'document_type' => fake()->randomElement(['CC', 'TI', 'CE']),
            'document_number' => fake()->unique()->numerify('##########'),
            'birthdate' => fake()->date('Y-m-d', '-10 years'),
            'gender' => fake()->randomElement(['male', 'female', 'other']),
            'address' => fake()->address(),
            'phone' => fake()->phoneNumber(),
            'emergency_contact_name' => fake()->name(),
            'emergency_contact_phone' => fake()->phoneNumber(),
            'emergency_contact_relationship' => fake()->randomElement(['Father', 'Mother', 'Sibling', 'Other']),
            'sport' => fake()->randomElement(['Athletics', 'Swimming', 'Cycling', 'Gymnastics']),
            'group_name' => fake()->randomElement(['Elite', 'Junior', 'Beginner']),
            'status' => 'active',
            'joined_at' => fake()->date(),
        ];
    }
}
