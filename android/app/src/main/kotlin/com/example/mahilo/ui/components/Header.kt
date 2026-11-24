package com.example.mahilo.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
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
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.mahilo.ui.theme.*

@Composable
fun MahiloHeader(
    cartCount: Int,
    selectedCity: String = "Vijayawada",
    onCartClick: () -> Unit = {},
    onSearch: (String) -> Unit = {}
) {
    var searchText by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(MahiloDeepPurple)
            .statusBarsPadding()
            .padding(horizontal = 12.dp, vertical = 8.dp)
    ) {
        // Top row: Location & Logo & Cart
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Mahilo Logo
            AsyncImage(
                model = "file:///android_asset/logo-navbar.png",
                contentDescription = "Mahilo",
                modifier = Modifier
                    .height(38.dp)
                    .width(125.dp),
                contentScale = ContentScale.Fit
            )

            // Deliver to Location
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .clickable { /* Change city */ }
                    .padding(horizontal = 6.dp, vertical = 4.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.LocationOn,
                    contentDescription = "Location",
                    tint = Color.White,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Column {
                    Text(
                        text = "Deliver to",
                        fontSize = 10.sp,
                        color = Color.LightGray,
                        lineHeight = 10.sp
                    )
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = selectedCity,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White,
                            lineHeight = 12.sp
                        )
                        Icon(
                            imageVector = Icons.Default.ArrowDropDown,
                            contentDescription = null,
                            tint = Color.LightGray,
                            modifier = Modifier.size(14.dp)
                        )
                    }
                }
            }

            // Cart with Badge
            Box(
                modifier = Modifier
                    .clip(CircleShape)
                    .clickable { onCartClick() }
                    .padding(4.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.ShoppingCart,
                    contentDescription = "Cart",
                    tint = Color.White,
                    modifier = Modifier.size(26.dp)
                )
                if (cartCount > 0) {
                    Box(
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .offset(x = 4.dp, y = (-4).dp)
                            .size(18.dp)
                            .background(MahiloAmberDark, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = cartCount.toString(),
                            color = Color.Black,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Black
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Search Bar Row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(42.dp)
                .background(Color.White, RoundedCornerShape(10.dp)),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Category selector pill
            Box(
                modifier = Modifier
                    .background(Color(0xFFF3F4F6), RoundedCornerShape(topStart = 10.dp, bottomStart = 10.dp))
                    .fillMaxHeight()
                    .padding(horizontal = 8.dp),
                contentAlignment = Alignment.Center
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "All",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color(0xFF374151)
                    )
                    Icon(
                        imageVector = Icons.Default.ArrowDropDown,
                        contentDescription = null,
                        tint = Color.Gray,
                        modifier = Modifier.size(14.dp)
                    )
                }
            }

            // Input field
            TextField(
                value = searchText,
                onValueChange = {
                    searchText = it
                    onSearch(it)
                },
                placeholder = {
                    Text(
                        text = "Search products, services & sellers",
                        fontSize = 12.sp,
                        color = Color(0xFF4B5563),
                        fontWeight = FontWeight.Medium
                    )
                },
                textStyle = androidx.compose.ui.text.TextStyle(
                    color = Color(0xFF111827),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold
                ),
                colors = TextFieldDefaults.colors(
                    focusedTextColor = Color(0xFF111827),
                    unfocusedTextColor = Color(0xFF111827),
                    cursorColor = MahiloMagenta,
                    focusedContainerColor = Color.Transparent,
                    unfocusedContainerColor = Color.Transparent,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent
                ),
                singleLine = true,
                modifier = Modifier.weight(1f)
            )

            // Search Action Button (Amazon-style amber/orange)
            Box(
                modifier = Modifier
                    .fillMaxHeight()
                    .width(42.dp)
                    .background(MahiloAmberDark, RoundedCornerShape(topEnd = 10.dp, bottomEnd = 10.dp))
                    .clickable { onSearch(searchText) },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = "Search",
                    tint = Color.Black,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}
