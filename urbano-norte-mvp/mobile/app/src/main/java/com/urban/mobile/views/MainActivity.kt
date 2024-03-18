package com.urban.mobile.views

import QRCodeDialogFragment
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.Bitmap
import android.os.BatteryManager
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.View
import android.view.WindowManager
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.urban.mobile.adapter.AdvertisementAdapter
import com.urban.mobile.model.Anuncio
import com.urban.mobile.model.UserSession
import com.urban.mobile.rest.RetrofitService
import com.urban.mobile.utils.repositories.AnuncioRepository
import com.urban.mobile.viewmodel.MainViewModel
import com.urban.mobile.viewmodel.MainViewModelFactory
import com.urban.urbanmobile.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    lateinit var binding: ActivityMainBinding
    private lateinit var viewModel: MainViewModel
    private val handler = Handler(Looper.getMainLooper())
    private var isFullScreen = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        supportActionBar?.hide()

        val retrofitService = RetrofitService.getInstance()
        val anuncioRepository = AnuncioRepository(retrofitService)
        val viewModelFactory = MainViewModelFactory(anuncioRepository)
        viewModel = ViewModelProvider(this, viewModelFactory).get(MainViewModel::class.java)

        val userId = UserSession.getUserId()
        viewModel.fetchAnunciosDoUsuario(userId)

        viewModel.anuncios.observe(this, Observer { anuncios ->
            if (anuncios != null) {
                setupViewPager(anuncios)
            }
        })

        viewModel.isLoading.observe(this, Observer { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        })

        setupFullScreenToggle()
        setupBatteryStatusReceiver()
        setupQRCodeDialog()
    }

    private fun setupViewPager(anuncios: List<Anuncio>) {
        val viewPager = binding.viewPagerAds
        val adapter = AdvertisementAdapter(anuncios)
        viewPager.adapter = adapter

        val handler = Handler()
        val changeImageAndTimeRunnable = object : Runnable {
            override fun run() {
                viewPager.apply {
                    currentItem = if (currentItem < anuncios.size - 1) currentItem + 1 else 0
                    val nextAnuncio = anuncios[currentItem]
                    val nextAddTime = nextAnuncio.pacote.firstOrNull()?.addTime ?: DEFAULT_ADD_TIME
                    nextAddTime * 1000L
                }
            }
        }

        val initialAddTime =
            anuncios.firstOrNull()?.pacote?.firstOrNull()?.addTime ?: DEFAULT_ADD_TIME
        handler.postDelayed(changeImageAndTimeRunnable, initialAddTime * 1000L)

        viewPager.setOnClickListener {
            if (isFullScreen) {
                showPasswordDialog()
            } else {
            }
        }

    }


    private fun setupFullScreenToggle() {
        binding.tvFullScreenAttention.setOnClickListener {
            toggleFullScreen()
        }
    }
    private fun toggleFullScreen() {
        if (!isFullScreen) {
            enterFullScreenMode()
        } else {
            exitFullScreenMode()
        }
    }

    private fun enterFullScreenMode() {
        binding.tvFullScreenAttention.visibility = View.INVISIBLE
        binding.btnNextAd.visibility = View.INVISIBLE
        binding.btnPrevAd.visibility = View.INVISIBLE
        binding.btnShare.visibility = View.VISIBLE
        binding.tvUserName.visibility = View.GONE
        binding.tvUserEmail.visibility = View.GONE
        binding.ivUserIcon.visibility = View.GONE
        binding.ivUserPhoto.visibility = View.GONE

        window.setFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE, WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE)

        isFullScreen = true

        val decorView = window.decorView
        decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY)
        supportActionBar?.hide()
    }

    private fun exitFullScreenMode() {
        binding.tvFullScreenAttention.visibility = View.VISIBLE
        binding.btnNextAd.visibility = View.VISIBLE
        binding.btnPrevAd.visibility = View.VISIBLE
        binding.btnShare.visibility = View.VISIBLE
        binding.tvUserName.visibility = View.VISIBLE
        binding.tvUserEmail.visibility = View.VISIBLE
        binding.ivUserIcon.visibility = View.VISIBLE
        binding.ivUserPhoto.visibility = View.VISIBLE

        window.clearFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE)

        isFullScreen = false

        val decorView = window.decorView
        decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN)
    }

    private fun showPasswordDialog() {
        val passwordDialog = PasswordDialogFragment()
        passwordDialog.setOnPasswordEnteredListener(object :
            PasswordDialogFragment.OnPasswordEnteredListener {
            override fun onPasswordEntered(password: String) {
                if (isPasswordCorrect(password)) {
                    enterFullScreenMode()
                } else {
                }
            }
        })
        passwordDialog.show(supportFragmentManager, "PasswordDialog")
    }

    private fun isPasswordCorrect(password: String): Boolean {
        return true
    }

    private fun setupBatteryStatusReceiver() {
        val batteryStatusReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
            }
        }
        val ifilter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        this.registerReceiver(batteryStatusReceiver, ifilter)
    }

    private fun setupQRCodeDialog() {
        binding.btnShare.setOnClickListener {
            showQRCodeDialog()
        }
    }

    private fun showQRCodeDialog() {
        val qrCodeDialogFragment = QRCodeDialogFragment()

        qrCodeDialogFragment.qrCodeBitmap = generateQRCodeBitmap("Your content here")

        qrCodeDialogFragment.show(supportFragmentManager, QRCodeDialogFragment.TAG)
    }

    private fun generateQRCodeBitmap(content: String): Bitmap {
        return Bitmap.createBitmap(200, 200, Bitmap.Config.ARGB_8888) // Placeholder
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacksAndMessages(null)
        // this.unregisterReceiver(batteryStatusReceiver) // Descomente se o receiver estiver registrado
    }

    companion object {
        private const val DEFAULT_ADD_TIME =
            30
    }
}

