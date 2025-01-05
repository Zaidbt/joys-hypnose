import { createCanvas, loadImage, registerFont } from 'canvas';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Create canvas with dimensions optimal for an ebook cover (600x900)
    const canvas = createCanvas(800, 1200);
    const ctx = canvas.getContext('2d');

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 1200);
    gradient.addColorStop(0, '#fce7f3');   // rose-100
    gradient.addColorStop(1, '#fff1f2');   // rose-50
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 1200);

    // Add decorative elements
    ctx.strokeStyle = '#fb7185';  // rose-400
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 100);
    ctx.lineTo(750, 100);
    ctx.stroke();

    // Add title
    ctx.fillStyle = '#881337';  // rose-900
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("L'Hypnose", 400, 400);
    ctx.fillText('Transformative', 400, 460);

    // Add subtitle
    ctx.fillStyle = '#9f1239';  // rose-800
    ctx.font = '32px Arial';
    ctx.fillText('Un Chemin vers la Guérison', 400, 540);

    // Add decorative line
    ctx.strokeStyle = '#fb7185';  // rose-400
    ctx.beginPath();
    ctx.moveTo(50, 1100);
    ctx.lineTo(750, 1100);
    ctx.stroke();

    // Add author
    ctx.fillStyle = '#881337';  // rose-900
    ctx.font = '36px Arial';
    ctx.fillText("Joy's Hypnose", 400, 1050);

    // Save the image
    const buffer = canvas.toBuffer('image/jpeg');
    const publicDir = path.join(process.cwd(), 'public');
    const imagesDir = path.join(publicDir, 'images');
    
    // Create directories if they don't exist
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir);
    }

    fs.writeFileSync(path.join(imagesDir, 'epub-cover.jpg'), buffer);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error generating cover:', error);
    return NextResponse.json({ error: 'Failed to generate cover' }, { status: 500 });
  }
} 