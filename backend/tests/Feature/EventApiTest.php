<?php

namespace Tests\Feature;

use App\Models\Club;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create(['role' => 'admin', 'club_id' => 1]);
        $this->club = Club::factory()->create(['id' => 1]);
    }

    public function test_can_create_event()
    {
        $token = $this->user->createToken('auth_token')->plainTextToken;

        $eventData = [
            'club_id' => $this->club->id,
            'user_id' => $this->user->id,
            'name' => 'Torneo Regional',
            'description' => 'Torneo anual regional',
            'date' => '2026-10-01',
            'start_time' => '08:00',
            'end_time' => '18:00',
            'location' => 'Estadio Principal',
            'status' => 'scheduled',
            'type' => 'tournament',
            'capacity' => 100,
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/v1/events', $eventData);

        $response->assertStatus(201)
                 ->assertJsonFragment(['name' => 'Torneo Regional']);
    }
}
