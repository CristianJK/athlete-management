<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    //`index`, `store`, `show`, `update`, `destroy` (soft delete), `changeStatus`
    public function index(Request $request)
    {
        //Obtener los eventos del club al que pertenece el usuario autenticado
        $events = Event::where('club_id', $request->user()->club_id)->get();
        return response()->json($events);
    }
    public function store(Request $request)
    {
        $request->validate([
            'club_id' => 'required|exists:clubs,id',
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string',
            'description' => 'required|string',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'location' => 'required|string',
            'status' => 'required|string',
            'type' => 'required|string',
            'capacity' => 'required|integer',
        ]);

        $event = Event::create($request->all());

        return response()->json($event, 201);
    }
    public function show(Request $request, Event $event)
    {
        return response()->json($event);
    }
    public function update(Request $request, Event $event)
    {
        $request->validate([
            'club_id' => 'required|exists:clubs,id',
            'name' => 'required|string',
            'description' => 'required|string',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'location' => 'required|string',
            'status' => 'required|string',
            'type' => 'required|string',
            'capacity' => 'required|integer',
        ]);

        $event->update($request->all());

        return response()->json($event);
    }
    public function destroy(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $event->delete();
        return response()->json($event);//falta que sea soft delete
    }
    public function changeStatus(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $event->status = $request->status;
        $event->save();
        return response()->json($event);
    }
}
