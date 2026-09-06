"""
Trainer Performance Target Service
===================================

Business Logic for monthly customer-acquisition target calculation.

Rules (configurable, not hard-coded):
  - base_next_month_target = previous_month_target × 2
  - overachievement = max(previous_achieved - previous_target, 0)
  - next_month_target = base_next_month_target - overachievement

Example:
  Month 1: target=1000, achieved=1250 → overachievement=250
  Month 2: base=2000, adjusted=1750

The service is the single source of truth for all target calculations.
Frontend never calculates targets independently.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Optional

from django.db import transaction
from django.utils import timezone

from apps.trainers.models import Trainer, TrainerMonthlyPerformance

logger = logging.getLogger(__name__)


# ── Configuration ─────────────────────────────────────────────

# Default target doubling multiplier — change without touching logic
TARGET_MULTIPLIER: int = 2

# Minimum possible target — also used as the first month's starting target
MINIMUM_TARGET: int = 10_000


@dataclass
class NextMonthTargetResult:
    previous_month: int
    previous_year: int
    previous_target: int
    previous_achieved: int
    previous_overachievement: int
    base_next_month_target: int
    adjusted_next_month_target: int
    month: int
    year: int


# ── Target Calculation Engine ─────────────────────────────────

def get_previous_performance(
    trainer: Trainer,
    month: int,
    year: int,
) -> Optional[TrainerMonthlyPerformance]:
    """Return the performance record for the month preceding the given month/year."""
    if month == 1:
        prev_month, prev_year = 12, year - 1
    else:
        prev_month, prev_year = month - 1, year

    return TrainerMonthlyPerformance.objects.filter(
        trainer=trainer,
        month=prev_month,
        year=prev_year,
    ).first()


def calculate_next_month_target(
    trainer: Trainer,
    target_month: int,
    target_year: int,
    starting_target: Optional[int] = None,
) -> NextMonthTargetResult:
    """
    Calculate the adjusted target for target_month/target_year.

    If no previous performance record exists and starting_target is provided,
    that value is used as the starting point. Otherwise defaults to MINIMUM_TARGET.
    """
    if target_month == 1:
        prev_month, prev_year = 12, target_year - 1
    else:
        prev_month, prev_year = target_month - 1, target_year

    prev_perf = TrainerMonthlyPerformance.objects.filter(
        trainer=trainer,
        month=prev_month,
        year=prev_year,
    ).first()

    if prev_perf is None:
        # No history — use provided starting target or minimum
        initial = starting_target if starting_target is not None else MINIMUM_TARGET
        return NextMonthTargetResult(
            previous_month=prev_month,
            previous_year=prev_year,
            previous_target=initial,
            previous_achieved=0,
            previous_overachievement=0,
            base_next_month_target=initial,
            adjusted_next_month_target=initial,
            month=target_month,
            year=target_year,
        )

    prev_target = prev_perf.target
    prev_achieved = prev_perf.achieved
    overachievement = max(prev_achieved - prev_target, 0)
    base_target = prev_target * TARGET_MULTIPLIER
    adjusted_target = max(base_target - overachievement, MINIMUM_TARGET)

    logger.debug(
        "Target for %s %s/%s: base=%d, overachievement=%d → adjusted=%d",
        trainer,
        target_month,
        target_year,
        base_target,
        overachievement,
        adjusted_target,
    )

    return NextMonthTargetResult(
        previous_month=prev_month,
        previous_year=prev_year,
        previous_target=prev_target,
        previous_achieved=prev_achieved,
        previous_overachievement=overachievement,
        base_next_month_target=base_target,
        adjusted_next_month_target=adjusted_target,
        month=target_month,
        year=target_year,
    )


def create_or_get_performance_record(
    trainer: Trainer,
    month: int,
    year: int,
    starting_target: Optional[int] = None,
) -> TrainerMonthlyPerformance:
    """
    Get existing performance record for a month, or create one with
    the auto-calculated target if none exists.
    """
    existing = TrainerMonthlyPerformance.objects.filter(
        trainer=trainer,
        month=month,
        year=year,
    ).first()

    if existing:
        return existing

    calc = calculate_next_month_target(trainer, month, year, starting_target)

    record = TrainerMonthlyPerformance.objects.create(
        trainer=trainer,
        month=month,
        year=year,
        target=calc.adjusted_next_month_target,
        achieved=0,
    )
    return record


@transaction.atomic
def override_target(
    trainer: Trainer,
    month: int,
    year: int,
    new_target: int,
    reason: str,
    overridden_by,
) -> TrainerMonthlyPerformance:
    """
    Manually override the target for a trainer's month.

    Records the original target, who changed it, when, and the reason.
    This is auditable and reversible.
    """
    record = create_or_get_performance_record(trainer, month, year)

    if not record.is_overridden:
        record.original_target = record.target

    record.target = new_target
    record.is_overridden = True
    record.override_reason = reason
    record.overridden_by = overridden_by
    record.overridden_at = timezone.now()
    record.save()

    logger.info(
        "Target overridden for %s %s/%s: %s → %s by %s. Reason: %s",
        trainer,
        month,
        year,
        record.original_target,
        new_target,
        overridden_by,
        reason,
    )

    return record


def update_achieved_count(
    trainer: Trainer,
    month: int,
    year: int,
    achieved: int,
) -> TrainerMonthlyPerformance:
    """Update the achieved customers count for a given month."""
    record = create_or_get_performance_record(trainer, month, year)
    record.achieved = achieved
    record.save()
    return record
