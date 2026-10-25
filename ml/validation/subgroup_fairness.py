"""
Project Saathi - Subgroup Fairness and Clinical Safety Metrics Evaluator
Standard library only (no external dependencies required).
Audits model performance across demographics to prevent disparate impact and bias.
"""

from dataclasses import dataclass
from typing import List, Dict, Any, Tuple
import math


@dataclass
class EvaluationSample:
    sample_id: str
    ground_truth_referral: bool  # Clinician confirmed need for medical check
    model_predicted_flag: str    # "GREEN", "AMBER", "RED", "UNCLEAR"
    subgroup_age: str           # "pediatric", "adult", "elderly"
    subgroup_gender: str        # "female", "male", "other"
    subgroup_skintone: str      # "fitzpatrick_iv", "fitzpatrick_v", "fitzpatrick_vi"
    device_model: str           # e.g., "redmi_9a", "samsung_m02"


@dataclass
class MetricReport:
    subgroup_name: str
    sample_count: int
    sensitivity: float
    specificity: float
    false_negative_rate: float
    false_positive_rate: float
    ppv: float
    npv: float
    unclear_rejection_rate: float


class SubgroupFairnessEvaluator:
    """
    Evaluates clinical safety metrics across rural demographic subgroups.
    Ensures that high-risk cases are not disproportionately missed in
    vulnerable demographics (pediatric/elderly or deeper skin tones).
    """

    def __init__(self, samples: List[EvaluationSample]):
        self.samples = samples

    def compute_metrics(self, subset: List[EvaluationSample], group_name: str) -> MetricReport:
        if not subset:
            return MetricReport(group_name, 0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)

        tp = 0
        fp = 0
        tn = 0
        fn = 0
        unclear = 0

        for s in subset:
            if s.model_predicted_flag == "UNCLEAR":
                unclear += 1
                continue

            # In triage, AMBER and RED count as triggering a referral check
            pred_refer = s.model_predicted_flag in ("AMBER", "RED")

            if s.ground_truth_referral and pred_refer:
                tp += 1
            elif not s.ground_truth_referral and pred_refer:
                fp += 1
            elif not s.ground_truth_referral and not pred_refer:
                tn += 1
            elif s.ground_truth_referral and not pred_refer:
                fn += 1

        usable = len(subset) - unclear
        sensitivity = (tp / (tp + fn)) if (tp + fn) > 0 else 0.0
        specificity = (tn / (tn + fp)) if (tn + fp) > 0 else 0.0
        fnr = 1.0 - sensitivity
        fpr = 1.0 - specificity
        ppv = (tp / (tp + fp)) if (tp + fp) > 0 else 0.0
        npv = (tn / (tn + fn)) if (tn + fn) > 0 else 0.0
        rejection_rate = unclear / len(subset)

        return MetricReport(
            subgroup_name=group_name,
            sample_count=len(subset),
            sensitivity=round(sensitivity, 4),
            specificity=round(specificity, 4),
            false_negative_rate=round(fnr, 4),
            false_positive_rate=round(fpr, 4),
            ppv=round(ppv, 4),
            npv=round(npv, 4),
            unclear_rejection_rate=round(rejection_rate, 4)
        )

    def evaluate_all_subgroups(self) -> Dict[str, List[MetricReport]]:
        results = {
            "overall": [self.compute_metrics(self.samples, "Overall Cohort")],
            "skin_tone": [],
            "age_bracket": [],
            "gender": []
        }

        # Skin tones
        for tone in ("fitzpatrick_iv", "fitzpatrick_v", "fitzpatrick_vi"):
            subset = [s for s in self.samples if s.subgroup_skintone == tone]
            results["skin_tone"].append(self.compute_metrics(subset, tone))

        # Age
        for age in ("pediatric", "adult", "elderly"):
            subset = [s for s in self.samples if s.subgroup_age == age]
            results["age_bracket"].append(self.compute_metrics(subset, age))

        # Gender
        for g in ("female", "male"):
            subset = [s for s in self.samples if s.subgroup_gender == g]
            results["gender"].append(self.compute_metrics(subset, g))

        return results

    def check_disparity_guardrails(self, max_fnr_gap: float = 0.05) -> Tuple[bool, List[str]]:
        """
        Check if any subgroup suffers from an excessive False Negative Rate gap
        compared to the global average.
        """
        violations = []
        reports = self.evaluate_all_subgroups()
        overall_fnr = reports["overall"][0].false_negative_rate

        for category, sub_list in reports.items():
            if category == "overall":
                continue
            for r in sub_list:
                if r.sample_count >= 10:
                    gap = r.false_negative_rate - overall_fnr
                    if gap > max_fnr_gap:
                        violations.append(
                            f"Safety Violation in {r.subgroup_name}: FNR is {r.false_negative_rate*100:.1f}%, "
                            f"exceeding overall ({overall_fnr*100:.1f}%) by {gap*100:.1f}%."
                        )

        passed = len(violations) == 0
        return passed, violations


if __name__ == "__main__":
    # Test suite run
    mock_samples = [
        EvaluationSample("P1", True, "RED", "adult", "female", "fitzpatrick_iv", "redmi_9a"),
        EvaluationSample("P2", True, "AMBER", "elderly", "female", "fitzpatrick_v", "redmi_9a"),
        EvaluationSample("P3", False, "GREEN", "adult", "male", "fitzpatrick_vi", "samsung_m02"),
        EvaluationSample("P4", True, "RED", "pediatric", "male", "fitzpatrick_vi", "redmi_9a"),
        EvaluationSample("P5", False, "GREEN", "adult", "female", "fitzpatrick_v", "samsung_m02"),
        EvaluationSample("P6", True, "UNCLEAR", "elderly", "female", "fitzpatrick_vi", "samsung_m02"),
        EvaluationSample("P7", False, "AMBER", "adult", "female", "fitzpatrick_iv", "redmi_9a"),
        EvaluationSample("P8", True, "RED", "elderly", "male", "fitzpatrick_v", "redmi_9a"),
    ]
    evaluator = SubgroupFairnessEvaluator(mock_samples)
    reports = evaluator.evaluate_all_subgroups()
    passed, issues = evaluator.check_disparity_guardrails()
    print("Fairness audit passed:", passed)
    print("Overall Sensitivity:", reports["overall"][0].sensitivity)
    print("Overall Specificity:", reports["overall"][0].specificity)
