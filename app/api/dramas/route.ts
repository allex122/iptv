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
          videoUrl: "https://www.youtube.com/embed/eRsGyueVLvQ?start=0&end=296&autoplay=1",
          isFree: true
        },
        {
          ep: 2,
          title: "Part 2: The Journey",
          videoUrl: "https://www.youtube.com/embed/eRsGyueVLvQ?start=296&end=592&autoplay=1",
          isFree: true
        },
        {
          ep: 3,
          title: "Part 3: The Confrontation",
          videoUrl: "https://www.youtube.com/embed/eRsGyueVLvQ?start=592&autoplay=1",
          isFree: false,
          coinCost: 5
        }
      ]
    },
    {
      id: "drama-tears-02",
      title: "Tears of Steel (Sci-Fi Short)",
      originalCreator: "Blender Foundation (CC-BY)",
      coverUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&auto=format&fit=crop",
      description: "A sci-fi film exploring a futuristic battle in Amsterdam where a group of scientists tries to rescue the world from giant robots.",
      episodes: [
        {
          ep: 1,
          title: "Part 1: The Amsterdam Uprising",
          videoUrl: "https://www.youtube.com/embed/OHOpb2fS-cM?start=0&end=244&autoplay=1",
          isFree: true
        },
        {
          ep: 2,
          title: "Part 2: The Giant Machine",
          videoUrl: "https://www.youtube.com/embed/OHOpb2fS-cM?start=244&end=488&autoplay=1",
          isFree: true
        },
        {
          ep: 3,
          title: "Part 3: The Final Hope",
          videoUrl: "https://www.youtube.com/embed/OHOpb2fS-cM?start=488&autoplay=1",
          isFree: false,
          coinCost: 5
        }
      ]
    }
  ];

  return NextResponse.json(fallbackDramas);
}
