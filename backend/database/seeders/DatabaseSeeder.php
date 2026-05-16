<?php

namespace Database\Seeders;

use App\Models\Athlete;
use App\Models\Club;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Crear el Club Principal
        $club = Club::factory()->create([
            'name' => 'Club Deportivo Antigravity',
        ]);

        // 2. Crear Usuarios con Roles específicos
        
        // Administrador
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@antigravity.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Entrenadores (Coaches)
        $coach1 = User::factory()->create([
            'name' => 'Coach Principal',
            'email' => 'coach1@antigravity.com',
            'role' => 'coach',
        ]);

        User::factory()->create([
            'name' => 'Coach Asistente',
            'email' => 'coach2@antigravity.com',
            'role' => 'coach',
        ]);

        // 3. Crear Atletas y sus registros relacionados
        // Vamos a crear 20 atletas vinculados al club
        Athlete::factory()
            ->count(20)
            ->create([
                'club_id' => $club->id,
            ])
            ->each(function ($athlete) use ($coach1) {
                // Crear un pago para cada atleta
                Payment::factory()->create([
                    'athlete_id' => $athlete->id,
                    'registered_by' => $coach1->id,
                ]);
            });

        $this->command->info('Database seeded successfully!');
        $this->command->info('Admin: admin@antigravity.com / password');
        $this->command->info('Coach: coach1@antigravity.com / password');
    }
}
