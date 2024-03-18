package com.urban.mobile.utils.repositories

import com.urban.mobile.model.Anuncio
import com.urban.mobile.model.AnuncioResponse
import com.urban.mobile.rest.RetrofitService
import retrofit2.Call

class AnuncioRepository(private val anuncioService: RetrofitService) {
    fun getAnunciosDoUsuario(userId: String): Call<AnuncioResponse> {
        return anuncioService.getAnunciosDoUsuario(userId)
    }
}
