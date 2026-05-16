<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'club_id',
    'created_by',
    'title',
    'description',
    'type',
    'location',
    'starts_at',
    'ends_at',
    'max_attendees',
    'status',
])]
class Event extends Model
{
    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'max_attendees' => 'integer',
    ];

    public function club(): BelongsTo
    {
        return $this->belongsTo(Club::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function eventAttendees(): HasMany
    {
        return $this->hasMany(EventAttendee::class);
    }
}
