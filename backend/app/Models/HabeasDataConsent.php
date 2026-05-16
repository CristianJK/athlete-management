<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['athlete_id', 'accepted_at', 'ip_address', 'user_agent', 'revoked_at'])]
class HabeasDataConsent extends Model
{
    protected $casts = [
        'accepted_at' => 'datetime',
        'revoked_at' => 'datetime',
    ];

    public function athlete(): BelongsTo
    {
        return $this->belongsTo(Athlete::class);
    }
}
