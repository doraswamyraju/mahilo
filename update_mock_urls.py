import re

with open('d:/mahilo/backend/src/data/mockStore.ts', 'r', encoding='utf-8') as f:
    text = f.read()

replacements = {
    'prod-h-1': '/assets/mockup/handicrafts/handwoven_jute_handbag.png',
    'prod-h-2': '/assets/mockup/handicrafts/terracotta_painted_jar.png',
    'prod-h-3': '/assets/mockup/handicrafts/macrame_wall_hanging.png',
    'prod-h-4': '/assets/mockup/handicrafts/brass_diya_set.png',
    'prod-h-5': '/assets/mockup/handicrafts/handpainted_coasters.png',
    'prod-h-6': '/assets/mockup/handicrafts/wooden_jewellery_box.png',
    'prod-hm-1': '/assets/mockup/home/cushion_cover.png',
    'prod-hm-2': '/assets/mockup/home/table_runner.png',
    'prod-hm-3': '/assets/mockup/home/indoor_ceramic_planter.png',
    'prod-hm-4': '/assets/mockup/home/aroma_candle.png',
    'prod-hm-5': '/assets/mockup/home/pickle_combo.png',
    'prod-hm-6': '/assets/mockup/home/herbal_bath_soap.png',
    'srv-1': '/assets/mockup/services/salon_services.png',
    'srv-2': '/assets/mockup/services/bridal_makeup.png',
    'srv-3': '/assets/mockup/services/tailoring_stitching.png',
    'srv-4': '/assets/mockup/services/mehendi_art.png',
    'srv-5': '/assets/mockup/services/home_catering.png',
    'srv-6': '/assets/mockup/services/event_decoration.png',
    'seller-1': '/assets/mockup/stores/saraswati_crafts.png',
    'seller-2': '/assets/mockup/stores/anitha_fashions.png',
    'seller-3': '/assets/mockup/stores/lakshmi_naturals.png',
    'seller-4': '/assets/mockup/stores/divya_home_art.png',
    'seller-5': '/assets/mockup/stores/ruchi_foods.png',
    'seller-6': '/assets/mockup/stores/siri_tailoring.png',
}

for item_id, url in replacements.items():
    # In seller objects, it might be logoUrl: "..."
    # In product and service objects, it is imageUrl: '...' or "..."
    pattern = rf"(id:\s*['\"]{item_id}['\"][^}}]*?)(imageUrl|logoUrl):\s*['\"][^'\"]+['\"]"
    new_text, count = re.subn(pattern, rf"\1\2: '{url}'", text, count=1)
    if count > 0:
        text = new_text
        print(f"Updated {item_id} -> {url}")
    else:
        print(f"FAILED to update {item_id}")

with open('d:/mahilo/backend/src/data/mockStore.ts', 'w', encoding='utf-8') as f:
    f.write(text)
