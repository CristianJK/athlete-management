<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'athlete_id' => 'required|exists:athletes,id',
        ]);
        $payments = Payment::where('athlete_id', $request->athlete_id)->get();
        return response()->json($payments);
    }
    public function store(Request $request)
    {
        $request->validate([
            'athlete_id' => 'required|exists:athletes,id',
            'amount' => 'required|numeric',
            'payment_method' => 'required|string',
        ]);
        $payment = Payment::create($request->all());
        return response()->json($payment, 201);
    }
    public function show(Request $request, $id)
    {
        $request->validate([
            'id' => 'required|exists:payments,id',
        ]);
        $payment = Payment::find($id);
        return response()->json($payment);
    }
    public function generateReceipt(Request $request, $id)
    {
        $request->validate([
            'id' => 'required|exists:payments,id',
        ]);
        $payment = Payment::find($id);
        return response()->json($payment);
    }
}
