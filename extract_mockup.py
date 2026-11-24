from PIL import Image
import os

img = Image.open(r'C:\Users\doras\.gemini\antigravity\brain\e8b917e5-9cbd-4dfc-8e45-a2cfc13881a1\.user_uploaded\media_1795100934183_88cdac13.jpg')
w, h = img.size

out_dir = r'd:\mahilo\frontend\public\assets\mockup'
os.makedirs(f'{out_dir}/categories', exist_ok=True)
os.makedirs(f'{out_dir}/hero', exist_ok=True)
os.makedirs(f'{out_dir}/handicrafts', exist_ok=True)
os.makedirs(f'{out_dir}/home', exist_ok=True)
os.makedirs(f'{out_dir}/services', exist_ok=True)
os.makedirs(f'{out_dir}/stores', exist_ok=True)
os.makedirs(f'{out_dir}/explore', exist_ok=True)

# 1. Categories (y ~ 110 to 195)
# 8 category cards across the width
# Left margin is around 25, right margin around 910
# Each card is roughly width (910-25)/8 = 110 px
cat_names = [
    'handicrafts', 'fashion', 'jewellery', 'beauty', 
    'food', 'home_decor', 'tailoring', 'gifts'
]

# Let's crop category card images (the icon/image part inside the card)
# Inside each category card, image is roughly y=115 to 175
for i, name in enumerate(cat_names):
    # calculate x bounds
    x_start = int(26 + i * 110.5)
    x_end = int(26 + (i + 1) * 110.5 - 6)
    
    # full card
    card_crop = img.crop((x_start, 114, x_end, 198))
    card_crop.save(f'{out_dir}/categories/card_{name}.png')
    
    # image only inside card
    img_crop = img.crop((x_start + 12, 117, x_end - 12, 175))
    img_crop.save(f'{out_dir}/categories/{name}.png')

# 2. Hero Section (y ~ 215 to 365)
# Left Hero banner
hero_left = img.crop((26, 218, 608, 368))
hero_left.save(f'{out_dir}/hero/hero_left_full.png')

# Left Hero Image (the wooden table with bag, pot, cloth)
hero_left_art = img.crop((235, 220, 606, 366))
hero_left_art.save(f'{out_dir}/hero/hero_handmade.png')

# Right Hero banner
hero_right = img.crop((618, 218, 908, 368))
hero_right.save(f'{out_dir}/hero/hero_right_full.png')

# Right Hero Image (the smiling Indian woman tailor)
hero_tailor = img.crop((790, 218, 908, 365))
hero_tailor.save(f'{out_dir}/hero/hero_tailor.png')

# 3. Popular in Handicrafts (y ~ 395 to 525)
# 6 product cards
hc_names = [
    'handwoven_jute_handbag',
    'terracotta_painted_jar',
    'macrame_wall_hanging',
    'brass_diya_set',
    'handpainted_coasters',
    'wooden_jewellery_box'
]
for i, name in enumerate(hc_names):
    x_start = int(41 + i * 144)
    x_end = int(41 + (i + 1) * 144 - 8)
    card_crop = img.crop((x_start, 396, x_end, 524))
    card_crop.save(f'{out_dir}/handicrafts/card_{name}.png')
    # Product photo inside card
    img_crop = img.crop((x_start + 6, 398, x_end - 6, 465))
    img_crop.save(f'{out_dir}/handicrafts/{name}.png')

# 4. Best picks for your home (y ~ 555 to 685)
# 6 product cards
home_names = [
    'cushion_cover',
    'table_runner',
    'indoor_ceramic_planter',
    'aroma_candle',
    'pickle_combo',
    'herbal_bath_soap'
]
for i, name in enumerate(home_names):
    x_start = int(41 + i * 144)
    x_end = int(41 + (i + 1) * 144 - 8)
    card_crop = img.crop((x_start, 556, x_end, 684))
    card_crop.save(f'{out_dir}/home/card_{name}.png')
    # Product photo inside card
    img_crop = img.crop((x_start + 6, 558, x_end - 6, 625))
    img_crop.save(f'{out_dir}/home/{name}.png')

# 5. Beauty services near you (y ~ 705 to 830)
# 6 service cards
serv_names = [
    'salon_services',
    'bridal_makeup',
    'tailoring_stitching',
    'mehendi_art',
    'home_catering',
    'event_decoration'
]
for i, name in enumerate(serv_names):
    x_start = int(41 + i * 144)
    x_end = int(41 + (i + 1) * 144 - 8)
    card_crop = img.crop((x_start, 706, x_end, 830))
    card_crop.save(f'{out_dir}/services/card_{name}.png')
    # Service photo
    img_crop = img.crop((x_start + 2, 708, x_end - 2, 765))
    img_crop.save(f'{out_dir}/services/{name}.png')

# 6. Featured women-owned stores (y ~ 860 to 925)
# 6 store cards
store_names = [
    'saraswati_crafts',
    'anitha_fashions',
    'lakshmi_naturals',
    'divya_home_art',
    'ruchi_foods',
    'siri_tailoring'
]
for i, name in enumerate(store_names):
    x_start = int(26 + i * 148)
    x_end = int(26 + (i + 1) * 148 - 6)
    card_crop = img.crop((x_start, 868, x_end, 920))
    card_crop.save(f'{out_dir}/stores/card_{name}.png')
    # Avatar photo inside store card
    avatar_crop = img.crop((x_start + 5, 874, x_start + 45, 914))
    avatar_crop.save(f'{out_dir}/stores/{name}.png')

# 7. Continue exploring (y ~ 945 to 1015)
# 8 thumbnails
for i in range(8):
    x_start = int(200 + i * 89)
    x_end = int(200 + (i + 1) * 89 - 8)
    crop = img.crop((x_start, 946, x_end, 998))
    crop.save(f'{out_dir}/explore/item_{i+1}.png')

print('All assets extracted successfully!')
