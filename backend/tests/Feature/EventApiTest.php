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
        $this->user = User::factory()->create(['role' => 'admin']);
        $this->club = Club::factory()->create(['id' => 1]);
    }

    public function test_can_create_event()
    {
        $token = $this->user->createToken('auth_token')->plainTextToken;

        $eventData = [
            'club_id' => $this->club->id,
            'title' => 'Torneo Regional',
            'description' => 'Torneo anual regional',
            'starts_at' => '2026-10-01 08:00:00',
            'ends_at' => '2026-10-01 18:00:00',
            'location' => 'Estadio Principal',
            'status' => 'upcoming',
            'type' => 'tournament',
            'max_attendees' => 100,
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/v1/events', $eventData);

        $response->assertStatus(201)
                 ->assertJsonFragment(['title' => 'Torneo Regional']);
    }
}
