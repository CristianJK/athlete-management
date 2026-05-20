<?php

use App\Http\Controllers\AthleteController;
use App\Http\Controllers\AttendanceRecordController;
use App\Http\Controllers\AttendanceSessionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClubController;
use App\Http\Controllers\EventAttendeeController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\HabeasDataController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaymentConfigController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//Rutas para la autenticación
Route::prefix('v1/auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
        Route::post('/refresh', [AuthController::class, 'refreshToken'])->name('refresh');
        Route::get('/me', [AuthController::class, 'me'])->name('me');
    });
});
//Rutas para el Habeas Data
Route::prefix('v1/habeas-data')->group(function () {
    Route::get('/policy', [HabeasDataController::class, 'showPolicy'])->name('habeas-data.policy');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/consent', [HabeasDataController::class, 'acceptConsent'])->name('habeas-data.accept');
        Route::delete('/consent/{athlete}', [HabeasDataController::class, 'revokeConsent'])->name('habeas-data.revoke');
        Route::get('/consent/{athlete}', [HabeasDataController::class, 'getConsentStatus'])->name('habeas-data.status');
    });
});
//Rutas para los atletas
Route::prefix('v1/athletes')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/', [AthleteController::class, 'index'])->name('athletes.index');
        Route::post('/', [AthleteController::class, 'store'])->name('athletes.store');
        Route::get('/{athlete}', [AthleteController::class, 'show'])->name('athletes.show');
        Route::put('/{athlete}', [AthleteController::class, 'update'])->name('athletes.update');
        Route::delete('/{athlete}', [AthleteController::class, 'destroy'])->name('athletes.destroy');
        Route::post('/{athlete}/change-status', [AthleteController::class, 'changeStatus'])->name('athletes.changeStatus');
    });
});

//Rutas para las sesiones de asistencia
Route::prefix('v1/attendance/sessions')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [AttendanceSessionController::class, 'create'])->name('attendance.sessions.create');
        Route::get('/{attendanceSession}', [AttendanceSessionController::class, 'show'])->name('attendance.sessions.show');
        Route::post('/{attendanceSession}/close', [AttendanceSessionController::class, 'close'])->name('attendance.sessions.close');
    });
});

//Rutas para los registros de asistencia
Route::prefix('v1/attendance/records')
    ->middleware('auth:sanctum')
    ->group(function () {
        Route::post('/', [AttendanceRecordController::class, 'checkIn'])->name('attendance.records.checkIn');
        Route::post('/manual', [AttendanceRecordController::class, 'manualCheckIn'])->name('attendance.records.manualCheckIn');
        Route::get('/', [AttendanceRecordController::class, 'index'])->name('attendance.records.index');
    });

//Rutas para la configuración de pagos
Route::prefix('v1/payments/config')
    ->middleware('auth:sanctum')
    ->group(function () {
        Route::get('/', [PaymentConfigController::class, 'index'])->name('payments.config.index');
        Route::post('/', [PaymentConfigController::class, 'store'])->name('payments.config.store');
        Route::put('/{paymentConfig}', [PaymentConfigController::class, 'update'])->name('payments.config.update');
    });

//Rutas para los pagos
Route::prefix('v1/payments')
    ->middleware('auth:sanctum')
    ->group(function () {
        Route::get('/', [PaymentController::class, 'index'])->name('payments.index');
        Route::post('/', [PaymentController::class, 'store'])->name('payments.store');
        Route::get('/{payment}', [PaymentController::class, 'show'])->name('payments.show');
        Route::get('/{payment}/receipt', [PaymentController::class, 'generateReceipt'])->name('payments.generateReceipt');
    });

//Rutas para los eventos
Route::prefix('v1/events')
    ->middleware('auth:sanctum')
    ->group(function () {
        Route::get('/', [EventController::class, 'index'])->name('events.index');
        Route::post('/', [EventController::class, 'store'])->name('events.store');
        Route::get('/{event}', [EventController::class, 'show'])->name('events.show');
        Route::put('/{event}', [EventController::class, 'update'])->name('events.update');
        Route::delete('/{event}', [EventController::class, 'destroy'])->name('events.destroy');
        Route::post('/{event}/change-status', [EventController::class, 'changeStatus'])->name('events.changeStatus');
    });

//Rutas para los asistentes a eventos
Route::prefix('v1/events/attendees')
    ->middleware('auth:sanctum')
    ->group(function () {
        Route::post('/', [EventAttendeeController::class, 'rsvp'])->name('events.attendees.rsvp');
        Route::get('/', [EventAttendeeController::class, 'index'])->name('events.attendees.index');
    });

//Rutas para las notificaciones
Route::prefix('v1/notifications')
    ->middleware('auth:sanctum')
    ->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('notifications.index');
        Route::post('/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
        Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');
    });

//Rutas para los clubes
Route::prefix('v1/clubs')
    ->middleware('auth:sanctum')
    ->group(function () {
        Route::get('/', [ClubController::class, 'index'])->name('clubs.index');
        Route::post('/', [ClubController::class, 'store'])->name('clubs.store');
        Route::get('/{club}', [ClubController::class, 'show'])->name('clubs.show');
        Route::put('/{club}', [ClubController::class, 'update'])->name('clubs.update');
    });

//Rutas para los usuarios
Route::prefix('v1/users')
    ->middleware('auth:sanctum')
    ->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('users.index');
        Route::post('/', [UserController::class, 'store'])->name('users.store');
        Route::get('/{user}', [UserController::class, 'show'])->name('users.show');
        Route::put('/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });

Route::post('/v1/auth/setup', function (Request $request) {
    $user = \App\Models\User::create([
        'name' => 'Administrador',
        'email' => 'admin@clubapp.com',
        'password' => bcrypt('password123'),
        'role' => 'admin',
        'club_id' => null,
    ]);
    return response()->json(['message' => 'Usuario creado', 'user' => $user]);
});