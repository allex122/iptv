import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Database config file path
const configPath = path.join(process.cwd(), 'data', 'siteConfig.json');

// 1. Get current configuration
export async function GET() {
  try {
    if (!fs.existsSync(configPath)) {
      return NextResponse.json({ ads: {}, streams: [] });
    }
    const fileData = fs.readFileSync(configPath, 'utf8');
    return NextResponse.json(JSON.parse(fileData));
  } catch (error) {
    return NextResponse.json({ error: "Failed to load configuration" }, { status: 500 });
  }
}

// 2. Save new configuration from Admin Dashboard
export async function POST(request: Request) {
  try {
    const newData = await request.json();
    
    // Create directory if not exists
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write new configurations to file
    fs.writeFileSync(configPath, JSON.stringify(newData, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, message: "Dashboard updated successfully!" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save configuration" }, { status: 500 });
  }
}
