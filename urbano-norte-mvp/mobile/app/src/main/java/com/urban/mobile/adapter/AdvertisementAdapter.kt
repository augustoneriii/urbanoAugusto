package com.urban.mobile.adapter

import android.graphics.drawable.Drawable
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.MediaController
import android.widget.VideoView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.load.DataSource
import com.bumptech.glide.load.engine.GlideException
import com.bumptech.glide.request.RequestListener
import com.urban.mobile.model.Anuncio
import com.urban.urbanmobile.R

class AdvertisementAdapter(private val anuncios: List<Anuncio>) :
    RecyclerView.Adapter<AdvertisementAdapter.ViewHolder>() {

    private val baseUrl = "http://vps50878.publiccloud.com.br:5000/public/image/anuncio/" // URL base para imagens e vídeos

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val imageView: ImageView = view.findViewById(R.id.image_view)
        val videoView: VideoView = view.findViewById(R.id.video_view)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_advertisement, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val anuncio = anuncios[position]

        val mediaName = anuncio.images.firstOrNull()
        if (mediaName != null) {
            val mediaUrl = baseUrl + mediaName

            if (mediaName.endsWith(".mp4")) {
                holder.imageView.visibility = View.GONE
                holder.videoView.visibility = View.VISIBLE

                // Configurar VideoView
                holder.videoView.layoutParams.width = ViewGroup.LayoutParams.MATCH_PARENT
                holder.videoView.layoutParams.height = ViewGroup.LayoutParams.MATCH_PARENT
                holder.videoView.setVideoPath(mediaUrl)

                // Adicionar MediaController
                val mediaController = MediaController(holder.videoView.context)
                mediaController.setAnchorView(holder.videoView)
                holder.videoView.setMediaController(mediaController)

                holder.videoView.setOnPreparedListener {
                    it.start() // Reproduzir automaticamente quando estiver pronto
                }
            } else {
                holder.videoView.visibility = View.GONE
                holder.imageView.visibility = View.VISIBLE

                // Carregar imagem com Glide
                Glide.with(holder.imageView.context)
                    .load(mediaUrl)
                    .centerInside()
                    .listener(object : RequestListener<Drawable> {
                        override fun onLoadFailed(
                            e: GlideException?,
                            model: Any?,
                            target: com.bumptech.glide.request.target.Target<Drawable>?,
                            isFirstResource: Boolean
                        ): Boolean {
                            Log.e("AdvertisementAdapter", "Erro ao carregar a imagem: $mediaUrl", e)
                            return false // false indica que o Glide não deve tratar o erro
                        }

                        override fun onResourceReady(
                            resource: Drawable?,
                            model: Any?,
                            target: com.bumptech.glide.request.target.Target<Drawable>?,
                            dataSource: DataSource?,
                            isFirstResource: Boolean
                        ): Boolean {
                            return false // false indica que você não quer substituir o comportamento padrão de Glide
                        }
                    })
                    .into(holder.imageView)
            }
        }
    }

    override fun getItemCount() = anuncios.size

    override fun onViewRecycled(holder: ViewHolder) {
        super.onViewRecycled(holder)
        holder.videoView.stopPlayback()
    }
}
