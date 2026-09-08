<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Ad;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Ad::where('is_active', true)->latest()->get(),
        ]);
    }

    public function adminIndex()
    {
        return response()->json([
            'success' => true,
            'data' => Ad::latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:1000'],
        ]);

        $validated['image'] = $request->file('image')->store('ads', 'public');

        $ad = Ad::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ad created successfully.',
            'data' => $ad,
        ], 201);
    }

    public function update(Request $request, Ad $ad)
    {
        $validated = $request->validate([
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:1000'],
        ]);

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($ad->image);
            $validated['image'] = $request->file('image')->store('ads', 'public');
        }

        $ad->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ad updated successfully.',
            'data' => $ad->fresh(),
        ]);
    }

    public function destroy(Ad $ad)
    {
        Storage::disk('public')->delete($ad->image);
        $ad->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ad deleted successfully.',
        ]);
    }
}