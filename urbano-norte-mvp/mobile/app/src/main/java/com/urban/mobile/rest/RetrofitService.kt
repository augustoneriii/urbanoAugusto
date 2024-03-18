package com.urban.mobile.rest

import com.urban.mobile.model.Anuncio
import com.urban.mobile.model.AnuncioResponse
import com.urban.mobile.model.LoginRequest
import com.urban.mobile.model.LoginResponse
import com.urban.mobile.model.UserSession
import okhttp3.OkHttpClient
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query
import java.util.concurrent.TimeUnit

interface RetrofitService {

    @POST("users/login")
    fun login(@Body loginRequest: LoginRequest): Call<LoginResponse>

    @GET("anuncio/myads")
    fun getAnunciosDoUsuario(@Query("userId") userId: String): Call<AnuncioResponse>

    companion object {

        private val retrofitService: RetrofitService by lazy {

            val okHttpClient = OkHttpClient.Builder()
                .addInterceptor { chain ->
                    val original = chain.request()

                    val token = UserSession.getToken()
                    val requestBuilder = original.newBuilder()
                        .addHeader("Authorization", "Bearer $token")
                    val request = requestBuilder.build()
                    chain.proceed(request)
                }
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build()

            val retrofit = Retrofit.Builder()
                .baseUrl("http://vps50878.publiccloud.com.br:5000/")
                .client(okHttpClient)
                .addConverterFactory(GsonConverterFactory.create())
                .build()

            retrofit.create(RetrofitService::class.java)
        }

        fun getInstance(): RetrofitService {
            return retrofitService
        }
    }
}
