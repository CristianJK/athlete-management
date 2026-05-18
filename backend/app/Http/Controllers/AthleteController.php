<?php

namespace App\Http\Controllers;

use App\Models\Athlete;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|max:255',
            'document_type' => 'required|string|max:20',
            'document_number' => 'required|string|max:50',
            'birthdate' => 'required|date',
            'gender' => 'required|string|max:50',
            'address' => 'required|string',
            'phone' => 'required|string',
            'emergency_contact' => 'required|array',
            'emergency_contact.name' => 'required|string|max:255',
            'emergency_contact.phone' => 'required|string',
            'emergency_contact.relationship' => 'required|string|max:100',
            'sport' => 'required|string',
            'group_name' => 'required|string',
        ]);

        $clubId = $request->user()->club_id ?? 1;

        // 1. Crear el usuario asociado
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->document_number), // Clave por defecto es el número de documento
            'role' => 'athlete',
            'club_id' => $clubId,
            'active' => true,
        ]);

        // 2. Crear el deportista vinculando al usuario recién creado
        $athlete = Athlete::create([
            'user_id' => $user->id,
            'club_id' => $clubId,
            'document_type' => $request->document_type,
            'document_number' => $request->document_number,
            'birthdate' => $request->birthdate,
            'gender' => $request->gender,
            'address' => $request->address,
            'phone' => $request->phone,
            'emergency_contact_name' => $request->input('emergency_contact.name'),
            'emergency_contact_phone' => $request->input('emergency_contact.phone'),
            'emergency_contact_relationship' => $request->input('emergency_contact.relationship'),
            'sport' => $request->sport,
            'group_name' => $request->group_name,
            'status' => $request->status ?? 'active',
            'joined_at' => $request->joined_at ?? now()->toDateString(),
        ]);

        return response()->json($athlete->load('user'), 201);
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
