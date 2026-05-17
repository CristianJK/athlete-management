<?php

namespace Tests\Feature;

use App\Models\Athlete;
use App\Models\AttendanceSession;
use App\Models\Club;
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
    }

    public function test_coach_can_create_attendance_session()
    {
        $token = $this->user->createToken('auth_token')->plainTextToken;

        $sessionData = [
            'club_id' => $this->club->id,
            'name' => 'Sesión de entrenamiento',
            'qr_token' => 'unique-qr-token-abc123',
            'expires_at' => now()->addHour()->toDateTimeString(),
            'group_name' => 'Sub 20',
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/v1/attendance/sessions', $sessionData);

        $response->assertStatus(201)
                 ->assertJsonFragment(['name' => 'Sesión de entrenamiento']);
    }

    public function test_athlete_cannot_checkin_twice_in_same_session()
    {
        $token = $this->user->createToken('auth_token')->plainTextToken;
        $athlete = Athlete::factory()->create(['club_id' => $this->club->id]);

        // Creamos la sesión directamente en la BD
        $session = AttendanceSession::create([
            'club_id' => $this->club->id,
            'coach_id' => $this->user->id,
            'name' => 'Sesión test',
            'qr_token' => 'unique-qr-test-xyz',
            'expires_at' => now()->addHour(),
        ]);

        $checkInData = [
            'session_id' => $session->id,
            'athlete_id' => $athlete->id,
            'qr_token' => 'unique-qr-test-xyz',
        ];

        // Primer check-in (debe pasar)
        $this->withHeaders(['Authorization' => 'Bearer ' . $token])
             ->postJson('/api/v1/attendance/records', $checkInData)
             ->assertStatus(201);

        // Segundo check-in (debe fallar con 422)
        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
                         ->postJson('/api/v1/attendance/records', $checkInData);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['athlete_id']);
    }
}
