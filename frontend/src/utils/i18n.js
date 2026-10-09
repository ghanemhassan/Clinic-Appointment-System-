/**
 * Internationalization (i18n) Module
 * English is the default system language, with full Arabic (RTL) support.
 */

const STORAGE_KEY = 'clinic_lang';
const DEFAULT_LANG = 'en';

const translations = {
  en: {
    // Brand & General
    app_title: 'Clinic Appointment System',
    meta_description: 'Book medical appointments with trusted specialists and manage your clinic visits.',
    brand_name: 'Smart Clinic',
    tagline: 'Exceptional healthcare appointment management with precision and ease.',
    copyright: '© 2026 Smart Clinic System. All rights reserved.',
    loading: 'Loading...',
    retry: 'Retry',
    all: 'All',
    actions: 'Actions',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    filter: 'Filter',
    yes: 'Yes',
    no: 'No',
    phone: 'Phone',
    email: 'Email',
    password: 'Password',
    name: 'Full Name',
    status: 'Status',
    date: 'Date',
    time: 'Time',
    specialty: 'Specialty',
    fee: 'Consultation Fee',
    bio: 'Bio / Experience',
    reason: 'Visit Reason',
    notes: 'Medical Notes & Recommendations',
    currency_suffix: 'EGP',
    current_account: '(Your Account)',

    // Languages
    lang_toggle_btn: 'العربية',
    lang_switch_title: 'Switch language',
    lang_name: 'English',

    // Roles
    role_patient: 'Patient',
    role_doctor: 'Doctor',
    role_manager: 'Admin Manager',
    role_label: 'Role',

    // Statuses
    status_upcoming: 'Upcoming',
    status_done: 'Completed',
    status_cancelled: 'Cancelled',
    status_active: 'Active',
    status_blocked: 'Blocked',
    status_available: 'Available',
    status_booked: 'Booked',

    // Specialties
    spec_Cardiology: 'Cardiology',
    spec_Dermatology: 'Dermatology',
    spec_Pediatrics: 'Pediatrics',
    spec_Dentistry: 'Dentistry',
    spec_Orthopedics: 'Orthopedics',
    spec_Neurology: 'Neurology',
    spec_Ophthalmology: 'Ophthalmology',
    spec_General: 'General Medicine',
    spec_ENT: 'ENT (Ear, Nose & Throat)',
    spec_Gynecology: 'Gynecology & Obstetrics',

    // Navbar
    nav_patient_home: 'Browse & Book',
    nav_patient_appointments: 'My Appointments',
    nav_doctor_schedule: 'My Schedule',
    nav_doctor_slots: 'Time Slots',
    nav_doctor_profile: 'Doctor Profile',
    nav_manager_stats: 'Dashboard Overview',
    nav_manager_doctors: 'Manage Doctors',
    nav_manager_users: 'Users Directory',
    nav_manager_appointments: 'All Bookings',
    nav_login: 'Log In',
    nav_register: 'Sign Up',
    nav_logout: 'Log Out',

    // Auth Page
    auth_welcome_title: 'Smart Clinic Management',
    auth_welcome_desc: 'Streamlined scheduling and healthcare experience for patients, doctors, and staff.',
    auth_tab_login: 'Sign In',
    auth_tab_register: 'Register',
    auth_email_placeholder: 'name@example.com',
    auth_pwd_placeholder: '••••••••',
    auth_name_placeholder: 'e.g. John Doe',
    auth_phone_placeholder: '05XXXXXXXX',
    auth_pwd_min: 'At least 6 characters',
    auth_btn_login: 'Sign In to Account',
    auth_btn_register: 'Create Account & Continue',
    auth_signing_in: 'Signing in...',
    auth_registering: 'Creating account...',
    auth_quick_demo: 'Quick Demo Login (Select Role):',
    auth_btn_admin: 'Admin',
    auth_btn_doctor: 'Doctor',
    auth_btn_patient: 'Patient',
    auth_no_account: "Don't have an account?",
    auth_signup_link: 'Sign up as a patient now',
    auth_has_account: 'Already have an account?',
    auth_signin_link: 'Sign In',
    auth_fill_all: 'Please fill in all required fields',
    auth_pwd_len_err: 'Password must be at least 6 characters long',
    auth_welcome_back: 'Welcome back,',
    auth_register_success: 'Account created successfully! Welcome,',

    // Patient Dashboard
    pat_greeting: 'Welcome,',
    pat_subtitle: 'Book appointments with trusted specialists and manage your visit history.',
    pat_tab_doctors: 'Browse Doctors & Book',
    pat_tab_appointments: 'My Appointments',
    pat_search_placeholder: 'Search doctor by name or specialty...',
    pat_no_doctors: 'No Doctors Found',
    pat_no_doctors_desc: 'No specialists match your search criteria.',
    pat_book_btn: 'Book Appointment',
    pat_consultation_fee: 'Consultation Fee',
    pat_modal_book_title: 'Book Appointment with',
    pat_select_date: 'Select Appointment Date',
    pat_available_slots: 'Available Time Slots',
    pat_loading_slots: 'Loading slots...',
    pat_no_slots: 'No available slots for this date. Please pick another day.',
    pat_reason_placeholder: 'e.g. Regular health checkup, consultation for...',
    pat_confirm_booking: 'Confirm Booking',
    pat_booking_in_progress: 'Confirming booking...',
    pat_booking_success: 'Appointment booked successfully!',
    pat_appts_title: 'Appointments & Booking History',
    pat_no_appts: 'No Appointments Found',
    pat_no_appts_desc: 'You do not have any appointments recorded in this category yet.',
    pat_browse_now_btn: 'Browse Doctors & Book Now',
    pat_cancel_btn: 'Cancel Appointment',
    pat_cancel_free_notice: 'Free cancellation is allowed up to 2 hours before the start time',
    pat_cancel_hours_left: 'hours remaining',
    pat_cancel_blocked_notice: 'Cancellation is unavailable: less than 2 hours remaining (Rule 7).',
    pat_cancel_confirm_title: 'Cancel Appointment',
    pat_cancel_confirm_msg: 'Are you sure you want to cancel this appointment? The slot will be released for other patients.',
    pat_cancel_confirm_btn: 'Yes, Cancel Appointment',
    pat_cancel_success: 'Appointment cancelled successfully',
    doctor_default_name: 'Doctor',
    doctor_default_bio: 'Specialist healthcare provider with extensive clinical expertise.',
    patient_default_name: 'Patient',
    phone_unavailable: 'N/A',
    medical_visit: 'Medical visit',
    general_checkup: 'General checkup',
    general_consultation: 'General consultation',
    booking_failed: 'Booking failed',
    cancellation_failed: 'Failed to cancel appointment',

    // Doctor Dashboard
    doc_dashboard_title: 'Doctor Portal',
    doc_welcome: 'Welcome, Dr.',
    doc_subtitle: 'Review your daily agenda, complete consultations, and manage available slots.',
    doc_tab_schedule: 'Daily Schedule',
    doc_tab_slots: 'Time Slots Management',
    doc_tab_profile: 'Professional Profile',
    doc_schedule_title: 'Patient Consultations',
    doc_all_dates: 'All Dates',
    doc_no_schedule: 'No Scheduled Appointments',
    doc_no_schedule_desc: 'No appointments match the selected filters.',
    doc_complete_btn: 'Complete Visit & Add Notes',
    doc_cancel_emergency_btn: 'Emergency Cancellation',
    doc_complete_modal_title: 'Complete Medical Consultation',
    doc_complete_modal_subtitle: 'Recording visit completion for patient:',
    doc_notes_label: 'Clinical Notes, Diagnosis & Prescription',
    doc_notes_placeholder: 'Enter clinical observations, diagnosis, prescribed treatments, and follow-up guidance...',
    doc_confirm_complete_btn: 'Confirm Visit Completion',
    doc_complete_success: 'Consultation marked as complete with notes recorded!',
    doc_cancel_confirm_title: 'Doctor Appointment Cancellation',
    doc_cancel_confirm_msg: 'Are you sure you want to cancel the appointment with patient',
    doc_cancel_confirm_btn: 'Yes, Cancel Appointment',
    doc_add_slot_title: 'Add Available Slot',
    doc_start_time: 'Start Time',
    doc_end_time: 'End Time',
    doc_add_slot_btn: 'Add Time Slot',
    doc_my_slots: 'My Active Slots',
    doc_filter_available: 'Available Only',
    doc_filter_booked: 'Booked Only',
    doc_no_slots: 'No slots recorded in this category.',
    doc_delete_slot_title: 'Delete Time Slot',
    doc_delete_slot_msg: 'Are you sure you want to delete this unbooked time slot?',
    doc_slot_created: 'Time slot created successfully!',
    doc_slot_deleted: 'Time slot deleted successfully',
    doc_time_err: 'End time must be after start time',
    doc_notes_required: 'Please enter diagnosis notes before submitting.',
    doc_slot_range_required: 'Please specify a date and time range.',
    doc_slot_delete_failed: 'Failed to delete time slot',
    doc_slot_create_failed: 'Failed to create time slot',
    doc_complete_failed: 'Failed to complete appointment',
    doc_profile_default_bio: 'Professional medical practitioner.',

    // Manager Dashboard
    mgr_dashboard_title: 'Clinic Administration Portal',
    mgr_subtitle: 'Comprehensive oversight of doctors, patients, appointments, and system users.',
    mgr_tab_stats: 'Overview & Stats',
    mgr_tab_doctors: 'Manage Doctors',
    mgr_tab_users: 'Users Directory',
    mgr_tab_appointments: 'All Bookings',
    mgr_total_doctors: 'Total Doctors',
    mgr_total_patients: 'Total Patients',
    mgr_total_appts: 'Total Appointments',
    mgr_completed_appts: 'Completed Visits',
    mgr_breakdown_title: 'Appointment Status Breakdown',
    mgr_quick_actions: 'Quick Administrative Actions',
    mgr_quick_actions_desc: 'Direct shortcuts for expanding clinic operations.',
    mgr_add_doctor_btn: 'Add New Doctor',
    mgr_view_users_btn: 'Browse Users & Block Controls',
    mgr_doctors_title: 'Registered Doctors Directory',
    mgr_doctors_subtitle: 'Add new specialist accounts and update fees or medical specialties.',
    mgr_no_doctors: 'No doctors registered yet.',
    mgr_add_doc_modal_title: 'Add New Doctor Account',
    mgr_add_doc_modal_desc: 'Create doctor login credentials with profile information and consultation fee.',
    mgr_edit_doc_modal_title: 'Edit Doctor Details for',
    mgr_delete_doctor_btn: 'Delete Doctor',
    mgr_delete_doctor_title: 'Delete Doctor Account',
    mgr_delete_doctor_msg: 'Delete {name} and the associated login account? This is allowed only when there are no appointments or booked slots. Appointment records are never deleted.',
    mgr_doctor_deleted: 'Doctor account deleted successfully.',
    mgr_doctor_delete_blocked: 'This doctor has appointments or booked slots and cannot be deleted.',
    mgr_doctor_delete_failed: 'Failed to delete doctor account.',
    mgr_save_doc_btn: 'Save Doctor Account',
    mgr_save_changes_btn: 'Save Changes',
    mgr_welcome: 'Welcome, {name}.',
    mgr_doc_created: 'Doctor account created successfully!',
    mgr_doc_updated: 'Doctor details updated successfully',
    mgr_doc_create_failed: 'Failed to create doctor account',
    mgr_doc_update_failed: 'Failed to update doctor details',
    mgr_user_update_failed: 'Failed to update user access',
    mgr_empty_users: 'No users match your search or filters.',
    mgr_doctor_name_placeholder: 'Doctor name',
    mgr_doctor_name_label: 'Doctor name',
    mgr_doctor_bio_placeholder: 'Qualifications and clinical experience...',
    mgr_users_title: 'User Accounts & Access Management',
    mgr_search_users_placeholder: 'Search by name or email...',
    mgr_all_roles: 'All Roles',
    mgr_all_statuses: 'All Statuses',
    mgr_active_only: 'Active Only',
    mgr_blocked_only: 'Blocked Only',
    mgr_block_btn: 'Block Account',
    mgr_unblock_btn: 'Unblock Account',
    mgr_block_confirm_title: 'Block User Account',
    mgr_unblock_confirm_title: 'Unblock User Account',
    mgr_block_confirm_msg: 'Are you sure you want to block {name}? They will not be able to log in to the system (Rule 11).',
    mgr_unblock_confirm_msg: 'Are you sure you want to reactivate access for {name}?',
    mgr_block_success: 'User account blocked successfully',
    mgr_unblock_success: 'User account unblocked successfully',
    mgr_all_appts_title: 'Clinic-Wide Bookings Log',
    mgr_cancel_appt_btn: 'Cancel as Admin',
    mgr_cancel_confirm_title: 'Admin Appointment Cancellation',
    mgr_cancel_confirm_msg: 'Are you sure you want to cancel the booking for patient {name}? The slot will be released.',

    // Common Alerts & Rules
    err_server_unreachable: 'Unable to reach the server. Please ensure the backend is running.',
    err_response_parse: 'The server returned an unreadable response.',
    err_generic: 'An unexpected error occurred.',
    auth_login_failed: 'Login failed',
    auth_register_failed: 'Account creation failed',
  },

  ar: {
    // Brand & General
    app_title: 'نظام حجز مواعيد العيادة الطبية',
    meta_description: 'احجز مواعيدك الطبية مع أطباء متخصصين وتابع زياراتك للعيادة بسهولة.',
    brand_name: 'العيادة الطبية الذكية',
    tagline: 'تجربة استثنائية لحجز وإدارة المواعيد الطبية بأعلى معايير الدقة والسهولة.',
    copyright: '© 2026 نظام العيادة الطبية الذكي. جميع الحقوق محفوظة.',
    loading: 'جاري التحميل...',
    retry: 'إعادة المحاولة',
    all: 'الكل',
    actions: 'الإجراءات',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    save: 'حفظ',
    edit: 'تعديل',
    delete: 'حذف',
    search: 'بحث',
    filter: 'تصفية',
    yes: 'نعم',
    no: 'لا',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    name: 'الاسم الكامل',
    status: 'الحالة',
    date: 'التاريخ',
    time: 'الوقت',
    specialty: 'التخصص',
    fee: 'قيمة الكشف',
    bio: 'نبذة عن الطبيب والخبرات',
    reason: 'سبب الزيارة',
    notes: 'الملاحظات والتشخيص الطبي',
    currency_suffix: 'EGP',
    current_account: '(حسابك الحالي)',

    // Languages
    lang_toggle_btn: 'English',
    lang_switch_title: 'تغيير اللغة',
    lang_name: 'العربية',

    // Roles
    role_patient: 'مريض',
    role_doctor: 'طبيب',
    role_manager: 'مدير النظام',
    role_label: 'الدور',

    // Statuses
    status_upcoming: 'قادم',
    status_done: 'مكتمل',
    status_cancelled: 'ملغي',
    status_active: 'نشط',
    status_blocked: 'محظور',
    status_available: 'متاحة',
    status_booked: 'محجوزة',

    // Specialties
    spec_Cardiology: 'أمراض القلب والأوعية الدموية',
    spec_Dermatology: 'الأمراض الجلدية والتجميل',
    spec_Pediatrics: 'طب الأطفال وحديثي الولادة',
    spec_Dentistry: 'طب وجراحة الفم والأسنان',
    spec_Orthopedics: 'جراحة العظام والمفاصل',
    spec_Neurology: 'المخ والأعصاب',
    spec_Ophthalmology: 'طب وجراحة العيون',
    spec_General: 'الطب العام والباطنة',
    spec_ENT: 'الأنف والأذن والحنجرة',
    spec_Gynecology: 'النساء والولادة',

    // Navbar
    nav_patient_home: 'الرئيسية وحجز المواعيد',
    nav_patient_appointments: 'مواعيدي',
    nav_doctor_schedule: 'جدول المواعيد',
    nav_doctor_slots: 'الفترات الزمنية',
    nav_doctor_profile: 'الملف الشخصي',
    nav_manager_stats: 'لوحة الإحصائيات',
    nav_manager_doctors: 'إدارة الأطباء',
    nav_manager_users: 'المستخدمين',
    nav_manager_appointments: 'كافة الحجوزات',
    nav_login: 'تسجيل الدخول',
    nav_register: 'حساب جديد',
    nav_logout: 'خروج',

    // Auth Page
    auth_welcome_title: 'نظام العيادة الطبية الذكي',
    auth_welcome_desc: 'تجربة استثنائية لحجز وإدارة المواعيد الطبية بأعلى معايير الدقة والسهولة.',
    auth_tab_login: 'تسجيل الدخول',
    auth_tab_register: 'حساب جديد',
    auth_email_placeholder: 'name@example.com',
    auth_pwd_placeholder: '••••••••',
    auth_name_placeholder: 'مثال: أحمد عبد الله',
    auth_phone_placeholder: '05XXXXXXXX',
    auth_pwd_min: '6 أحرف على الأقل',
    auth_btn_login: 'تسجيل الدخول',
    auth_btn_register: 'إنشاء الحساب والمتابعة',
    auth_signing_in: 'جاري تسجيل الدخول...',
    auth_registering: 'جاري إنشاء الحساب...',
    auth_quick_demo: 'تسجيل دخول سريع لتجربة الأدوار:',
    auth_btn_admin: 'مدير النظام',
    auth_btn_doctor: 'طبيب',
    auth_btn_patient: 'مريض',
    auth_no_account: 'ليس لديك حساب؟',
    auth_signup_link: 'سجل حسابك كـ مريض الآن',
    auth_has_account: 'لديك حساب بالفعل؟',
    auth_signin_link: 'تسجيل الدخول',
    auth_fill_all: 'يرجى ملء جميع الحقول المطلوبة',
    auth_pwd_len_err: 'كلمة المرور يجب أن لا تقل عن 6 أحرف',
    auth_welcome_back: 'مرحباً بك،',
    auth_register_success: 'تم إنشاء الحساب بنجاح! أهلاً بك يا',

    // Patient Dashboard
    pat_greeting: 'مرحباً،',
    pat_subtitle: 'احجز موعدك الطبي بكل سهولة وتابع مواعيدك السابقة والقادمة.',
    pat_tab_doctors: 'الأطباء وحجز موعد',
    pat_tab_appointments: 'مواعيدي',
    pat_search_placeholder: 'ابحث باسم الطبيب أو التخصص...',
    pat_no_doctors: 'لا يوجد أطباء متاحون',
    pat_no_doctors_desc: 'لم يتم العثور على أطباء يطابقون خيارات البحث المحددة.',
    pat_book_btn: 'حجز موعد الآن',
    pat_consultation_fee: 'قيمة الكشف',
    pat_modal_book_title: 'حجز موعد مع',
    pat_select_date: 'اختر تاريخ الموعد',
    pat_available_slots: 'الفترات الزمنية المتاحة',
    pat_loading_slots: 'جاري تحميل الفترات المتاحة...',
    pat_no_slots: 'لا توجد فترات متاحة في هذا اليوم، يرجى اختيار يوم آخر.',
    pat_reason_placeholder: 'مثال: فحص دوري، استشارة بخصوص...',
    pat_confirm_booking: 'تأكيد الحجز',
    pat_booking_in_progress: 'جاري تأكيد الحجز...',
    pat_booking_success: 'تم حجز الموعد بنجاح!',
    pat_appts_title: 'سجل المواعيد والحجوزات',
    pat_no_appts: 'لا توجد مواعيد مسجلة',
    pat_no_appts_desc: 'لم تقم بحجز أي مواعيد في هذه الفئة بعد.',
    pat_browse_now_btn: 'تصفح الأطباء وحجز موعد الآن',
    pat_cancel_btn: 'إلغاء الموعد',
    pat_cancel_free_notice: 'يمكنك إلغاء الموعد مجاناً حتى ساعتين قبل الموعد',
    pat_cancel_hours_left: 'ساعة متبقية',
    pat_cancel_blocked_notice: 'لا يمكن إلغاء الموعد لأن المتبقي أقل من ساعتين (وفقاً للقاعدة 7).',
    pat_cancel_confirm_title: 'إلغاء الموعد الطبي',
    pat_cancel_confirm_msg: 'هل أنت متأكد من رغبتك في إلغاء هذا الموعد؟ سيتم إتاحة الفترة الزمنية لمرضى آخرين.',
    pat_cancel_confirm_btn: 'نعم، قم بالإلغاء',
    pat_cancel_success: 'تم إلغاء الموعد بنجاح',
    doctor_default_name: 'طبيب',
    doctor_default_bio: 'طبيب متخصص ذو خبرة واسعة في الرعاية الصحية.',
    patient_default_name: 'مريض',
    phone_unavailable: 'غير متوفر',
    medical_visit: 'زيارة طبية',
    general_checkup: 'فحص عام',
    general_consultation: 'استشارة عامة',
    booking_failed: 'تعذر حجز الموعد',
    cancellation_failed: 'تعذر إلغاء الموعد',

    // Doctor Dashboard
    doc_dashboard_title: 'لوحة تحكم الطبيب',
    doc_welcome: 'مرحباً بك د.',
    doc_subtitle: 'يمكنك متابعة جدول مواعيدك وإدارة الفترات المتاحة وتوثيق الكشوفات.',
    doc_tab_schedule: 'جدول المواعيد',
    doc_tab_slots: 'الفترات الزمنية',
    doc_tab_profile: 'الملف الشخصي',
    doc_schedule_title: 'مواعيد المرضى',
    doc_all_dates: 'عرض كل التواريخ',
    doc_no_schedule: 'لا توجد مواعيد',
    doc_no_schedule_desc: 'لا توجد مواعيد تطابق الفلاتر المحددة.',
    doc_complete_btn: 'إتمام الكشف وتدوين الملاحظات',
    doc_cancel_emergency_btn: 'إلغاء الموعد (طوارئ)',
    doc_complete_modal_title: 'إتمام الكشف الطبي',
    doc_complete_modal_subtitle: 'تسجيل إتمام الزيارة للمريض:',
    doc_notes_label: 'التقرير والتشخيص الطبي وتوصيات العلاج',
    doc_notes_placeholder: 'اكتب تفاصيل الكشف، التشخيص، الأدوية الموصوفة، أو أي تعليمات للمريض...',
    doc_confirm_complete_btn: 'تأكيد إتمام الكشف',
    doc_complete_success: 'تم إتمام الكشف وتدوين الملاحظات بنجاح!',
    doc_cancel_confirm_title: 'إلغاء الموعد كطبيب',
    doc_cancel_confirm_msg: 'هل أنت متأكد من إلغاء موعد المريض',
    doc_cancel_confirm_btn: 'نعم، إلغاء الموعد',
    doc_add_slot_title: 'إضافة فترة متاحة',
    doc_start_time: 'وقت البدء',
    doc_end_time: 'وقت الانتهاء',
    doc_add_slot_btn: 'إضافة الفترة الزمنية',
    doc_my_slots: 'فتراتي الزمنية',
    doc_filter_available: 'المتاحة فقط',
    doc_filter_booked: 'المحجوزة',
    doc_no_slots: 'لا توجد فترات زمنية مسجلة في هذا التصنيف.',
    doc_delete_slot_title: 'حذف الفترة الزمنية',
    doc_delete_slot_msg: 'هل أنت متأكد من حذف هذه الفترة المتاحة؟',
    doc_slot_created: 'تمت إضافة الفترة الزمنية بنجاح!',
    doc_slot_deleted: 'تم حذف الفترة بنجاح',
    doc_time_err: 'وقت الانتهاء يجب أن يكون بعد وقت البدء',
    doc_notes_required: 'يرجى إدخال ملاحظات التشخيص قبل الإرسال.',
    doc_slot_range_required: 'يرجى تحديد التاريخ والفترة الزمنية.',
    doc_slot_delete_failed: 'تعذر حذف الفترة الزمنية',
    doc_slot_create_failed: 'تعذرت إضافة الفترة الزمنية',
    doc_complete_failed: 'تعذر إتمام الموعد',
    doc_profile_default_bio: 'ممارس طبي متخصص.',

    // Manager Dashboard
    mgr_dashboard_title: 'لوحة تحكم مدير النظام',
    mgr_subtitle: 'إدارة شاملة للأطباء، المرضى، الحجوزات والمستخدمين.',
    mgr_tab_stats: 'الإحصائيات',
    mgr_tab_doctors: 'إدارة الأطباء',
    mgr_tab_users: 'المستخدمين',
    mgr_tab_appointments: 'كافة الحجوزات',
    mgr_total_doctors: 'إجمالي الأطباء',
    mgr_total_patients: 'إجمالي المرضى',
    mgr_total_appts: 'إجمالي الحجوزات',
    mgr_completed_appts: 'كشوفات مكتملة',
    mgr_breakdown_title: 'حالة المواعيد',
    mgr_quick_actions: 'إجراءات سريعة',
    mgr_quick_actions_desc: 'روابط مباشرة لإدارة وتوسيع نطاق العيادة.',
    mgr_add_doctor_btn: 'إضافة طبيب جديد',
    mgr_view_users_btn: 'استعراض قائمة المستخدمين والحظر',
    mgr_doctors_title: 'قائمة الأطباء المعتمدين',
    mgr_doctors_subtitle: 'إضافة أطباء جدد وتحديث بيانات التخصص والرسوم.',
    mgr_no_doctors: 'لا يوجد أطباء مسجلين حتى الآن.',
    mgr_add_doc_modal_title: 'إضافة طبيب جديد',
    mgr_add_doc_modal_desc: 'إنشاء حساب طبيب مع الملف المهني وتحديد التخصص وقيمة الكشف.',
    mgr_edit_doc_modal_title: 'تعديل بيانات',
    mgr_delete_doctor_btn: 'حذف الطبيب',
    mgr_delete_doctor_title: 'حذف حساب الطبيب',
    mgr_delete_doctor_msg: 'هل تريد حذف {name} وحساب دخوله؟ لا يُسمح بالحذف إذا كانت لديه مواعيد أو فترات محجوزة. لن تُحذف سجلات المواعيد.',
    mgr_doctor_deleted: 'تم حذف حساب الطبيب بنجاح.',
    mgr_doctor_delete_blocked: 'لدى الطبيب مواعيد أو فترات محجوزة، لذلك لا يمكن حذفه.',
    mgr_doctor_delete_failed: 'تعذر حذف حساب الطبيب.',
    mgr_save_doc_btn: 'حفظ الطبيب',
    mgr_save_changes_btn: 'حفظ التعديلات',
    mgr_welcome: 'مرحباً، {name}.',
    mgr_doc_created: 'تمت إضافة الطبيب بنجاح!',
    mgr_doc_updated: 'تم تحديث بيانات الطبيب بنجاح',
    mgr_doc_create_failed: 'تعذرت إضافة حساب الطبيب',
    mgr_doc_update_failed: 'تعذر تحديث بيانات الطبيب',
    mgr_user_update_failed: 'تعذر تحديث صلاحيات المستخدم',
    mgr_empty_users: 'لا يوجد مستخدمون يطابقون البحث أو عوامل التصفية.',
    mgr_doctor_name_placeholder: 'اسم الطبيب',
    mgr_doctor_name_label: 'اسم الطبيب',
    mgr_doctor_bio_placeholder: 'المؤهلات والخبرات السريرية...',
    mgr_users_title: 'إدارة المستخدمين والحسابات',
    mgr_search_users_placeholder: 'ابحث بالاسم أو البريد...',
    mgr_all_roles: 'كل الأدوار',
    mgr_all_statuses: 'كل الحالات',
    mgr_active_only: 'النشطين فقط',
    mgr_blocked_only: 'المحظورين',
    mgr_block_btn: 'حظر الحساب',
    mgr_unblock_btn: 'إلغاء الحظر',
    mgr_block_confirm_title: 'حظر المستخدم',
    mgr_unblock_confirm_title: 'إلغاء حظر المستخدم',
    mgr_block_confirm_msg: 'هل أنت متأكد من رغبتك في حظر ({name})؟ لن يتمكن من تسجيل الدخول للنظام (وفقاً للقاعدة 11).',
    mgr_unblock_confirm_msg: 'هل ترغب في إعادة تفعيل حساب ({name})؟',
    mgr_block_success: 'تم حظر المستخدم بنجاح',
    mgr_unblock_success: 'تم إلغاء الحظر بنجاح',
    mgr_all_appts_title: 'سجل الحجوزات العام',
    mgr_cancel_appt_btn: 'إلغاء الحجز كمدير نظام',
    mgr_cancel_confirm_title: 'إلغاء حجز المريض',
    mgr_cancel_confirm_msg: 'هل أنت متأكد من إلغاء حجز المريض ({name}) كمدير نظام؟ سيتم تحرير الفترة الزمنية.',

    // Common Alerts & Rules
    err_server_unreachable: 'تعذر الاتصال بالخادم، يرجى التأكد من تشغيل الخادم.',
    err_response_parse: 'تعذرت قراءة استجابة الخادم.',
    err_generic: 'حدث خطأ غير متوقع.',
    auth_login_failed: 'تعذر تسجيل الدخول',
    auth_register_failed: 'تعذر إنشاء الحساب',
  },
};

class I18nService {
  constructor() {
    this.currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    this.listeners = [];
    this.applyDomSettings();
  }

  getLang() {
    return this.currentLang;
  }

  isRtl() {
    return this.currentLang === 'ar';
  }

  setLang(lang) {
    if (lang !== 'en' && lang !== 'ar') lang = DEFAULT_LANG;
    this.currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    this.applyDomSettings();
    this.notify();
  }

  toggleLang() {
    this.setLang(this.currentLang === 'en' ? 'ar' : 'en');
  }

  applyDomSettings() {
    const isAr = this.currentLang === 'ar';
    document.documentElement.lang = this.currentLang;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    if (document.body) {
      document.body.dir = isAr ? 'rtl' : 'ltr';
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentLang);
      } catch (err) {
        console.error('Error in i18n listener:', err);
      }
    });
  }

  t(key, params = {}) {
    const langDict = translations[this.currentLang] || translations[DEFAULT_LANG];
    let text = langDict[key] || translations[DEFAULT_LANG][key] || key;

    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      });
    }

    return text;
  }
}

export const i18n = new I18nService();
export const t = (key, params) => i18n.t(key, params);
export default i18n;
