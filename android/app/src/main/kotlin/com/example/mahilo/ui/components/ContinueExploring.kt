package com.example.mahilo.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.mahilo.ui.theme.MahiloCardBorder

@Composable
fun ContinueExploringSection(
    items: List<String>,
    onItemClick: (String) -> Unit = {}
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(Color.White)
            .border(1.dp, MahiloCardBorder, RoundedCornerShape(20.dp))
            .padding(14.dp)
    ) {
        Text(
            text = "Continue exploring",
            fontSize = 14.sp,
            fontWeight = FontWeight.Black,
            color = Color(0xFF111827)
        )
        Text(
            text = "Based on your recent activity",
            fontSize = 10.sp,
            color = Color.Gray,
            modifier = Modifier.padding(bottom = 10.dp)
        )

        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            contentPadding = PaddingValues(vertical = 2.dp)
        ) {
            items(items) { assetPath ->
                Box(
                    modifier = Modifier
                        .size(68.dp)
                        .clip(RoundedCornerShape(14.dp))
                        .background(Color(0xFFFAF7FA))
                        .border(1.dp, MahiloCardBorder, RoundedCornerShape(14.dp))
                        .clickable { onItemClick(assetPath) }
                        .padding(6.dp),
                    contentAlignment = Alignment.Center
                ) {
                    AsyncImage(
                        model = assetPath,
                        contentDescription = "Activity Item",
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Fit
                    )
                }
            }
        }
    }
}
