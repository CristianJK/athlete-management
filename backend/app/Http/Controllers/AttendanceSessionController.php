<?php

namespace App\Http\Controllers;

use App\Models\AttendanceSession;
use Illuminate\Http\Request;

class AttendanceSessionController extends Controller
{
    public function create(Request $request)
    {
        $data = $request->validate([
            'club_id' => 'required|exists:clubs,id',
            'name' => 'required|string',
            'qr_token' => 'required|string|unique:attendance_sessions,qr_token',
            'expires_at' => 'required|date',
            'group_name' => 'nullable|string',
        ]);

        $attendanceSession = AttendanceSession::create(array_merge($data, [
            'coach_id' => $request->user()->id,
        ]));

        return response()->json($attendanceSession, 201);
    }
    public function show(Request $request, AttendanceSession $attendanceSession)
    {
        return response()->json($attendanceSession);
    }
    public function close(Request $request, AttendanceSession $attendanceSession)
    {
        $attendanceSession->status = 'closed';
        $attendanceSession->save();
        return response()->json($attendanceSession);
    }
}
