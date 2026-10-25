"""
Project Saathi - Skin Sign Screening Adapter
Implements safe triage for visible skin signs (lesions, bruising, pallor, petechiae).
Strict clinical governance: Does not infer disease from skin color, does not diagnose cancer/leukemia.
"""

from typing import Dict, Any, Optional
import math
from .base_adapter import BaseScreeningAdapter, ScreeningOutput, ScreeningFlag, QualityCheckResult


class SkinScreeningAdapter(BaseScreeningAdapter):

    def __init__(self, is_demonstration: bool = True):
        super().__init__(
            model_id="saathi-skin-v1.0-q8",
            model_version="1.0.2-demo",
            is_demonstration=is_demonstration
        )

    def validate_input(self, input_data: Any) -> bool:
        if not isinstance(input_data, dict):
            return False
        # Expected keys: image_bytes or image_pixels, width, height, metadata
        return "width" in input_data and "height" in input_data

    def assess_quality(self, input_data: Any) -> QualityCheckResult:
        width = input_data.get("width", 0)
        height = input_data.get("height", 0)
        blur_score = input_data.get("blur_variance", 150.0)
        mean_luminance = input_data.get("mean_luminance", 120.0)

        # 1. Resolution check
        if width < 300 or height < 300:
            return QualityCheckResult(
                is_usable=False,
                blur_score=blur_score,
                exposure_score=mean_luminance,
                framing_score=0.4,
                anatomy_visible=False,
                hardware_compatible=True,
                feedback_message="Resolution too low. Hold camera closer to the lesion.",
                feedback_spoken_en="Bring the camera closer to the skin sign.",
                feedback_spoken_hi="कैमरा त्वचा के थोड़ा और पास लाएं।"
            )

        # 2. Blur / motion check
        if blur_score < 100.0:
            return QualityCheckResult(
                is_usable=False,
                blur_score=blur_score,
                exposure_score=mean_luminance,
                framing_score=0.5,
                anatomy_visible=True,
                hardware_compatible=True,
                feedback_message="Image is blurry. Hold phone steady against motion.",
                feedback_spoken_en="Hold the phone steady.",
                feedback_spoken_hi="फ़ोन को स्थिर पकड़ें।"
            )

        # 3. Lighting check (underexposed or overexposed flash glare)
        if mean_luminance < 40.0:
            return QualityCheckResult(
                is_usable=False,
                blur_score=blur_score,
                exposure_score=mean_luminance,
                framing_score=0.8,
                anatomy_visible=True,
                hardware_compatible=True,
                feedback_message="Too dark. Move patient near natural outdoor or window light.",
                feedback_spoken_en="Move to better light.",
                feedback_spoken_hi="मरीज़ को बेहतर रोशनी में ले जाएं।"
            )

        if mean_luminance > 225.0:
            return QualityCheckResult(
                is_usable=False,
                blur_score=blur_score,
                exposure_score=mean_luminance,
                framing_score=0.8,
                anatomy_visible=True,
                hardware_compatible=True,
                feedback_message="Flash glare detected. Disable flash and use indirect lighting.",
                feedback_spoken_en="Turn off flash and use natural light.",
                feedback_spoken_hi="फ़्लैश बंद करें और सीधी रोशनी से बचें।"
            )

        return QualityCheckResult(
            is_usable=True,
            blur_score=blur_score,
            exposure_score=mean_luminance,
            framing_score=0.95,
            anatomy_visible=True,
            hardware_compatible=True,
            feedback_message="Image quality acceptable.",
            feedback_spoken_en="Image captured properly.",
            feedback_spoken_hi="फोटो सही ढंग से ली गई है।"
        )

    def preprocess(self, input_data: Any) -> Any:
        # Preprocessing simulation (normalize 224x224x3 to [-1, 1])
        return input_data

    def execute_inference(self, preprocessed_tensor: Any) -> Dict[str, float]:
        # Quantized model execution simulation / adapter hooks
        simulated_concern = preprocessed_tensor.get("simulated_concern_level", "low")
        if simulated_concern == "high":
            return {"no_concern": 0.15, "monitor": 0.25, "prompt_assessment": 0.60}
        elif simulated_concern == "medium":
            return {"no_concern": 0.35, "monitor": 0.45, "prompt_assessment": 0.20}
        else:
            return {"no_concern": 0.88, "monitor": 0.08, "prompt_assessment": 0.04}

    def map_to_screening_flag(self, probabilities: Dict[str, float]) -> ScreeningOutput:
        p_prompt = probabilities.get("prompt_assessment", 0.0)
        p_monitor = probabilities.get("monitor", 0.0)

        if p_prompt >= 0.40:
            return ScreeningOutput(
                model_id=self.model_id,
                model_version=self.model_version,
                is_demonstration=self.is_demonstration,
                flag=ScreeningFlag.RED,
                confidence=round(p_prompt, 2),
                primary_message_en="Some signs need a closer medical check.",
                primary_message_hi="कुछ लक्षणों की डॉक्टर द्वारा जाँच आवश्यक है।",
                spoken_message_en=(
                    "This check suggests that a medical assessment is needed. "
                    "Your health worker can help arrange the next step."
                ),
                spoken_message_hi=(
                    "इस जाँच से पता चलता है कि डॉक्टर से मिलना ज़रूरी है। "
                    "आपकी आशा कार्यकर्ता आगे की व्यवस्था करने में मदद करेंगी।"
                ),
                recommended_action_en="Please arrange a medical assessment promptly at the nearest CHC or District Hospital.",
                recommended_action_hi="कृपया नजदीकी सामुदायिक स्वास्थ्य केंद्र (सीएचसी) में तुरंत डॉक्टर से संपर्क करें।",
                follow_up_interval_days=3,
                urgency_tier="prompt_assessment",
                raw_probabilities=probabilities
            )

        elif p_monitor >= 0.35 or p_prompt >= 0.20:
            return ScreeningOutput(
                model_id=self.model_id,
                model_version=self.model_version,
                is_demonstration=self.is_demonstration,
                flag=ScreeningFlag.AMBER,
                confidence=round(p_monitor, 2),
                primary_message_en="Some signs need a closer medical check.",
                primary_message_hi="लक्षणों पर नज़र रखना और दोबारा जाँच उपयोगी हो सकती है।",
                spoken_message_en=(
                    "A closer check may be helpful. Your health worker will explain the next step."
                ),
                spoken_message_hi=(
                    "एक बार फिर जाँच करवाना मददगार हो सकता है। आपकी आशा दीदी आगे की बात समझाएंगी।"
                ),
                recommended_action_en="Schedule a recheck in 7 to 14 days or visit the Primary Health Centre if lesion changes.",
                recommended_action_hi="7 से 14 दिनों में दोबारा दिखाएं या बदलाव होने पर पीएचसी जाएं।",
                follow_up_interval_days=10,
                urgency_tier="scheduled_check",
                raw_probabilities=probabilities
            )

        else:
            return ScreeningOutput(
                model_id=self.model_id,
                model_version=self.model_version,
                is_demonstration=self.is_demonstration,
                flag=ScreeningFlag.GREEN,
                confidence=round(probabilities.get("no_concern", 0.90), 2),
                primary_message_en="No concerning sign was detected by this screening.",
                primary_message_hi="इस जाँच में कोई चिंताजनक लक्षण नहीं दिखा।",
                spoken_message_en=(
                    "This check did not identify a concerning sign. "
                    "Please continue routine care and follow any advice from your health worker."
                ),
                spoken_message_hi=(
                    "इस जाँच में कोई चिंता की बात नहीं पाई गई है। "
                    "सामान्य देखभाल जारी रखें और अपनी आशा दीदी की सलाह का पालन करें।"
                ),
                recommended_action_en="Continue routine personal care. Return if you notice bleeding, rapid growth, or colour changes.",
                recommended_action_hi="नियमित देखभाल जारी रखें। यदि कोई नया बदलाव दिखे तो तुरंत सूचित करें।",
                follow_up_interval_days=None,
                urgency_tier="routine",
                raw_probabilities=probabilities
            )
