<?php

namespace Tests\Feature;

use App\Models\Athlete;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create(['role' => 'admin']);
        $this->athlete = Athlete::factory()->create();
    }

    public function test_can_record_payment()
    {
        $token = $this->user->createToken('auth_token')->plainTextToken;

        $paymentData = [
            'athlete_id' => $this->athlete->id,
            'amount' => 150.00,
            'payment_method' => 'Efectivo',
            'period_month' => 5,
            'period_year' => 2026,
            'status' => 'paid',
            'due_date' => '2026-05-10',
            'registered_by' => $this->user->id,
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/v1/payments', $paymentData);

        $response->assertStatus(201)
                 ->assertJsonFragment(['amount' => "150.00"]);
    }

    public function test_can_list_payments()
    {
        Payment::factory()->count(3)->create([
            'athlete_id' => $this->athlete->id,
            'period_month' => 5,
            'period_year' => 2026,
            'status' => 'paid',
            'due_date' => '2026-05-10',
            'registered_by' => $this->user->id,
        ]);

        $token = $this->user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/v1/payments?athlete_id=' . $this->athlete->id);

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }
}
