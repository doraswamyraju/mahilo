package com.example.mahilo.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.mahilo.data.models.ServiceItem
import com.example.mahilo.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BookingSheet(
    service: ServiceItem?,
    onDismiss: () -> Unit,
    onConfirm: (service: ServiceItem, date: String, slot: String) -> Unit
) {
    if (service == null) return

    val slots = listOf("10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "05:00 PM")
    var selectedSlot by remember { mutableStateOf(slots[0]) }
    val dates = listOf("Tomorrow", "Saturday", "Sunday", "Next Monday")
    var selectedDate by remember { mutableStateOf(dates[0]) }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        containerColor = Color.White,
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 10.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Book Appointment",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = MahiloDeepPurple
                    )
                    Text(
                        text = service.name,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = MahiloMagenta
                    )
                }
                IconButton(onClick = onDismiss) {
                    Icon(imageVector = Icons.Default.Close, contentDescription = "Close")
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Pricing note
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MahiloPinkBg, RoundedCornerShape(12.dp))
                    .padding(10.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = "Service Fee", fontSize = 12.sp, color = Color.Gray)
                Text(text = "₹${service.price}", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = MahiloPlum)
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Select Date
            Text(text = "Select Day", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.Black)
            Spacer(modifier = Modifier.height(6.dp))
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                dates.forEach { d ->
                    val isSelected = selectedDate == d
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (isSelected) MahiloPlum else Color(0xFFF3F4F6))
                            .clickable { selectedDate = d }
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = d,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isSelected) Color.White else Color(0xFF374151)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Select Slot
            Text(text = "Available Time Slots", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.Black)
            Spacer(modifier = Modifier.height(6.dp))
            Row(
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                slots.forEach { s ->
                    val isSelected = selectedSlot == s
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(8.dp))
                            .background(if (isSelected) MahiloMagenta else Color.White)
                            .border(1.dp, if (isSelected) MahiloMagenta else Color.LightGray, RoundedCornerShape(8.dp))
                            .clickable { selectedSlot = s }
                            .padding(vertical = 6.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = s,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isSelected) Color.White else Color(0xFF374151)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Confirm Button
            Button(
                onClick = { onConfirm(service, selectedDate, selectedSlot) },
                colors = ButtonDefaults.buttonColors(containerColor = MahiloPlum),
                shape = CircleShape,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(46.dp)
            ) {
                Text(
                    text = "Confirm Booking • ₹${service.price}",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
