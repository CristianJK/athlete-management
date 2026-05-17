<?php

namespace App\Http\Controllers;

use App\Models\AttendanceSession;
use Illuminate\Http\Request;

class AttendanceSessionController extends Controller
{
    // `create`, `show`, `close`

    public function create(Request $request)
    {
        $request->validate([
            'club_id' => 'required|exists:clubs,id',
            'event_id' => 'required|exists:events,id',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'status' => 'required|string',
        ]);

        $attendanceSession = AttendanceSession::create($request->all());

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
