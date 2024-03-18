package com.urban.mobile.views

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.urban.mobile.model.LoginRequest
import com.urban.mobile.model.UserSession
import com.urban.mobile.utils.repositories.UserRepository
import com.urban.mobile.rest.RetrofitService
import com.urban.mobile.utils.Validator.validateEmail
import com.urban.mobile.utils.Validator.validatePassword
import com.urban.mobile.viewmodel.LoginViewModel
import com.urban.mobile.viewmodel.LoginViewModelFactory
import com.urban.urbanmobile.databinding.ActivityLoginBinding

class LoginActivity : AppCompatActivity() {

    private lateinit var _binding: ActivityLoginBinding
    private lateinit var viewModel: LoginViewModel
    private val retrofitService = RetrofitService.getInstance()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        _binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(_binding.root)
        supportActionBar?.hide()
        supportActionBar?.setDisplayShowTitleEnabled(false)

        viewModel =
            ViewModelProvider(this, LoginViewModelFactory(UserRepository(retrofitService))).get(
                LoginViewModel::class.java
            )

        setupUi()

    }

    private fun setupUi() = _binding.apply {

        btnLogin.setOnClickListener {

            if (!validateEmail(edtEmail.text.toString())) {

                edtEmail.error = "Preencha o email corretamente"
                edtEmail.requestFocus()
                return@setOnClickListener

            }

            if (!validatePassword(edtPassword.text.toString())) {

                edtPassword.error = "Preencha a senha de acesso"
                edtPassword.requestFocus()
                return@setOnClickListener

            }

            viewModel.login(
                LoginRequest(
                    edtEmail.text.toString(),
                    edtPassword.text.toString()
                )
            )
            loadingView.show()

        }
    }

    override fun onStart() {
        super.onStart()

        viewModel.success.observe(this, Observer {

            UserSession.setToken(it.token)
            UserSession.setUserId(it.userId) // Armazena o userId na sessão do usuário
            startActivity(Intent(this@LoginActivity, MainActivity::class.java))
            finish()

        })

        viewModel.errorMessage.observe(this, Observer {
            _binding.loadingView.dismiss()
            Toast.makeText(this, it, Toast.LENGTH_LONG).show()
        })

    }
}
