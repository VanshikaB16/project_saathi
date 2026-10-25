"""
Project Saathi - Eye & Retina Screening Adapter
Enforces clinical requirement:
- A standard phone photograph of an eye is NOT equivalent to a retinal fundus photograph.
- Optical fundus camera attachment (e.g., Remidio/Volk) is strictly required for retinal inference.
- If equipment unavailable, guides worker through symptom/risk factor referral instead.
"""

from typing import Dict, Any
from .base_adapter import BaseScreeningAdapter, ScreeningOutput, ScreeningFlag, QualityCheckResult


class RetinaScreeningAdapter(BaseScreeningAdapter):

    def __init__(self, is_demonstration: bool = True):
        super().__init__(
            model_id="saathi-retina-v1.0-q8",
            model_version="1.0.1-demo",
            is_demonstration=is_demonstration
        )

    def validate_input(self, input_data: Any) -> bool:
        if not isinstance(input_data, dict):
            return False
        return True

    def assess_quality(self, input_data: Any) -> QualityCheckResult:
        has_fundus_attachment = input_data.get("has_fundus_attachment", False)
        is_external_eye_photo = input_data.get("is_external_eye_photo", False)

        # Critical clinical safeguard: External phone eye photo rejection
        if is_external_eye_photo or not has_fundus_attachment:
            return QualityCheckResult(
                is_usable=False,
                blur_score=0.0,
                exposure_score=0.0,
                framing_score=0.0,
                anatomy_visible=False,
                hardware_compatible=False,
                feedback_message=(
                    "Retinal imaging attachment not detected. A standard phone camera photo "
                    "cannot see inside the eye or evaluate the retina. "
                    "Do not use external photos for retinal screening."
                ),
                feedback_spoken_en=(
                    "Retinal lens attachment is required. Standard eye photos cannot evaluate the retina. "
                    "Please refer patient to an eye care centre."
                ),
                feedback_spoken_hi=(
                    "रेटिना की जाँच के लिए विशेष लेंस की आवश्यकता है। "
                    "सामान्य कैमरे से आंख के भीतर की जांच नहीं हो सकती। कृपया आंख अस्पताल में रेफर करें।"
                )
            )

        blur_score = input_data.get("blur_variance", 200.0)
        optic_disc_visible = input_data.get("optic_disc_visible", True)

        if not optic_disc_visible or blur_score < 120.0:
            return QualityCheckResult(
                is_usable=False,
                blur_score=blur_score,
                exposure_score=100.0,
                framing_score=0.4,
                anatomy_visible=False,
                hardware_compatible=True,
                feedback_message="Retinal fundus image is out of focus or optic disc not centered.",
                feedback_spoken_en="Re-center the fundus lens on the pupil and hold steady.",
                feedback_spoken_hi="लेंस को पुतली के केंद्र में रखें और हाथ स्थिर रखें।"
            )

        return QualityCheckResult(
            is_usable=True,
            blur_score=blur_score,
            exposure_score=120.0,
            framing_score=0.9,
            anatomy_visible=True,
            hardware_compatible=True,
            feedback_message="Fundus photograph quality acceptable.",
            feedback_spoken_en="Retinal image captured properly.",
            feedback_spoken_hi="रेटिना की फोटो सही ली गई है।"
        )

    def preprocess(self, input_data: Any) -> Any:
        return input_data

    def execute_inference(self, preprocessed_tensor: Any) -> Dict[str, float]:
        dr_stage = preprocessed_tensor.get("simulated_dr_grade", 0)
        if dr_stage >= 2:
            return {"no_dr": 0.10, "mild": 0.20, "referable_dr": 0.70}
        elif dr_stage == 1:
            return {"no_dr": 0.40, "mild": 0.45, "referable_dr": 0.15}
        else:
            return {"no_dr": 0.92, "mild": 0.06, "referable_dr": 0.02}

    def map_to_screening_flag(self, probabilities: Dict[str, float]) -> ScreeningOutput:
        p_referable = probabilities.get("referable_dr", 0.0)
        p_mild = probabilities.get("mild", 0.0)

        if p_referable >= 0.35:
            return ScreeningOutput(
                model_id=self.model_id,
                model_version=self.model_version,
                is_demonstration=self.is_demonstration,
                flag=ScreeningFlag.RED,
                confidence=round(p_referable, 2),
                primary_message_en="Some signs need a closer medical check.",
                primary_message_hi="आंख के पर्दे (रेटिना) की डॉक्टर द्वारा जाँच आवश्यक है।",
                spoken_message_en=(
                    "This check suggests that a medical assessment is needed. "
                    "Your health worker can help arrange the next step."
                ),
                spoken_message_hi=(
                    "इस जाँच से पता चलता है कि नेत्र विशेषज्ञ (आंख के डॉक्टर) को दिखाना ज़रूरी है। "
                    "आपकी आशा दीदी सहायता करेंगी।"
                ),
                recommended_action_en="Arrange an ophthalmologist assessment at the District Hospital within 14 days.",
                recommended_action_hi="जिला अस्पताल के नेत्र रोग विशेषज्ञ के पास 14 दिनों के भीतर दिखाएं।",
                follow_up_interval_days=14,
                urgency_tier="prompt_assessment",
                raw_probabilities=probabilities
            )
        elif p_mild >= 0.30:
            return ScreeningOutput(
                model_id=self.model_id,
                model_version=self.model_version,
                is_demonstration=self.is_demonstration,
                flag=ScreeningFlag.AMBER,
                confidence=round(p_mild, 2),
                primary_message_en="Some signs need a closer medical check.",
                primary_message_hi="हल्के लक्षण दिखे हैं। कुछ महीनों में दोबारा जांच की सलाह दी जाती है।",
                spoken_message_en=(
                    "A closer check may be helpful. Your health worker will explain the next step."
                ),
                spoken_message_hi=(
                    "एक बार फिर जाँच करवाना मददगार हो सकता है। आपकी आशा कार्यकर्ता आगे का मार्गदर्शन करेंगी।"
                ),
                recommended_action_en="Repeat retinal check in 6 months. Maintain blood sugar control with local PHC.",
                recommended_action_hi="6 महीने बाद दोबारा आंख की जांच करवाएं और शुगर नियंत्रित रखें।",
                follow_up_interval_days=180,
                urgency_tier="scheduled_check",
                raw_probabilities=probabilities
            )
        else:
            return ScreeningOutput(
                model_id=self.model_id,
                model_version=self.model_version,
                is_demonstration=self.is_demonstration,
                flag=ScreeningFlag.GREEN,
                confidence=round(probabilities.get("no_dr", 0.90), 2),
                primary_message_en="No concerning sign was detected by this screening.",
                primary_message_hi="इस जाँच में आंख के पर्दे पर कोई गंभीर लक्षण नहीं मिला।",
                spoken_message_en=(
                    "This check did not identify a concerning sign. "
                    "Please continue routine care and follow any advice from your health worker."
                ),
                spoken_message_hi=(
                    "जाँच में कोई चिंताजनक बात नहीं मिली। वार्षिक नेत्र जाँच जारी रखें।"
                ),
                recommended_action_en="Regular annual diabetic eye checkup recommended. Inform worker if vision changes.",
                recommended_action_hi="साल में एक बार नियमित नेत्र जांच कराते रहें। रोशनी धुंधली होने पर तुरंत बताएं।",
                follow_up_interval_days=365,
                urgency_tier="routine",
                raw_probabilities=probabilities
            )
