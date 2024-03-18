package com.urban.mobile.viewmodel

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.urban.mobile.model.Anuncio
import com.urban.mobile.model.AnuncioResponse
import com.urban.mobile.utils.repositories.AnuncioRepository
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainViewModel(private val anuncioRepository: AnuncioRepository) : ViewModel() {
    val anuncios = MutableLiveData<List<Anuncio>>()
    val errorMessage = MutableLiveData<String>()
    val isLoading = MutableLiveData<Boolean>()

    fun fetchAnunciosDoUsuario(userId: String) {
        isLoading.value = true
        anuncioRepository.getAnunciosDoUsuario(userId).enqueue(object : Callback<AnuncioResponse> {
            override fun onResponse(
                call: Call<AnuncioResponse>,
                response: Response<AnuncioResponse>
            ) {
                isLoading.value = false
                if (response.isSuccessful) {
                    anuncios.value = response.body()?.anuncio
                } else {
                    errorMessage.value = "Erro ao buscar anúncios"
                }
            }

            override fun onFailure(call: Call<AnuncioResponse>, t: Throwable) {
                isLoading.value = false
                errorMessage.value = t.message
            }
        })
    }
}


