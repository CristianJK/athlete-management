<?php

namespace App\Http\Controllers;

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
        // Assuming the user is authenticated via Sanctum
        $user = $request->user();
        $user->habeas_data_accepted = true;
        $user->save();

        return response()->json([
            'message' => 'Consentimiento aceptado',
            'user' => $user,
        ]);
    }

    public function revokeConsent(Request $request)
    {
        // Assuming the user is authenticated via Sanctum
        $user = $request->user();
        $user->habeas_data_accepted = false;
        $user->save();

        return response()->json([
            'message' => 'Consentimiento revocado',
            'user' => $user,
        ]);
    }

    public function getConsentStatus(Request $request)
    {
        return response()->json([
            'habeas_data_accepted' => $request->user()->habeas_data_accepted,
        ]);
    }
}
