"""
Project Saathi - Chest Radiograph & Symptom Screening Adapter
Strict clinical governance:
- A camera photograph of a person's chest cannot substitute for a chest X-ray.
- Rejects non-radiographic skin/torso photos.
- Provides fallback to clinician-reviewed symptom escalation pathway (cough > 2 weeks, hemoptysis, weight loss).
- Never claims to diagnose TB or lung cancer.
"""

from typing import Dict, Any, List
from .base_adapter import BaseScreeningAdapter, ScreeningOutput, ScreeningFlag, QualityCheckResult


class ChestScreeningAdapter(BaseScreeningAdapter):

    def __init__(self, is_demonstration: bool = True):
        super().__init__(
            model_id="saathi-chest-v1.0-q8",
            model_version="1.0.0-demo",
            is_demonstration=is_demonstration
        )

    def validate_input(self, input_data: Any) -> bool:
        if not isinstance(input_data, dict):
            return False
        return True

    def assess_quality(self, input_data: Any) -> QualityCheckResult:
        is_torso_skin_photo = input_data.get("is_torso_skin_photo", False)
        is_genuine_radiograph = input_data.get("is_genuine_radiograph", False)

        # Critical clinical safeguard: Torso photo rejected
        if is_torso_skin_photo or not is_genuine_radiograph:
            return QualityCheckResult(
                is_usable=False,
                blur_score=0.0,
                exposure_score=0.0,
                framing_score=0.0,
                anatomy_visible=False,
                hardware_compatible=False,
                feedback_message=(
                    "A camera photograph of a person's chest cannot substitute for a chest X-ray. "
                    "Require a genuine radiographic image from an authorized source or "
                    "follow the clinical symptom checklist."
                ),
                feedback_spoken_en=(
                    "A camera photo of the chest cannot see lung disease. "
                    "Please import a chest X-ray or follow the symptom questions."
                ),
                feedback_spoken_hi=(
                    "छाती की साधारण फोटो से फेफड़ों की बीमारी नहीं देखी जा सकती। "
                    "कृपया एक्स-रे आयात करें या लक्षणों वाले सवालों के जवाब दें।"
                )
            )

        blur_score = input_data.get("blur_variance", 180.0)
        lung_fields_visible = input_data.get("lung_fields_visible", True)

        if not lung_fields_visible or blur_score < 100.0:
            return QualityCheckResult(
                is_usable=False,
                blur_score=blur_score,
                exposure_score=110.0,
                framing_score=0.5,
                anatomy_visible=False,
                hardware_compatible=True,
                feedback_message="Radiograph exposure insufficient or costophrenic angles cut off.",
                feedback_spoken_en="X-ray image is cropped or underpenetrated. Import complete PA view.",
                feedback_spoken_hi="एक्स-रे अधूरा है या स्पष्ट नहीं दिख रहा। पूरा एक्स-रे अपलोड करें।"
            )

        return QualityCheckResult(
            is_usable=True,
            blur_score=blur_score,
            exposure_score=120.0,
            framing_score=0.95,
            anatomy_visible=True,
            hardware_compatible=True,
            feedback_message="Chest radiograph quality validated.",
            feedback_spoken_en="Chest X-ray verified.",
            feedback_spoken_hi="छाती का एक्स-रे सही पाया गया।"
        )

    def evaluate_symptoms_fallback(self, symptoms: Dict[str, bool]) -> ScreeningOutput:
        """
        Clinician-reviewed symptom escalation pathway when imaging is unavailable.
        Does NOT depend on image-model output.
        """
        cough_over_2_weeks = symptoms.get("cough_over_2_weeks", False)
        hemoptysis = symptoms.get("coughing_blood", False)
        unexplained_weight_loss = symptoms.get("unexplained_weight_loss", False)
        night_sweats = symptoms.get("night_sweats", False)
        fever_over_2_weeks = symptoms.get("fever_over_2_weeks", False)

        has_urgent_warning = hemoptysis or (cough_over_2_weeks and fever_over_2_weeks)
        has_moderate_warning = cough_over_2_weeks or unexplained_weight_loss or night_sweats

        if has_urgent_warning:
            return ScreeningOutput(
                model_id="saathi-symptom-tb-v1",
                model_version="1.0.0-clinical-rules",
                is_demonstration=self.is_demonstration,
                flag=ScreeningFlag.RED,
                confidence=1.0,
                primary_message_en="Some signs need a closer medical check.",
                primary_message_hi="गंभीर लक्षण पाए गए हैं। तुरंत डॉक्टर की जाँच आवश्यक है।",
                spoken_message_en=(
                    "This check suggests that a medical assessment is needed. "
                    "Your health worker will help arrange the next step for sputum testing."
                ),
                spoken_message_hi=(
                    "इस जाँच से पता चलता है कि तुरंत डॉक्टर से मिलना और बलगम की जाँच कराना आवश्यक है।"
                ),
                recommended_action_en="Urgent referral to CHC / NTEP Tuberculosis testing unit for sputum microscopy and NAAT (CBNAAT/TrueNat).",
                recommended_action_hi="तुरंत सीएचसी अस्पताल में बलगम (CBNAAT) जाँच के लिए रेफरल करें।",
                follow_up_interval_days=2,
                urgency_tier="prompt_assessment"
            )
        elif has_moderate_warning:
            return ScreeningOutput(
                model_id="saathi-symptom-tb-v1",
                model_version="1.0.0-clinical-rules",
                is_demonstration=self.is_demonstration,
                flag=ScreeningFlag.AMBER,
                confidence=0.8,
                primary_message_en="Some signs need a closer medical check.",
                primary_message_hi="लगातार खांसी या वजन घटने के कारण जाँच की सलाह दी जाती है।",
                spoken_message_en=(
                    "A closer check may be helpful. Your health worker will explain the next step."
                ),
                spoken_message_hi=(
                    "एक बार अस्पताल में डॉक्टर को दिखाना मददगार रहेगा।"
                ),
                recommended_action_en="Consult medical officer at PHC within 5 days for clinical evaluation.",
                recommended_action_hi="5 दिनों के अंदर प्राथमिक स्वास्थ्य केंद्र के डॉक्टर को दिखाएं।",
                follow_up_interval_days=5,
                urgency_tier="scheduled_check"
            )
        else:
            return ScreeningOutput(
                model_id="saathi-symptom-tb-v1",
                model_version="1.0.0-clinical-rules",
                is_demonstration=self.is_demonstration,
                flag=ScreeningFlag.GREEN,
                confidence=0.9,
                primary_message_en="No concerning sign was detected by this screening.",
                primary_message_hi="जाँच में कोई गंभीर श्वसन लक्षण नहीं मिला।",
                spoken_message_en=(
                    "This check did not identify a concerning sign. "
                    "Please continue routine care and follow any advice from your health worker."
                ),
                spoken_message_hi=(
                    "जाँच में कोई चिंता की बात नहीं पाई गई है। यदि खांसी बढ़े तो तुरंत संपर्क करें।"
                ),
                recommended_action_en="Routine health care. Contact ASHA worker if cough develops or lasts more than 2 weeks.",
                recommended_action_hi="सामान्य स्वास्थ्य सलाह। यदि खांसी दो सप्ताह से अधिक चले तो तुरंत आशा दीदी को बताएं।",
                follow_up_interval_days=None,
                urgency_tier="routine"
            )

    def preprocess(self, input_data: Any) -> Any:
        return input_data

    def execute_inference(self, preprocessed_tensor: Any) -> Dict[str, float]:
        score = preprocessed_tensor.get("simulated_abnormality_score", 0.1)
        return {"normal": 1.0 - score, "pulmonary_abnormality": score}

    def map_to_screening_flag(self, probabilities: Dict[str, float]) -> ScreeningOutput:
        p_abnormal = probabilities.get("pulmonary_abnormality", 0.0)

        if p_abnormal >= 0.45:
            return ScreeningOutput(
                model_id=self.model_id,
                model_version=self.model_version,
                is_demonstration=self.is_demonstration,
                flag=ScreeningFlag.RED,
                confidence=round(p_abnormal, 2),
                primary_message_en="Some signs need a closer medical check.",
                primary_message_hi="एक्स-रे में फेफड़ों के कुछ लक्षण दिखे हैं जिनकी डॉक्टर द्वारा जाँच आवश्यक है।",
                spoken_message_en=(
                    "This check suggests that a medical assessment is needed. "
                    "Your health worker can help arrange the next step."
                ),
                spoken_message_hi=(
                    "इस जाँच से पता चलता है कि छाती के विशेषज्ञ डॉक्टर को दिखाना ज़रूरी है। आपकी आशा दीदी आगे की व्यवस्था करेंगी।"
                ),
                recommended_action_en="Refer to District Hospital chest clinic for sputum NAAT and physician review within 3 days.",
                recommended_action_hi="3 दिन के भीतर जिला अस्पताल में बलगम जाँच एवं विशेषज्ञ परामर्श हेतु जाएं।",
                follow_up_interval_days=3,
                urgency_tier="prompt_assessment",
                raw_probabilities=probabilities
            )
        elif p_abnormal >= 0.25:
            return ScreeningOutput(
                model_id=self.model_id,
                model_version=self.model_version,
                is_demonstration=self.is_demonstration,
                flag=ScreeningFlag.AMBER,
                confidence=round(p_abnormal, 2),
                primary_message_en="Some signs need a closer medical check.",
                primary_message_hi="हल्के लक्षण दिखे हैं। दोबारा जाँच या डॉक्टर से सलाह उपयोगी होगी।",
                spoken_message_en=(
                    "A closer check may be helpful. Your health worker will explain the next step."
                ),
                spoken_message_hi=(
                    "एक बार फिर जाँच करवाना मददगार हो सकता है।"
                ),
                recommended_action_en="Consult medical officer at PHC for physical examination within 7 days.",
                recommended_action_hi="7 दिनों के भीतर प्राथमिक स्वास्थ्य केंद्र के डॉक्टर से मिलें।",
                follow_up_interval_days=7,
                urgency_tier="scheduled_check",
                raw_probabilities=probabilities
            )
        else:
            return ScreeningOutput(
                model_id=self.model_id,
                model_version=self.model_version,
                is_demonstration=self.is_demonstration,
                flag=ScreeningFlag.GREEN,
                confidence=round(probabilities.get("normal", 0.95), 2),
                primary_message_en="No concerning sign was detected by this screening.",
                primary_message_hi="एक्स-रे में कोई गंभीर लक्षण नहीं दिखा।",
                spoken_message_en=(
                    "This check did not identify a concerning sign. "
                    "Please continue routine care and follow any advice from your health worker."
                ),
                spoken_message_hi=(
                    "इस जाँच में कोई चिंताजनक बात नहीं मिली। सामान्य देखभाल जारी रखें।"
                ),
                recommended_action_en="Routine follow-up. Remember that early screening does not replace clinical evaluation if symptoms arise.",
                recommended_action_hi="नियमित दिनचर्या रखें। यदि लक्षण दिखें तो आशा दीदी को बताएं।",
                follow_up_interval_days=None,
                urgency_tier="routine",
                raw_probabilities=probabilities
            )
