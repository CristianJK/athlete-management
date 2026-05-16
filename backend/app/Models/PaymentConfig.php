<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['club_id', 'group_name', 'sport', 'monthly_fee'])]
class PaymentConfig extends Model
{
    protected $casts = [
        'monthly_fee' => 'decimal:2',
    ];

    public function club(): BelongsTo
    {
        return $this->belongsTo(Club::class);
    }
}
