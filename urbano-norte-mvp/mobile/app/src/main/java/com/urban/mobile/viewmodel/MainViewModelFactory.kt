package com.urban.mobile.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.urban.mobile.rest.RetrofitService
import com.urban.mobile.utils.repositories.AnuncioRepository

class MainViewModelFactory(private val anuncioRepository: AnuncioRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(MainViewModel::class.java)) {
            return MainViewModel(anuncioRepository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}

