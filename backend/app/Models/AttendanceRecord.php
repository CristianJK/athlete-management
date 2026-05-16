<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['session_id', 'athlete_id', 'checked_in_at', 'method'])]
class AttendanceRecord extends Model
{
    protected $casts = [
        'checked_in_at' => 'datetime',
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(AttendanceSession::class, 'session_id');
    }

    public function athlete(): BelongsTo
    {
        return $this->belongsTo(Athlete::class);
    }
}
