import os
import json
import yt_dlp

PROCESSED_LOG = "processed_dramas.json"

def load_processed_ids():
    if os.path.exists(PROCESSED_LOG):
        try:
            with open(PROCESSED_LOG, 'r') as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_processed_id(video_id):
    processed_ids = load_processed_ids()
    if video_id not in processed_ids:
        processed_ids.append(video_id)
        try:
            with open(PROCESSED_LOG, 'w') as f:
                json.dump(processed_ids, f, indent=4)
        except Exception as e:
            print(f"Error saving processed ID: {e}")

def main():
    search_keywords = [
        "thriller short film", 
        "romantic drama short film", 
        "indie drama short",
        "suspense short movie"
    ]
    
    already_processed = load_processed_ids()
    
    # Load existing dramas in public/dramas.json to append to them
    dramas_path = "public/dramas.json"
    dramas = []
    if os.path.exists(dramas_path):
        try:
            with open(dramas_path, 'r', encoding='utf-8') as f:
                dramas = json.load(f)
        except Exception:
            pass

    existing_drama_ids = {d['id'] for d in dramas}
    
    print("🚀 Starting Bulk AI Drama Pipeline...")
    new_count = 0

    for keyword in search_keywords:
        print(f"🔍 Searching for Creative Commons videos for: {keyword}")
        
        ydl_opts = {
            'default_search': 'ytsearch10',  # Searches up to 10 videos per keyword
            'quiet': True,
            'match_filter': 'license = "Creative Commons Attribution license (reuse allowed)" & duration >= 600 & duration <= 1800',
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            try:
                search_results = ydl.extract_info(f"{keyword}", download=False)
                entries = []
                if 'entries' in search_results:
                    entries = search_results['entries']
                else:
                    entries = [search_results]

                for video in entries:
                    if not video:
                        continue
                        
                    video_id = video.get('id')
                    video_title = video.get('title', 'Unknown Title')
                    uploader = video.get('uploader', 'Indie Creator')
                    thumbnail = video.get('thumbnail') or f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
                    description = video.get('description', '')
                    if description:
                        description = description[:250] + "..."
                    else:
                        description = f"A short drama by {uploader} released under Creative Commons."

                    duration = video.get('duration', 0)
                    if not duration:
                        continue
                    
                    # Duplicate check: Skip if already processed or already in public/dramas.json
                    drama_id = f"drama-{video_id}"
                    if video_id in already_processed or drama_id in existing_drama_ids:
                        print(f"⏭️ Skipping already processed video: {video_title}")
                        continue
                        
                    print(f"📥 New Drama Found: {video_title} | Starting Processing...")
                    
                    # Split the video duration into 3 virtual episodes
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
                        "id": drama_id,
                        "title": video_title,
                        "originalCreator": f"{uploader} (CC-BY)",
                        "coverUrl": thumbnail,
                        "description": description,
                        "episodes": episodes
                    })
                    
                    # Save ID to processed logs
                    save_processed_id(video_id)
                    existing_drama_ids.add(drama_id)
                    new_count += 1
                    print(f"✅ Successfully created micro-dramas for: {video_title}")
                    
            except Exception as e:
                print(f"❌ Error searching for keyword {keyword}: {str(e)}")
                continue

    # Ensure Sintel and Tears of Steel remain loaded if the list is completely empty
    if not dramas:
        print("Writing initial default Creative Commons movies to database...")
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

    # Save finalized database back to public directory
    os.makedirs("public", exist_ok=True)
    try:
        with open(dramas_path, "w", encoding="utf-8") as f:
            json.dump(dramas, f, indent=2, ensure_ascii=False)
        print(f"🎉 Bulk processing complete! Added {new_count} new entries. Total in database: {len(dramas)}")
    except Exception as e:
        print(f"Error saving dramas database: {e}")

if __name__ == "__main__":
    main()
