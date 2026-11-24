package com.example.mahilo.ui.main

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.mahilo.data.MarketplaceRepository
import com.example.mahilo.data.models.*
import com.example.mahilo.ui.components.*
import com.example.mahilo.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun MainScreen(
    onItemClick: (String) -> Unit = {},
    modifier: Modifier = Modifier
) {
    val repo = remember { MarketplaceRepository() }
    val scope = rememberCoroutineScope()
    val snackbarHostState = remember { SnackbarHostState() }

    // State
    val cartItems = remember { mutableStateListOf<CartItem>() }
    var isCartOpen by remember { mutableStateOf(false) }
    var selectedServiceForBooking by remember { mutableStateOf<ServiceItem?>(null) }
    var activeTab by remember { mutableStateOf("Shop") }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            MahiloHeader(
                cartCount = cartItems.sumOf { it.quantity },
                onCartClick = { isCartOpen = true }
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = Color.White,
                tonalElevation = 8.dp
            ) {
                NavigationBarItem(
                    selected = activeTab == "Shop",
                    onClick = { activeTab = "Shop" },
                    icon = { Icon(Icons.Default.Storefront, contentDescription = "Shop") },
                    label = { Text("Shop", fontSize = 10.sp, fontWeight = FontWeight.Bold) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = MahiloPlum,
                        selectedTextColor = MahiloPlum,
                        indicatorColor = MahiloPinkBg
                    )
                )
                NavigationBarItem(
                    selected = activeTab == "Services",
                    onClick = { activeTab = "Services" },
                    icon = { Icon(Icons.Default.DateRange, contentDescription = "Services") },
                    label = { Text("Services", fontSize = 10.sp, fontWeight = FontWeight.Bold) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = MahiloPlum,
                        selectedTextColor = MahiloPlum,
                        indicatorColor = MahiloPinkBg
                    )
                )
                NavigationBarItem(
                    selected = isCartOpen,
                    onClick = { isCartOpen = true },
                    icon = {
                        BadgedBox(
                            badge = {
                                val count = cartItems.sumOf { it.quantity }
                                if (count > 0) {
                                    Badge(containerColor = MahiloAmberDark) {
                                        Text(count.toString(), color = Color.Black, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        ) {
                            Icon(Icons.Default.ShoppingCart, contentDescription = "Cart")
                        }
                    },
                    label = { Text("Cart", fontSize = 10.sp, fontWeight = FontWeight.Bold) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = MahiloPlum,
                        selectedTextColor = MahiloPlum,
                        indicatorColor = MahiloPinkBg
                    )
                )
                NavigationBarItem(
                    selected = activeTab == "Account",
                    onClick = { activeTab = "Account" },
                    icon = { Icon(Icons.Default.Person, contentDescription = "Account") },
                    label = { Text("Account", fontSize = 10.sp, fontWeight = FontWeight.Bold) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = MahiloPlum,
                        selectedTextColor = MahiloPlum,
                        indicatorColor = MahiloPinkBg
                    )
                )
            }
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(MahiloBg)
                .padding(innerPadding),
            contentPadding = PaddingValues(bottom = 20.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // 1. Promotional Ticker Strip
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(MahiloPinkBg)
                        .padding(horizontal = 14.dp, vertical = 7.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.ShoppingBag,
                            contentDescription = null,
                            tint = MahiloMagenta,
                            modifier = Modifier.size(16.dp)
                        )
                        Text(
                            text = "Discover products made by women entrepreneurs",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = MahiloDeepPurple
                        )
                    }
                    Text(
                        text = "Explore ➔",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = MahiloMagenta
                    )
                }
            }

            // 2. Category Tiles (8 rounded cards)
            item {
                CategoryStrip(categories = repo.categories)
            }

            // 3. Split Hero Banners
            item {
                HeroBanners(
                    onShopNow = {
                        scope.launch {
                            snackbarHostState.showSnackbar("Browsing Handmade finds under ₹499")
                        }
                    },
                    onBookService = {
                        selectedServiceForBooking = repo.services.firstOrNull()
                    }
                )
            }

            // 4. Section 1: "Popular in Handicrafts"
            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp)
                        .clip(RoundedCornerShape(20.dp))
                        .background(Color.White)
                        .padding(vertical = 12.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 12.dp, vertical = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Popular in Handicrafts",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFF111827)
                        )
                        Text(
                            text = "See All ➔",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = MahiloMagenta
                        )
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 10.dp),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(repo.popularHandicrafts) { prod ->
                            ProductCard(
                                product = prod,
                                onAddToCart = { p ->
                                    val existing = cartItems.find { it.product.id == p.id }
                                    if (existing != null) {
                                        existing.quantity++
                                    } else {
                                        cartItems.add(CartItem(p, 1))
                                    }
                                    scope.launch {
                                        snackbarHostState.showSnackbar("Added '${p.name}' to cart!")
                                    }
                                }
                            )
                        }
                    }
                }
            }

            // 5. Section 2: "Best picks for your home"
            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp)
                        .clip(RoundedCornerShape(20.dp))
                        .background(Color.White)
                        .padding(vertical = 12.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 12.dp, vertical = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Best picks for your home",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFF111827)
                        )
                        Text(
                            text = "See All ➔",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = MahiloMagenta
                        )
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 10.dp),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(repo.homePicks) { prod ->
                            ProductCard(
                                product = prod,
                                onAddToCart = { p ->
                                    val existing = cartItems.find { it.product.id == p.id }
                                    if (existing != null) {
                                        existing.quantity++
                                    } else {
                                        cartItems.add(CartItem(p, 1))
                                    }
                                    scope.launch {
                                        snackbarHostState.showSnackbar("Added '${p.name}' to cart!")
                                    }
                                }
                            )
                        }
                    }
                }
            }

            // 6. Section 3: "Beauty services near you"
            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp)
                        .clip(RoundedCornerShape(20.dp))
                        .background(Color.White)
                        .padding(vertical = 12.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 12.dp, vertical = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Beauty services near you",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFF111827)
                        )
                        Text(
                            text = "See All ➔",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = MahiloMagenta
                        )
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 10.dp),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(repo.services) { srv ->
                            ServiceCard(
                                service = srv,
                                onBookNow = { s -> selectedServiceForBooking = s }
                            )
                        }
                    }
                }
            }

            // 7. Section 4: "Featured women-owned stores"
            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp)
                        .clip(RoundedCornerShape(20.dp))
                        .background(Color.White)
                        .padding(vertical = 12.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 12.dp, vertical = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Featured women-owned stores",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFF111827)
                        )
                        Text(
                            text = "See All ➔",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = MahiloMagenta
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 10.dp),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(repo.featuredStores) { st ->
                            StorePill(
                                store = st,
                                onClick = {
                                    scope.launch {
                                        snackbarHostState.showSnackbar("Opening store: ${st.name}")
                                    }
                                }
                            )
                        }
                    }
                }
            }

            // 8. Section 5: "Continue exploring"
            item {
                Box(modifier = Modifier.padding(horizontal = 12.dp)) {
                    ContinueExploringSection(
                        items = repo.exploreItems,
                        onItemClick = {
                            scope.launch {
                                snackbarHostState.showSnackbar("Exploring item...")
                            }
                        }
                    )
                }
            }
        }
    }

    // Booking Dialog
    if (selectedServiceForBooking != null) {
        BookingSheet(
            service = selectedServiceForBooking,
            onDismiss = { selectedServiceForBooking = null },
            onConfirm = { srv, date, slot ->
                selectedServiceForBooking = null
                scope.launch {
                    snackbarHostState.showSnackbar(
                        "🎉 Appointment confirmed for '${srv.name}' on $date at $slot!"
                    )
                }
            }
        )
    }

    // Cart Dialog
    if (isCartOpen) {
        CartSheet(
            cartItems = cartItems,
            onDismiss = { isCartOpen = false },
            onRemoveItem = { item -> cartItems.remove(item) },
            onCheckout = {
                isCartOpen = false
                cartItems.clear()
                scope.launch {
                    snackbarHostState.showSnackbar("🎉 Order placed successfully! You will receive updates via SMS.")
                }
            }
        )
    }
}
