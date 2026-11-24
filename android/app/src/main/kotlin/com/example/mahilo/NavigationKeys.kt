package com.example.mahilo

sealed interface ScreenRoute {
    data object Main : ScreenRoute
}
