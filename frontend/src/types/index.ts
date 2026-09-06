// ============================================================
// FitnessZone — Core TypeScript Types
// ============================================================

// ── Enums ────────────────────────────────────────────────────

export type Role = "admin" | "staff" | "member";

export type MembershipLevel = "starter" | "builder" | "pro" | "elite";

export type MembershipStatus = "active" | "expired" | "pending" | "cancelled";

export type PaymentMethod = "upi" | "card" | "net_banking" | "cash" | "cheque";

export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

export type GoalType =
  | "weight_loss"
  | "muscle_gain"
  | "endurance"
  | "flexibility"
  | "general_fitness"
  | "custom";

export type AttendanceStatus = "checked_in" | "checked_out" | "absent";

export type ClassStatus = "scheduled" | "ongoing" | "completed" | "cancelled";

// ── Auth ─────────────────────────────────────────────────────

export interface User {
  id: number;
  full_name: string;
  email: string;
  mobile: string;
  role: Role;
  profile_image?: string;
  is_active: boolean;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginPayload {
  email?: string;
  mobile?: string;
  password: string;
}

export interface SignupPayload {
  full_name: string;
  mobile: string;
  email?: string;
  password: string;
}

// ── Members ───────────────────────────────────────────────────

export interface Member {
  id: number;
  member_id: string; // e.g. FZ-00123
  user: User;
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  city: string;
  state: string;
  pincode?: string;
  emergency_contact_name?: string;
  emergency_contact_mobile?: string;
  assigned_trainer_id?: number;
  assigned_trainer?: Trainer;
  current_membership?: Membership;
  attendance_streak: number;
  profile_completion: number; // 0-100
  created_at: string;
  updated_at: string;
}

export interface MemberSummary {
  id: number;
  member_id: string;
  full_name: string;
  mobile: string;
  email: string;
  city: string;
  membership_level?: MembershipLevel;
  membership_status?: MembershipStatus;
  renewal_date?: string;
  attendance_streak: number;
  profile_image?: string;
  is_active: boolean;
}

// ── Membership ────────────────────────────────────────────────

export interface MembershipPlan {
  id: number;
  name: string;
  level: MembershipLevel;
  price_inr: number;
  duration_days: number;
  features: string[];
  personal_training: boolean;
  class_access: boolean;
  guest_passes: number;
  is_active: boolean;
  popular?: boolean;
}

export interface Membership {
  id: number;
  member_id: number;
  plan: MembershipPlan;
  start_date: string;
  end_date: string;
  status: MembershipStatus;
  auto_renew: boolean;
  created_at: string;
}

// ── Payments ──────────────────────────────────────────────────

export interface Payment {
  id: number;
  member: MemberSummary;
  membership_id: number;
  amount_inr: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
  upi_ref?: string;
  payment_date: string;
  notes?: string;
}

// ── Attendance ────────────────────────────────────────────────

export interface AttendanceRecord {
  id: number;
  member_id: number;
  member_name: string;
  check_in: string;
  check_out?: string;
  duration_minutes?: number;
  date: string;
  qr_token?: string;
}

export interface AttendanceSummary {
  total_today: number;
  total_this_month: number;
  avg_daily: number;
  peak_hour: string;
}

// ── Trainers ──────────────────────────────────────────────────

export interface Trainer {
  id: number;
  user: User;
  specialization: string[];
  experience_years: number;
  certifications: string[];
  bio?: string;
  rating?: number;
  total_members: number;
  availability: string; // e.g. "Mon-Sat, 6AM-8PM"
  current_performance?: TrainerMonthlyPerformance;
  is_active?: boolean;
}

// ── Trainer Performance ───────────────────────────────────────

export interface TrainerMonthlyPerformance {
  id: number;
  trainer_id: number;
  trainer_name: string;
  month: number; // 1-12
  year: number;
  target: number;
  achieved: number;
  difference: number;
  achievement_percentage: number;
  overachievement: number;
  remaining: number;
  is_overridden: boolean;
  override_reason?: string;
  overridden_by?: string;
  overridden_at?: string;
}

export interface NextMonthTarget {
  base_target: number;
  adjusted_target: number;
  previous_overachievement: number;
}

export interface PerformanceOverridePayload {
  new_target: number;
  reason: string;
}

// ── Classes / Schedule ────────────────────────────────────────

export interface GymClass {
  id: number;
  name: string;
  trainer: Trainer;
  start_datetime: string;
  end_datetime: string;
  capacity: number;
  enrolled: number;
  available_seats: number;
  location: string;
  status: ClassStatus;
  description?: string;
  level?: "beginner" | "intermediate" | "advanced";
}

export interface ClassBooking {
  id: number;
  member_id: number;
  gym_class: GymClass;
  status: "confirmed" | "waitlisted" | "cancelled";
  booked_at: string;
}

// ── Goals & Progress ──────────────────────────────────────────

export interface Goal {
  id: number;
  member_id: number;
  type: GoalType;
  title: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline?: string;
  progress_percentage: number;
  is_achieved: boolean;
  created_at: string;
}

export interface ProgressRecord {
  id: number;
  member_id: number;
  date: string;
  weight_kg?: number;
  body_fat_percentage?: number;
  chest_cm?: number;
  waist_cm?: number;
  hip_cm?: number;
  arm_cm?: number;
  notes?: string;
}

// ── Dashboard / Analytics ─────────────────────────────────────

export interface AdminDashboardStats {
  total_members: number;
  active_members: number;
  staff_count: number;
  customer_count: number;
  monthly_revenue_inr: number;
  renewals_this_month: number;
  today_attendance: number;
  new_members_this_month: number;
  revenue_growth_pct: number;
  membership_distribution: MembershipDistribution[];
  monthly_revenue_trend: MonthlyRevenue[];
  recent_activity: ActivityItem[];
  alerts: AlertItem[];
}

export interface MembershipDistribution {
  level: MembershipLevel;
  count: number;
  percentage: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  new_members: number;
}

export interface ActivityItem {
  id: number;
  type: "join" | "renewal" | "payment" | "checkin" | "goal_achieved";
  message: string;
  member_name?: string;
  timestamp: string;
}

export interface AlertItem {
  id: number;
  type: "warning" | "info" | "error" | "success";
  message: string;
}

// The real API returns a flattened member shape (no nested `user` object)
export interface FlatMember {
  id: number;
  member_id: string;
  full_name: string;
  mobile: string;
  email: string;
  date_of_birth?: string;
  gender?: string;
  city: string;
  state: string;
  pincode?: string;
  emergency_contact_name?: string;
  emergency_contact_mobile?: string;
  membership_level?: MembershipLevel;
  membership_status?: MembershipStatus;
  attendance_streak: number;
  renewal_date?: string;
  created_at: string;
  assigned_trainer?: Trainer | null;
}

export interface MemberDashboard {
  member: FlatMember;
  membership: Membership | null;
  attendance_streak: number;
  goals: Goal[];
  recent_attendance?: AttendanceRecord[];
  upcoming_classes: GymClass[];
  progress_summary: any | null;
  achievements: Achievement[];
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  earned_at: string;
}

// ── API Response Wrappers ─────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface ApiError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

// ── Trainer Dashboard ─────────────────────────────────────────

export interface TrainerDashboard {
  trainer: Trainer;
  assigned_members: MemberSummary[];
  today_classes: GymClass[];
  upcoming_classes: GymClass[];
  current_month_performance: TrainerMonthlyPerformance;
  next_month_target: NextMonthTarget;
  performance_history: TrainerMonthlyPerformance[];
  member_goals: MemberGoalSummary[];
  recent_check_ins: AttendanceRecord[];
  alerts: AlertItem[];
}

export interface MemberGoalSummary {
  member_id: number;
  member_name: string;
  member_avatar: string;
  goal_title: string;
  goal_type: GoalType;
  progress_percentage: number;
  is_achieved: boolean;
  needs_attention: boolean; // behind schedule
}

