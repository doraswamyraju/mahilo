package com.example.mahilo.data.models

data class CategoryItem(
    val id: String,
    val name: String,
    val imageAsset: String,
    val isService: Boolean = false
)

data class ProductItem(
    val id: String,
    val name: String,
    val categoryId: String,
    val basePrice: Int,
    val originalPrice: Int? = null,
    val discount: String = "20% off",
    val ratingAverage: Double = 4.8,
    val totalRatings: Int = 100,
    val imageAsset: String,
    val sellerName: String = "Mahilo Artisan",
    val slug: String = ""
)

data class ServiceItem(
    val id: String,
    val name: String,
    val categoryId: String,
    val price: String,
    val ratingAverage: Double = 4.8,
    val totalRatings: String = "400",
    val location: String = "Vijayawada",
    val imageAsset: String,
    val sellerName: String = "Mahilo Expert",
    val slug: String = ""
)

data class SellerStoreItem(
    val id: String,
    val name: String,
    val category: String,
    val rating: String,
    val productCount: String,
    val avatarAsset: String,
    val slug: String = ""
)

data class CartItem(
    val product: ProductItem,
    var quantity: Int = 1
)

data class BookingItem(
    val id: String,
    val serviceName: String,
    val bookingDate: String,
    val timeSlot: String,
    val status: String = "CONFIRMED"
)
