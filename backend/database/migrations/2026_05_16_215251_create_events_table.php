<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('club_id')->constrained()->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['training', 'tournament', 'meeting', 'other'])->default('training');
            $table->string('location')->nullable();
            $table->timestamp('starts_at');
            $table->timestamp('ends_at');
            $table->integer('max_attendees')->nullable();
            $table->enum('status', ['upcoming', 'ongoing', 'finished', 'cancelled'])->default('upcoming');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
