package com.urban.mobile.utils.repositories

import com.urban.mobile.model.LoginRequest
import com.urban.mobile.rest.RetrofitService

class UserRepository constructor(private val retrofitService: RetrofitService) {

//    fun saveUser(user: User) = retrofitService.saveUser(user)

    fun login(loginRequest: LoginRequest) = retrofitService.login(loginRequest)

}
