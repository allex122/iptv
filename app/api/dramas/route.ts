import { NextResponse } from 'next/server';

export async function GET() {
  const microDramas = [
    {
      id: "drama-thriller-01",
      title: "The Midnight Betrayal",
      originalCreator: "IndieShorts (CC-BY)",
      coverUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop",
      description: "A high-stakes thriller following the secrets of a corporate espionage plot. Tensions boil in the dark hours of midnight.",
      episodes: [
        { ep: 1, title: "The Argument", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", isFree: true },
        { ep: 2, title: "The Hidden Truth", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", isFree: true },
        { ep: 3, title: "The Cliffhanger", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", isFree: false, coinCost: 5 }
      ]
    }
  ];
  return NextResponse.json(microDramas);
}
