<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AttendanceRecordController extends Controller
{
    //`checkIn` (por QR), `manualCheckIn`, `index`
    public function checkIn(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:attendance_sessions,id',
            'athlete_id' => [
                'required',
                'exists:athletes,id',
                Rule::unique('attendance_records')->where(function ($query) use ($request) {
                    return $query->where('session_id', $request->session_id);
                }),
            ],
            'qr_token' => 'required|string',
        ], [
            'athlete_id.unique' => 'El deportista ya se encuentra registrado en esta sesión.',
        ]);

        $attendanceRecord = AttendanceRecord::create($request->all());

        return response()->json($attendanceRecord, 201);
    }
    public function manualCheckIn(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:attendance_sessions,id',
            'athlete_id' => [
                'required',
                'exists:athletes,id',
                Rule::unique('attendance_records')->where(function ($query) use ($request) {
                    return $query->where('session_id', $request->session_id);
                }),
            ],
        ], [
            'athlete_id.unique' => 'El deportista ya se encuentra registrado en esta sesión.',
        ]);

        $attendanceRecord = AttendanceRecord::create($request->all());

        return response()->json($attendanceRecord, 201);
    }
    public function index(Request $request)
    {
        $attendanceRecords = AttendanceRecord::where('session_id', $request->session_id)->get();
        return response()->json($attendanceRecords);
    }
}
