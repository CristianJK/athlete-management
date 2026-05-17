<?php

namespace Tests\Feature;

use App\Models\Athlete;
use App\Models\Club;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AthleteApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Evita el error de no haber definido factories para todas las relaciones en este test simple
        $this->user = User::factory()->create(['role' => 'admin']);
        $this->club = Club::factory()->create(['id' => 1]);
    }

    public function test_admin_can_get_athletes_list()
    {
        $token = $this->user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/v1/athletes');

        $response->assertStatus(200);
    }

    public function test_admin_can_create_athlete()
    {
        $token = $this->user->createToken('auth_token')->plainTextToken;
        $newUser = User::factory()->create(['role' => 'athlete']);

        $athleteData = [
            'user_id' => $newUser->id,
            'club_id' => $this->club->id,
            'document_type' => 'CC',
            'document_number' => '123456789',
            'birthdate' => '2000-01-01',
            'gender' => 'male',
            'address' => 'Calle Falsa 123',
            'phone' => '1234567890',
            'emergency_contact_name' => 'John Doe',
            'emergency_contact_phone' => '0987654321',
            'emergency_contact_relationship' => 'Padre',
            'sport' => 'Futbol',
            'group_name' => 'Sub 20',
            'status' => 'active',
            'joined_at' => now()->toDateString(),
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/v1/athletes', $athleteData);

        $response->assertStatus(201)
                 ->assertJsonFragment(['document_number' => '123456789']);
    }
}
