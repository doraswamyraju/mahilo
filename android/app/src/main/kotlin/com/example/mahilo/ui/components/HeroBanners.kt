package com.example.mahilo.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.mahilo.ui.theme.*

@Composable
fun HeroBanners(
    onShopNow: () -> Unit = {},
    onBookService: () -> Unit = {}
) {
    LazyRow(
        modifier = Modifier.fillMaxWidth(),
        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Banner 1: Handmade Finds Under 499
        item {
            Box(
                modifier = Modifier
                    .width(320.dp)
                    .height(170.dp)
                    .clip(RoundedCornerShape(22.dp))
                    .background(
                        Brush.horizontalGradient(
                            colors = listOf(Color(0xFFFEE5E1), Color(0xFFFAF2EE), Color(0xFFF5ECE4))
                        )
                    )
                    .border(1.dp, Color(0xFFEEDECE), RoundedCornerShape(22.dp))
                    .padding(14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxSize(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(
                        modifier = Modifier.weight(1.1f),
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "Handmade Finds",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = MahiloDeepPurple
                        )
                        Text(
                            text = "Under ₹499",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Black,
                            color = MahiloMagenta
                        )
                        Text(
                            text = "Crafts • Décor • Accessories",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color(0xFF4B5563)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Button(
                            onClick = onShopNow,
                            colors = ButtonDefaults.buttonColors(containerColor = MahiloPlum),
                            shape = CircleShape,
                            contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp),
                            modifier = Modifier.height(32.dp)
                        ) {
                            Text(text = "Shop Now", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.width(4.dp))
                            Icon(
                                imageVector = Icons.Default.ArrowForward,
                                contentDescription = null,
                                modifier = Modifier.size(12.dp)
                            )
                        }
                    }

                    // Product illustration
                    AsyncImage(
                        model = "file:///android_asset/mockup/hero/hero_handmade.png",
                        contentDescription = "Handmade Finds",
                        modifier = Modifier
                            .weight(0.9f)
                            .fillMaxHeight(),
                        contentScale = ContentScale.Fit
                    )
                }
            }
        }

        // Banner 2: Book Trusted Services Near You
        item {
            Box(
                modifier = Modifier
                    .width(310.dp)
                    .height(170.dp)
                    .clip(RoundedCornerShape(22.dp))
                    .background(
                        Brush.linearGradient(
                            colors = listOf(Color(0xFFFDE9F4), Color(0xFFF6EDF8))
                        )
                    )
                    .border(1.dp, Color(0xFFE9D6EB), RoundedCornerShape(22.dp))
                    .padding(14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxSize(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(
                        modifier = Modifier.weight(1.2f),
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "Book Trusted Services\nNear You",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = MahiloDeepPurple,
                            lineHeight = 18.sp
                        )

                        Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                            ServiceBullet("Beauty & Wellness")
                            ServiceBullet("Tailoring & Stitching")
                            ServiceBullet("Mehendi & More")
                        }

                        Button(
                            onClick = onBookService,
                            colors = ButtonDefaults.buttonColors(containerColor = MahiloMagenta),
                            shape = CircleShape,
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                            modifier = Modifier.height(30.dp)
                        ) {
                            Text(text = "Book a Service", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.width(4.dp))
                            Icon(
                                imageVector = Icons.Default.ArrowForward,
                                contentDescription = null,
                                modifier = Modifier.size(12.dp)
                            )
                        }
                    }

                    // Tailor photo
                    AsyncImage(
                        model = "file:///android_asset/mockup/hero/hero_tailor.png",
                        contentDescription = "Tailor & Services",
                        modifier = Modifier
                            .weight(0.8f)
                            .fillMaxHeight()
                            .clip(RoundedCornerShape(14.dp)),
                        contentScale = ContentScale.Crop
                    )
                }
            }
        }
    }
}

@Composable
private fun ServiceBullet(title: String) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(
            imageVector = Icons.Default.CheckCircle,
            contentDescription = null,
            tint = MahiloMagenta,
            modifier = Modifier.size(12.dp)
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = title,
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF374151)
        )
    }
}
