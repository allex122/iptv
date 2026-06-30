import os
import json
import yt_dlp

def search_cc_dramas(keyword):
    ydl_opts = {
        'default_search': 'ytsearch10',
        'quiet': True,
        # Filters for Creative Commons licensing, and durations between 10 and 30 minutes
        'match_filter': 'license = "Creative Commons Attribution license (reuse allowed)" & duration >= 600 & duration <= 1800',
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            info = ydl.extract_info(f"{keyword}", download=False)
            if 'entries' in info:
                return info['entries']
            return [info]
        except Exception as e:
            print(f"Error fetching dramas: {e}")
            return []

def main():
    print("Searching YouTube for Creative Commons dramas...")
    raw_entries = search_cc_dramas("thriller short film")
    
    dramas = []
    for entry in raw_entries:
        if not entry:
            print("Skipping empty entry.")
            continue
        
        video_id = entry.get('id')
        title = entry.get('title', 'Unknown Title')
        uploader = entry.get('uploader', 'Indie Creator')
        thumbnail = entry.get('thumbnail') or f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
        description = entry.get('description', '')
        if description:
            description = description[:250] + "..."
        else:
            description = f"A thriller short film by {uploader} released under Creative Commons."
            
        duration = entry.get('duration', 0)
        if not duration:
            continue
            
        # Split the video duration into 3 parts (episodes)
        chunk = duration // 3
        
        episodes = [
            {
                "ep": 1,
                "title": "Part 1: The Inciting Incident",
                "videoUrl": f"https://www.youtube.com/embed/{video_id}?start=0&end={chunk}&autoplay=1",
                "isFree": True
            },
            {
                "ep": 2,
                "title": "Part 2: Rising Action",
                "videoUrl": f"https://www.youtube.com/embed/{video_id}?start={chunk}&end={chunk*2}&autoplay=1",
                "isFree": True
            },
            {
                "ep": 3,
                "title": "Part 3: The Climax",
                "videoUrl": f"https://www.youtube.com/embed/{video_id}?start={chunk*2}&autoplay=1",
                "isFree": False,
                "coinCost": 5
            }
        ]
        
        dramas.append({
            "id": f"drama-{video_id}",
            "title": title,
            "originalCreator": f"{uploader} (CC-BY)",
            "coverUrl": thumbnail,
            "description": description,
            "episodes": episodes
        })
        
    # If no search matches (or due to API limits/quiet mode), output robust mock CC dramas
    if not dramas:
        print("No new videos matched filters. Writing fallback Creative Commons content...")
        dramas = [
            {
                "id": "drama-sintel-01",
                "title": "Sintel (Creative Commons Cinema)",
                "originalCreator": "Blender Foundation (CC-BY)",
                "coverUrl": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop",
                "description": "The story of a lonely young woman who searches for her companion dragon in a beautiful, fantasy world.",
                "episodes": [
                    {
                        "ep": 1,
                        "title": "Part 1: The Discovery",
                        "videoUrl": "https://www.youtube.com/embed/eRsGyueVLvQ?start=0&end=296&autoplay=1",
                        "isFree": True
                    },
                    {
                        "ep": 2,
                        "title": "Part 2: The Journey",
                        "videoUrl": "https://www.youtube.com/embed/eRsGyueVLvQ?start=296&end=592&autoplay=1",
                        "isFree": True
                    },
                    {
                        "ep": 3,
                        "title": "Part 3: The Confrontation",
                        "videoUrl": "https://www.youtube.com/embed/eRsGyueVLvQ?start=592&autoplay=1",
                        "isFree": False,
                        "coinCost": 5
                    }
                ]
            },
            {
                "id": "drama-tears-02",
                "title": "Tears of Steel (Sci-Fi Short)",
                "originalCreator": "Blender Foundation (CC-BY)",
                "coverUrl": "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&auto=format&fit=crop",
                "description": "A sci-fi film exploring a futuristic battle in Amsterdam where a group of scientists tries to rescue the world from giant robots.",
                "episodes": [
                    {
                        "ep": 1,
                        "title": "Part 1: The Amsterdam Uprising",
                        "videoUrl": "https://www.youtube.com/embed/OHOpb2fS-cM?start=0&end=244&autoplay=1",
                        "isFree": True
                    },
                    {
                        "ep": 2,
                        "title": "Part 2: The Giant Machine",
                        "videoUrl": "https://www.youtube.com/embed/OHOpb2fS-cM?start=244&end=488&autoplay=1",
                        "isFree": True
                    },
                    {
                        "ep": 3,
                        "title": "Part 3: The Final Hope",
                        "videoUrl": "https://www.youtube.com/embed/OHOpb2fS-cM?start=488&autoplay=1",
                        "isFree": False,
                        "coinCost": 5
                    }
                ]
            }
        ]

    # Save to public directory for the Next.js app to load
    os.makedirs("public", exist_ok=True)
    with open("public/dramas.json", "w", encoding="utf-8") as f:
        json.dump(dramas, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully generated public/dramas.json with {len(dramas)} entries!")

if __name__ == "__main__":
    main()
