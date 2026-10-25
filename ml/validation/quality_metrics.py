"""
Project Saathi - Edge Image-Quality Verification Metrics
Evaluates blur, exposure, and framing before inference.
Provides actionable voice prompts in English and Hindi for ASHA field workers.
"""

from dataclasses import dataclass
from typing import Tuple, List, Dict, Any


@dataclass
class QualityAssessment:
    passed: bool
    blur_score: float
    exposure_score: float
    framing_ratio: float
    feedback_text_en: str
    feedback_text_hi: str
    audio_cue_en: str
    audio_cue_hi: str
    error_code: str


class ImageQualityAssessor:
    """
    On-device image quality gatekeeper.
    Rejects degraded inputs before ML inference to prevent misleading predictions.
    """

    MIN_BLUR_THRESHOLD = 110.0
    MIN_LUMINANCE = 45.0
    MAX_LUMINANCE = 220.0
    MIN_RESOLUTION_PIXELS = 400 * 400

    @classmethod
    def evaluate(
        cls,
        width: int,
        height: int,
        blur_variance: float,
        mean_luminance: float,
        object_bounding_box_ratio: float = 0.5
    ) -> QualityAssessment:
        total_pixels = width * height

        # 1. Resolution Check
        if total_pixels < cls.MIN_RESOLUTION_PIXELS:
            return QualityAssessment(
                passed=False,
                blur_score=blur_variance,
                exposure_score=mean_luminance,
                framing_ratio=object_bounding_box_ratio,
                feedback_text_en="Image resolution too low. Please bring the camera closer.",
                feedback_text_hi="फ़ोटो का रिज़ॉल्यूशन कम है। कृपया कैमरे को थोड़ा और पास लाएं।",
                audio_cue_en="Bring the camera closer.",
                audio_cue_hi="कैमरा थोड़ा और पास लाएं।",
                error_code="LOW_RESOLUTION"
            )

        # 2. Blur / Motion Check
        if blur_variance < cls.MIN_BLUR_THRESHOLD:
            return QualityAssessment(
                passed=False,
                blur_score=blur_variance,
                exposure_score=mean_luminance,
                framing_ratio=object_bounding_box_ratio,
                feedback_text_en="Image is blurry due to phone movement. Hold steady.",
                feedback_text_hi="फ़ोटो धुंधली है। कृपया हाथ स्थिर रखकर दोबारा फ़ोटो लें।",
                audio_cue_en="Hold the phone steady.",
                audio_cue_hi="फ़ोन को स्थिर पकड़ें।",
                error_code="BLUR_DETECTED"
            )

        # 3. Underexposure (Dark / Poor Light)
        if mean_luminance < cls.MIN_LUMINANCE:
            return QualityAssessment(
                passed=False,
                blur_score=blur_variance,
                exposure_score=mean_luminance,
                framing_ratio=object_bounding_box_ratio,
                feedback_text_en="Lighting is too dark. Move near a window or open door.",
                feedback_text_hi="रोशनी बहुत कम है। कृपया खिड़की या बाहर प्राकृतिक रोशनी में आएं।",
                audio_cue_en="Move to better light.",
                audio_cue_hi="बेहतर रोशनी में आएं।",
                error_code="UNDEREXPOSED"
            )

        # 4. Overexposure / Glare
        if mean_luminance > cls.MAX_LUMINANCE:
            return QualityAssessment(
                passed=False,
                blur_score=blur_variance,
                exposure_score=mean_luminance,
                framing_ratio=object_bounding_box_ratio,
                feedback_text_en="Too bright or camera flash glare. Please step away from direct reflection.",
                feedback_text_hi="बहुत तेज़ चमक या फ़्लैश की रोशनी है। सीधी धूप से बचें।",
                audio_cue_en="Avoid direct glare or flash.",
                audio_cue_hi="सीधी चमक से बचें।",
                error_code="OVEREXPOSED"
            )

        # 5. Framing Check
        if object_bounding_box_ratio < 0.20:
            return QualityAssessment(
                passed=False,
                blur_score=blur_variance,
                exposure_score=mean_luminance,
                framing_ratio=object_bounding_box_ratio,
                feedback_text_en="Subject is too far away. Center the area of interest in the frame.",
                feedback_text_hi="विषय बहुत दूर है। जाँच के हिस्से को बीच में रखें।",
                audio_cue_en="Center the area in the frame.",
                audio_cue_hi="जाँच के हिस्से को बीच में लाएं।",
                error_code="POOR_FRAMING"
            )

        return QualityAssessment(
            passed=True,
            blur_score=blur_variance,
            exposure_score=mean_luminance,
            framing_ratio=object_bounding_box_ratio,
            feedback_text_en="Image quality is clear and acceptable for screening.",
            feedback_text_hi="फ़ोटो स्पष्ट है और जाँच के लिए उपयुक्त है।",
            audio_cue_en="Image captured properly.",
            audio_cue_hi="फ़ोटो सही ली गई है।",
            error_code="OK"
        )


if __name__ == "__main__":
    # Test cases
    test1 = ImageQualityAssessor.evaluate(640, 480, 75.0, 110.0)
    assert not test1.passed and test1.error_code == "BLUR_DETECTED"

    test2 = ImageQualityAssessor.evaluate(640, 480, 160.0, 30.0)
    assert not test2.passed and test2.error_code == "UNDEREXPOSED"

    test3 = ImageQualityAssessor.evaluate(640, 480, 180.0, 120.0, 0.45)
    assert test3.passed and test3.error_code == "OK"

    print("ImageQualityAssessor unit tests passed successfully.")
