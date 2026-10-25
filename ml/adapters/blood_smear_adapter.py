"""
Project Saathi - Blood Smear Microscopic Review Adapter
Stage 4 of the Blood-Cancer Screening Funnel.
Strict clinical governance:
- Requires high-magnification microscope image from authorized lab equipment.
- Standard phone photographs of skin, bruising, or CBC tubes are strictly rejected.
- Only assists trained laboratory personnel by highlighting candidate cells.
- NEVER confirms or diagnoses leukemia.
"""

from typing import Dict, Any, List
from .base_adapter import BaseScreeningAdapter, ScreeningOutput, ScreeningFlag, QualityCheckResult


class BloodSmearReviewAdapter(BaseScreeningAdapter):

    def __init__(self, is_demonstration: bool = True):
        super().__init__(
            model_id="saathi-smear-v1.0-q8",
            model_version="1.0.0-demo",
            is_demonstration=is_demonstration
        )

    def validate_input(self, input_data: Any) -> bool:
        if not isinstance(input_data, dict):
            return False
        return True

    def assess_quality(self, input_data: Any) -> QualityCheckResult:
        is_skin_photo = input_data.get("is_skin_photo", False)
        is_tube_photo = input_data.get("is_vial_photo", False)
        is_microscopic_smear = input_data.get("is_microscopic_smear", False)

        # Critical safeguard: Reject skin/tube photos
        if is_skin_photo or is_tube_photo or not is_microscopic_smear:
            return QualityCheckResult(
                is_usable=False,
                blur_score=0.0,
                exposure_score=0.0,
                framing_score=0.0,
                anatomy_visible=False,
                hardware_compatible=False,
                feedback_message=(
                    "A standard phone photograph of skin or a blood vial is NOT a blood smear. "
                    "A compatible microscope image captured via optical adapter is required."
                ),
                feedback_spoken_en=(
                    "Microscope photograph required. Standard phone photos cannot review blood cells."
                ),
                feedback_spoken_hi=(
                    "माइक्रोस्कोप की फोटो आवश्यक है। साधारण कैमरे से रक्त कोशिकाओं की जांच नहीं हो सकती।"
                )
            )

        staining_quality_ok = input_data.get("staining_quality_ok", True)
        cell_density_ok = input_data.get("cell_density_ok", True)

        if not staining_quality_ok or not cell_density_ok:
            return QualityCheckResult(
                is_usable=False,
                blur_score=110.0,
                exposure_score=100.0,
                framing_score=0.6,
                anatomy_visible=False,
                hardware_compatible=True,
                feedback_message="Smear staining is uneven or field is too crowded. Move to monolayer zone.",
                feedback_spoken_en="Smear area crowded or poorly stained. Position on monolayer.",
                feedback_spoken_hi="स्लाइड के उस हिस्से पर फोकस करें जहाँ कोशिकाएं अलग-अलग दिखें।"
            )

        return QualityCheckResult(
            is_usable=True,
            blur_score=190.0,
            exposure_score=120.0,
            framing_score=0.92,
            anatomy_visible=True,
            hardware_compatible=True,
            feedback_message="Peripheral smear field usable for laboratory candidate review.",
            feedback_spoken_en="Microscopic slide field verified.",
            feedback_spoken_hi="माइक्रोस्कोप स्लाइड फोटो सत्यापित हुई।"
        )

    def preprocess(self, input_data: Any) -> Any:
        return input_data

    def execute_inference(self, preprocessed_tensor: Any) -> Dict[str, float]:
        candidate_blasts = preprocessed_tensor.get("simulated_candidate_blasts", 0)
        return {
            "candidate_blast_count": float(candidate_blasts),
            "atypical_lymphocyte_flag": 1.0 if candidate_blasts > 0 else 0.0
        }

    def map_to_screening_flag(self, probabilities: Dict[str, float]) -> ScreeningOutput:
        blasts = probabilities.get("candidate_blast_count", 0.0)

        if blasts >= 3.0:
            return ScreeningOutput(
                model_id=self.model_id,
                model_version=self.model_version,
                is_demonstration=self.is_demonstration,
                flag=ScreeningFlag.RED,
                confidence=0.85,
                primary_message_en="Some signs need a closer medical check.",
                primary_message_hi="रक्त स्लाइड में कुछ असामान्य कोशिकाएं दिखी हैं। पैथोलॉजिस्ट द्वारा समीक्षा आवश्यक है।",
                spoken_message_en=(
                    "This check suggests that a medical assessment is needed. "
                    "Your health worker will arrange a specialist referral."
                ),
                spoken_message_hi=(
                    "इस जाँच से पता चलता है कि मेडिकल कॉलेज या जिला अस्पताल के विशेषज्ञ को दिखाना आवश्यक है।"
                ),
                recommended_action_en="Immediate pathologist review and referral to Hematology / Medical Oncology unit for bone marrow evaluation.",
                recommended_action_hi="हेमेटोलॉजिस्ट / पैथोलॉजिस्ट विशेषज्ञ को तुरंत रेफर करें।",
                follow_up_interval_days=2,
                urgency_tier="prompt_assessment",
                raw_probabilities=probabilities
            )
        elif blasts >= 1.0:
            return ScreeningOutput(
                model_id=self.model_id,
                model_version=self.model_version,
                is_demonstration=self.is_demonstration,
                flag=ScreeningFlag.AMBER,
                confidence=0.65,
                primary_message_en="Some signs need a closer medical check.",
                primary_message_hi="कुछ कोशिकाओं पर संदेह है। वरिष्ठ लैब तकनीशियन से पुनः परीक्षण करवाएं।",
                spoken_message_en=(
                    "A closer check may be helpful. Your health worker will explain the next step."
                ),
                spoken_message_hi=(
                    "एक बार फिर जाँच करवाना मददगार हो सकता है।"
                ),
                recommended_action_en="Senior technician manual differential count and repeat CBC smear in 5 days.",
                recommended_action_hi="5 दिनों में वरिष्ठ लैब तकनीशियन से दोबारा स्लाइड जाँच करवाएं।",
                follow_up_interval_days=5,
                urgency_tier="scheduled_check",
                raw_probabilities=probabilities
            )
        else:
            return ScreeningOutput(
                model_id=self.model_id,
                model_version=self.model_version,
                is_demonstration=self.is_demonstration,
                flag=ScreeningFlag.GREEN,
                confidence=0.92,
                primary_message_en="No concerning sign was detected by this screening.",
                primary_message_hi="इस स्लाइड क्षेत्र में कोई असामान्य ब्लास्ट कोशिका नहीं दिखी।",
                spoken_message_en=(
                    "This check did not identify a concerning sign. "
                    "Please continue routine care and follow any advice from your health worker."
                ),
                spoken_message_hi=(
                    "इस जाँच में कोई चिंता की बात नहीं पाई गई है। सामान्य देखभाल जारी रखें।"
                ),
                recommended_action_en="Routine blood smear findings. Correlate with clinical symptoms and CBC parameters.",
                recommended_action_hi="स्लाइड सामान्य प्रतीत होती है। लक्षणों के साथ सीबीसी रिपोर्ट मिलाकर देखें।",
                follow_up_interval_days=None,
                urgency_tier="routine",
                raw_probabilities=probabilities
            )
