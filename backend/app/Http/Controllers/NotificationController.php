<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    //`index`, `markAsRead`, `markAllAsRead`
    public function index(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)->get();
        return response()->json($notifications);
    }
    public function markAsRead(Request $request, $id)
    {
        $notification = Notification::findOrFail($id);
        $notification->read_at = now();
        $notification->save();
        return response()->json($notification);
    }
    public function markAllAsRead(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)->get();
        foreach ($notifications as $notification) {
            $notification->read_at = now();
            $notification->save();
        }
        return response()->json($notifications);
    }
}
