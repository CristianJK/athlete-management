<?php

namespace App\Http\Controllers;

use App\Models\Club;
use Illuminate\Http\Request;

class ClubController extends Controller
{
    //`show`,`store`, `update`
    public function show(Request $request)
    {
        $club = Club::where('user_id', $request->user()->id)->first();
        return response()->json($club);
    }
    public function store(Request $request)
    {
        #'name', 'logo', 'address', 'phone', 'email'
        $request->validate([
            'name' => 'required',
            'email' => 'required',
            'phone' => 'required',
            'address' => 'required',
        ]);
        $club = Club::create($request->all());
        return response()->json($club);
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required',
            'phone' => 'required',
            'address' => 'required',
        ]);
        $club = Club::findOrFail($id);
        $club->update($request->all());
        return response()->json($club);
    }
}
