<?php

namespace App\Http\Controllers;

use App\Models\Athlete;
use Illuminate\Http\Request;

class AthleteController extends Controller
{
    //`index`, `store`, `show`, `update`, `destroy` (soft delete), `changeStatus`
    public function index(Request $request)
    {
        //Obtener los atletas del club al que pertenece el usuario autenticado
        $athletes = Athlete::where('club_id', $request->user()->club_id)->get();
        return response()->json($athletes);
    }
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'club_id' => 'required|exists:clubs,id',
            'document_type' => 'required|string',
            'document_number' => 'required|string',
            'birthdate' => 'required|date',
            'gender' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|string',
            'emergency_contact_name' => 'required|string',
            'emergency_contact_phone' => 'required|string',
            'emergency_contact_relationship' => 'required|string',
            'sport' => 'required|string',
            'group_name' => 'required|string',
            'status' => 'required|string',
            'joined_at' => 'required|date',
        ]);

        $athlete = Athlete::create($request->all());

        return response()->json($athlete, 201);
    }
    public function show(Request $request, Athlete $athlete)
    {
        return response()->json($athlete);
    }
    public function update(Request $request, Athlete $athlete)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'club_id' => 'required|exists:clubs,id',
            'document_type' => 'required|string',
            'document_number' => 'required|string',
            'birthdate' => 'required|date',
            'gender' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|string',
            'emergency_contact_name' => 'required|string',
            'emergency_contact_phone' => 'required|string',
            'emergency_contact_relationship' => 'required|string',
            'sport' => 'required|string',
            'group_name' => 'required|string',
            'status' => 'required|string',
            'joined_at' => 'required|date',
        ]);

        $athlete->update($request->all());

        return response()->json($athlete);
    }
    public function destroy(Request $request, $id)
    {
        $athlete = Athlete::findOrFail($id);
        $athlete->delete();
        return response()->json($athlete);//falta que sea soft delete
    }
    public function changeStatus(Request $request, $id)
    {
        $athlete = Athlete::findOrFail($id);
        $athlete->status = $request->status;
        $athlete->save();
        return response()->json($athlete);
    }
}
