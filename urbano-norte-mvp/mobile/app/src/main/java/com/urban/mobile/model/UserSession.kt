package com.urban.mobile.model

object UserSession {

    private var _token: String? = null
    private var _userId: String? = null

    fun isUserLogged(): Boolean {
        return _token != null
    }

    fun setToken(token: String) {
        _token = token
    }

    fun setUserId(userId: String) {
        _userId = userId
    }

    fun cleanSession() {
        _token = null
    }

    fun getToken(): String = if (_token != null)
        _token!!
    else
        ""

    fun getUserId(): String = if (_userId != null)
        _userId!!
    else
        ""
}