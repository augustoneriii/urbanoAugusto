package com.urban.mobile.views

import android.app.Dialog
import android.os.Bundle
import android.view.LayoutInflater
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.DialogFragment
import com.urban.urbanmobile.databinding.DialogPasswordBinding

class PasswordDialogFragment : DialogFragment() {

    private var _binding: DialogPasswordBinding? = null
    private val binding get() = _binding!!
    private var onPasswordEnteredListener: OnPasswordEnteredListener? = null

    interface OnPasswordEnteredListener {
        fun onPasswordEntered(password: String)
    }

    fun setOnPasswordEnteredListener(listener: OnPasswordEnteredListener) {
        onPasswordEnteredListener = listener
    }

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        _binding = DialogPasswordBinding.inflate(LayoutInflater.from(requireContext()))

        val builder = AlertDialog.Builder(requireContext())
        builder.setView(binding.root)

        binding.buttonSubmit.setOnClickListener {
            val password = binding.editTextPassword.text.toString()
            onPasswordEnteredListener?.onPasswordEntered(password)
            dismiss()
        }

        return builder.create()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

