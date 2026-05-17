<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'user_id',
    'club_id',
    'document_type',
    'document_number',
    'birthdate',
    'gender',
    'address',
    'phone',
    'emergency_contact_name',
    'emergency_contact_phone',
    'emergency_contact_relationship',
    'sport',
    'group_name',
    'status',
    'joined_at',
])]
class Athlete extends Model
{
    use HasFactory;
    protected $casts = [
        'birthdate' => 'date',
        'joined_at' => 'date',
        'emergency_contact_name' => 'encrypted',
        'emergency_contact_phone' => 'encrypted',
        'emergency_contact_relationship' => 'encrypted',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function club(): BelongsTo
    {
        return $this->belongsTo(Club::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class);
    }

    public function habeasDataConsent(): HasOne
    {
        return $this->hasOne(HabeasDataConsent::class);
    }

    public function eventAttendees(): HasMany
    {
        return $this->hasMany(EventAttendee::class);
    }
}
