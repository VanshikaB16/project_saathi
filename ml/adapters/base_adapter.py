"""
Project Saathi - Base Screening Model Adapter Interface
Defines the standard contract for on-device edge screening models.
Screening models strictly produce risk indicators / flags, NEVER diagnoses.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, Any, Optional, List
import time


class ScreeningFlag(str, Enum):
    GREEN = "GREEN"  # No concerning sign detected by this screening
    AMBER = "AMBER"  # Follow-up or repeat check recommended
    RED = "RED"      # Prompt medical assessment recommended
    UNCLEAR = "IMAGE_UNCLEAR"  # Low quality / lighting / blur / improper source
    MODEL_UNAVAILABLE = "MODEL_UNAVAILABLE"  # On-device model missing or corrupted
    CLINICIAN_REVIEW_REQUIRED = "CLINICIAN_REVIEW_REQUIRED"
    EMERGENCY = "EMERGENCY_PATHWAY"


@dataclass
class QualityCheckResult:
    is_usable: bool
    blur_score: float
    exposure_score: float
    framing_score: float
    anatomy_visible: bool
    hardware_compatible: bool
    feedback_message: str
    feedback_spoken_en: str
    feedback_spoken_hi: str


@dataclass
class ScreeningOutput:
    model_id: str
    model_version: str
    is_demonstration: bool
    flag: ScreeningFlag
    confidence: float
    primary_message_en: str
    primary_message_hi: str
    spoken_message_en: str
    spoken_message_hi: str
    recommended_action_en: str
    recommended_action_hi: str
    follow_up_interval_days: Optional[int]
    urgency_tier: str  # "routine", "scheduled_check", "prompt_assessment", "emergency"
    raw_probabilities: Dict[str, float] = field(default_factory=dict)
    limitations_disclaimer: str = (
        "This screening check is an assistive triage tool and does not provide a medical diagnosis. "
        "A negative screening does not rule out disease."
    )
    inference_latency_ms: float = 0.0


class BaseScreeningAdapter(ABC):
    """
    Common screening interface enforcing clinical safety governance:
    - Pre-inference quality gating
    - Safe failure handling (NEVER defaults to GREEN on error)
    - Structured, non-diagnostic result mapping
    """

    def __init__(self, model_id: str, model_version: str, is_demonstration: bool = True):
        self.model_id = model_id
        self.model_version = model_version
        self.is_demonstration = is_demonstration

    @abstractmethod
    def validate_input(self, input_data: Any) -> bool:
        """Validate input type, dimensions, and metadata compatibility."""
        pass

    @abstractmethod
    def assess_quality(self, input_data: Any) -> QualityCheckResult:
        """Assess blur, exposure, framing, and anatomical viability."""
        pass

    @abstractmethod
    def preprocess(self, input_data: Any) -> Any:
        """Normalize, resize, and prepare input tensor."""
        pass

    @abstractmethod
    def execute_inference(self, preprocessed_tensor: Any) -> Dict[str, float]:
        """Run on-device inference via TFLite/ONNX runtime."""
        pass

    @abstractmethod
    def map_to_screening_flag(self, probabilities: Dict[str, float]) -> ScreeningOutput:
        """Map raw probabilities to green/amber/red screening flag with safety copy."""
        pass

    def run_screening_pipeline(self, input_data: Any) -> ScreeningOutput:
        """
        End-to-end safe execution pipeline.
        Strict governance:
        1. Input validation
        2. Image quality gate -> reject if unusable
        3. Inference with latency profiling
        4. Safe result mapping
        5. Catch exceptions -> default to CLINICIAN_REVIEW_REQUIRED, NEVER GREEN!
        """
        start_time = time.time()
        try:
            if not self.validate_input(input_data):
                return self._create_failure_output(
                    ScreeningFlag.UNCLEAR,
                    "Invalid input format or incompatible hardware source.",
                    "Input format invalid. Please retake using standard workflow.",
                    "फ़ॉर्मैट अमान्य है। कृपया दोबारा जाँच करें।",
                    time.time() - start_time
                )

            quality = self.assess_quality(input_data)
            if not quality.is_usable:
                return self._create_failure_output(
                    ScreeningFlag.UNCLEAR,
                    quality.feedback_message,
                    quality.feedback_spoken_en,
                    quality.feedback_spoken_hi,
                    time.time() - start_time
                )

            tensor = self.preprocess(input_data)
            probabilities = self.execute_inference(tensor)
            output = self.map_to_screening_flag(probabilities)
            output.inference_latency_ms = (time.time() - start_time) * 1000.0
            return output

        except Exception as e:
            # Clinical safety rule: Technical failure must NEVER become a GREEN result!
            return self._create_failure_output(
                ScreeningFlag.CLINICIAN_REVIEW_REQUIRED,
                f"Screening analysis could not complete: {str(e)}",
                "Technical error occurred. Please refer patient for direct clinical check.",
                "तकनीकी त्रुटि हुई। कृपया सीधे डॉक्टर से जाँच करवाएं।",
                time.time() - start_time
            )

    def _create_failure_output(
        self, flag: ScreeningFlag, msg: str, spoken_en: str, spoken_hi: str, elapsed: float
    ) -> ScreeningOutput:
        return ScreeningOutput(
            model_id=self.model_id,
            model_version=self.model_version,
            is_demonstration=self.is_demonstration,
            flag=flag,
            confidence=0.0,
            primary_message_en=msg,
            primary_message_hi="जाँच पूर्ण नहीं हो सकी।",
            spoken_message_en=spoken_en,
            spoken_message_hi=spoken_hi,
            recommended_action_en="Please retake image under good lighting or refer to clinic.",
            recommended_action_hi="अच्छी रोशनी में दोबारा फोटो लें या अस्पताल भेजें।",
            follow_up_interval_days=None,
            urgency_tier="scheduled_check" if flag == ScreeningFlag.UNCLEAR else "prompt_assessment",
            inference_latency_ms=elapsed * 1000.0
        )
