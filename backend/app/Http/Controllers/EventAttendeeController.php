<?php

namespace App\Http\Controllers;

use App\Models\EventAttendee;
use Illuminate\Http\Request;

class EventAttendeeController extends Controller
{
    //`rsvp`, `index`
    public function rsvp(Request $request, $id)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'athlete_id' => 'required|exists:athletes,id',
            'status' => 'required|string',
        ]);

        $eventAttendee = EventAttendee::create($request->all());

        return response()->json($eventAttendee, 201);
    }
    public function index(Request $request)
    {
        $eventAttendees = EventAttendee::where('event_id', $request->event_id)->get();
        return response()->json($eventAttendees);
    }
}
