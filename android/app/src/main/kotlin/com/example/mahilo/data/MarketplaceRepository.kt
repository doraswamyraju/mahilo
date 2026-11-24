package com.example.mahilo.data

import com.example.mahilo.data.models.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class MarketplaceRepository {

    private val client = OkHttpClient.Builder()
        .connectTimeout(3, TimeUnit.SECONDS)
        .readTimeout(3, TimeUnit.SECONDS)
        .build()

    // 10.0.2.2 maps to host localhost from Android emulator
    private val apiBaseUrl = "http://10.0.2.2:5000/api"

    val categories = listOf(
        CategoryItem("cat-p-1", "Handicrafts", "file:///android_asset/mockup/categories/handicrafts.png"),
        CategoryItem("cat-p-2", "Fashion", "file:///android_asset/mockup/categories/fashion.png"),
        CategoryItem("cat-p-3", "Jewellery", "file:///android_asset/mockup/categories/jewellery.png"),
        CategoryItem("cat-p-4", "Beauty", "file:///android_asset/mockup/categories/beauty.png"),
        CategoryItem("cat-p-5", "Food", "file:///android_asset/mockup/categories/food.png"),
        CategoryItem("cat-p-6", "Home Decor", "file:///android_asset/mockup/categories/home_decor.png"),
        CategoryItem("cat-s-3", "Tailoring", "file:///android_asset/mockup/categories/tailoring.png", isService = true),
        CategoryItem("cat-p-8", "Gifts", "file:///android_asset/mockup/categories/gifts.png")
    )

    val popularHandicrafts = listOf(
        ProductItem(
            id = "prod-h-1",
            name = "Handwoven Jute Handbag",
            categoryId = "cat-p-1",
            basePrice = 799,
            originalPrice = 999,
            discount = "20% off",
            ratingAverage = 4.8,
            totalRatings = 126,
            imageAsset = "file:///android_asset/mockup/handicrafts/handwoven_jute_handbag.png",
            sellerName = "Saraswati Crafts"
        ),
        ProductItem(
            id = "prod-h-2",
            name = "Terracotta Painted Jar",
            categoryId = "cat-p-1",
            basePrice = 549,
            originalPrice = 699,
            discount = "21% off",
            ratingAverage = 4.7,
            totalRatings = 89,
            imageAsset = "file:///android_asset/mockup/handicrafts/terracotta_painted_jar.png",
            sellerName = "Saraswati Crafts"
        ),
        ProductItem(
            id = "prod-h-3",
            name = "Macrame Wall Hanging",
            categoryId = "cat-p-1",
            basePrice = 1299,
            originalPrice = 1599,
            discount = "19% off",
            ratingAverage = 4.9,
            totalRatings = 56,
            imageAsset = "file:///android_asset/mockup/handicrafts/macrame_wall_hanging.png",
            sellerName = "Saraswati Crafts"
        ),
        ProductItem(
            id = "prod-h-4",
            name = "Brass Diya Set (2 pcs)",
            categoryId = "cat-p-1",
            basePrice = 599,
            originalPrice = 749,
            discount = "20% off",
            ratingAverage = 4.8,
            totalRatings = 102,
            imageAsset = "file:///android_asset/mockup/handicrafts/brass_diya_set.png",
            sellerName = "Divya Home Art"
        ),
        ProductItem(
            id = "prod-h-5",
            name = "Handpainted Coasters (Set of 6)",
            categoryId = "cat-p-1",
            basePrice = 349,
            originalPrice = 449,
            discount = "22% off",
            ratingAverage = 4.6,
            totalRatings = 73,
            imageAsset = "file:///android_asset/mockup/handicrafts/handpainted_coasters.png",
            sellerName = "Saraswati Crafts"
        ),
        ProductItem(
            id = "prod-h-6",
            name = "Wooden Jewellery Box",
            categoryId = "cat-p-1",
            basePrice = 899,
            originalPrice = 1199,
            discount = "25% off",
            ratingAverage = 4.8,
            totalRatings = 41,
            imageAsset = "file:///android_asset/mockup/handicrafts/wooden_jewellery_box.png",
            sellerName = "Divya Home Art"
        )
    )

    val homePicks = listOf(
        ProductItem(
            id = "prod-hm-1",
            name = "Cushion Cover (Set of 2)",
            categoryId = "cat-p-6",
            basePrice = 499,
            originalPrice = 649,
            discount = "23% off",
            ratingAverage = 4.7,
            totalRatings = 214,
            imageAsset = "file:///android_asset/mockup/home/cushion_cover.png",
            sellerName = "Anitha Fashions"
        ),
        ProductItem(
            id = "prod-hm-2",
            name = "Table Runner (Handloom)",
            categoryId = "cat-p-6",
            basePrice = 699,
            originalPrice = 899,
            discount = "22% off",
            ratingAverage = 4.6,
            totalRatings = 98,
            imageAsset = "file:///android_asset/mockup/home/table_runner.png",
            sellerName = "Anitha Fashions"
        ),
        ProductItem(
            id = "prod-hm-3",
            name = "Indoor Ceramic Planter",
            categoryId = "cat-p-6",
            basePrice = 399,
            originalPrice = 499,
            discount = "20% off",
            ratingAverage = 4.8,
            totalRatings = 167,
            imageAsset = "file:///android_asset/mockup/home/indoor_ceramic_planter.png",
            sellerName = "Divya Home Art"
        ),
        ProductItem(
            id = "prod-hm-4",
            name = "Aroma Candle (Soy Wax)",
            categoryId = "cat-p-6",
            basePrice = 349,
            originalPrice = 449,
            discount = "22% off",
            ratingAverage = 4.7,
            totalRatings = 305,
            imageAsset = "file:///android_asset/mockup/home/aroma_candle.png",
            sellerName = "Lakshmi Naturals"
        ),
        ProductItem(
            id = "prod-hm-5",
            name = "Pickle Combo (3 Jars)",
            categoryId = "cat-p-5",
            basePrice = 599,
            originalPrice = 749,
            discount = "20% off",
            ratingAverage = 4.8,
            totalRatings = 122,
            imageAsset = "file:///android_asset/mockup/home/pickle_combo.png",
            sellerName = "Ruchi Foods"
        ),
        ProductItem(
            id = "prod-hm-6",
            name = "Herbal Bath Soap (Pack of 3)",
            categoryId = "cat-p-4",
            basePrice = 299,
            originalPrice = 399,
            discount = "25% off",
            ratingAverage = 4.6,
            totalRatings = 188,
            imageAsset = "file:///android_asset/mockup/home/herbal_bath_soap.png",
            sellerName = "Lakshmi Naturals"
        )
    )

    val services = listOf(
        ServiceItem(
            id = "srv-1",
            name = "Salon & Beauty Services",
            categoryId = "cat-s-1",
            price = "299",
            ratingAverage = 4.8,
            totalRatings = "1,240",
            location = "Vijayawada",
            imageAsset = "file:///android_asset/mockup/services/salon_services.png",
            sellerName = "Lakshmi Naturals"
        ),
        ServiceItem(
            id = "srv-2",
            name = "Bridal Makeup",
            categoryId = "cat-s-2",
            price = "4,999",
            ratingAverage = 4.9,
            totalRatings = "420",
            location = "Vijayawada",
            imageAsset = "file:///android_asset/mockup/services/bridal_makeup.png",
            sellerName = "Lakshmi Naturals"
        ),
        ServiceItem(
            id = "srv-3",
            name = "Tailoring & Stitching",
            categoryId = "cat-s-3",
            price = "199",
            ratingAverage = 4.8,
            totalRatings = "880",
            location = "Vijayawada",
            imageAsset = "file:///android_asset/mockup/services/tailoring_stitching.png",
            sellerName = "Siri Tailoring"
        ),
        ServiceItem(
            id = "srv-4",
            name = "Mehendi (Henna) Art",
            categoryId = "cat-s-4",
            price = "399",
            ratingAverage = 4.8,
            totalRatings = "764",
            location = "Vijayawada",
            imageAsset = "file:///android_asset/mockup/services/mehendi_art.png",
            sellerName = "Siri Tailoring"
        ),
        ServiceItem(
            id = "srv-5",
            name = "Home Catering",
            categoryId = "cat-s-5",
            price = "1,499",
            ratingAverage = 4.7,
            totalRatings = "312",
            location = "Vijayawada",
            imageAsset = "file:///android_asset/mockup/services/home_catering.png",
            sellerName = "Ruchi Foods"
        ),
        ServiceItem(
            id = "srv-6",
            name = "Event Decoration",
            categoryId = "cat-s-6",
            price = "2,999",
            ratingAverage = 4.8,
            totalRatings = "196",
            location = "Vijayawada",
            imageAsset = "file:///android_asset/mockup/services/event_decoration.png",
            sellerName = "Divya Home Art"
        )
    )

    val featuredStores = listOf(
        SellerStoreItem(
            id = "seller-1",
            name = "Saraswati Crafts",
            category = "Handicrafts & Décor",
            rating = "4.9",
            productCount = "250+ products",
            avatarAsset = "file:///android_asset/mockup/stores/saraswati_crafts.png"
        ),
        SellerStoreItem(
            id = "seller-2",
            name = "Anitha Fashions",
            category = "Sarees & Apparels",
            rating = "4.8",
            productCount = "420+ products",
            avatarAsset = "file:///android_asset/mockup/stores/anitha_fashions.png"
        ),
        SellerStoreItem(
            id = "seller-3",
            name = "Lakshmi Naturals",
            category = "Beauty & Wellness",
            rating = "4.8",
            productCount = "180+ products",
            avatarAsset = "file:///android_asset/mockup/stores/lakshmi_naturals.png"
        ),
        SellerStoreItem(
            id = "seller-4",
            name = "Divya Home Art",
            category = "Home Decor & Living",
            rating = "4.7",
            productCount = "310+ products",
            avatarAsset = "file:///android_asset/mockup/stores/divya_home_art.png"
        ),
        SellerStoreItem(
            id = "seller-5",
            name = "Ruchi Foods",
            category = "Homemade Food",
            rating = "4.8",
            productCount = "160+ products",
            avatarAsset = "file:///android_asset/mockup/stores/ruchi_foods.png"
        ),
        SellerStoreItem(
            id = "seller-6",
            name = "Siri Tailoring",
            category = "Stitching & Custom Wear",
            rating = "4.8",
            productCount = "95+ services",
            avatarAsset = "file:///android_asset/mockup/stores/siri_tailoring.png"
        )
    )

    val exploreItems = listOf(
        "file:///android_asset/mockup/explore/item_1.png",
        "file:///android_asset/mockup/explore/item_2.png",
        "file:///android_asset/mockup/explore/item_3.png",
        "file:///android_asset/mockup/explore/item_4.png",
        "file:///android_asset/mockup/explore/item_5.png",
        "file:///android_asset/mockup/explore/item_6.png",
        "file:///android_asset/mockup/explore/item_7.png",
        "file:///android_asset/mockup/explore/item_8.png"
    )

    suspend fun tryFetchBackendProducts(): List<ProductItem> = withContext(Dispatchers.IO) {
        try {
            val req = Request.Builder().url("$apiBaseUrl/products").build()
            client.newCall(req).execute().use { res ->
                if (!res.isSuccessful) return@withContext popularHandicrafts
                val body = res.body?.string() ?: return@withContext popularHandicrafts
                val json = JSONObject(body)
                if (json.optBoolean("success")) {
                    // Fallback to local high-res items if parse succeeds
                    popularHandicrafts
                } else {
                    popularHandicrafts
                }
            }
        } catch (e: Exception) {
            popularHandicrafts
        }
    }
}
