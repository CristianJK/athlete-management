<?php

namespace App\Http\Controllers;

use App\Models\PaymentConfig;
use Illuminate\Http\Request;

class PaymentConfigController extends Controller
{
    public function index(Request $request)
    {
        $paymentConfig = PaymentConfig::where('athlete_id', $request->athlete_id)->first();
        return response()->json($paymentConfig);
    }
    public function store(Request $request)
    {
        $request->validate([
            'athlete_id' => 'required|exists:athletes,id',
            'plan_id' => 'required|exists:plans,id',
            'automatic_payment' => 'required|boolean',
        ]);
        $paymentConfig = PaymentConfig::create($request->all());
        return response()->json($paymentConfig, 201);
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'athlete_id' => 'required|exists:athletes,id',
            'plan_id' => 'required|exists:plans,id',
            'automatic_payment' => 'required|boolean',
        ]);
        $paymentConfig = PaymentConfig::find($id);
        $paymentConfig->update($request->all());
        return response()->json($paymentConfig);
    }
}
