from PIL import Image

src = Image.open(r'C:\Users\doras\.gemini\antigravity\brain\e8b917e5-9cbd-4dfc-8e45-a2cfc13881a1\.user_uploaded\media_1795075903998_7230fd87.jpg').convert('RGBA')

# Crop tightly around content (120, 11, 869, 313) with a 6px breathing room
crop_box = (114, 6, 875, 318)
cropped = src.crop(crop_box)
w, h = cropped.size

# 1. logo-brand.png: Crisp clean white-background version
cropped.save(r'd:\mahilo\frontend\public\logo-brand.png')
cropped.save(r'd:\mahilo\android\app\src\main\assets\logo-brand.png')

# 2. logo-navbar.png: Transparent background with white lettering for dark purple topbar
trans_nav = Image.new('RGBA', (w, h), (0, 0, 0, 0))
for y in range(h):
    for x in range(w):
        r, g, b, a = cropped.getpixel((x, y))
        # White background -> transparent
        if r > 235 and g > 235 and b > 235:
            trans_nav.putpixel((x, y), (0, 0, 0, 0))
        elif x > 260 and r < 120 and g < 60 and b < 120:
            # Dark purple text "Mahilo" and tagline -> Crisp White
            trans_nav.putpixel((x, y), (255, 255, 255, 255))
        else:
            # Bag icon, green leaves, orange smile, pink dots -> keep vibrant colors!
            trans_nav.putpixel((x, y), (r, g, b, 255))

trans_nav.save(r'd:\mahilo\frontend\public\logo-navbar.png')
trans_nav.save(r'd:\mahilo\android\app\src\main\assets\logo-navbar.png')

# Also save timestamped version for cache busting
trans_nav.save(r'd:\mahilo\frontend\public\logo-navbar-v2.png')

print(f'Successfully generated logo-brand.png and logo-navbar.png ({w}x{h})!')
