<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'logo', 'address', 'phone', 'email'])]
class Club extends Model
{
    use HasFactory;
    public function athletes(): HasMany
    {
        return $this->hasMany(Athlete::class);
    }

    public function attendanceSessions(): HasMany
    {
        return $this->hasMany(AttendanceSession::class);
    }

    public function paymentConfigs(): HasMany
    {
        return $this->hasMany(PaymentConfig::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }
}
