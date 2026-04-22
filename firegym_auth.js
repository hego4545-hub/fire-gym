// firegym_auth.js
// Fire Gym Elite - Auth & Security Logic v10.1 (Legacy Optimized)

async function fireGymChangePass() {
    if (typeof Swal === 'undefined') return alert("مكتبة التنبيهات لا تعمل، برجاء تحديث الصفحة 🔄");
    
    var p = localStorage.getItem('fire_gym_phone');
    if (!p) return Swal.fire('خطأ', 'برجاء تسجيل الدخول أولاً يا وحش', 'error');

    var result = await Swal.fire({
        title: 'تغيير كلمة السر 🔥',
        input: 'password',
        inputLabel: 'ادخل كلمة السر الجديدة:',
        inputPlaceholder: 'كلمة سر قوية...',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#ffb300',
        confirmButtonText: 'حفظ التعديل ✅',
        showCancelButton: true,
        cancelButtonText: 'إلغاء'
    });

    var pass = result.value;

    if (pass) {
        if (pass.length < 4) return Swal.fire('خطأ', 'الباسورد لازم يكون 4 أرقام أو حروف على الأقل', 'error');
        Swal.fire({ title: 'جاري الحفظ...', allowOutsideClick: false, didOpen: function() { Swal.showLoading(); } });
        try {
            await firebase.firestore().collection('users').doc(p).set({ password: pass }, { merge: true });
            Swal.fire({ title: 'عاش يا بطل! 🔥', text: 'تم تحديث كلمة السر بنجاح، متنسهاش بقى!', icon: 'success', background: '#1e1e1e', color: '#fff' });
        } catch(e) {
            Swal.fire('عذراً', 'فشل الحفظ: ' + e.message, 'error');
        }
    }
}

async function requestGoalChange() {
    var p = localStorage.getItem('fire_gym_phone');
    if (!p) return Swal.fire('عذراً', 'برجاء تسجيل الدخول أولاً', 'error');

    var s = await firebase.firestore().collection('users').doc(p).get();
    if (!s.exists) return Swal.fire('خطأ', 'بيانات المستخدم غير موجودة', 'error');
    var u = s.data();

    var result = await Swal.fire({
        title: 'طلب تغيير نظامك 🔥',
        input: 'select',
        inputOptions: {
            'نظام تدريب': 'نظام تدريب 🏋️‍♂️',
            'نظام تغذيه': 'نظام تغذيه 🥗',
            'نظام VIP': 'نظام VIP ⭐'
        },
        inputPlaceholder: 'اختر النظام اللي عايزه...',
        showCancelButton: true,
        confirmButtonText: 'إرسال الطلب للكابتن ✅',
        cancelButtonText: 'إلغاء',
        background: '#1a1a1a',
        color: '#fff'
    });

    var goal = result.value;

    if (goal) {
        if (goal === u.goal) return Swal.fire('ملاحظة', 'أنت مسجل بالفعل في هذا النظام يا بطل!', 'info');

        Swal.fire({ title: 'جاري الإرسال...', allowOutsideClick: false, didOpen: function() { Swal.showLoading(); } });
        try {
            await firebase.firestore().collection('users').doc(p).update({
                pendingGoal: goal
            });
            Swal.fire({
                title: 'تم الإرسال بنجاح! 🚀',
                text: 'طلبك وصل للكابتن وهيتم مراجعته فوراً، انتظر التغيير يا وحش!',
                icon: 'success',
                background: '#1e1e1e',
                color: '#fff'
            });
        } catch (e) {
            Swal.fire('خطأ', 'فشل إرسال الطلب: ' + e.message, 'error');
        }
    }
}

async function approveGoalChange(id, newGoal) {
    Swal.fire({ title: 'جاري التنفيذ...', allowOutsideClick: false, didOpen: function() { Swal.showLoading(); } });
    try {
        await firebase.firestore().collection('users').doc(id).update({
            goal: newGoal,
            pendingGoal: null
        });
        Swal.fire({
            title: 'تمت الموافقة! ✅',
            text: 'نظام البطل اتغير رسمياً ومسحنا الطلب المعلق.',
            icon: 'success',
            timer: 1500,
            background: '#1e1e1e',
            color: '#fff'
        });
        if (typeof sendNotificationTo === 'function') sendNotificationTo(id, "تحديث من الكابتن 🔥", "الكابتن وافق على تغيير نظامك إلى: " + newGoal);
        if (typeof loadAdmin === 'function') loadAdmin();
    } catch (e) {
        Swal.fire('خطأ', 'فشل التنفيذ: ' + e.message, 'error');
    }
}

async function rejectGoalChange(id) {
    if (!confirm('هل أنت متأكد من رفض طلب هذا البطل؟')) return;
    try {
        await firebase.firestore().collection('users').doc(id).update({
            pendingGoal: null
        });
        Swal.fire('تم الرفض ❌', 'تم مسح طلب التغيير وإبقاء البطل على نظامه الحالي.', 'info');
        if (typeof loadAdmin === 'function') loadAdmin();
    } catch (e) {
        Swal.fire('خطأ', 'فشل الإجراء: ' + e.message, 'error');
    }
}
