from PIL import Image, ImageDraw
import os

src_path = r'C:\Users\doras\.gemini\antigravity\brain\e8b917e5-9cbd-4dfc-8e45-a2cfc13881a1\.user_uploaded\media_1795076006633_51fa23f3.jpg'
src_img = Image.open(src_path).convert('RGBA')

# Densities for Android
densities = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
}

base_res_dir = r'd:\mahilo\android\app\src\main\res'

for folder, size in densities.items():
    folder_path = os.path.join(base_res_dir, folder)
    os.makedirs(folder_path, exist_ok=True)
    
    # Square launcher
    sq = src_img.resize((size, size), Image.Resampling.LANCZOS)
    sq.save(os.path.join(folder_path, 'ic_launcher.webp'), 'WEBP')
    sq.save(os.path.join(folder_path, 'ic_launcher.png'), 'PNG')
    
    # Round launcher (masked circle with white background)
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size - 1, size - 1), fill=255)
    
    round_img = Image.new('RGBA', (size, size), (255, 255, 255, 255))
    round_img.paste(sq, (0, 0), mask=mask)
    round_img.save(os.path.join(folder_path, 'ic_launcher_round.webp'), 'WEBP')
    round_img.save(os.path.join(folder_path, 'ic_launcher_round.png'), 'PNG')
    print(f'Generated icons for {folder} ({size}x{size})')

# Web Favicons & Icons
web_pub = r'd:\mahilo\frontend\public'
favicon_32 = src_img.resize((32, 32), Image.Resampling.LANCZOS)
favicon_32.save(os.path.join(web_pub, 'favicon.ico'))
favicon_32.save(os.path.join(web_pub, 'favicon.png'))

favicon_192 = src_img.resize((192, 192), Image.Resampling.LANCZOS)
favicon_192.save(os.path.join(web_pub, 'logo-square.png'))

print('Generated web favicons and logos successfully!')
