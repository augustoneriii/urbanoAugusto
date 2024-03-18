package com.urban.mobile.model
data class Anuncio(
    val id: String,
    val title: String,
    val description: String,
    val images: List<String>,
    val available: Boolean,
    val user: User2,
    val pacote: List<Pacote>
)
data class User2(
    val id: String,
    val name: String,
    val phone: String,
)
data class Pacote(
    val id: String,
    val name: String,
    val description: String,
    val price: Double,
    val available: Boolean,
    val addTime: Int
)
