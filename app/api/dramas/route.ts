import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const jsonPath = path.join(process.cwd(), 'public', 'dramas.json');
    
    // Check if the Python script has generated the dynamic playlist
    if (fs.existsSync(jsonPath)) {
      const fileContents = fs.readFileSync(jsonPath, 'utf8');
      const dramas = JSON.parse(fileContents);
      return NextResponse.json(dramas);
    }
  } catch (error) {
    console.error("Failed to read public/dramas.json, using fallback mock:", error);
  }

  // Fallback default CC-BY dramas if the python script hasn't generated the JSON file yet
  const fallbackDramas = [
    {
      id: "drama-sintel-01",
      title: "Sintel (Creative Commons Cinema)",
      originalCreator: "Blender Foundation (CC-BY)",
      coverUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop",
      description: "The story of a lonely young woman who searches for her companion dragon in a beautiful, fantasy world.",
      episodes: [
        {
          ep: 1,
          title: "Part 1: The Discovery",
          videoUrl: "https://www.youtube.com/embed/eRsGy9On1z0?start=0&end=200&autoplay=1",
          isFree: true
        },
        {
          ep: 2,
          title: "Part 2: The Journey",
          videoUrl: "https://www.youtube.com/embed/eRsGy9On1z0?start=200&end=400&autoplay=1",
          isFree: true
        },
        {
          ep: 3,
          title: "Part 3: The Confrontation",
          videoUrl: "https://www.youtube.com/embed/eRsGy9On1z0?start=400&autoplay=1",
          isFree: false,
          coinCost: 5
        }
      ]
    }
  ];

  return NextResponse.json(fallbackDramas);
}
