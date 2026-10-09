(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const i of l.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(o){if(o.ep)return;o.ep=!0;const l=n(o);fetch(o.href,l)}})();const W="/api";class G{constructor(){this.baseUrl=W}getToken(){return localStorage.getItem("token")}setToken(t){t?localStorage.setItem("token",t):localStorage.removeItem("token")}getHeaders(t={}){const n={"Content-Type":"application/json",...t},s=this.getToken();return s&&(n.Authorization=`Bearer ${s}`),n}async request(t,n={}){const s=`${this.baseUrl}${t}`,o=this.getHeaders(n.headers);try{const l=await fetch(s,{...n,headers:o}),i=await l.json().catch(()=>({success:!1,message:"خطأ في معالجة استجابة الخادم."}));if(!l.ok){l.status===401&&!t.includes("/auth/login")&&!t.includes("/auth/register")&&window.dispatchEvent(new CustomEvent("auth:unauthorized"));const r=new Error(i.message||"حدث خطأ في الطلب");throw r.status=l.status,r.data=i,r.errors=i.errors,r}return i}catch(l){throw l.status||(l.message="تعذر الاتصال بالخادم، يرجى التأكد من تشغيل الـ Backend."),l}}login(t,n){return this.request("/auth/login",{method:"POST",body:JSON.stringify({email:t,password:n})})}register(t){return this.request("/auth/register",{method:"POST",body:JSON.stringify(t)})}getMe(){return this.request("/auth/me")}getDoctors(t=""){const n=t?`?specialty=${encodeURIComponent(t)}`:"";return this.request(`/patients/doctors${n}`)}getDoctorProfile(t){return this.request(`/patients/doctors/${t}`)}getDoctorSlots(t,n=""){const s=n?`?date=${encodeURIComponent(n)}`:"";return this.request(`/patients/doctors/${t}/slots${s}`)}bookAppointment(t,n){return this.request("/patients/appointments",{method:"POST",body:JSON.stringify({slotId:t,reason:n})})}getPatientAppointments(t={}){const n=new URLSearchParams;t.status&&n.append("status",t.status),t.page&&n.append("page",t.page),t.limit&&n.append("limit",t.limit);const s=n.toString()?`?${n.toString()}`:"";return this.request(`/patients/appointments${s}`)}cancelPatientAppointment(t){return this.request(`/patients/appointments/${t}/cancel`,{method:"PATCH"})}getDoctorOwnProfile(){return this.request("/doctors/profile")}getDoctorSlotsOwn(t={}){const n=new URLSearchParams;t.date&&n.append("date",t.date),t.booked!==void 0&&t.booked!==""&&n.append("booked",t.booked),t.page&&n.append("page",t.page),t.limit&&n.append("limit",t.limit);const s=n.toString()?`?${n.toString()}`:"";return this.request(`/doctors/slots${s}`)}createSlot(t,n){return this.request("/doctors/slots",{method:"POST",body:JSON.stringify({startTime:t,endTime:n})})}deleteSlot(t){return this.request(`/doctors/slots/${t}`,{method:"DELETE"})}getDoctorAppointments(t={}){const n=new URLSearchParams;t.status&&n.append("status",t.status),t.date&&n.append("date",t.date),t.page&&n.append("page",t.page),t.limit&&n.append("limit",t.limit);const s=n.toString()?`?${n.toString()}`:"";return this.request(`/doctors/appointments${s}`)}completeAppointment(t,n){return this.request(`/doctors/appointments/${t}/complete`,{method:"PATCH",body:JSON.stringify({notes:n})})}cancelDoctorAppointment(t){return this.request(`/doctors/appointments/${t}/cancel`,{method:"PATCH"})}createDoctor(t){return this.request("/manager/doctors",{method:"POST",body:JSON.stringify(t)})}updateDoctor(t,n){return this.request(`/manager/doctors/${t}`,{method:"PUT",body:JSON.stringify(n)})}getManagerDoctors(t={}){const n=new URLSearchParams;t.specialty&&n.append("specialty",t.specialty),t.page&&n.append("page",t.page),t.limit&&n.append("limit",t.limit);const s=n.toString()?`?${n.toString()}`:"";return this.request(`/manager/doctors${s}`)}getManagerUsers(t={}){const n=new URLSearchParams;t.role&&n.append("role",t.role),t.is_blocked!==void 0&&t.is_blocked!==""&&n.append("is_blocked",t.is_blocked),t.search&&n.append("search",t.search),t.page&&n.append("page",t.page),t.limit&&n.append("limit",t.limit);const s=n.toString()?`?${n.toString()}`:"";return this.request(`/manager/users${s}`)}toggleBlockUser(t,n){return this.request(`/manager/users/${t}/block`,{method:"PATCH",body:JSON.stringify({is_blocked:n})})}getManagerAppointments(t={}){const n=new URLSearchParams;t.status&&n.append("status",t.status),t.date&&n.append("date",t.date),t.doctorId&&n.append("doctorId",t.doctorId),t.patientId&&n.append("patientId",t.patientId),t.page&&n.append("page",t.page),t.limit&&n.append("limit",t.limit);const s=n.toString()?`?${n.toString()}`:"";return this.request(`/manager/appointments${s}`)}cancelManagerAppointment(t){return this.request(`/manager/appointments/${t}/cancel`,{method:"PATCH"})}}const x=new G;class J{constructor(){this.user=null,this.token=localStorage.getItem("token")||null,this.listeners=[],window.addEventListener("auth:unauthorized",()=>{this.logout(!1)})}subscribe(t){return this.listeners.push(t),()=>{this.listeners=this.listeners.filter(n=>n!==t)}}notify(){this.listeners.forEach(t=>{var n;try{t({user:this.user,token:this.token,isAuthenticated:!!this.token&&!!this.user,role:((n=this.user)==null?void 0:n.role)||null})}catch(s){console.error("Error in auth listener:",s)}})}async init(){if(!this.token)return this.user=null,this.notify(),null;try{const t=await x.getMe();return t&&t.success&&t.data?(this.user=t.data,this.notify(),this.user):(this.logout(!1),null)}catch(t){return console.warn("Failed to verify token:",t.message),this.logout(!1),null}}async login(t,n){var i,r;const s=await x.login(t,n),o=((i=s.data)==null?void 0:i.token)||s.token,l=((r=s.data)==null?void 0:r.user)||s.user;if(s.success&&o)return this.token=o,this.user=l,x.setToken(this.token),this.notify(),{success:!0,token:o,user:l,message:s.message};throw new Error(s.message||"فشل تسجيل الدخول")}async register(t){var l,i;const n=await x.register(t),s=((l=n.data)==null?void 0:l.token)||n.token,o=((i=n.data)==null?void 0:i.user)||n.user;if(n.success&&s)return this.token=s,this.user=o,x.setToken(this.token),this.notify(),{success:!0,token:s,user:o,message:n.message};throw new Error(n.message||"فشل إنشاء الحساب")}logout(t=!0){this.token=null,this.user=null,x.setToken(null),this.notify(),t&&(window.location.hash="#/login")}getUser(){return this.user}getToken(){return this.token}isAuthenticated(){return!!this.token&&!!this.user}getRole(){var t;return((t=this.user)==null?void 0:t.role)||null}}const w=new J,j="clinic_lang",I="en",D={en:{app_title:"Clinic Appointment System",brand_name:"Smart Clinic",tagline:"Exceptional healthcare appointment management with precision and ease.",copyright:"© 2026 Smart Clinic System. All rights reserved.",loading:"Loading...",retry:"Retry",all:"All",actions:"Actions",cancel:"Cancel",confirm:"Confirm",save:"Save",edit:"Edit",delete:"Delete",search:"Search",filter:"Filter",yes:"Yes",no:"No",phone:"Phone",email:"Email",password:"Password",name:"Full Name",status:"Status",date:"Date",time:"Time",fee:"Consultation Fee",bio:"Bio / Experience",reason:"Visit Reason",notes:"Medical Notes & Recommendations",currency_suffix:"SAR",current_account:"(Your Account)",lang_toggle_btn:"العربية",lang_name:"English",role_patient:"Patient",role_doctor:"Doctor",role_manager:"Admin Manager",status_upcoming:"Upcoming",status_done:"Completed",status_cancelled:"Cancelled",status_active:"Active",status_blocked:"Blocked",status_available:"Available",status_booked:"Booked",spec_Cardiology:"Cardiology",spec_Dermatology:"Dermatology",spec_Pediatrics:"Pediatrics",spec_Dentistry:"Dentistry",spec_Orthopedics:"Orthopedics",spec_Neurology:"Neurology",spec_Ophthalmology:"Ophthalmology",spec_General:"General Medicine",spec_ENT:"ENT (Ear, Nose & Throat)",spec_Gynecology:"Gynecology & Obstetrics",nav_patient_home:"Browse & Book",nav_patient_appointments:"My Appointments",nav_doctor_schedule:"My Schedule",nav_doctor_slots:"Time Slots",nav_doctor_profile:"Doctor Profile",nav_manager_stats:"Dashboard Overview",nav_manager_doctors:"Manage Doctors",nav_manager_users:"Users Directory",nav_manager_appointments:"All Bookings",nav_login:"Log In",nav_register:"Sign Up",nav_logout:"Log Out",auth_welcome_title:"Smart Clinic Management",auth_welcome_desc:"Streamlined scheduling and healthcare experience for patients, doctors, and staff.",auth_tab_login:"Sign In",auth_tab_register:"Register",auth_email_placeholder:"name@example.com",auth_pwd_placeholder:"••••••••",auth_name_placeholder:"e.g. John Doe",auth_phone_placeholder:"05XXXXXXXX",auth_pwd_min:"At least 6 characters",auth_btn_login:"Sign In to Account",auth_btn_register:"Create Account & Continue",auth_signing_in:"Signing in...",auth_registering:"Creating account...",auth_quick_demo:"Quick Demo Login (Select Role):",auth_btn_admin:"Admin",auth_btn_doctor:"Doctor",auth_btn_patient:"Patient",auth_no_account:"Don't have an account?",auth_signup_link:"Sign up as a patient now",auth_has_account:"Already have an account?",auth_signin_link:"Sign In",auth_fill_all:"Please fill in all required fields",auth_pwd_len_err:"Password must be at least 6 characters long",auth_welcome_back:"Welcome back,",auth_register_success:"Account created successfully! Welcome,",pat_greeting:"Welcome,",pat_subtitle:"Book appointments with trusted specialists and manage your visit history.",pat_tab_doctors:"Browse Doctors & Book",pat_tab_appointments:"My Appointments",pat_search_placeholder:"Search doctor by name or specialty...",pat_no_doctors:"No Doctors Found",pat_no_doctors_desc:"No specialists match your search criteria.",pat_book_btn:"Book Appointment",pat_consultation_fee:"Consultation Fee",pat_modal_book_title:"Book Appointment with",pat_select_date:"Select Appointment Date",pat_available_slots:"Available Time Slots",pat_loading_slots:"Loading slots...",pat_no_slots:"No available slots for this date. Please pick another day.",pat_reason_placeholder:"e.g. Regular health checkup, consultation for...",pat_confirm_booking:"Confirm Booking",pat_booking_in_progress:"Confirming booking...",pat_booking_success:"Appointment booked successfully!",pat_appts_title:"Appointments & Booking History",pat_no_appts:"No Appointments Found",pat_no_appts_desc:"You do not have any appointments recorded in this category yet.",pat_browse_now_btn:"Browse Doctors & Book Now",pat_cancel_btn:"Cancel Appointment",pat_cancel_free_notice:"Free cancellation is allowed up to 2 hours before the start time",pat_cancel_hours_left:"hours remaining",pat_cancel_blocked_notice:"Cancellation is unavailable: less than 2 hours remaining (Rule 7).",pat_cancel_confirm_title:"Cancel Appointment",pat_cancel_confirm_msg:"Are you sure you want to cancel this appointment? The slot will be released for other patients.",pat_cancel_confirm_btn:"Yes, Cancel Appointment",pat_cancel_success:"Appointment cancelled successfully",doc_dashboard_title:"Doctor Portal",doc_welcome:"Welcome, Dr.",doc_subtitle:"Review your daily agenda, complete consultations, and manage available slots.",doc_tab_schedule:"Daily Schedule",doc_tab_slots:"Time Slots Management",doc_tab_profile:"Professional Profile",doc_schedule_title:"Patient Consultations",doc_all_dates:"All Dates",doc_no_schedule:"No Scheduled Appointments",doc_no_schedule_desc:"No appointments match the selected filters.",doc_complete_btn:"Complete Visit & Add Notes",doc_cancel_emergency_btn:"Emergency Cancellation",doc_complete_modal_title:"Complete Medical Consultation",doc_complete_modal_subtitle:"Recording visit completion for patient:",doc_notes_label:"Clinical Notes, Diagnosis & Prescription",doc_notes_placeholder:"Enter clinical observations, diagnosis, prescribed treatments, and follow-up guidance...",doc_confirm_complete_btn:"Confirm Visit Completion",doc_complete_success:"Consultation marked as complete with notes recorded!",doc_cancel_confirm_title:"Doctor Appointment Cancellation",doc_cancel_confirm_msg:"Are you sure you want to cancel the appointment with patient",doc_cancel_confirm_btn:"Yes, Cancel Appointment",doc_add_slot_title:"Add Available Slot",doc_start_time:"Start Time",doc_end_time:"End Time",doc_add_slot_btn:"Add Time Slot",doc_my_slots:"My Active Slots",doc_filter_available:"Available Only",doc_filter_booked:"Booked Only",doc_no_slots:"No slots recorded in this category.",doc_delete_slot_title:"Delete Time Slot",doc_delete_slot_msg:"Are you sure you want to delete this unbooked time slot?",doc_slot_created:"Time slot created successfully!",doc_slot_deleted:"Time slot deleted successfully",doc_time_err:"End time must be after start time",mgr_dashboard_title:"Clinic Administration Portal",mgr_subtitle:"Comprehensive oversight of doctors, patients, appointments, and system users.",mgr_tab_stats:"Overview & Stats",mgr_tab_doctors:"Manage Doctors",mgr_tab_users:"Users Directory",mgr_tab_appointments:"All Bookings",mgr_total_doctors:"Total Doctors",mgr_total_patients:"Total Patients",mgr_total_appts:"Total Appointments",mgr_completed_appts:"Completed Visits",mgr_breakdown_title:"Appointment Status Breakdown",mgr_quick_actions:"Quick Administrative Actions",mgr_quick_actions_desc:"Direct shortcuts for expanding clinic operations.",mgr_add_doctor_btn:"Add New Doctor",mgr_view_users_btn:"Browse Users & Block Controls",mgr_doctors_title:"Registered Doctors Directory",mgr_doctors_subtitle:"Add new specialist accounts and update fees or medical specialties.",mgr_no_doctors:"No doctors registered yet.",mgr_add_doc_modal_title:"Add New Doctor Account",mgr_add_doc_modal_desc:"Create doctor login credentials with profile information and consultation fee.",mgr_edit_doc_modal_title:"Edit Doctor Details for",mgr_save_doc_btn:"Save Doctor Account",mgr_save_changes_btn:"Save Changes",mgr_doc_created:"Doctor account created successfully!",mgr_doc_updated:"Doctor details updated successfully",mgr_users_title:"User Accounts & Access Management",mgr_search_users_placeholder:"Search by name or email...",mgr_all_roles:"All Roles",mgr_all_statuses:"All Statuses",mgr_active_only:"Active Only",mgr_blocked_only:"Blocked Only",mgr_block_btn:"Block Account",mgr_unblock_btn:"Unblock Account",mgr_block_confirm_title:"Block User Account",mgr_unblock_confirm_title:"Unblock User Account",mgr_block_confirm_msg:"Are you sure you want to block {name}? They will not be able to log in to the system (Rule 11).",mgr_unblock_confirm_msg:"Are you sure you want to reactivate access for {name}?",mgr_block_success:"User account blocked successfully",mgr_unblock_success:"User account unblocked successfully",mgr_all_appts_title:"Clinic-Wide Bookings Log",mgr_cancel_appt_btn:"Cancel as Admin",mgr_cancel_confirm_title:"Admin Appointment Cancellation",mgr_cancel_confirm_msg:"Are you sure you want to cancel the booking for patient {name}? The slot will be released.",err_server_unreachable:"Unable to reach the server. Please ensure the backend is running.",err_generic:"An unexpected error occurred."},ar:{app_title:"نظام حجز مواعيد العيادة الطبية",brand_name:"العيادة الطبية الذكية",tagline:"تجربة استثنائية لحجز وإدارة المواعيد الطبية بأعلى معايير الدقة والسهولة.",copyright:"© 2026 نظام العيادة الطبية الذكي. جميع الحقوق محفوظة.",loading:"جاري التحميل...",retry:"إعادة المحاولة",all:"الكل",actions:"الإجراءات",cancel:"إلغاء",confirm:"تأكيد",save:"حفظ",edit:"تعديل",delete:"حذف",search:"بحث",filter:"تصفية",yes:"نعم",no:"لا",phone:"رقم الهاتف",email:"البريد الإلكتروني",password:"كلمة المرور",name:"الاسم الكامل",status:"الحالة",date:"التاريخ",time:"الوقت",fee:"قيمة الكشف",bio:"نبذة عن الطبيب والخبرات",reason:"سبب الزيارة",notes:"الملاحظات والتشخيص الطبي",currency_suffix:"ر.س",current_account:"(حسابك الحالي)",lang_toggle_btn:"English",lang_name:"العربية",role_patient:"مريض",role_doctor:"طبيب",role_manager:"مدير النظام",status_upcoming:"قادم",status_done:"مكتمل",status_cancelled:"ملغي",status_active:"نشط",status_blocked:"محظور",status_available:"متاحة",status_booked:"محجوزة",spec_Cardiology:"أمراض القلب والأوعية الدموية",spec_Dermatology:"الأمراض الجلدية والتجميل",spec_Pediatrics:"طب الأطفال وحديثي الولادة",spec_Dentistry:"طب وجراحة الفم والأسنان",spec_Orthopedics:"جراحة العظام والمفاصل",spec_Neurology:"المخ والأعصاب",spec_Ophthalmology:"طب وجراحة العيون",spec_General:"الطب العام والباطنة",spec_ENT:"الأنف والأذن والحنجرة",spec_Gynecology:"النساء والولادة",nav_patient_home:"الرئيسية وحجز المواعيد",nav_patient_appointments:"مواعيدي",nav_doctor_schedule:"جدول المواعيد",nav_doctor_slots:"الفترات الزمنية",nav_doctor_profile:"الملف الشخصي",nav_manager_stats:"لوحة الإحصائيات",nav_manager_doctors:"إدارة الأطباء",nav_manager_users:"المستخدمين",nav_manager_appointments:"كافة الحجوزات",nav_login:"تسجيل الدخول",nav_register:"حساب جديد",nav_logout:"خروج",auth_welcome_title:"نظام العيادة الطبية الذكي",auth_welcome_desc:"تجربة استثنائية لحجز وإدارة المواعيد الطبية بأعلى معايير الدقة والسهولة.",auth_tab_login:"تسجيل الدخول",auth_tab_register:"حساب جديد",auth_email_placeholder:"name@example.com",auth_pwd_placeholder:"••••••••",auth_name_placeholder:"مثال: أحمد عبد الله",auth_phone_placeholder:"05XXXXXXXX",auth_pwd_min:"6 أحرف على الأقل",auth_btn_login:"تسجيل الدخول",auth_btn_register:"إنشاء الحساب والمتابعة",auth_signing_in:"جاري تسجيل الدخول...",auth_registering:"جاري إنشاء الحساب...",auth_quick_demo:"تسجيل دخول سريع لتجربة الأدوار (Demo Accounts):",auth_btn_admin:"مدير (Admin)",auth_btn_doctor:"طبيب (Doctor)",auth_btn_patient:"مريض (Patient)",auth_no_account:"ليس لديك حساب؟",auth_signup_link:"سجل حسابك كـ مريض الآن",auth_has_account:"لديك حساب بالفعل؟",auth_signin_link:"تسجيل الدخول",auth_fill_all:"يرجى ملء جميع الحقول المطلوبة",auth_pwd_len_err:"كلمة المرور يجب أن لا تقل عن 6 أحرف",auth_welcome_back:"مرحباً بك،",auth_register_success:"تم إنشاء الحساب بنجاح! أهلاً بك يا",pat_greeting:"مرحباً،",pat_subtitle:"احجز موعدك الطبي بكل سهولة وتابع مواعيدك السابقة والقادمة.",pat_tab_doctors:"الأطباء وحجز موعد",pat_tab_appointments:"مواعيدي",pat_search_placeholder:"ابحث باسم الطبيب أو التخصص...",pat_no_doctors:"لا يوجد أطباء متاحون",pat_no_doctors_desc:"لم يتم العثور على أطباء يطابقون خيارات البحث المحددة.",pat_book_btn:"حجز موعد الآن",pat_consultation_fee:"قيمة الكشف",pat_modal_book_title:"حجز موعد مع",pat_select_date:"اختر تاريخ الموعد",pat_available_slots:"الفترات الزمنية المتاحة (Time Slots)",pat_loading_slots:"جاري تحميل الفترات المتاحة...",pat_no_slots:"لا توجد فترات متاحة في هذا اليوم، يرجى اختيار يوم آخر.",pat_reason_placeholder:"مثال: فحص دوري، استشارة بخصوص...",pat_confirm_booking:"تأكيد الحجز",pat_booking_in_progress:"جاري تأكيد الحجز...",pat_booking_success:"تم حجز الموعد بنجاح!",pat_appts_title:"سجل المواعيد والحجوزات",pat_no_appts:"لا توجد مواعيد مسجلة",pat_no_appts_desc:"لم تقم بحجز أي مواعيد في هذه الفئة بعد.",pat_browse_now_btn:"تصفح الأطباء وحجز موعد الآن",pat_cancel_btn:"إلغاء الموعد",pat_cancel_free_notice:"يمكنك إلغاء الموعد مجاناً حتى ساعتين قبل الموعد",pat_cancel_hours_left:"ساعة متبقية",pat_cancel_blocked_notice:"لا يمكن إلغاء الموعد لأن المتبقي أقل من ساعتين (وفقاً للقاعدة 7).",pat_cancel_confirm_title:"إلغاء الموعد الطبي",pat_cancel_confirm_msg:"هل أنت متأكد من رغبتك في إلغاء هذا الموعد؟ سيتم إتاحة الفترة الزمنية لمرضى آخرين.",pat_cancel_confirm_btn:"نعم، قم بالإلغاء",pat_cancel_success:"تم إلغاء الموعد بنجاح",doc_dashboard_title:"لوحة تحكم الطبيب",doc_welcome:"مرحباً بك د.",doc_subtitle:"يمكنك متابعة جدول مواعيدك وإدارة الفترات المتاحة وتوثيق الكشوفات.",doc_tab_schedule:"جدول المواعيد",doc_tab_slots:"الفترات الزمنية (Slots)",doc_tab_profile:"الملف الشخصي",doc_schedule_title:"مواعيد المرضى",doc_all_dates:"عرض كل التواريخ",doc_no_schedule:"لا توجد مواعيد",doc_no_schedule_desc:"لا توجد مواعيد تطابق الفلاتر المحددة.",doc_complete_btn:"إتمام الكشف وتدوين الملاحظات",doc_cancel_emergency_btn:"إلغاء الموعد (طوارئ)",doc_complete_modal_title:"إتمام الكشف الطبي",doc_complete_modal_subtitle:"تسجيل إتمام الزيارة للمريض:",doc_notes_label:"التقرير والتشخيص الطبي وتوصيات العلاج",doc_notes_placeholder:"اكتب تفاصيل الكشف، التشخيص، الأدوية الموصوفة، أو أي تعليمات للمريض...",doc_confirm_complete_btn:"تأكيد إتمام الكشف",doc_complete_success:"تم إتمام الكشف وتدوين الملاحظات بنجاح!",doc_cancel_confirm_title:"إلغاء الموعد كطبيب",doc_cancel_confirm_msg:"هل أنت متأكد من إلغاء موعد المريض",doc_cancel_confirm_btn:"نعم، إلغاء الموعد",doc_add_slot_title:"إضافة فترة متاحة",doc_start_time:"وقت البدء (Start Time)",doc_end_time:"وقت الانتهاء (End Time)",doc_add_slot_btn:"إضافة الفترة الزمنية",doc_my_slots:"فتراتي الزمنية",doc_filter_available:"المتاحة فقط",doc_filter_booked:"المحجوزة",doc_no_slots:"لا توجد فترات زمنية مسجلة في هذا التصنيف.",doc_delete_slot_title:"حذف الفترة الزمنية",doc_delete_slot_msg:"هل أنت متأكد من حذف هذه الفترة المتاحة؟",doc_slot_created:"تمت إضافة الفترة الزمنية بنجاح!",doc_slot_deleted:"تم حذف الفترة بنجاح",doc_time_err:"وقت الانتهاء يجب أن يكون بعد وقت البدء",mgr_dashboard_title:"لوحة تحكم مدير النظام",mgr_subtitle:"إدارة شاملة للأطباء، المرضى، الحجوزات والمستخدمين.",mgr_tab_stats:"الإحصائيات",mgr_tab_doctors:"إدارة الأطباء",mgr_tab_users:"المستخدمين",mgr_tab_appointments:"كافة الحجوزات",mgr_total_doctors:"إجمالي الأطباء",mgr_total_patients:"إجمالي المرضى",mgr_total_appts:"إجمالي الحجوزات",mgr_completed_appts:"كشوفات مكتملة",mgr_breakdown_title:"حالة المواعيد",mgr_quick_actions:"إجراءات سريعة",mgr_quick_actions_desc:"روابط مباشرة لإدارة وتوسيع نطاق العيادة.",mgr_add_doctor_btn:"إضافة طبيب جديد",mgr_view_users_btn:"استعراض قائمة المستخدمين والحظر",mgr_doctors_title:"قائمة الأطباء المعتمدين",mgr_doctors_subtitle:"إضافة أطباء جدد وتحديث بيانات التخصص والرسوم.",mgr_no_doctors:"لا يوجد أطباء مسجلين حتى الآن.",mgr_add_doc_modal_title:"إضافة طبيب جديد",mgr_add_doc_modal_desc:"إنشاء حساب طبيب مع الملف المهني وتحديد التخصص وقيمة الكشف.",mgr_edit_doc_modal_title:"تعديل بيانات",mgr_save_doc_btn:"حفظ الطبيب",mgr_save_changes_btn:"حفظ التعديلات",mgr_doc_created:"تمت إضافة الطبيب بنجاح!",mgr_doc_updated:"تم تحديث بيانات الطبيب بنجاح",mgr_users_title:"إدارة المستخدمين والحسابات",mgr_search_users_placeholder:"ابحث بالاسم أو البريد...",mgr_all_roles:"كل الأدوار",mgr_all_statuses:"كل الحالات",mgr_active_only:"النشطين فقط",mgr_blocked_only:"المحظورين",mgr_block_btn:"حظر الحساب",mgr_unblock_btn:"إلغاء الحظر",mgr_block_confirm_title:"حظر المستخدم",mgr_unblock_confirm_title:"إلغاء حظر المستخدم",mgr_block_confirm_msg:"هل أنت متأكد من رغبتك في حظر ({name})؟ لن يتمكن من تسجيل الدخول للنظام (وفقاً للقاعدة 11).",mgr_unblock_confirm_msg:"هل ترغب في إعادة تفعيل حساب ({name})؟",mgr_block_success:"تم حظر المستخدم بنجاح",mgr_unblock_success:"تم إلغاء الحظر بنجاح",mgr_all_appts_title:"سجل الحجوزات العام",mgr_cancel_appt_btn:"إلغاء الحجز كمدير نظام",mgr_cancel_confirm_title:"إلغاء حجز المريض",mgr_cancel_confirm_msg:"هل أنت متأكد من إلغاء حجز المريض ({name}) كمدير نظام؟ سيتم تحرير الفترة الزمنية.",err_server_unreachable:"تعذر الاتصال بالخادم، يرجى التأكد من تشغيل الـ Backend.",err_generic:"حدث خطأ غير متوقع."}};class Y{constructor(){this.currentLang=localStorage.getItem(j)||I,this.listeners=[],this.applyDomSettings()}getLang(){return this.currentLang}isRtl(){return this.currentLang==="ar"}setLang(t){t!=="en"&&t!=="ar"&&(t=I),this.currentLang=t,localStorage.setItem(j,t),this.applyDomSettings(),this.notify()}toggleLang(){this.setLang(this.currentLang==="en"?"ar":"en")}applyDomSettings(){const t=this.currentLang==="ar";document.documentElement.lang=this.currentLang,document.documentElement.dir=t?"rtl":"ltr",document.body&&(document.body.dir=t?"rtl":"ltr")}subscribe(t){return this.listeners.push(t),()=>{this.listeners=this.listeners.filter(n=>n!==t)}}notify(){this.listeners.forEach(t=>{try{t(this.currentLang)}catch(n){console.error("Error in i18n listener:",n)}})}t(t,n={}){let o=(D[this.currentLang]||D[I])[t]||D[I][t]||t;return n&&typeof n=="object"&&Object.entries(n).forEach(([l,i])=>{o=o.replace(new RegExp(`\\{${l}\\}`,"g"),i)}),o}}const z=new Y,e=(a,t)=>z.t(a,t);function f(a,{size:t=18,className:n="",stroke:s="currentColor",fill:o="none",strokeWidth:l=2}={}){return`<svg width="${t}" height="${t}" viewBox="0 0 24 24" fill="${o}" stroke="${s}" stroke-width="${l}" stroke-linecap="round" stroke-linejoin="round" class="ui-icon ${n}">${a}</svg>`}const p={plus:a=>f('<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>',a),edit:a=>f('<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>',a),trash:a=>f('<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>',a),check:a=>f('<polyline points="20 6 9 17 4 12"></polyline>',a),checkCircle:a=>f('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',a),x:a=>f('<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',a),xCircle:a=>f('<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',a),alertCircle:a=>f('<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',a),info:a=>f('<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',a),logOut:a=>f('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>',a),search:a=>f('<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>',a),globe:a=>f('<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>',a),calendar:a=>f('<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',a),clock:a=>f('<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',a),user:a=>f('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',a),users:a=>f('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',a),userPlus:a=>f('<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>',a),userCheck:a=>f('<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline>',a),userX:a=>f('<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line>',a),lock:a=>f('<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>',a),unlock:a=>f('<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path>',a),stethoscope:a=>f('<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path><circle cx="20" cy="10" r="2"></circle>',a),activity:a=>f('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>',a),heartPulse:a=>f('<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"></path>',a),shield:a=>f('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',a),fileText:a=>f('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>',a),dollarSign:a=>f('<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>',a),phone:a=>f('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',a),mail:a=>f('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',a),clinicCross:a=>f('<path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" fill="currentColor" stroke="none"></path>',a),chevronDown:a=>f('<polyline points="6 9 12 15 18 9"></polyline>',a),refresh:a=>f('<polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>',a),zap:a=>f('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>',a)},B=["Cardiology","Dermatology","Pediatrics","Dentistry","Orthopedics","Neurology","Ophthalmology","General","ENT","Gynecology"];function A(a){return a?e(`spec_${a}`)||a:""}function U(a){return a?e(`role_${a}`)||a:""}function M(a){return a?e(`status_${a}`)||a:""}function q(a){switch(a){case"upcoming":return"status-upcoming";case"done":return"status-done";case"cancelled":return"status-cancelled";default:return""}}function C(a){if(a==null)return`0 ${e("currency_suffix")}`;const n=z.getLang()==="ar"?"ar-SA":"en-US";return`${Number(a).toLocaleString(n)} ${e("currency_suffix")}`}function F(a){if(!a)return"";const t=new Date(a);if(isNaN(t.getTime()))return a;const s=z.getLang()==="ar"?"ar-EG":"en-US";return t.toLocaleDateString(s,{weekday:"short",year:"numeric",month:"short",day:"numeric"})}function S(a){if(!a)return"";const t=new Date(a);if(isNaN(t.getTime()))return"";const s=z.getLang()==="ar"?"ar-EG":"en-US";return t.toLocaleTimeString(s,{hour:"2-digit",minute:"2-digit",hour12:!0})}function H(a){if(!a)return"";const t=new Date(a);return isNaN(t.getTime())?a:`${F(a)} • ${S(a)}`}function V(a){const t=a?new Date(a):new Date,n=t.getFullYear(),s=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${n}-${s}-${o}`}function Q(a){if(!a)return!1;const t=new Date(a).getTime(),n=Date.now();return(t-n)/(1e3*60*60)>=2}function K(a){if(!a)return 0;const t=new Date(a).getTime(),n=Date.now();return(t-n)/(1e3*60*60)}function h(a){if(!a)return"";const t=document.createElement("div");return t.textContent=a,t.innerHTML}function Z(){const a=w.getUser(),t=w.isAuthenticated(),n=window.location.hash||"#/",s=z.t("lang_toggle_btn");let o="";t&&a&&(a.role==="patient"?o=`
        <a href="#/patient" class="nav-link ${n==="#/patient"||n==="#/"||n.startsWith("#/patient?tab=doctors")?"active":""}">
          ${p.stethoscope({size:16})}
          <span>${e("nav_patient_home")}</span>
        </a>
        <a href="#/patient?tab=appointments" class="nav-link ${n.includes("tab=appointments")?"active":""}">
          ${p.calendar({size:16})}
          <span>${e("nav_patient_appointments")}</span>
        </a>
      `:a.role==="doctor"?o=`
        <a href="#/doctor" class="nav-link ${n==="#/doctor"||n==="#/"||n.startsWith("#/doctor?tab=schedule")?"active":""}">
          ${p.calendar({size:16})}
          <span>${e("nav_doctor_schedule")}</span>
        </a>
        <a href="#/doctor?tab=slots" class="nav-link ${n.includes("tab=slots")?"active":""}">
          ${p.clock({size:16})}
          <span>${e("nav_doctor_slots")}</span>
        </a>
        <a href="#/doctor?tab=profile" class="nav-link ${n.includes("tab=profile")?"active":""}">
          ${p.user({size:16})}
          <span>${e("nav_doctor_profile")}</span>
        </a>
      `:a.role==="manager"&&(o=`
        <a href="#/manager" class="nav-link ${n==="#/manager"||n==="#/"||n.startsWith("#/manager?tab=stats")?"active":""}">
          ${p.activity({size:16})}
          <span>${e("nav_manager_stats")}</span>
        </a>
        <a href="#/manager?tab=doctors" class="nav-link ${n.includes("tab=doctors")?"active":""}">
          ${p.stethoscope({size:16})}
          <span>${e("nav_manager_doctors")}</span>
        </a>
        <a href="#/manager?tab=users" class="nav-link ${n.includes("tab=users")?"active":""}">
          ${p.users({size:16})}
          <span>${e("nav_manager_users")}</span>
        </a>
        <a href="#/manager?tab=appointments" class="nav-link ${n.includes("tab=appointments")?"active":""}">
          ${p.calendar({size:16})}
          <span>${e("nav_manager_appointments")}</span>
        </a>
      `));const l=`
    <button type="button" id="btn-toggle-lang" class="lang-toggle-btn" title="Switch Language">
      ${p.globe({size:16})}
      <span>${s}</span>
    </button>
  `,i=t&&a?`
      <div class="navbar-user">
        ${l}
        <div style="display: flex; flex-direction: column; align-items: flex-end;">
          <span class="navbar-user-name">${h(a.name)}</span>
          <span class="navbar-user-role role-badge role-${a.role}">${U(a.role)}</span>
        </div>
        <button id="btn-logout" class="btn-logout" title="${e("nav_logout")}">
          ${p.logOut({size:16})}
          <span>${e("nav_logout")}</span>
        </button>
      </div>
    `:`
      <div class="navbar-user">
        ${l}
        <a href="#/login" class="btn btn-secondary btn-sm">${e("nav_login")}</a>
        <a href="#/register" class="btn btn-primary btn-sm">${e("nav_register")}</a>
      </div>
    `;return`
    <nav class="navbar">
      <div class="navbar-inner">
        <a href="#/" class="navbar-brand">
          ${p.clinicCross({size:24,className:"brand-icon"})}
          <span>${e("brand_name")}</span>
        </a>

        <div class="navbar-nav">
          ${o}
        </div>

        ${i}
      </div>
    </nav>
  `}function tt(){const a=document.getElementById("btn-logout");a&&a.addEventListener("click",n=>{n.preventDefault(),w.logout(!0)});const t=document.getElementById("btn-toggle-lang");t&&t.addEventListener("click",n=>{n.preventDefault(),z.toggleLang()})}class et{constructor(){this.container=document.getElementById("toast-container"),this.container||(this.container=document.createElement("div"),this.container.id="toast-container",document.body.appendChild(this.container))}show(t,n="info",s=3500){const o=document.createElement("div");o.className=`toast ${n==="error"?"toast-error":n==="success"?"toast-success":""}`;let l="";n==="success"?l='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>':n==="error"?l='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>':l='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',o.innerHTML=`
      <div style="display:flex;align-items:center;gap:10px;">
        ${l}
        <span>${t}</span>
      </div>
    `,this.container.appendChild(o),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateY(-10px)",o.style.transition="all 0.3s ease",setTimeout(()=>{o.parentNode&&o.parentNode.removeChild(o)},300)},s)}success(t,n){this.show(t,"success",n)}error(t,n){this.show(t,"error",n||4500)}info(t,n){this.show(t,"info",n)}}const $=new et;function N(a="login"){const t=a==="login";return`
    <div class="auth-page">
      <div style="position: absolute; top: 20px; right: 20px; z-index: 10;">
        <button type="button" id="btn-auth-lang-toggle" class="lang-toggle-btn">
          ${p.globe({size:16})}
          <span>${e("lang_toggle_btn")}</span>
        </button>
      </div>

      <div class="auth-hero">
        <div class="auth-hero-icon">
          ${p.clinicCross({size:36})}
        </div>
        <h1>${e("auth_welcome_title")}</h1>
        <p>${e("auth_welcome_desc")}</p>
      </div>

      <div class="auth-card">
        <div class="auth-tabs">
          <a href="#/login" class="auth-tab-btn ${t?"active":""}">
            ${e("auth_tab_login")}
          </a>
          <a href="#/register" class="auth-tab-btn ${t?"":"active"}">
            ${e("auth_tab_register")}
          </a>
        </div>

        <div id="auth-error-alert" style="display: none; padding: 12px 16px; background: rgba(214, 48, 49, 0.08); border-radius: 12px; color: var(--color-danger); font-size: 14px; margin-bottom: 20px;"></div>

        ${t?`
          <form id="login-form">
            <div class="form-group">
              <label for="login-email">${e("email")}</label>
              <input
                type="email"
                id="login-email"
                class="form-input"
                placeholder="${e("auth_email_placeholder")}"
                required
                autocomplete="email"
                dir="ltr"
              />
            </div>

            <div class="form-group">
              <label for="login-password">${e("password")}</label>
              <input
                type="password"
                id="login-password"
                class="form-input"
                placeholder="${e("auth_pwd_placeholder")}"
                required
                autocomplete="current-password"
                dir="ltr"
              />
            </div>

            <button type="submit" id="btn-auth-submit" class="btn btn-primary btn-block" style="margin-top: var(--spacing-20); height: 48px; font-size: 16px;">
              ${e("auth_btn_login")}
            </button>
          </form>

          <!-- Quick Test Accounts -->
          <div style="margin-top: var(--spacing-28); padding-top: var(--spacing-20); border-top: 1px solid var(--color-hairline-silver);">
            <div style="font-size: 12px; color: var(--color-steel); margin-bottom: 12px; display: flex; align-items: center; justify-content: center; gap: 6px;">
              ${p.zap({size:14,stroke:"var(--color-pricing-blue)"})}
              <span>${e("auth_quick_demo")}</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
              <button type="button" class="btn btn-secondary btn-sm" id="quick-manager-btn" style="font-size: 12px; padding: 8px 4px; display: inline-flex; align-items: center; justify-content: center; gap: 4px;">
                ${p.shield({size:13})}
                <span>${e("auth_btn_admin")}</span>
              </button>
              <button type="button" class="btn btn-secondary btn-sm" id="quick-doctor-btn" style="font-size: 12px; padding: 8px 4px; display: inline-flex; align-items: center; justify-content: center; gap: 4px;">
                ${p.stethoscope({size:13})}
                <span>${e("auth_btn_doctor")}</span>
              </button>
              <button type="button" class="btn btn-secondary btn-sm" id="quick-patient-btn" style="font-size: 12px; padding: 8px 4px; display: inline-flex; align-items: center; justify-content: center; gap: 4px;">
                ${p.user({size:13})}
                <span>${e("auth_btn_patient")}</span>
              </button>
            </div>
          </div>
        `:`
          <form id="register-form">
            <div class="form-group">
              <label for="reg-name">${e("name")}</label>
              <input
                type="text"
                id="reg-name"
                class="form-input"
                placeholder="${e("auth_name_placeholder")}"
                required
                autocomplete="name"
              />
            </div>

            <div class="form-group">
              <label for="reg-email">${e("email")}</label>
              <input
                type="email"
                id="reg-email"
                class="form-input"
                placeholder="${e("auth_email_placeholder")}"
                required
                autocomplete="email"
                dir="ltr"
              />
            </div>

            <div class="form-group">
              <label for="reg-phone">${e("phone")}</label>
              <input
                type="tel"
                id="reg-phone"
                class="form-input"
                placeholder="${e("auth_phone_placeholder")}"
                required
                autocomplete="tel"
                dir="ltr"
              />
            </div>

            <div class="form-group">
              <label for="reg-password">${e("password")}</label>
              <input
                type="password"
                id="reg-password"
                class="form-input"
                placeholder="${e("auth_pwd_min")}"
                minlength="6"
                required
                autocomplete="new-password"
                dir="ltr"
              />
            </div>

            <button type="submit" id="btn-auth-submit" class="btn btn-primary btn-block" style="margin-top: var(--spacing-20); height: 48px; font-size: 16px;">
              ${e("auth_btn_register")}
            </button>
          </form>
        `}

        <div class="auth-footer">
          ${t?`${e("auth_no_account")} <a href="#/register">${e("auth_signup_link")}</a>`:`${e("auth_has_account")} <a href="#/login">${e("auth_signin_link")}</a>`}
        </div>
      </div>
    </div>
  `}function O(a="login"){var r,c,d,y;const t=a==="login",n=document.getElementById("auth-error-alert"),s=document.getElementById("btn-auth-submit");(r=document.getElementById("btn-auth-lang-toggle"))==null||r.addEventListener("click",()=>{z.toggleLang()});const o=u=>{n&&(n.textContent=u,n.style.display="block"),$.error(u)},l=()=>{n&&(n.style.display="none",n.textContent="")},i=u=>{P.redirectToRoleDashboard(u||w.getRole()||"patient")};if(t){(c=document.getElementById("quick-manager-btn"))==null||c.addEventListener("click",()=>{document.getElementById("login-email").value="manager@clinic.com",document.getElementById("login-password").value="Manager@123",document.getElementById("login-form").dispatchEvent(new Event("submit"))}),(d=document.getElementById("quick-doctor-btn"))==null||d.addEventListener("click",()=>{document.getElementById("login-email").value="ahmed.doctor@clinic.com",document.getElementById("login-password").value="Doctor@123",document.getElementById("login-form").dispatchEvent(new Event("submit"))}),(y=document.getElementById("quick-patient-btn"))==null||y.addEventListener("click",()=>{document.getElementById("login-email").value="tariq.patient@clinic.com",document.getElementById("login-password").value="Patient@123",document.getElementById("login-form").dispatchEvent(new Event("submit"))});const u=document.getElementById("login-form");u==null||u.addEventListener("submit",async g=>{g.preventDefault(),l();const m=document.getElementById("login-email").value.trim(),_=document.getElementById("login-password").value;if(!m||!_){o(e("auth_fill_all"));return}s.disabled=!0,s.textContent=e("auth_signing_in");try{const v=(await w.login(m,_)).user||w.getUser();$.success(`${e("auth_welcome_back")} ${(v==null?void 0:v.name)||""}`),i(v==null?void 0:v.role)}catch(b){o(b.message||e("err_generic"))}finally{s.disabled=!1,s.textContent=e("auth_btn_login")}})}else{const u=document.getElementById("register-form");u==null||u.addEventListener("submit",async g=>{g.preventDefault(),l();const m=document.getElementById("reg-name").value.trim(),_=document.getElementById("reg-email").value.trim(),b=document.getElementById("reg-phone").value.trim(),v=document.getElementById("reg-password").value;if(!m||!_||!b||!v){o(e("auth_fill_all"));return}if(v.length<6){o(e("auth_pwd_len_err"));return}s.disabled=!0,s.textContent=e("auth_registering");try{const L=(await w.register({name:m,email:_,phone:b,password:v})).user||w.getUser();$.success(`${e("auth_register_success")} ${(L==null?void 0:L.name)||""}`),i("patient")}catch(E){let L=E.message;E.errors&&E.errors.length&&(L=E.errors.map(T=>T.message).join(" | ")),o(L||e("err_generic"))}finally{s.disabled=!1,s.textContent=e("auth_btn_register")}})}}class nt{constructor(){this.overlay=document.getElementById("modal-overlay"),this.overlay||(this.overlay=document.createElement("div"),this.overlay.id="modal-overlay",document.body.appendChild(this.overlay)),this.overlay.addEventListener("click",t=>{t.target===this.overlay&&this.close()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&this.isOpen()&&this.close()})}isOpen(){return this.overlay.classList.contains("open")}open(t,n=null){this.onCloseCallback=n,this.overlay.innerHTML=`<div class="modal">${t}</div>`,this.overlay.classList.add("open"),document.body.style.overflow="hidden",setTimeout(()=>{const s=this.overlay.querySelector("input, select, textarea, button");s&&s.focus()},50)}close(){this.overlay.classList.remove("open"),this.overlay.innerHTML="",document.body.style.overflow="",this.onCloseCallback&&(this.onCloseCallback(),this.onCloseCallback=null)}confirm({title:t="تأكيد الإجراء",message:n="هل أنت متأكد من المتابعة؟",confirmText:s="تأكيد",cancelText:o="إلغاء",confirmClass:l="btn-danger"}){return new Promise(i=>{var c,d;const r=`
        <h2>${t}</h2>
        <p style="color: var(--color-slate); margin-bottom: var(--spacing-24); line-height: 1.6;">
          ${n}
        </p>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="modal-cancel-btn">${o}</button>
          <button type="button" class="btn ${l}" id="modal-confirm-btn">${s}</button>
        </div>
      `;this.open(r,()=>i(!1)),(c=document.getElementById("modal-cancel-btn"))==null||c.addEventListener("click",()=>{this.close(),i(!1)}),(d=document.getElementById("modal-confirm-btn"))==null||d.addEventListener("click",()=>{this.close(),i(!0)})})}}const k=new nt;function at(a="doctors"){const t=w.getUser();return`
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>${e("pat_greeting")} ${h((t==null?void 0:t.name)||"")}</h1>
        <p>${e("pat_subtitle")}</p>

        <div class="dashboard-tabs" style="margin-top: var(--spacing-28); display: inline-flex; background: var(--color-studio-mist); padding: 4px; border-radius: 9999px; gap: 4px;">
          <button type="button" class="tab-btn ${a==="doctors"?"active":""}" id="tab-btn-doctors" style="border-radius: 9999px; padding: 10px 24px; font-weight: 500; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
            ${p.stethoscope({size:16})}
            <span>${e("pat_tab_doctors")}</span>
          </button>
          <button type="button" class="tab-btn ${a==="appointments"?"active":""}" id="tab-btn-appointments" style="border-radius: 9999px; padding: 10px 24px; font-weight: 500; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
            ${p.calendar({size:16})}
            <span>${e("pat_tab_appointments")}</span>
          </button>
        </div>
      </div>

      <div class="dashboard-content" style="max-width: 1200px; margin: 0 auto; padding: var(--spacing-32) var(--spacing-20);">
        <div id="patient-tab-content">
          <div style="text-align: center; padding: 40px;">
            <div class="spinner"></div>
            <p style="margin-top: 12px; color: var(--color-slate);">${e("loading")}</p>
          </div>
        </div>
      </div>
    </div>
  `}async function st(a="doctors"){let t=a;const n=document.getElementById("tab-btn-doctors"),s=document.getElementById("tab-btn-appointments"),o=document.getElementById("patient-tab-content"),l=i=>{t=i,n==null||n.classList.toggle("active",i==="doctors"),s==null||s.classList.toggle("active",i==="appointments"),window.location.hash=i==="doctors"?"#/patient":"#/patient?tab=appointments",i==="doctors"?X(o):it(o)};n==null||n.addEventListener("click",()=>l("doctors")),s==null||s.addEventListener("click",()=>l("appointments")),l(t)}async function X(a){var l,i;const t=z.isRtl();a.innerHTML=`
    <div style="margin-bottom: var(--spacing-28);">
      <div style="display: flex; gap: var(--spacing-16); flex-wrap: wrap; align-items: center; justify-content: space-between; margin-bottom: var(--spacing-20);">
        <!-- Search -->
        <div style="flex: 1; min-width: 260px; max-width: 420px; position: relative;">
          <input
            type="text"
            id="doctor-search-input"
            class="form-input"
            placeholder="${e("pat_search_placeholder")}"
            style="padding-${t?"right":"left"}: 42px; width: 100%;"
          />
          <div style="position: absolute; ${t?"right: 14px":"left: 14px"}; top: 50%; transform: translateY(-50%); color: var(--color-steel); display: flex; align-items: center;">
            ${p.search({size:18})}
          </div>
        </div>

        <!-- Specialty Filter Pills -->
        <div id="specialty-pills" style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="btn btn-sm btn-primary specialty-pill active" data-specialty="">${e("all")}</button>
          ${B.map(r=>`
            <button type="button" class="btn btn-sm btn-secondary specialty-pill" data-specialty="${r}">
              ${A(r)}
            </button>
          `).join("")}
        </div>
      </div>
    </div>

    <div id="doctors-grid" class="doctors-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--spacing-24);">
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    </div>
  `;let n=[],s="";const o=()=>{var y;const r=document.getElementById("doctors-grid");if(!r)return;const c=((y=document.getElementById("doctor-search-input"))==null?void 0:y.value.toLowerCase().trim())||"",d=n.filter(u=>{var E;const g=(((E=u.userId)==null?void 0:E.name)||"").toLowerCase(),m=(u.specialty||"").toLowerCase(),_=(A(u.specialty)||"").toLowerCase(),b=!c||g.includes(c)||m.includes(c)||_.includes(c),v=!s||u.specialty===s;return b&&v});if(d.length===0){r.innerHTML=`
        <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--color-gallery-white); border-radius: var(--radius-cards);">
          <div style="display: flex; justify-content: center; margin-bottom: 12px; color: var(--color-steel);">
            ${p.stethoscope({size:48})}
          </div>
          <h3>${e("pat_no_doctors")}</h3>
          <p style="color: var(--color-slate); font-size: 14px;">${e("pat_no_doctors_desc")}</p>
        </div>
      `;return}r.innerHTML=d.map(u=>{var v;const g=((v=u.userId)==null?void 0:v.name)||"Doctor",m=A(u.specialty),_=C(u.consultationFee),b=u.bio||"Specialist healthcare provider with extensive clinical expertise.";return`
        <div class="doctor-card" style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-28); box-shadow: var(--shadow-subtle); display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s ease, box-shadow 0.2s ease;">
          <div>
            <div style="display: flex; align-items: flex-start; gap: var(--spacing-16); margin-bottom: var(--spacing-16);">
              <div style="width: 52px; height: 52px; border-radius: 50%; background: rgba(0, 113, 227, 0.08); display: flex; align-items: center; justify-content: center; color: var(--color-pricing-blue); flex-shrink: 0;">
                ${p.stethoscope({size:24})}
              </div>
              <div>
                <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">${h(g)}</h3>
                <span class="status-badge status-upcoming" style="font-size: 12px;">${m}</span>
              </div>
            </div>

            <p style="color: var(--color-slate); font-size: 14px; line-height: 1.6; margin-bottom: var(--spacing-20); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
              ${h(b)}
            </p>
          </div>

          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: var(--spacing-16); border-top: 1px solid var(--color-hairline-silver); margin-bottom: var(--spacing-16);">
              <span style="font-size: 13px; color: var(--color-slate);">${e("pat_consultation_fee")}</span>
              <span style="font-size: 17px; font-weight: 600; color: var(--color-ink);">${_}</span>
            </div>

            <button type="button" class="btn btn-primary btn-block btn-book-doctor" data-doc-id="${u._id}" data-doc-name="${h(g)}" data-doc-fee="${_}" data-doc-specialty="${m}" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
              ${p.calendar({size:16})}
              <span>${e("pat_book_btn")}</span>
            </button>
          </div>
        </div>
      `}).join(""),r.querySelectorAll(".btn-book-doctor").forEach(u=>{u.addEventListener("click",()=>{const g=u.getAttribute("data-doc-id"),m=u.getAttribute("data-doc-name"),_=u.getAttribute("data-doc-fee"),b=u.getAttribute("data-doc-specialty");ot(g,m,b,_)})})};try{const r=await x.getDoctors();r.success&&r.data&&(n=r.data,o())}catch(r){a.innerHTML=`
      <div style="text-align: center; padding: 40px; color: var(--color-danger);">
        <p>${r.message}</p>
        <button type="button" class="btn btn-secondary btn-sm" id="retry-doctors-btn" style="margin-top: 12px; display: inline-flex; align-items: center; gap: 6px;">
          ${p.refresh({size:14})}
          <span>${e("retry")}</span>
        </button>
      </div>
    `,(l=document.getElementById("retry-doctors-btn"))==null||l.addEventListener("click",()=>X(a));return}(i=document.getElementById("doctor-search-input"))==null||i.addEventListener("input",o),document.querySelectorAll(".specialty-pill").forEach(r=>{r.addEventListener("click",()=>{document.querySelectorAll(".specialty-pill").forEach(c=>{c.classList.remove("btn-primary","active"),c.classList.add("btn-secondary")}),r.classList.remove("btn-secondary"),r.classList.add("btn-primary","active"),s=r.getAttribute("data-specialty"),o()})})}async function ot(a,t,n,s){var u;const o=V(new Date),l=`
    <h2>${e("pat_modal_book_title")} ${t}</h2>
    <div style="display: flex; gap: 8px; margin-bottom: var(--spacing-20); flex-wrap: wrap;">
      <span class="status-badge status-upcoming">${n}</span>
      <span class="status-badge" style="background: rgba(0,0,0,0.05);">${s}</span>
    </div>

    <div class="form-group">
      <label for="booking-date">${e("pat_select_date")}</label>
      <input
        type="date"
        id="booking-date"
        class="form-input"
        value="${o}"
        min="${o}"
      />
    </div>

    <div class="form-group">
      <label>${e("pat_available_slots")}</label>
      <div id="booking-slots-container" style="min-height: 120px; display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; max-height: 220px; overflow-y: auto; padding: 4px;">
        <div style="grid-column: 1/-1; text-align: center; padding: 20px;">
          <div class="spinner"></div>
          <p style="font-size: 13px; color: var(--color-slate); margin-top: 8px;">${e("pat_loading_slots")}</p>
        </div>
      </div>
    </div>

    <div class="form-group">
      <label for="booking-reason">${e("reason")}</label>
      <textarea
        id="booking-reason"
        class="form-input"
        rows="2"
        placeholder="${e("pat_reason_placeholder")}"
      ></textarea>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" id="modal-cancel-btn">${e("cancel")}</button>
      <button type="button" class="btn btn-primary" id="modal-confirm-booking-btn" disabled style="display: inline-flex; align-items: center; gap: 6px;">
        ${p.check({size:16})}
        <span>${e("pat_confirm_booking")}</span>
      </button>
    </div>
  `;k.open(l),(u=document.getElementById("modal-cancel-btn"))==null||u.addEventListener("click",()=>k.close());const i=document.getElementById("booking-slots-container"),r=document.getElementById("booking-date"),c=document.getElementById("modal-confirm-booking-btn");let d=null;const y=async g=>{d=null,c.disabled=!0,i.innerHTML=`
      <div style="grid-column: 1/-1; text-align: center; padding: 20px;">
        <div class="spinner"></div>
      </div>
    `;try{const m=await x.getDoctorSlots(a,g);if(m.success&&m.data){const _=m.data;if(_.length===0){i.innerHTML=`
            <div style="grid-column: 1/-1; text-align: center; padding: 24px; color: var(--color-slate); font-size: 13px; background: var(--color-studio-mist); border-radius: 12px;">
              ${e("pat_no_slots")}
            </div>
          `;return}i.innerHTML=_.map(b=>{const v=`${S(b.startTime)} - ${S(b.endTime)}`;return`
            <button
              type="button"
              class="slot-select-btn btn btn-secondary btn-sm"
              data-slot-id="${b._id}"
              style="padding: 8px 10px; font-size: 12px; border-radius: 12px; width: 100%; direction: ltr; display: inline-flex; align-items: center; justify-content: center; gap: 4px;"
            >
              ${p.clock({size:13})}
              <span>${v}</span>
            </button>
          `}).join(""),i.querySelectorAll(".slot-select-btn").forEach(b=>{b.addEventListener("click",()=>{i.querySelectorAll(".slot-select-btn").forEach(v=>{v.classList.remove("btn-primary"),v.classList.add("btn-secondary")}),b.classList.remove("btn-secondary"),b.classList.add("btn-primary"),d=b.getAttribute("data-slot-id"),c.disabled=!d})})}}catch(m){i.innerHTML=`
        <div style="grid-column: 1/-1; text-align: center; padding: 12px; color: var(--color-danger); font-size: 13px;">
          ${m.message}
        </div>
      `}};r==null||r.addEventListener("change",g=>{y(g.target.value)}),y(o),c==null||c.addEventListener("click",async()=>{var m;if(!d)return;const g=((m=document.getElementById("booking-reason"))==null?void 0:m.value.trim())||"General Consultation";c.disabled=!0,c.textContent=e("pat_booking_in_progress");try{await x.bookAppointment(d,g),k.close(),$.success(e("pat_booking_success"));const _=document.getElementById("tab-btn-appointments");_&&_.click()}catch(_){$.error(_.message||"Booking failed"),c.disabled=!1,c.textContent=e("pat_confirm_booking")}})}async function it(a){a.innerHTML=`
    <div style="margin-bottom: var(--spacing-28);">
      <div style="display: flex; gap: var(--spacing-16); flex-wrap: wrap; align-items: center; justify-content: space-between;">
        <h2 style="font-size: 20px; font-weight: 600;">${e("pat_appts_title")}</h2>

        <div id="appointment-status-filters" style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="btn btn-sm btn-primary appt-filter active" data-status="">${e("all")}</button>
          <button type="button" class="btn btn-sm btn-secondary appt-filter" data-status="upcoming">${e("status_upcoming")}</button>
          <button type="button" class="btn btn-sm btn-secondary appt-filter" data-status="done">${e("status_done")}</button>
          <button type="button" class="btn btn-sm btn-secondary appt-filter" data-status="cancelled">${e("status_cancelled")}</button>
        </div>
      </div>
    </div>

    <div id="appointments-list" style="display: flex; flex-direction: column; gap: var(--spacing-16);">
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    </div>
  `;let t="";const n=async()=>{var o;const s=document.getElementById("appointments-list");if(s){s.innerHTML=`
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    `;try{const l=await x.getPatientAppointments({status:t});if(l.success&&l.data){const i=l.data;if(i.length===0){s.innerHTML=`
            <div class="empty-state" style="text-align: center; padding: 60px 20px; background: var(--color-gallery-white); border-radius: var(--radius-cards);">
              <div style="display: flex; justify-content: center; margin-bottom: 12px; color: var(--color-steel);">
                ${p.calendar({size:48})}
              </div>
              <h3>${e("pat_no_appts")}</h3>
              <p style="color: var(--color-slate); font-size: 14px; margin-bottom: 20px;">${e("pat_no_appts_desc")}</p>
              <button type="button" class="btn btn-primary btn-sm" id="btn-goto-book" style="display: inline-flex; align-items: center; gap: 6px;">
                ${p.stethoscope({size:16})}
                <span>${e("pat_browse_now_btn")}</span>
              </button>
            </div>
          `,(o=document.getElementById("btn-goto-book"))==null||o.addEventListener("click",()=>{var r;(r=document.getElementById("tab-btn-doctors"))==null||r.click()});return}s.innerHTML=i.map(r=>{var v,E,L,T;const c=((E=(v=r.doctorId)==null?void 0:v.userId)==null?void 0:E.name)||"Doctor",d=A((L=r.doctorId)==null?void 0:L.specialty),y=C((T=r.doctorId)==null?void 0:T.consultationFee),u=q(r.status),g=M(r.status),m=H(r.appointmentTime),_=r.status==="upcoming"&&Q(r.appointmentTime),b=K(r.appointmentTime);return`
            <div class="appointment-card" style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-24) var(--spacing-28); box-shadow: var(--shadow-subtle); display: flex; flex-direction: column; gap: var(--spacing-16);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
                <div>
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 4px;">
                    <h3 style="font-size: 18px; font-weight: 600;">${h(c)}</h3>
                    <span class="status-badge ${u}">${g}</span>
                  </div>
                  <span style="font-size: 14px; color: var(--color-slate);">${d} • ${y}</span>
                </div>

                <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: var(--color-pricing-blue); background: var(--surface-studio-mist); padding: 6px 12px; border-radius: 9999px;">
                  ${p.clock({size:14})}
                  <span>${m}</span>
                </div>
              </div>

              <div style="background: var(--surface-studio-mist); padding: 12px 16px; border-radius: 16px; font-size: 14px;">
                <span style="font-weight: 500; color: var(--color-slate);">${e("reason")}:</span>
                <span style="color: var(--color-ink); margin-inline-start: 6px;">${h(r.reason||"General checkup")}</span>
              </div>

              ${r.notes?`
                <div style="background: rgba(0, 168, 84, 0.06); border: 1px solid rgba(0, 168, 84, 0.2); padding: 14px 18px; border-radius: 16px; font-size: 14px;">
                  <div style="font-weight: 600; color: var(--color-success); margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                    ${p.checkCircle({size:16})}
                    <span>${e("notes")}:</span>
                  </div>
                  <div style="color: var(--color-ink); line-height: 1.6;">${h(r.notes)}</div>
                </div>
              `:""}

              ${r.status==="upcoming"?`
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-hairline-silver); padding-top: var(--spacing-16); flex-wrap: wrap; gap: 10px;">
                  <div style="font-size: 12px; color: ${_?"var(--color-steel)":"var(--color-launch-orange)"}; display: inline-flex; align-items: center; gap: 6px;">
                    ${_?p.info({size:14}):p.alertCircle({size:14})}
                    <span>
                      ${_?`${e("pat_cancel_free_notice")} (${b.toFixed(1)} ${e("pat_cancel_hours_left")}).`:e("pat_cancel_blocked_notice")}
                    </span>
                  </div>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm btn-cancel-appointment"
                    data-id="${r._id}"
                    ${_?"":"disabled"}
                    style="display: inline-flex; align-items: center; gap: 6px;"
                  >
                    ${p.x({size:14})}
                    <span>${e("pat_cancel_btn")}</span>
                  </button>
                </div>
              `:""}
            </div>
          `}).join(""),s.querySelectorAll(".btn-cancel-appointment").forEach(r=>{r.addEventListener("click",async()=>{const c=r.getAttribute("data-id");if(await k.confirm({title:e("pat_cancel_confirm_title"),message:e("pat_cancel_confirm_msg"),confirmText:e("pat_cancel_confirm_btn"),cancelText:e("cancel"),confirmClass:"btn-danger"}))try{await x.cancelPatientAppointment(c),$.success(e("pat_cancel_success")),n()}catch(y){$.error(y.message||"Failed to cancel appointment")}})})}}catch(l){s.innerHTML=`
        <div style="text-align: center; padding: 20px; color: var(--color-danger);">
          <p>${l.message}</p>
        </div>
      `}}};document.querySelectorAll(".appt-filter").forEach(s=>{s.addEventListener("click",()=>{document.querySelectorAll(".appt-filter").forEach(o=>{o.classList.remove("btn-primary","active"),o.classList.add("btn-secondary")}),s.classList.remove("btn-secondary"),s.classList.add("btn-primary","active"),t=s.getAttribute("data-status"),n()})}),n()}function rt(a="schedule"){const t=w.getUser();return`
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>${e("doc_dashboard_title")}</h1>
        <p>${e("doc_welcome")} ${h((t==null?void 0:t.name)||"")}. ${e("doc_subtitle")}</p>

        <div class="dashboard-tabs" style="margin-top: var(--spacing-28); display: inline-flex; background: var(--color-studio-mist); padding: 4px; border-radius: 9999px; gap: 4px;">
          <button type="button" class="tab-btn ${a==="schedule"?"active":""}" id="doc-tab-btn-schedule" style="border-radius: 9999px; padding: 10px 24px; font-weight: 500; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
            ${p.calendar({size:16})}
            <span>${e("doc_tab_schedule")}</span>
          </button>
          <button type="button" class="tab-btn ${a==="slots"?"active":""}" id="doc-tab-btn-slots" style="border-radius: 9999px; padding: 10px 24px; font-weight: 500; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
            ${p.clock({size:16})}
            <span>${e("doc_tab_slots")}</span>
          </button>
          <button type="button" class="tab-btn ${a==="profile"?"active":""}" id="doc-tab-btn-profile" style="border-radius: 9999px; padding: 10px 24px; font-weight: 500; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
            ${p.user({size:16})}
            <span>${e("doc_tab_profile")}</span>
          </button>
        </div>
      </div>

      <div class="dashboard-content" style="max-width: 1200px; margin: 0 auto; padding: var(--spacing-32) var(--spacing-20);">
        <div id="doctor-tab-content">
          <div style="text-align: center; padding: 40px;">
            <div class="spinner"></div>
            <p style="margin-top: 12px; color: var(--color-slate);">${e("loading")}</p>
          </div>
        </div>
      </div>
    </div>
  `}async function lt(a="schedule"){let t=a;const n=document.getElementById("doc-tab-btn-schedule"),s=document.getElementById("doc-tab-btn-slots"),o=document.getElementById("doc-tab-btn-profile"),l=document.getElementById("doctor-tab-content"),i=r=>{t=r,n==null||n.classList.toggle("active",r==="schedule"),s==null||s.classList.toggle("active",r==="slots"),o==null||o.classList.toggle("active",r==="profile");const c=r==="schedule"?"":`?tab=${r}`;window.location.hash=`#/doctor${c}`,r==="schedule"?ct(l):r==="slots"?pt(l):r==="profile"&&ut(l)};n==null||n.addEventListener("click",()=>i("schedule")),s==null||s.addEventListener("click",()=>i("slots")),o==null||o.addEventListener("click",()=>i("profile")),i(t)}async function ct(a){var l;a.innerHTML=`
    <div style="margin-bottom: var(--spacing-28);">
      <div style="display: flex; gap: var(--spacing-16); flex-wrap: wrap; align-items: center; justify-content: space-between;">
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <h2 style="font-size: 20px; font-weight: 600;">${e("doc_schedule_title")}</h2>
          <input
            type="date"
            id="doc-schedule-date"
            class="form-input"
            style="width: 170px; padding: 6px 12px; font-size: 13px;"
          />
          <button type="button" class="btn btn-secondary btn-sm" id="doc-clear-date-btn" style="display: inline-flex; align-items: center; gap: 6px;">
            ${p.refresh({size:14})}
            <span>${e("doc_all_dates")}</span>
          </button>
        </div>

        <div id="doc-status-filters" style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="btn btn-sm btn-primary doc-filter active" data-status="">${e("all")}</button>
          <button type="button" class="btn btn-sm btn-secondary doc-filter" data-status="upcoming">${e("status_upcoming")}</button>
          <button type="button" class="btn btn-sm btn-secondary doc-filter" data-status="done">${e("status_done")}</button>
          <button type="button" class="btn btn-sm btn-secondary doc-filter" data-status="cancelled">${e("status_cancelled")}</button>
        </div>
      </div>
    </div>

    <div id="doc-appointments-list" style="display: flex; flex-direction: column; gap: var(--spacing-16);">
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    </div>
  `;let t="",n="";const s=async()=>{const i=document.getElementById("doc-appointments-list");if(i){i.innerHTML=`
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    `;try{const r=await x.getDoctorAppointments({date:t,status:n});if(r.success&&r.data){const c=r.data;if(c.length===0){i.innerHTML=`
            <div class="empty-state" style="text-align: center; padding: 60px 20px; background: var(--color-gallery-white); border-radius: var(--radius-cards);">
              <div style="display: flex; justify-content: center; margin-bottom: 12px; color: var(--color-steel);">
                ${p.calendar({size:48})}
              </div>
              <h3>${e("doc_no_schedule")}</h3>
              <p style="color: var(--color-slate); font-size: 14px;">${e("doc_no_schedule_desc")}</p>
            </div>
          `;return}i.innerHTML=c.map(d=>{var b,v;const y=((b=d.patientId)==null?void 0:b.name)||"Patient",u=((v=d.patientId)==null?void 0:v.phone)||"N/A",g=q(d.status),m=M(d.status),_=H(d.appointmentTime);return`
            <div class="appointment-card" style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-24) var(--spacing-28); box-shadow: var(--shadow-subtle); display: flex; flex-direction: column; gap: var(--spacing-16);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
                <div>
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 4px;">
                    <h3 style="font-size: 18px; font-weight: 600;">${h(y)}</h3>
                    <span class="status-badge ${g}">${m}</span>
                  </div>
                  <span style="font-size: 14px; color: var(--color-slate); display: inline-flex; align-items: center; gap: 4px;">
                    ${p.phone({size:14})}
                    <span dir="ltr">${h(u)}</span>
                  </span>
                </div>

                <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: var(--color-pricing-blue); background: var(--surface-studio-mist); padding: 6px 12px; border-radius: 9999px;">
                  ${p.clock({size:14})}
                  <span>${_}</span>
                </div>
              </div>

              <div style="background: var(--surface-studio-mist); padding: 12px 16px; border-radius: 16px; font-size: 14px;">
                <span style="font-weight: 500; color: var(--color-slate);">${e("reason")}:</span>
                <span style="color: var(--color-ink); margin-inline-start: 6px;">${h(d.reason||"Medical consultation")}</span>
              </div>

              ${d.notes?`
                <div style="background: rgba(0, 168, 84, 0.06); border: 1px solid rgba(0, 168, 84, 0.2); padding: 14px 18px; border-radius: 16px; font-size: 14px;">
                  <div style="font-weight: 600; color: var(--color-success); margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                    ${p.fileText({size:16})}
                    <span>${e("notes")}:</span>
                  </div>
                  <div style="color: var(--color-ink); line-height: 1.6;">${h(d.notes)}</div>
                </div>
              `:""}

              ${d.status==="upcoming"?`
                <div style="display: flex; justify-content: flex-end; gap: var(--spacing-12); border-top: 1px solid var(--color-hairline-silver); padding-top: var(--spacing-16); flex-wrap: wrap;">
                  <button
                    type="button"
                    class="btn btn-danger btn-sm btn-doc-cancel-appt"
                    data-id="${d._id}"
                    data-patient="${h(y)}"
                    style="display: inline-flex; align-items: center; gap: 6px;"
                  >
                    ${p.alertCircle({size:14})}
                    <span>${e("doc_cancel_emergency_btn")}</span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-success btn-sm btn-doc-complete-appt"
                    data-id="${d._id}"
                    data-patient="${h(y)}"
                    style="display: inline-flex; align-items: center; gap: 6px;"
                  >
                    ${p.check({size:14})}
                    <span>${e("doc_complete_btn")}</span>
                  </button>
                </div>
              `:""}
            </div>
          `}).join(""),i.querySelectorAll(".btn-doc-complete-appt").forEach(d=>{d.addEventListener("click",()=>{const y=d.getAttribute("data-id"),u=d.getAttribute("data-patient");dt(y,u,s)})}),i.querySelectorAll(".btn-doc-cancel-appt").forEach(d=>{d.addEventListener("click",async()=>{const y=d.getAttribute("data-id"),u=d.getAttribute("data-patient");if(await k.confirm({title:e("doc_cancel_confirm_title"),message:`${e("doc_cancel_confirm_msg")} (${u})?`,confirmText:e("doc_cancel_confirm_btn"),cancelText:e("cancel"),confirmClass:"btn-danger"}))try{await x.cancelDoctorAppointment(y),$.success(e("pat_cancel_success")),s()}catch(m){$.error(m.message||"Failed to cancel appointment")}})})}}catch(r){i.innerHTML=`
        <div style="text-align: center; padding: 20px; color: var(--color-danger);">
          <p>${r.message}</p>
        </div>
      `}}},o=document.getElementById("doc-schedule-date");o==null||o.addEventListener("change",i=>{t=i.target.value,s()}),(l=document.getElementById("doc-clear-date-btn"))==null||l.addEventListener("click",()=>{t="",o&&(o.value=""),s()}),document.querySelectorAll(".doc-filter").forEach(i=>{i.addEventListener("click",()=>{document.querySelectorAll(".doc-filter").forEach(r=>{r.classList.remove("btn-primary","active"),r.classList.add("btn-secondary")}),i.classList.remove("btn-secondary"),i.classList.add("btn-primary","active"),n=i.getAttribute("data-status"),s()})}),s()}function dt(a,t,n){var l;const s=`
    <h2>${e("doc_complete_modal_title")}</h2>
    <p style="color: var(--color-slate); font-size: 14px; margin-bottom: var(--spacing-20);">
      ${e("doc_complete_modal_subtitle")} <strong>${t}</strong>
    </p>

    <div class="form-group">
      <label for="doctor-notes-input">${e("doc_notes_label")}</label>
      <textarea
        id="doctor-notes-input"
        class="form-input"
        rows="4"
        placeholder="${e("doc_notes_placeholder")}"
        required
      ></textarea>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" id="modal-cancel-btn">${e("cancel")}</button>
      <button type="button" class="btn btn-success" id="modal-submit-complete-btn" style="display: inline-flex; align-items: center; gap: 6px;">
        ${p.check({size:16})}
        <span>${e("doc_confirm_complete_btn")}</span>
      </button>
    </div>
  `;k.open(s),(l=document.getElementById("modal-cancel-btn"))==null||l.addEventListener("click",()=>k.close());const o=document.getElementById("modal-submit-complete-btn");o==null||o.addEventListener("click",async()=>{var r;const i=(r=document.getElementById("doctor-notes-input"))==null?void 0:r.value.trim();if(!i){$.error("Please enter diagnosis notes before submitting.");return}o.disabled=!0,o.textContent=e("loading");try{await x.completeAppointment(a,i),k.close(),$.success(e("doc_complete_success")),n&&n()}catch(c){$.error(c.message||"Failed to complete appointment"),o.disabled=!1,o.textContent=e("doc_confirm_complete_btn")}})}async function pt(a){const t=V(new Date);a.innerHTML=`
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--spacing-28); align-items: flex-start;">
      <!-- Add Slot Form Card -->
      <div style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-28); box-shadow: var(--shadow-subtle);">
        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: var(--spacing-16); display: flex; align-items: center; gap: 8px;">
          ${p.plus({size:20,stroke:"var(--color-pricing-blue)"})}
          <span>${e("doc_add_slot_title")}</span>
        </h2>

        <form id="add-slot-form">
          <div class="form-group">
            <label for="slot-date-input">${e("date")}</label>
            <input
              type="date"
              id="slot-date-input"
              class="form-input"
              value="${t}"
              min="${t}"
              required
            />
          </div>

          <div class="form-group">
            <label for="slot-start-time">${e("doc_start_time")}</label>
            <input
              type="time"
              id="slot-start-time"
              class="form-input"
              value="09:00"
              required
            />
          </div>

          <div class="form-group">
            <label for="slot-end-time">${e("doc_end_time")}</label>
            <input
              type="time"
              id="slot-end-time"
              class="form-input"
              value="09:30"
              required
            />
          </div>

          <button type="submit" id="btn-add-slot-submit" class="btn btn-primary btn-block" style="margin-top: var(--spacing-20); display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
            ${p.plus({size:16})}
            <span>${e("doc_add_slot_btn")}</span>
          </button>
        </form>
      </div>

      <!-- Slots List -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-16); flex-wrap: wrap; gap: 10px;">
          <h2 style="font-size: 18px; font-weight: 600;">${e("doc_my_slots")}</h2>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="btn btn-sm btn-primary slot-filter active" data-booked="">${e("all")}</button>
            <button type="button" class="btn btn-sm btn-secondary slot-filter" data-booked="false">${e("doc_filter_available")}</button>
            <button type="button" class="btn btn-sm btn-secondary slot-filter" data-booked="true">${e("doc_filter_booked")}</button>
          </div>
        </div>

        <div id="slots-list-container" style="display: flex; flex-direction: column; gap: 12px;">
          <div style="text-align: center; padding: 40px;">
            <div class="spinner"></div>
          </div>
        </div>
      </div>
    </div>
  `;let n="";const s=async()=>{const i=document.getElementById("slots-list-container");if(i){i.innerHTML=`
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    `;try{const r=await x.getDoctorSlotsOwn({booked:n});if(r.success&&r.data){const c=r.data;if(c.length===0){i.innerHTML=`
            <div class="empty-state" style="text-align: center; padding: 40px 20px; background: var(--color-gallery-white); border-radius: var(--radius-cards);">
              <p style="color: var(--color-slate); font-size: 14px;">${e("doc_no_slots")}</p>
            </div>
          `;return}i.innerHTML=c.map(d=>{const y=F(d.startTime),u=`${S(d.startTime)} - ${S(d.endTime)}`,g=d.isBooked;return`
            <div class="slot-card" style="background: var(--color-gallery-white); border-radius: 16px; padding: 14px 20px; box-shadow: var(--shadow-subtle); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
              <div>
                <div style="font-weight: 600; font-size: 15px; color: var(--color-ink);">${y}</div>
                <div style="font-size: 13px; color: var(--color-slate);" dir="ltr">${u}</div>
              </div>

              <div style="display: flex; align-items: center; gap: 12px;">
                <span class="status-badge ${g?"status-upcoming":"status-done"}" style="font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
                  ${g?p.lock({size:12}):p.checkCircle({size:12})}
                  <span>${e(g?"status_booked":"status_available")}</span>
                </span>

                ${g?"":`
                  <button
                    type="button"
                    class="btn btn-danger btn-sm btn-delete-slot"
                    data-id="${d._id}"
                    style="padding: 6px 12px; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;"
                    title="${e("delete")}"
                  >
                    ${p.trash({size:13})}
                    <span>${e("delete")}</span>
                  </button>
                `}
              </div>
            </div>
          `}).join(""),i.querySelectorAll(".btn-delete-slot").forEach(d=>{d.addEventListener("click",async()=>{const y=d.getAttribute("data-id");if(await k.confirm({title:e("doc_delete_slot_title"),message:e("doc_delete_slot_msg"),confirmText:e("delete"),cancelText:e("cancel"),confirmClass:"btn-danger"}))try{await x.deleteSlot(y),$.success(e("doc_slot_deleted")),s()}catch(g){$.error(g.message||"Failed to delete slot")}})})}}catch(r){i.innerHTML=`
        <div style="text-align: center; padding: 20px; color: var(--color-danger);">
          <p>${r.message}</p>
        </div>
      `}}},o=document.getElementById("add-slot-form"),l=document.getElementById("btn-add-slot-submit");o==null||o.addEventListener("submit",async i=>{i.preventDefault();const r=document.getElementById("slot-date-input").value,c=document.getElementById("slot-start-time").value,d=document.getElementById("slot-end-time").value;if(!r||!c||!d){$.error("Please specify date and time range");return}const y=new Date(`${r}T${c}:00`),u=new Date(`${r}T${d}:00`);if(u<=y){$.error(e("doc_time_err"));return}l.disabled=!0,l.textContent=e("loading");try{await x.createSlot(y.toISOString(),u.toISOString()),$.success(e("doc_slot_created")),s()}catch(g){$.error(g.message||"Failed to create slot")}finally{l.disabled=!1,l.textContent=e("doc_add_slot_btn")}}),document.querySelectorAll(".slot-filter").forEach(i=>{i.addEventListener("click",()=>{document.querySelectorAll(".slot-filter").forEach(r=>{r.classList.remove("btn-primary","active"),r.classList.add("btn-secondary")}),i.classList.remove("btn-secondary"),i.classList.add("btn-primary","active"),n=i.getAttribute("data-booked"),s()})}),s()}async function ut(a){a.innerHTML=`
    <div style="text-align: center; padding: 40px;">
      <div class="spinner"></div>
    </div>
  `;try{const t=await x.getDoctorOwnProfile();if(t.success&&t.data){const n=t.data,s=n.userId||w.getUser(),o=A(n.specialty),l=C(n.consultationFee);a.innerHTML=`
        <div style="max-width: 600px; margin: 0 auto; background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-40); box-shadow: var(--shadow-subtle);">
          <div style="text-align: center; margin-bottom: var(--spacing-28);">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(0, 113, 227, 0.08); display: inline-flex; align-items: center; justify-content: center; color: var(--color-pricing-blue); margin-bottom: 16px;">
              ${p.stethoscope({size:40})}
            </div>
            <h2 style="font-size: 24px; font-weight: 600;">${h((s==null?void 0:s.name)||"")}</h2>
            <span class="status-badge status-upcoming" style="font-size: 14px; margin-top: 8px;">${o}</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: var(--spacing-16);">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--surface-studio-mist); border-radius: 12px;">
              <span style="color: var(--color-slate);">${e("email")}</span>
              <span style="font-weight: 500;" dir="ltr">${h((s==null?void 0:s.email)||"")}</span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--surface-studio-mist); border-radius: 12px;">
              <span style="color: var(--color-slate);">${e("phone")}</span>
              <span style="font-weight: 500;" dir="ltr">${h((s==null?void 0:s.phone)||"")}</span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--surface-studio-mist); border-radius: 12px;">
              <span style="color: var(--color-slate);">${e("fee")}</span>
              <span style="font-weight: 600; color: var(--color-pricing-blue);">${l}</span>
            </div>

            <div style="padding: 16px; background: var(--surface-studio-mist); border-radius: 12px;">
              <div style="color: var(--color-slate); font-size: 13px; margin-bottom: 6px;">${e("bio")}</div>
              <p style="color: var(--color-ink); line-height: 1.6; font-size: 14px;">${h(n.bio||"Professional medical practitioner.")}</p>
            </div>
          </div>
        </div>
      `}}catch(t){a.innerHTML=`
      <div style="text-align: center; padding: 40px; color: var(--color-danger);">
        <p>${t.message}</p>
      </div>
    `}}function gt(a="stats"){const t=w.getUser();return`
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>${e("mgr_dashboard_title")}</h1>
        <p>${e("doc_welcome")} ${h((t==null?void 0:t.name)||"")}. ${e("mgr_subtitle")}</p>

        <div class="dashboard-tabs" style="margin-top: var(--spacing-28); display: inline-flex; background: var(--color-studio-mist); padding: 4px; border-radius: 9999px; flex-wrap: wrap; gap: 4px;">
          <button type="button" class="tab-btn ${a==="stats"?"active":""}" id="mgr-tab-btn-stats" style="border-radius: 9999px; padding: 10px 20px; font-weight: 500; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
            ${p.activity({size:16})}
            <span>${e("mgr_tab_stats")}</span>
          </button>
          <button type="button" class="tab-btn ${a==="doctors"?"active":""}" id="mgr-tab-btn-doctors" style="border-radius: 9999px; padding: 10px 20px; font-weight: 500; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
            ${p.stethoscope({size:16})}
            <span>${e("mgr_tab_doctors")}</span>
          </button>
          <button type="button" class="tab-btn ${a==="users"?"active":""}" id="mgr-tab-btn-users" style="border-radius: 9999px; padding: 10px 20px; font-weight: 500; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
            ${p.users({size:16})}
            <span>${e("mgr_tab_users")}</span>
          </button>
          <button type="button" class="tab-btn ${a==="appointments"?"active":""}" id="mgr-tab-btn-appointments" style="border-radius: 9999px; padding: 10px 20px; font-weight: 500; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
            ${p.calendar({size:16})}
            <span>${e("mgr_tab_appointments")}</span>
          </button>
        </div>
      </div>

      <div class="dashboard-content" style="max-width: 1200px; margin: 0 auto; padding: var(--spacing-32) var(--spacing-20);">
        <div id="manager-tab-content">
          <div style="text-align: center; padding: 40px;">
            <div class="spinner"></div>
            <p style="margin-top: 12px; color: var(--color-slate);">${e("loading")}</p>
          </div>
        </div>
      </div>
    </div>
  `}async function mt(a="stats"){let t=a;const n=document.getElementById("mgr-tab-btn-stats"),s=document.getElementById("mgr-tab-btn-doctors"),o=document.getElementById("mgr-tab-btn-users"),l=document.getElementById("mgr-tab-btn-appointments"),i=document.getElementById("manager-tab-content"),r=c=>{t=c,n==null||n.classList.toggle("active",c==="stats"),s==null||s.classList.toggle("active",c==="doctors"),o==null||o.classList.toggle("active",c==="users"),l==null||l.classList.toggle("active",c==="appointments");const d=c==="stats"?"":`?tab=${c}`;window.location.hash=`#/manager${d}`,c==="stats"?bt(i):c==="doctors"?yt(i):c==="users"?ht(i):c==="appointments"&&ft(i)};n==null||n.addEventListener("click",()=>r("stats")),s==null||s.addEventListener("click",()=>r("doctors")),o==null||o.addEventListener("click",()=>r("users")),l==null||l.addEventListener("click",()=>r("appointments")),r(t)}async function bt(a){var t,n;a.innerHTML=`
    <div style="text-align: center; padding: 40px;">
      <div class="spinner"></div>
    </div>
  `;try{const[s,o,l]=await Promise.all([x.getManagerDoctors(),x.getManagerUsers(),x.getManagerAppointments()]),i=s.data||[],r=o.data||[],c=l.data||[],d=r.filter(b=>b.role==="patient").length,y=i.length,u=c.length,g=c.filter(b=>b.status==="done").length,m=c.filter(b=>b.status==="upcoming").length,_=c.filter(b=>b.status==="cancelled").length;a.innerHTML=`
      <!-- Stats Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--spacing-20); margin-bottom: var(--spacing-32);">
        <div class="stat-card" style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-24); box-shadow: var(--shadow-subtle);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 13px; color: var(--color-slate);">${e("mgr_total_doctors")}</span>
            <div style="color: var(--color-pricing-blue);">${p.stethoscope({size:18})}</div>
          </div>
          <div style="font-size: 32px; font-weight: 700; color: var(--color-ink);">${y}</div>
        </div>

        <div class="stat-card" style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-24); box-shadow: var(--shadow-subtle);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 13px; color: var(--color-slate);">${e("mgr_total_patients")}</span>
            <div style="color: var(--color-pricing-blue);">${p.users({size:18})}</div>
          </div>
          <div style="font-size: 32px; font-weight: 700; color: var(--color-ink);">${d}</div>
        </div>

        <div class="stat-card" style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-24); box-shadow: var(--shadow-subtle);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 13px; color: var(--color-slate);">${e("mgr_total_appts")}</span>
            <div style="color: var(--color-pricing-blue);">${p.calendar({size:18})}</div>
          </div>
          <div style="font-size: 32px; font-weight: 700; color: var(--color-pricing-blue);">${u}</div>
        </div>

        <div class="stat-card" style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-24); box-shadow: var(--shadow-subtle);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 13px; color: var(--color-slate);">${e("mgr_completed_appts")}</span>
            <div style="color: var(--color-success);">${p.checkCircle({size:18})}</div>
          </div>
          <div style="font-size: 32px; font-weight: 700; color: var(--color-success);">${g}</div>
        </div>
      </div>

      <!-- Quick Summary Details -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--spacing-24);">
        <!-- Status Breakdown -->
        <div style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-28); box-shadow: var(--shadow-subtle);">
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: var(--spacing-20);">${e("mgr_breakdown_title")}</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--surface-studio-mist); border-radius: 12px;">
              <span class="status-badge status-upcoming">${e("status_upcoming")}</span>
              <span style="font-weight: 600;">${m}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--surface-studio-mist); border-radius: 12px;">
              <span class="status-badge status-done">${e("status_done")}</span>
              <span style="font-weight: 600;">${g}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--surface-studio-mist); border-radius: 12px;">
              <span class="status-badge status-cancelled">${e("status_cancelled")}</span>
              <span style="font-weight: 600;">${_}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions Card -->
        <div style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-28); box-shadow: var(--shadow-subtle); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">${e("mgr_quick_actions")}</h3>
            <p style="color: var(--color-slate); font-size: 14px; margin-bottom: var(--spacing-20);">${e("mgr_quick_actions_desc")}</p>
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <button type="button" class="btn btn-primary" id="btn-quick-add-doc" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
              ${p.plus({size:16})}
              <span>${e("mgr_add_doctor_btn")}</span>
            </button>
            <button type="button" class="btn btn-secondary" id="btn-quick-view-users" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
              ${p.users({size:16})}
              <span>${e("mgr_view_users_btn")}</span>
            </button>
          </div>
        </div>
      </div>
    `,(t=document.getElementById("btn-quick-add-doc"))==null||t.addEventListener("click",()=>{var b;(b=document.getElementById("mgr-tab-btn-doctors"))==null||b.click(),setTimeout(()=>{var v;(v=document.getElementById("btn-open-add-doctor-modal"))==null||v.click()},100)}),(n=document.getElementById("btn-quick-view-users"))==null||n.addEventListener("click",()=>{var b;(b=document.getElementById("mgr-tab-btn-users"))==null||b.click()})}catch(s){a.innerHTML=`
      <div style="text-align: center; padding: 40px; color: var(--color-danger);">
        <p>${s.message}</p>
      </div>
    `}}async function yt(a){var s;a.innerHTML=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-24); flex-wrap: wrap; gap: 12px;">
      <div>
        <h2 style="font-size: 20px; font-weight: 600;">${e("mgr_doctors_title")}</h2>
        <p style="color: var(--color-slate); font-size: 14px;">${e("mgr_doctors_subtitle")}</p>
      </div>
      <button type="button" class="btn btn-primary" id="btn-open-add-doctor-modal" style="display: inline-flex; align-items: center; gap: 6px;">
        ${p.plus({size:16})}
        <span>${e("mgr_add_doctor_btn")}</span>
      </button>
    </div>

    <div id="manager-doctors-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: var(--spacing-20);">
      <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    </div>
  `;let t=[];const n=async()=>{const o=document.getElementById("manager-doctors-grid");if(o)try{const l=await x.getManagerDoctors();if(l.success&&l.data){if(t=l.data,t.length===0){o.innerHTML=`
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--color-gallery-white); border-radius: var(--radius-cards);">
              <p style="color: var(--color-slate);">${e("mgr_no_doctors")}</p>
            </div>
          `;return}o.innerHTML=t.map(i=>{var m,_,b;const r=((m=i.userId)==null?void 0:m.name)||"Doctor",c=((_=i.userId)==null?void 0:_.email)||"",d=((b=i.userId)==null?void 0:b.phone)||"",y=A(i.specialty),u=C(i.consultationFee),g=i.bio||"No bio recorded.";return`
            <div class="doctor-mgr-card" style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-24); box-shadow: var(--shadow-subtle); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                  <div>
                    <h3 style="font-size: 17px; font-weight: 600;">${h(r)}</h3>
                    <span class="status-badge status-upcoming" style="font-size: 12px; margin-top: 4px;">${y}</span>
                  </div>
                  <span style="font-weight: 600; color: var(--color-pricing-blue);">${u}</span>
                </div>

                <div style="font-size: 13px; color: var(--color-slate); line-height: 1.5; margin-bottom: 12px;">
                  <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                    ${p.mail({size:14})}
                    <span dir="ltr">${h(c)}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    ${p.phone({size:14})}
                    <span dir="ltr">${h(d)}</span>
                  </div>
                </div>

                <p style="font-size: 13px; color: var(--color-ink); line-height: 1.5; margin-bottom: 16px; background: var(--surface-studio-mist); padding: 10px; border-radius: 12px;">
                  ${h(g)}
                </p>
              </div>

              <div style="border-top: 1px solid var(--color-hairline-silver); padding-top: 12px; display: flex; justify-content: flex-end;">
                <button
                  type="button"
                  class="btn btn-secondary btn-sm btn-edit-doctor"
                  data-id="${i._id}"
                  data-specialty="${i.specialty}"
                  data-fee="${i.consultationFee}"
                  data-bio="${h(i.bio||"")}"
                  data-name="${h(r)}"
                  style="display: inline-flex; align-items: center; gap: 6px;"
                >
                  ${p.edit({size:14})}
                  <span>${e("edit")}</span>
                </button>
              </div>
            </div>
          `}).join(""),o.querySelectorAll(".btn-edit-doctor").forEach(i=>{i.addEventListener("click",()=>{const r=i.getAttribute("data-id"),c=i.getAttribute("data-name"),d=i.getAttribute("data-specialty"),y=i.getAttribute("data-fee"),u=i.getAttribute("data-bio");vt(r,c,d,y,u,n)})})}}catch(l){o.innerHTML=`
        <div style="grid-column: 1/-1; text-align: center; color: var(--color-danger); padding: 20px;">
          ${l.message}
        </div>
      `}};(s=document.getElementById("btn-open-add-doctor-modal"))==null||s.addEventListener("click",()=>{_t(n)}),n()}function _t(a){var s;const t=`
    <h2>${e("mgr_add_doc_modal_title")}</h2>
    <p style="color: var(--color-slate); font-size: 14px; margin-bottom: var(--spacing-20);">
      ${e("mgr_add_doc_modal_desc")}
    </p>

    <form id="add-doctor-form">
      <div class="form-group">
        <label for="new-doc-name">${e("name")}</label>
        <input type="text" id="new-doc-name" class="form-input" placeholder="Dr. Sarah Johnson" required />
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
        <div class="form-group">
          <label for="new-doc-email">${e("email")}</label>
          <input type="email" id="new-doc-email" class="form-input" placeholder="doctor@clinic.com" required dir="ltr" />
        </div>

        <div class="form-group">
          <label for="new-doc-phone">${e("phone")}</label>
          <input type="tel" id="new-doc-phone" class="form-input" placeholder="05XXXXXXXX" required dir="ltr" />
        </div>
      </div>

      <div class="form-group">
        <label for="new-doc-password">${e("password")}</label>
        <input type="password" id="new-doc-password" class="form-input" placeholder="${e("auth_pwd_min")}" minlength="6" required dir="ltr" />
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
        <div class="form-group">
          <label for="new-doc-specialty">${e("spec_Cardiology")}</label>
          <select id="new-doc-specialty" class="form-input" required>
            ${B.map(o=>`<option value="${o}">${A(o)} (${o})</option>`).join("")}
          </select>
        </div>

        <div class="form-group">
          <label for="new-doc-fee">${e("fee")} (${e("currency_suffix")})</label>
          <input type="number" id="new-doc-fee" class="form-input" min="0" value="200" required />
        </div>
      </div>

      <div class="form-group">
        <label for="new-doc-bio">${e("bio")}</label>
        <textarea id="new-doc-bio" class="form-input" rows="2" placeholder="Qualifications & clinical experience..."></textarea>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" id="modal-cancel-btn">${e("cancel")}</button>
        <button type="submit" class="btn btn-primary" id="btn-save-new-doctor" style="display: inline-flex; align-items: center; gap: 6px;">
          ${p.plus({size:16})}
          <span>${e("mgr_save_doc_btn")}</span>
        </button>
      </div>
    </form>
  `;k.open(t),(s=document.getElementById("modal-cancel-btn"))==null||s.addEventListener("click",()=>k.close());const n=document.getElementById("add-doctor-form");n==null||n.addEventListener("submit",async o=>{o.preventDefault();const l=document.getElementById("new-doc-name").value.trim(),i=document.getElementById("new-doc-email").value.trim(),r=document.getElementById("new-doc-phone").value.trim(),c=document.getElementById("new-doc-password").value,d=document.getElementById("new-doc-specialty").value,y=Number(document.getElementById("new-doc-fee").value),u=document.getElementById("new-doc-bio").value.trim(),g=document.getElementById("btn-save-new-doctor");g.disabled=!0,g.textContent=e("loading");try{await x.createDoctor({name:l,email:i,phone:r,password:c,specialty:d,consultationFee:y,bio:u}),k.close(),$.success(e("mgr_doc_created")),a&&a()}catch(m){$.error(m.message||"Failed to create doctor"),g.disabled=!1,g.textContent=e("mgr_save_doc_btn")}})}function vt(a,t,n,s,o,l){var c;const i=`
    <h2>${e("mgr_edit_doc_modal_title")} ${t}</h2>

    <form id="edit-doctor-form">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
        <div class="form-group">
          <label for="edit-doc-specialty">${e("spec_Cardiology")}</label>
          <select id="edit-doc-specialty" class="form-input" required>
            ${B.map(d=>`<option value="${d}" ${d===n?"selected":""}>${A(d)} (${d})</option>`).join("")}
          </select>
        </div>

        <div class="form-group">
          <label for="edit-doc-fee">${e("fee")} (${e("currency_suffix")})</label>
          <input type="number" id="edit-doc-fee" class="form-input" min="0" value="${s}" required />
        </div>
      </div>

      <div class="form-group">
        <label for="edit-doc-bio">${e("bio")}</label>
        <textarea id="edit-doc-bio" class="form-input" rows="3">${o}</textarea>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" id="modal-cancel-btn">${e("cancel")}</button>
        <button type="submit" class="btn btn-primary" id="btn-save-edit-doctor" style="display: inline-flex; align-items: center; gap: 6px;">
          ${p.check({size:16})}
          <span>${e("mgr_save_changes_btn")}</span>
        </button>
      </div>
    </form>
  `;k.open(i),(c=document.getElementById("modal-cancel-btn"))==null||c.addEventListener("click",()=>k.close());const r=document.getElementById("edit-doctor-form");r==null||r.addEventListener("submit",async d=>{d.preventDefault();const y=document.getElementById("edit-doc-specialty").value,u=Number(document.getElementById("edit-doc-fee").value),g=document.getElementById("edit-doc-bio").value.trim(),m=document.getElementById("btn-save-edit-doctor");m.disabled=!0,m.textContent=e("loading");try{await x.updateDoctor(a,{specialty:y,consultationFee:u,bio:g}),k.close(),$.success(e("mgr_doc_updated")),l&&l()}catch(_){$.error(_.message||"Failed to update details"),m.disabled=!1,m.textContent=e("mgr_save_changes_btn")}})}async function ht(a){var i,r,c;const t=z.isRtl();a.innerHTML=`
    <div style="margin-bottom: var(--spacing-24);">
      <div style="display: flex; gap: var(--spacing-16); flex-wrap: wrap; align-items: center; justify-content: space-between;">
        <h2 style="font-size: 20px; font-weight: 600;">${e("mgr_users_title")}</h2>

        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
          <input
            type="text"
            id="mgr-user-search"
            class="form-input"
            placeholder="${e("mgr_search_users_placeholder")}"
            style="width: 220px; padding: 6px 12px; font-size: 13px;"
          />

          <select id="mgr-role-filter" class="form-input" style="width: 140px; padding: 6px 12px; font-size: 13px;">
            <option value="">${e("mgr_all_roles")}</option>
            <option value="patient">${e("role_patient")}</option>
            <option value="doctor">${e("role_doctor")}</option>
            <option value="manager">${e("role_manager")}</option>
          </select>

          <select id="mgr-block-filter" class="form-input" style="width: 140px; padding: 6px 12px; font-size: 13px;">
            <option value="">${e("mgr_all_statuses")}</option>
            <option value="false">${e("mgr_active_only")}</option>
            <option value="true">${e("mgr_blocked_only")}</option>
          </select>
        </div>
      </div>
    </div>

    <div id="users-table-container" style="background: var(--color-gallery-white); border-radius: var(--radius-cards); box-shadow: var(--shadow-subtle); overflow-x: auto;">
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    </div>
  `;let n="",s="",o="";const l=async()=>{const d=document.getElementById("users-table-container");if(d){d.innerHTML=`
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    `;try{const y=await x.getManagerUsers({role:n,is_blocked:s,search:o});if(y.success&&y.data){const u=y.data;if(u.length===0){d.innerHTML=`
            <div class="empty-state" style="text-align: center; padding: 40px 20px;">
              <p style="color: var(--color-slate);">${e("pat_no_doctors_desc")}</p>
            </div>
          `;return}d.innerHTML=`
          <table class="data-table" style="width: 100%; border-collapse: collapse; text-align: ${t?"right":"left"};">
            <thead>
              <tr style="border-bottom: 1px solid var(--color-hairline-silver); background: var(--surface-studio-mist);">
                <th style="padding: 14px 20px; font-weight: 600; font-size: 13px; color: var(--color-slate);">${e("name")}</th>
                <th style="padding: 14px 20px; font-weight: 600; font-size: 13px; color: var(--color-slate);">${e("email")}</th>
                <th style="padding: 14px 20px; font-weight: 600; font-size: 13px; color: var(--color-slate);">${e("phone")}</th>
                <th style="padding: 14px 20px; font-weight: 600; font-size: 13px; color: var(--color-slate);">${e("role_patient")}</th>
                <th style="padding: 14px 20px; font-weight: 600; font-size: 13px; color: var(--color-slate);">${e("status")}</th>
                <th style="padding: 14px 20px; font-weight: 600; font-size: 13px; color: var(--color-slate); text-align: ${t?"left":"right"};">${e("actions")}</th>
              </tr>
            </thead>
            <tbody>
              ${u.map(g=>{var b;const m=g.is_blocked,_=g._id===((b=w.getUser())==null?void 0:b._id);return`
                  <tr style="border-bottom: 1px solid var(--color-hairline-silver);">
                    <td style="padding: 14px 20px; font-weight: 600;">${h(g.name)}</td>
                    <td style="padding: 14px 20px; font-size: 14px;" dir="ltr">${h(g.email)}</td>
                    <td style="padding: 14px 20px; font-size: 14px;" dir="ltr">${h(g.phone||"-")}</td>
                    <td style="padding: 14px 20px;">
                      <span class="role-badge role-${g.role}" style="font-size: 12px;">${U(g.role)}</span>
                    </td>
                    <td style="padding: 14px 20px;">
                      <span class="status-badge ${m?"status-cancelled":"status-done"}" style="font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
                        ${m?p.lock({size:12}):p.checkCircle({size:12})}
                        <span>${e(m?"status_blocked":"status_active")}</span>
                      </span>
                    </td>
                    <td style="padding: 14px 20px; text-align: ${t?"left":"right"};">
                      ${_?`<span style="color: var(--color-steel); font-size: 12px;">${e("current_account")}</span>`:`
                        <button
                          type="button"
                          class="btn ${m?"btn-success":"btn-danger"} btn-sm btn-toggle-block"
                          data-id="${g._id}"
                          data-name="${h(g.name)}"
                          data-blocked="${m}"
                          style="font-size: 12px; padding: 6px 14px; display: inline-flex; align-items: center; gap: 4px;"
                        >
                          ${m?p.unlock({size:13}):p.lock({size:13})}
                          <span>${e(m?"mgr_unblock_btn":"mgr_block_btn")}</span>
                        </button>
                      `}
                    </td>
                  </tr>
                `}).join("")}
            </tbody>
          </table>
        `,d.querySelectorAll(".btn-toggle-block").forEach(g=>{g.addEventListener("click",async()=>{const m=g.getAttribute("data-id"),_=g.getAttribute("data-name"),v=!(g.getAttribute("data-blocked")==="true");if(await k.confirm({title:e(v?"mgr_block_confirm_title":"mgr_unblock_confirm_title"),message:v?e("mgr_block_confirm_msg",{name:_}):e("mgr_unblock_confirm_msg",{name:_}),confirmText:e(v?"mgr_block_btn":"mgr_unblock_btn"),cancelText:e("cancel"),confirmClass:v?"btn-danger":"btn-success"}))try{await x.toggleBlockUser(m,v),$.success(e(v?"mgr_block_success":"mgr_unblock_success")),l()}catch(L){$.error(L.message||"Failed to update user block state")}})})}}catch(y){d.innerHTML=`
        <div style="text-align: center; padding: 20px; color: var(--color-danger);">
          <p>${y.message}</p>
        </div>
      `}}};(i=document.getElementById("mgr-user-search"))==null||i.addEventListener("input",d=>{o=d.target.value.trim(),l()}),(r=document.getElementById("mgr-role-filter"))==null||r.addEventListener("change",d=>{n=d.target.value,l()}),(c=document.getElementById("mgr-block-filter"))==null||c.addEventListener("change",d=>{s=d.target.value,l()}),l()}async function ft(a){a.innerHTML=`
    <div style="margin-bottom: var(--spacing-24);">
      <div style="display: flex; gap: var(--spacing-16); flex-wrap: wrap; align-items: center; justify-content: space-between;">
        <h2 style="font-size: 20px; font-weight: 600;">${e("mgr_all_appts_title")}</h2>

        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="btn btn-sm btn-primary mgr-appt-filter active" data-status="">${e("all")}</button>
          <button type="button" class="btn btn-sm btn-secondary mgr-appt-filter" data-status="upcoming">${e("status_upcoming")}</button>
          <button type="button" class="btn btn-sm btn-secondary mgr-appt-filter" data-status="done">${e("status_done")}</button>
          <button type="button" class="btn btn-sm btn-secondary mgr-appt-filter" data-status="cancelled">${e("status_cancelled")}</button>
        </div>
      </div>
    </div>

    <div id="manager-appointments-list" style="display: flex; flex-direction: column; gap: var(--spacing-16);">
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    </div>
  `;let t="";const n=async()=>{const s=document.getElementById("manager-appointments-list");if(s){s.innerHTML=`
      <div style="text-align: center; padding: 40px;">
        <div class="spinner"></div>
      </div>
    `;try{const o=await x.getManagerAppointments({status:t});if(o.success&&o.data){const l=o.data;if(l.length===0){s.innerHTML=`
            <div class="empty-state" style="text-align: center; padding: 60px 20px; background: var(--color-gallery-white); border-radius: var(--radius-cards);">
              <p style="color: var(--color-slate);">${e("pat_no_appts_desc")}</p>
            </div>
          `;return}s.innerHTML=l.map(i=>{var _,b,v,E,L;const r=((b=(_=i.doctorId)==null?void 0:_.userId)==null?void 0:b.name)||"Doctor",c=A((v=i.doctorId)==null?void 0:v.specialty),d=((E=i.patientId)==null?void 0:E.name)||"Patient",y=((L=i.patientId)==null?void 0:L.phone)||"",u=q(i.status),g=M(i.status),m=H(i.appointmentTime);return`
            <div class="appointment-card" style="background: var(--color-gallery-white); border-radius: var(--radius-cards); padding: var(--spacing-24); box-shadow: var(--shadow-subtle); display: flex; flex-direction: column; gap: var(--spacing-16);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
                <div>
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                    <span style="font-weight: 700; font-size: 16px;">${e("role_patient")}: ${h(d)}</span>
                    <span class="status-badge ${u}">${g}</span>
                  </div>
                  <div style="font-size: 13px; color: var(--color-slate);">
                    ${e("role_doctor")}: ${h(r)} (${c}) • ${e("phone")}: <span dir="ltr">${h(y)}</span>
                  </div>
                </div>

                <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: var(--color-pricing-blue); background: var(--surface-studio-mist); padding: 6px 12px; border-radius: 9999px;">
                  ${p.clock({size:14})}
                  <span>${m}</span>
                </div>
              </div>

              <div style="background: var(--surface-studio-mist); padding: 10px 14px; border-radius: 12px; font-size: 13px;">
                <span style="color: var(--color-slate); font-weight: 500;">${e("reason")}:</span>
                <span style="color: var(--color-ink); margin-inline-start: 4px;">${h(i.reason||"Medical Visit")}</span>
              </div>

              ${i.notes?`
                <div style="background: rgba(0, 168, 84, 0.05); border: 1px solid rgba(0, 168, 84, 0.15); padding: 10px 14px; border-radius: 12px; font-size: 13px;">
                  <span style="color: var(--color-success); font-weight: 600;">${e("notes")}:</span>
                  <span style="color: var(--color-ink); margin-inline-start: 4px;">${h(i.notes)}</span>
                </div>
              `:""}

              ${i.status==="upcoming"?`
                <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--color-hairline-silver); padding-top: 12px;">
                  <button
                    type="button"
                    class="btn btn-danger btn-sm btn-mgr-cancel-appt"
                    data-id="${i._id}"
                    data-patient="${h(d)}"
                    style="display: inline-flex; align-items: center; gap: 6px;"
                  >
                    ${p.x({size:14})}
                    <span>${e("mgr_cancel_appt_btn")}</span>
                  </button>
                </div>
              `:""}
            </div>
          `}).join(""),s.querySelectorAll(".btn-mgr-cancel-appt").forEach(i=>{i.addEventListener("click",async()=>{const r=i.getAttribute("data-id"),c=i.getAttribute("data-patient");if(await k.confirm({title:e("mgr_cancel_confirm_title"),message:e("mgr_cancel_confirm_msg",{name:c}),confirmText:e("delete"),cancelText:e("cancel"),confirmClass:"btn-danger"}))try{await x.cancelManagerAppointment(r),$.success(e("pat_cancel_success")),n()}catch(y){$.error(y.message||"Failed to cancel appointment")}})})}}catch(o){s.innerHTML=`
        <div style="text-align: center; padding: 20px; color: var(--color-danger);">
          <p>${o.message}</p>
        </div>
      `}}};document.querySelectorAll(".mgr-appt-filter").forEach(s=>{s.addEventListener("click",()=>{document.querySelectorAll(".mgr-appt-filter").forEach(o=>{o.classList.remove("btn-primary","active"),o.classList.add("btn-secondary")}),s.classList.remove("btn-secondary"),s.classList.add("btn-primary","active"),t=s.getAttribute("data-status"),n()})}),n()}class xt{constructor(){this.appContainer=document.getElementById("app"),window.addEventListener("hashchange",()=>this.handleRoute())}parseHash(){const t=window.location.hash.slice(1)||"/",[n,s]=t.split("?"),o=new URLSearchParams(s||"");return{path:n,params:o}}navigate(t){window.location.hash===t?this.handleRoute():window.location.hash=t}redirectToRoleDashboard(t){let n="#/patient";t==="doctor"?n="#/doctor":t==="manager"&&(n="#/manager"),this.navigate(n)}async handleRoute(){const{path:t,params:n}=this.parseHash(),s=w.isAuthenticated(),o=w.getRole();if(s){if(t==="/login"||t==="/register"||t==="/"){this.redirectToRoleDashboard(o);return}if(t.startsWith("/patient")&&o!=="patient"){this.redirectToRoleDashboard(o);return}if(t.startsWith("/doctor")&&o!=="doctor"){this.redirectToRoleDashboard(o);return}if(t.startsWith("/manager")&&o!=="manager"){this.redirectToRoleDashboard(o);return}}else if(t!=="/login"&&t!=="/register"){window.location.hash="#/login";return}let l="",i=!1;if(t==="/login")i=!0,l=N("login");else if(t==="/register")i=!0,l=N("register");else if(t.startsWith("/patient")){const c=n.get("tab")||"doctors";l=at(c)}else if(t.startsWith("/doctor")){const c=n.get("tab")||"schedule";l=rt(c)}else if(t.startsWith("/manager")){const c=n.get("tab")||"stats";l=gt(c)}else if(s){this.redirectToRoleDashboard(o);return}else{window.location.hash="#/login";return}const r=`
      ${i?"":Z()}
      <main id="main-content">
        ${l}
      </main>
      ${i?"":`
        <footer style="background: var(--color-gallery-white); border-top: 1px solid var(--color-hairline-silver); padding: 24px; text-align: center; color: var(--color-slate); font-size: 13px;">
          <p>${e("copyright")}</p>
        </footer>
      `}
    `;if(this.appContainer.innerHTML=r,i||tt(),t==="/login")O("login");else if(t==="/register")O("register");else if(t.startsWith("/patient")){const c=n.get("tab")||"doctors";st(c)}else if(t.startsWith("/doctor")){const c=n.get("tab")||"schedule";lt(c)}else if(t.startsWith("/manager")){const c=n.get("tab")||"stats";mt(c)}}init(){this.handleRoute()}}const P=new xt;async function R(){try{document.title=e("app_title"),await w.init()}catch(a){console.error("Failed during auth initialization:",a)}finally{P.init()}}z.subscribe(()=>{document.title=e("app_title"),P.handleRoute()});w.subscribe(({isAuthenticated:a,role:t})=>{const n=window.location.hash||"#/";!a&&!n.startsWith("#/login")&&!n.startsWith("#/register")&&(window.location.hash="#/login")});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",R):R();
