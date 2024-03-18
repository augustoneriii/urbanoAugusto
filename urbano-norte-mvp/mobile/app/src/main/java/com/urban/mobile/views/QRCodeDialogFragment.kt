import android.content.Context
import android.graphics.Bitmap
import android.os.Bundle
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.DialogFragment
import com.urban.mobile.views.MainActivity
import com.urban.urbanmobile.databinding.DialogQrCodeBinding

class QRCodeDialogFragment : DialogFragment() {

    private var _binding: DialogQrCodeBinding? = null
    private val binding get() = _binding!!

    var qrCodeBitmap: Bitmap? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = DialogQrCodeBinding.inflate(inflater, container, false)
        return binding.root
        isCancelable = true

    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
//        super.onViewCreated(view, savedInstanceState)
//        binding.imageViewQrCode.setImageBitmap(qrCodeBitmap)
    }

    override fun onStart() {
        super.onStart()
        dialog?.window?.apply {
            // Set the size of the dialog
            setLayout(300.dpToPixelsInt(context), 340.dpToPixelsInt(context))

            val attributes = attributes
            attributes.gravity = Gravity.TOP or Gravity.START

            val location = IntArray(2)
            (activity as? MainActivity)?.binding?.btnShare?.getLocationInWindow(location)

            val yOffset = (activity as? MainActivity)?.binding?.btnShare?.height ?: 0

            attributes.x = location[0]
            attributes.y =
                location[1] + yOffset

            setDimAmount(0f)

            this.attributes = attributes
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    fun Int.dpToPixelsInt(context: Context?): Int {
        val metrics = context?.resources?.displayMetrics
        return (this * (metrics?.density ?: 1f)).toInt()
    }

    companion object {
        const val TAG = "QRCodeDialogFragment"
    }
}
