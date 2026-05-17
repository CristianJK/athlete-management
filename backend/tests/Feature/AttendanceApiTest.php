<?php

namespace Tests\Feature;

use App\Models\Athlete;
use App\Models\AttendanceSession;
use App\Models\Club;
use App\Models\Event;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AttendanceApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create(['role' => 'admin']);
        $this->club = Club::factory()->create();
        $this->event = Event::factory()->create(['club_id' => $this->club->id]);
    }

    public function test_coach_can_create_attendance_session()
    {
        $token = $this->user->createToken('auth_token')->plainTextToken;

        $sessionData = [
            'club_id' => $this->club->id,
            'event_id' => $this->event->id,
            'date' => now()->toDateString(),
            'start_time' => '10:00',
            'end_time' => '12:00',
            'status' => 'open',
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/v1/attendance/sessions', $sessionData);

        $response->assertStatus(201)
                 ->assertJsonFragment(['status' => 'open']);
    }

    public function test_athlete_cannot_checkin_twice_in_same_session()
    {
        $token = $this->user->createToken('auth_token')->plainTextToken;
        $athlete = Athlete::factory()->create(['club_id' => $this->club->id]);
        $session = AttendanceSession::factory()->create(['event_id' => $this->event->id]);

        $checkInData = [
            'session_id' => $session->id,
            'athlete_id' => $athlete->id,
            'qr_token' => 'dummy_token_123',
        ];

        // Primer check-in
        $this->withHeaders(['Authorization' => 'Bearer ' . $token])
             ->postJson('/api/v1/attendance/records', $checkInData)
             ->assertStatus(201);

        // Segundo check-in (debe fallar por la validación única que agregamos)
        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
                         ->postJson('/api/v1/attendance/records', $checkInData);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['athlete_id']);
    }
}
