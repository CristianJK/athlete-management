<?php

namespace App\Http\Controllers;

use App\Models\Athlete;
use App\Models\HabeasDataConsent;
use Illuminate\Http\Request;

class HabeasDataController extends Controller
{
    //`showPolicy`, `acceptConsent`, `revokeConsent`, `getConsentStatus`

    public function showPolicy()
    {
        // Return the habeas data policy text
        return response()->json([
            'policy' => env('HABEAS_DATA_POLICY', 'No policy found'),
        ]);
    }
    public function acceptConsent(Request $request)
    {
        $request->validate([
            'athlete_id' => 'required|exists:athletes,id'
        ]);

        $athlete = Athlete::findOrFail($request->athlete_id);

        // Verificamos autorización (debería existir una política, pero lo hacemos rápido)
        if ($request->user()->role === 'athlete' && $request->user()->id !== $athlete->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $consent = HabeasDataConsent::updateOrCreate(
            ['athlete_id' => $athlete->id],
            [
                'accepted_at' => now(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'revoked_at' => null
            ]
        );

        return response()->json([
            'message' => 'Consentimiento aceptado',
            'consent' => $consent,
        ]);
    }

    public function revokeConsent(Request $request, Athlete $athlete)
    {
        if ($request->user()->role === 'athlete' && $request->user()->id !== $athlete->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $consent = HabeasDataConsent::where('athlete_id', $athlete->id)->first();
        if ($consent) {
            $consent->revoked_at = now();
            $consent->save();
        }

        return response()->json([
            'message' => 'Consentimiento revocado',
            'consent' => $consent,
        ]);
    }

    public function getConsentStatus(Request $request, Athlete $athlete)
    {
        if ($request->user()->role === 'athlete' && $request->user()->id !== $athlete->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $consent = HabeasDataConsent::where('athlete_id', $athlete->id)->first();

        return response()->json([
            'has_consent' => $consent && $consent->accepted_at && !$consent->revoked_at,
            'details' => $consent
        ]);
    }
}
