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
        $data = $request->validate([
            'club_id' => 'required|exists:clubs,id',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'starts_at' => 'required|date',
            'ends_at' => 'required|date|after:starts_at',
            'location' => 'nullable|string',
            'status' => 'in:upcoming,ongoing,finished,cancelled',
            'type' => 'required|in:training,tournament,meeting,other',
            'max_attendees' => 'nullable|integer',
        ]);

        $event = Event::create(array_merge($data, [
            'created_by' => $request->user()->id,
        ]));

        return response()->json($event, 201);
    }
    public function show(Request $request, Event $event)
    {
        return response()->json($event);
    }
    public function update(Request $request, Event $event)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'starts_at' => 'required|date',
            'ends_at' => 'required|date|after:starts_at',
            'location' => 'nullable|string',
            'status' => 'in:upcoming,ongoing,finished,cancelled',
            'type' => 'required|in:training,tournament,meeting,other',
            'max_attendees' => 'nullable|integer',
        ]);

        $event->update($data);

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
