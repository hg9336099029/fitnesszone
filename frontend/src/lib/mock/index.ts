import type {
  AdminDashboardStats,
  MemberSummary,
  MembershipPlan,
  Payment,
  AttendanceRecord,
  AttendanceSummary,
  Trainer,
  TrainerMonthlyPerformance,
  GymClass,
  Goal,
  ProgressRecord,
  MemberDashboard,
  PaginatedResponse,
} from "@/types";

// ============================================================
// MOCK DATA — Realistic Indian gym data for development
// Replace each function by swapping with the real API client
// ============================================================

// ── Helpers ──────────────────────────────────────────────────

const delay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const paginate = <T>(
  data: T[],
  page = 1,
  pageSize = 10
): PaginatedResponse<T> => {
  const start = (page - 1) * pageSize;
  return {
    count: data.length,
    results: data.slice(start, start + pageSize),
    next: start + pageSize < data.length ? `?page=${page + 1}` : undefined,
    previous: page > 1 ? `?page=${page - 1}` : undefined,
  };
};

// ── Membership Plans ─────────────────────────────────────────

const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 1,
    name: "Starter",
    level: "starter",
    price_inr: 999,
    duration_days: 30,
    features: [
      "Full gym access",
      "Locker room access",
      "1 free fitness assessment",
      "Access to cardio zone",
    ],
    personal_training: false,
    class_access: false,
    guest_passes: 0,
    is_active: true,
  },
  {
    id: 2,
    name: "Builder",
    level: "builder",
    price_inr: 1999,
    duration_days: 30,
    features: [
      "All Starter features",
      "Group fitness classes (5/month)",
      "Nutrition consultation (1/month)",
      "Progress tracking",
    ],
    personal_training: false,
    class_access: true,
    guest_passes: 1,
    is_active: true,
    popular: true,
  },
  {
    id: 3,
    name: "Pro",
    level: "pro",
    price_inr: 3499,
    duration_days: 30,
    features: [
      "All Builder features",
      "Unlimited group classes",
      "4 PT sessions/month",
      "Dietary planning",
      "Body composition analysis",
    ],
    personal_training: true,
    class_access: true,
    guest_passes: 2,
    is_active: true,
  },
  {
    id: 4,
    name: "Elite",
    level: "elite",
    price_inr: 5999,
    duration_days: 30,
    features: [
      "All Pro features",
      "Unlimited PT sessions",
      "Priority class booking",
      "Dedicated locker",
      "Guest passes (4/month)",
      "Spa & recovery access",
    ],
    personal_training: true,
    class_access: true,
    guest_passes: 4,
    is_active: true,
  },
];

// ── Members ───────────────────────────────────────────────────

const MEMBERS_DATA: MemberSummary[] = [
  { id: 1, member_id: "FZ-00101", full_name: "Arjun Sharma", mobile: "+91 98765 43210", email: "arjun.sharma@gmail.com", city: "Mumbai", membership_level: "pro", membership_status: "active", renewal_date: "2026-09-15", attendance_streak: 14, is_active: true },
  { id: 2, member_id: "FZ-00102", full_name: "Priya Patel", mobile: "+91 87654 32109", email: "priya.patel@gmail.com", city: "Bengaluru", membership_level: "elite", membership_status: "active", renewal_date: "2026-09-28", attendance_streak: 21, is_active: true },
  { id: 3, member_id: "FZ-00103", full_name: "Rahul Verma", mobile: "+91 76543 21098", email: "rahul.verma@yahoo.com", city: "Delhi", membership_level: "builder", membership_status: "active", renewal_date: "2026-09-10", attendance_streak: 7, is_active: true },
  { id: 4, member_id: "FZ-00104", full_name: "Ananya Singh", mobile: "+91 65432 10987", email: "ananya.singh@outlook.com", city: "Pune", membership_level: "starter", membership_status: "expired", renewal_date: "2026-08-01", attendance_streak: 0, is_active: false },
  { id: 5, member_id: "FZ-00105", full_name: "Kiran Nair", mobile: "+91 54321 09876", email: "kiran.nair@gmail.com", city: "Hyderabad", membership_level: "pro", membership_status: "active", renewal_date: "2026-10-05", attendance_streak: 5, is_active: true },
  { id: 6, member_id: "FZ-00106", full_name: "Meera Iyer", mobile: "+91 43210 98765", email: "meera.iyer@gmail.com", city: "Chennai", membership_level: "elite", membership_status: "active", renewal_date: "2026-09-20", attendance_streak: 30, is_active: true },
  { id: 7, member_id: "FZ-00107", full_name: "Vikram Joshi", mobile: "+91 32109 87654", email: "vikram.joshi@gmail.com", city: "Jaipur", membership_level: "builder", membership_status: "active", renewal_date: "2026-09-12", attendance_streak: 3, is_active: true },
  { id: 8, member_id: "FZ-00108", full_name: "Deepika Reddy", mobile: "+91 21098 76543", email: "deepika.reddy@hotmail.com", city: "Bengaluru", membership_level: "pro", membership_status: "pending", renewal_date: "2026-08-25", attendance_streak: 0, is_active: true },
  { id: 9, member_id: "FZ-00109", full_name: "Amit Kumar", mobile: "+91 90876 54321", email: "amit.kumar@gmail.com", city: "Noida", membership_level: "starter", membership_status: "active", renewal_date: "2026-09-05", attendance_streak: 10, is_active: true },
  { id: 10, member_id: "FZ-00110", full_name: "Sneha Goyal", mobile: "+91 80765 43210", email: "sneha.goyal@gmail.com", city: "Chandigarh", membership_level: "builder", membership_status: "active", renewal_date: "2026-09-18", attendance_streak: 8, is_active: true },
  { id: 11, member_id: "FZ-00111", full_name: "Rohit Malhotra", mobile: "+91 70654 32109", email: "rohit.malhotra@gmail.com", city: "Mumbai", membership_level: "elite", membership_status: "active", renewal_date: "2026-10-10", attendance_streak: 45, is_active: true },
  { id: 12, member_id: "FZ-00112", full_name: "Pooja Desai", mobile: "+91 60543 21098", email: "pooja.desai@gmail.com", city: "Ahmedabad", membership_level: "pro", membership_status: "active", renewal_date: "2026-09-25", attendance_streak: 12, is_active: true },
];

// ── Trainers ──────────────────────────────────────────────────

const TRAINERS_DATA: Trainer[] = [
  {
    id: 1,
    user: { id: 101, full_name: "Rajesh Kapoor", email: "rajesh.kapoor@fitnesszone.in", mobile: "+91 98111 22333", role: "staff", is_active: true, date_joined: "2024-01-15" },
    specialization: ["Strength Training", "Bodybuilding", "Powerlifting"],
    experience_years: 8,
    certifications: ["NSCA-CPT", "ACE Certified", "Diploma in Sports Nutrition"],
    bio: "8+ years transforming bodies with scientific strength training. Expert in progressive overload and nutrition.",
    rating: 4.9,
    total_members: 32,
    availability: "Mon-Sat, 6AM-8PM",
    current_performance: { id: 1, trainer_id: 1, trainer_name: "Rajesh Kapoor", month: 8, year: 2026, target: 40, achieved: 32, difference: -8, achievement_percentage: 80, overachievement: 0, remaining: 8, is_overridden: false },
  },
  {
    id: 2,
    user: { id: 102, full_name: "Sunita Rao", email: "sunita.rao@fitnesszone.in", mobile: "+91 87222 33444", role: "staff", is_active: true, date_joined: "2024-03-01" },
    specialization: ["Yoga", "Pilates", "Flexibility Training", "Women's Fitness"],
    experience_years: 6,
    certifications: ["RYT-500 Yoga Alliance", "Pilates Method Alliance", "ISSA Certified"],
    bio: "Certified yoga and pilates instructor with a holistic approach to women's wellness.",
    rating: 4.8,
    total_members: 28,
    availability: "Mon-Fri, 7AM-7PM",
    current_performance: { id: 2, trainer_id: 2, trainer_name: "Sunita Rao", month: 8, year: 2026, target: 35, achieved: 38, difference: 3, achievement_percentage: 108.6, overachievement: 3, remaining: 0, is_overridden: false },
  },
  {
    id: 3,
    user: { id: 103, full_name: "Mohammed Salim", email: "salim@fitnesszone.in", mobile: "+91 76333 44555", role: "staff", is_active: true, date_joined: "2023-08-10" },
    specialization: ["HIIT", "Cardio", "Boxing", "Weight Loss"],
    experience_years: 5,
    certifications: ["NASM-CPT", "Boxing Coach Level 2"],
    bio: "High-intensity specialist helping clients burn fat and build explosive fitness.",
    rating: 4.7,
    total_members: 25,
    availability: "Tue-Sun, 5AM-9PM",
    current_performance: { id: 3, trainer_id: 3, trainer_name: "Mohammed Salim", month: 8, year: 2026, target: 30, achieved: 30, difference: 0, achievement_percentage: 100, overachievement: 0, remaining: 0, is_overridden: false },
  },
];

// ── Classes ───────────────────────────────────────────────────

const CLASSES_DATA: GymClass[] = [
  { id: 1, name: "Morning Yoga", trainer: TRAINERS_DATA[1], start_datetime: "2026-08-23T07:00:00+05:30", end_datetime: "2026-08-23T08:00:00+05:30", capacity: 20, enrolled: 16, available_seats: 4, location: "Studio A", status: "scheduled", level: "beginner", description: "Start your day right with a calming yoga flow." },
  { id: 2, name: "Power HIIT", trainer: TRAINERS_DATA[2], start_datetime: "2026-08-23T06:00:00+05:30", end_datetime: "2026-08-23T06:45:00+05:30", capacity: 15, enrolled: 15, available_seats: 0, location: "Training Zone", status: "scheduled", level: "advanced", description: "High-intensity interval training to torch calories." },
  { id: 3, name: "Strength Fundamentals", trainer: TRAINERS_DATA[0], start_datetime: "2026-08-23T18:00:00+05:30", end_datetime: "2026-08-23T19:00:00+05:30", capacity: 12, enrolled: 8, available_seats: 4, location: "Weight Room", status: "scheduled", level: "intermediate", description: "Build a solid foundation in compound lifts." },
  { id: 4, name: "Zumba Dance Fitness", trainer: TRAINERS_DATA[1], start_datetime: "2026-08-24T10:00:00+05:30", end_datetime: "2026-08-24T11:00:00+05:30", capacity: 25, enrolled: 18, available_seats: 7, location: "Studio A", status: "scheduled", level: "beginner", description: "Fun cardio dance workout suitable for all levels." },
];

// ── Admin Dashboard ───────────────────────────────────────────

const ADMIN_DASHBOARD: AdminDashboardStats = {
  total_members: 248,
  active_members: 192,
  staff_count: 12,
  customer_count: 236,
  monthly_revenue_inr: 584500,
  renewals_this_month: 47,
  today_attendance: 63,
  new_members_this_month: 22,
  revenue_growth_pct: 14.3,
  membership_distribution: [
    { level: "starter", count: 68, percentage: 27.4 },
    { level: "builder", count: 89, percentage: 35.9 },
    { level: "pro", count: 62, percentage: 25.0 },
    { level: "elite", count: 29, percentage: 11.7 },
  ],
  monthly_revenue_trend: [
    { month: "Mar", revenue: 412000, new_members: 14 },
    { month: "Apr", revenue: 445000, new_members: 18 },
    { month: "May", revenue: 498000, new_members: 20 },
    { month: "Jun", revenue: 521000, new_members: 19 },
    { month: "Jul", revenue: 511000, new_members: 17 },
    { month: "Aug", revenue: 584500, new_members: 22 },
  ],
  recent_activity: [
    { id: 1, type: "join", message: "Sneha Goyal joined with Builder plan", member_name: "Sneha Goyal", timestamp: "2026-08-22T20:15:00+05:30" },
    { id: 2, type: "payment", message: "Arjun Sharma renewed Pro membership (₹3,499)", member_name: "Arjun Sharma", timestamp: "2026-08-22T19:40:00+05:30" },
    { id: 3, type: "goal_achieved", message: "Meera Iyer achieved 30-day attendance streak!", member_name: "Meera Iyer", timestamp: "2026-08-22T18:00:00+05:30" },
    { id: 4, type: "renewal", message: "Kiran Nair's membership expires in 3 days", member_name: "Kiran Nair", timestamp: "2026-08-22T09:00:00+05:30" },
  ],
  alerts: [
    { id: 1, type: "warning", message: "4 memberships expiring this week" },
    { id: 2, type: "info", message: "2 pending payment verifications" },
    { id: 3, type: "success", message: "August revenue target 97% achieved" },
  ],
};

// ── Member Dashboard ──────────────────────────────────────────

const MEMBER_DASHBOARD: MemberDashboard = {
  member: {
    id: 1,
    member_id: "FZ-00101",
    full_name: "Arjun Sharma",
    email: "arjun.sharma@gmail.com",
    mobile: "+91 98765 43210",
    city: "Mumbai",
    state: "Maharashtra",
    assigned_trainer: TRAINERS_DATA[0],
    attendance_streak: 14,
    created_at: "2026-01-10",
  },
  membership: {
    id: 1,
    member_id: 1,
    plan: MEMBERSHIP_PLANS[2],
    start_date: "2026-08-15",
    end_date: "2026-09-15",
    status: "active",
    auto_renew: true,
    created_at: "2026-08-15",
  },
  attendance_streak: 14,
  goals: [
    { id: 1, member_id: 1, type: "weight_loss", title: "Lose 8 kg", target_value: 8, current_value: 5.5, unit: "kg", deadline: "2026-11-01", progress_percentage: 68.75, is_achieved: false, created_at: "2026-01-15" },
    { id: 2, member_id: 1, type: "endurance", title: "Run 5km without stopping", target_value: 5, current_value: 3.2, unit: "km", deadline: "2026-10-01", progress_percentage: 64, is_achieved: false, created_at: "2026-02-01" },
  ],
  recent_attendance: [
    { id: 1, member_id: 1, member_name: "Arjun Sharma", check_in: "2026-08-22T07:02:00+05:30", check_out: "2026-08-22T08:45:00+05:30", duration_minutes: 103, date: "2026-08-22" },
    { id: 2, member_id: 1, member_name: "Arjun Sharma", check_in: "2026-08-21T07:10:00+05:30", check_out: "2026-08-21T08:50:00+05:30", duration_minutes: 100, date: "2026-08-21" },
  ],
  upcoming_classes: [CLASSES_DATA[0], CLASSES_DATA[2]],
  progress_summary: { id: 1, member_id: 1, date: "2026-08-15", weight_kg: 84.5, body_fat_percentage: 22.1, chest_cm: 98, waist_cm: 86, hip_cm: 102, arm_cm: 36 },
  achievements: [
    { id: 1, title: "First Week Warrior", description: "Attended 7 days in a row", icon: "🔥", earned_at: "2026-01-17" },
    { id: 2, title: "Two Week Streak", description: "14 consecutive gym days", icon: "⚡", earned_at: "2026-08-22" },
  ],
};

// ============================================================
// MOCK SERVICE FUNCTIONS (same signature as real API functions)
// ============================================================

export const mockAdminDashboard = async (): Promise<AdminDashboardStats> => {
  await delay(600);
  return ADMIN_DASHBOARD;
};

export const mockGetMembers = async (
  page = 1,
  search = "",
  level?: string,
  status?: string
): Promise<PaginatedResponse<MemberSummary>> => {
  await delay(500);
  let filtered = MEMBERS_DATA;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.full_name.toLowerCase().includes(q) ||
        m.mobile.includes(q) ||
        m.member_id.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
    );
  }
  if (level) filtered = filtered.filter((m) => m.membership_level === level);
  if (status) filtered = filtered.filter((m) => m.membership_status === status);
  return paginate(filtered, page, 10);
};

export const mockGetMemberById = async (id: number): Promise<MemberSummary> => {
  await delay(400);
  const member = MEMBERS_DATA.find((m) => m.id === id);
  if (!member) throw new Error("Member not found");
  return member;
};

export const mockGetMembershipPlans = async (): Promise<MembershipPlan[]> => {
  await delay(300);
  return MEMBERSHIP_PLANS;
};

export const mockGetTrainers = async (): Promise<Trainer[]> => {
  await delay(500);
  return TRAINERS_DATA;
};

export const mockGetTrainerPerformance = async (
  trainerId: number
): Promise<TrainerMonthlyPerformance[]> => {
  await delay(400);
  return [
    { id: 10, trainer_id: trainerId, trainer_name: "Rajesh Kapoor", month: 6, year: 2026, target: 20, achieved: 25, difference: 5, achievement_percentage: 125, overachievement: 5, remaining: 0, is_overridden: false },
    { id: 11, trainer_id: trainerId, trainer_name: "Rajesh Kapoor", month: 7, year: 2026, target: 35, achieved: 32, difference: -3, achievement_percentage: 91.4, overachievement: 0, remaining: 3, is_overridden: false },
    { id: 12, trainer_id: trainerId, trainer_name: "Rajesh Kapoor", month: 8, year: 2026, target: 40, achieved: 32, difference: -8, achievement_percentage: 80, overachievement: 0, remaining: 8, is_overridden: false },
  ];
};

export const mockGetClasses = async (): Promise<GymClass[]> => {
  await delay(400);
  return CLASSES_DATA;
};

export const mockGetMemberDashboard = async (): Promise<MemberDashboard> => {
  await delay(600);
  return MEMBER_DASHBOARD;
};

export const mockGetAttendanceSummary = async (): Promise<AttendanceSummary> => {
  await delay(300);
  return { total_today: 63, total_this_month: 1842, avg_daily: 61.4, peak_hour: "7:00 AM" };
};

export const mockGetPayments = async (
  page = 1
): Promise<PaginatedResponse<Payment>> => {
  await delay(500);
  const payments: Payment[] = MEMBERS_DATA.slice(0, 8).map((m, i) => ({
    id: i + 1,
    member: m,
    membership_id: i + 1,
    amount_inr: [999, 1999, 3499, 5999][i % 4],
    method: (["upi", "card", "net_banking", "cash"] as const)[i % 4],
    status: i % 5 === 0 ? "pending" : "paid",
    transaction_id: `TXN${Date.now()}${i}`,
    payment_date: `2026-08-${String(22 - i).padStart(2, "0")}`,
  }));
  return paginate(payments, page, 10);
};

// ── Trainer Dashboard Mock ────────────────────────────────────

import type { TrainerDashboard, MemberGoalSummary } from "@/types";

const TRAINER_PERFORMANCE_HISTORY: TrainerMonthlyPerformance[] = [
  { id: 1, trainer_id: 1, trainer_name: "Rajesh Kapoor", month: 3, year: 2026, target: 10,   achieved: 12,  difference: 2,   achievement_percentage: 120, overachievement: 2,  remaining: 0, is_overridden: false },
  { id: 2, trainer_id: 1, trainer_name: "Rajesh Kapoor", month: 4, year: 2026, target: 16,   achieved: 18,  difference: 2,   achievement_percentage: 112, overachievement: 2,  remaining: 0, is_overridden: false },
  { id: 3, trainer_id: 1, trainer_name: "Rajesh Kapoor", month: 5, year: 2026, target: 28,   achieved: 25,  difference: -3,  achievement_percentage: 89,  overachievement: 0,  remaining: 3, is_overridden: false },
  { id: 4, trainer_id: 1, trainer_name: "Rajesh Kapoor", month: 6, year: 2026, target: 56,   achieved: 60,  difference: 4,   achievement_percentage: 107, overachievement: 4,  remaining: 0, is_overridden: false },
  { id: 5, trainer_id: 1, trainer_name: "Rajesh Kapoor", month: 7, year: 2026, target: 108,  achieved: 115, difference: 7,   achievement_percentage: 106, overachievement: 7,  remaining: 0, is_overridden: false },
  { id: 6, trainer_id: 1, trainer_name: "Rajesh Kapoor", month: 8, year: 2026, target: 209,  achieved: 174, difference: -35, achievement_percentage: 83,  overachievement: 0,  remaining: 35, is_overridden: false },
];

const CURRENT_MONTH_PERF: TrainerMonthlyPerformance = TRAINER_PERFORMANCE_HISTORY[5];

// Next month target = prev_target × 2 − overachievement
const NEXT_MONTH_TARGET = {
  base_target: 418,      // 209 × 2
  adjusted_target: 418,  // no overachievement this month
  previous_overachievement: 0,
};

const MEMBER_GOALS_FOR_TRAINER: MemberGoalSummary[] = [
  { member_id: 1, member_name: "Priya Mehta",     member_avatar: "PM", goal_title: "Lose 10 kg",       goal_type: "weight_loss",    progress_percentage: 78, is_achieved: false, needs_attention: false },
  { member_id: 2, member_name: "Vikash Kumar",    member_avatar: "VK", goal_title: "Bench Press 100kg", goal_type: "muscle_gain",    progress_percentage: 55, is_achieved: false, needs_attention: false },
  { member_id: 3, member_name: "Anjali Sharma",   member_avatar: "AS", goal_title: "Run 5km under 30m", goal_type: "endurance",      progress_percentage: 90, is_achieved: false, needs_attention: false },
  { member_id: 4, member_name: "Rohit Verma",     member_avatar: "RV", goal_title: "Weight Loss 8 kg",  goal_type: "weight_loss",    progress_percentage: 20, is_achieved: false, needs_attention: true  },
  { member_id: 5, member_name: "Deepika Nair",    member_avatar: "DN", goal_title: "Full Splits",       goal_type: "flexibility",    progress_percentage: 100, is_achieved: true, needs_attention: false },
  { member_id: 6, member_name: "Suresh Pillai",   member_avatar: "SP", goal_title: "General Fitness",   goal_type: "general_fitness", progress_percentage: 45, is_achieved: false, needs_attention: true  },
];

export const mockGetTrainerDashboard = async (): Promise<TrainerDashboard> => {
  await delay(600);

  const trainerUser = {
    id: 10,
    full_name: "Rajesh Kapoor",
    email: "rajesh@fitnesszone.in",
    mobile: "+91 98111 22333",
    role: "staff" as const,
    is_active: true,
    date_joined: "2024-01-10T09:00:00Z",
  };

  const trainer: import("@/types").Trainer = {
    id: 1,
    user: trainerUser,
    specialization: ["Strength Training", "Bodybuilding", "Powerlifting"],
    experience_years: 8,
    certifications: ["ACE Certified", "ISSA Personal Trainer", "CrossFit Level 2"],
    bio: "Passionate about helping members achieve their strength goals through scientific training methodologies.",
    rating: 4.9,
    total_members: 6,
    availability: "Mon–Sat, 6AM–8PM",
    current_performance: CURRENT_MONTH_PERF,
  };

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const todayClasses: import("@/types").GymClass[] = [
    {
      id: 201,
      name: "Morning Strength",
      trainer,
      start_datetime: `${todayStr}T06:00:00`,
      end_datetime:   `${todayStr}T07:00:00`,
      capacity: 15, enrolled: 12, available_seats: 3,
      location: "Weight Room A",
      status: "completed",
      description: "Compound lifts — squats, deadlifts, bench.",
      level: "intermediate",
    },
    {
      id: 202,
      name: "Power Hour",
      trainer,
      start_datetime: `${todayStr}T18:00:00`,
      end_datetime:   `${todayStr}T19:00:00`,
      capacity: 10, enrolled: 8, available_seats: 2,
      location: "Weight Room B",
      status: "scheduled",
      description: "Olympic lifts and explosive movements.",
      level: "advanced",
    },
  ];

  const recentCheckIns: import("@/types").AttendanceRecord[] = MEMBERS_DATA.slice(0, 4).map((m, i) => ({
    id: i + 1,
    member_id: m.id,
    member_name: m.full_name,
    check_in: `${todayStr}T${String(6 + i).padStart(2,"0")}:${i % 2 === 0 ? "15" : "45"}:00`,
    date: todayStr,
  }));

  return {
    trainer,
    assigned_members: MEMBERS_DATA.slice(0, 6),
    today_classes: todayClasses,
    upcoming_classes: todayClasses.filter(c => c.status === "scheduled"),
    current_month_performance: CURRENT_MONTH_PERF,
    next_month_target: NEXT_MONTH_TARGET,
    performance_history: TRAINER_PERFORMANCE_HISTORY,
    member_goals: MEMBER_GOALS_FOR_TRAINER,
    recent_check_ins: recentCheckIns,
    alerts: [
      { id: 1, type: "warning", message: "4 members haven't checked in this week — Rohit, Suresh, Kavya, Arun." },
      { id: 2, type: "info",    message: "Next month's target: 418 customers. You're at 174/209 this month." },
    ],
  };
};

