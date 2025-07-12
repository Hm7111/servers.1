-- إجراء لإصلاح معرّف المستخدم المدير بين نظامي المصادقة والمستخدمين
DO $$
DECLARE
  auth_user_id UUID := '7151aed7-6856-4ae7-bb15-41125c7c98ba';  -- المعرّف من نظام المصادقة
  public_user_id UUID := '1e57a768-c57b-4a3d-9b2d-f83d26a79ea1'; -- المعرّف الحالي في جدول المستخدمين
  admin_email TEXT := 'admin@charity.org';
  services_count INTEGER := 0;
  admin_exists BOOLEAN;
BEGIN
  -- 1. التحقق مما إذا كان المستخدم المدير موجود بالفعل
  SELECT EXISTS(
    SELECT 1 FROM public.users WHERE email = admin_email
  ) INTO admin_exists;
  
  RAISE NOTICE 'المستخدم المدير موجود: %', admin_exists;
  
  IF admin_exists THEN
    -- 2. الحصول على معرف المستخدم المدير الحالي
    SELECT id INTO public_user_id
    FROM public.users
    WHERE email = admin_email;
    
    RAISE NOTICE 'معرّف المستخدم المدير الحالي: %', public_user_id;
    
    -- 3. إذا كان المعرّف الحالي مختلفًا عن معرّف المصادقة، نقوم بتحديث الخدمات أولاً
    IF public_user_id != auth_user_id THEN
      -- تحديث الخدمات المرتبطة بالمعرّف القديم
      UPDATE services 
      SET created_by = auth_user_id
      WHERE created_by = public_user_id;
      
      GET DIAGNOSTICS services_count = ROW_COUNT;
      RAISE NOTICE 'تم تحديث % خدمة لاستخدام المعرّف الجديد', services_count;
      
      -- حذف المستخدم القديم وإنشاء مستخدم جديد بالمعرّف الصحيح
      -- لكن يجب تغيير البريد الإلكتروني للمستخدم القديم أولاً لتجنب تضارب المفتاح الفريد
      UPDATE public.users
      SET email = 'old_admin_' || now()::text || '@backup.org'
      WHERE id = public_user_id;
      
      -- الآن نقوم بإنشاء المستخدم بالمعرّف الصحيح
      INSERT INTO public.users (
        id, 
        full_name, 
        email, 
        phone, 
        role, 
        is_active,
        created_at,
        updated_at
      )
      VALUES (
        auth_user_id,
        'مدير النظام',
        admin_email,
        '+966500000000',
        'admin',
        true,
        now(),
        now()
      );
      
      RAISE NOTICE 'تم إنشاء مستخدم جديد بالمعرّف الصحيح: %', auth_user_id;
      
      -- حذف المستخدم القديم بعد نقل جميع العلاقات
      DELETE FROM public.users 
      WHERE id = public_user_id;
      
      RAISE NOTICE 'تم حذف المستخدم القديم بالمعرّف: %', public_user_id;
    ELSE
      -- المعرف متطابق بالفعل، نتأكد فقط من أن البيانات صحيحة
      UPDATE public.users
      SET 
        role = 'admin',
        is_active = true,
        full_name = 'مدير النظام',
        updated_at = now()
      WHERE id = auth_user_id;
      
      RAISE NOTICE 'المعرّفات متطابقة بالفعل. تم تحديث بيانات المستخدم فقط.';
    END IF;
  ELSE
    -- المستخدم المدير غير موجود، نقوم بإنشائه بالمعرّف الصحيح
    INSERT INTO public.users (
      id, 
      full_name, 
      email, 
      phone, 
      role, 
      is_active,
      created_at,
      updated_at
    )
    VALUES (
      auth_user_id,
      'مدير النظام',
      admin_email,
      '+966500000000',
      'admin',
      true,
      now(),
      now()
    );
    
    RAISE NOTICE 'تم إنشاء مستخدم مدير جديد بالمعرّف: %', auth_user_id;
  END IF;
  
  RAISE NOTICE 'اكتملت عملية إصلاح معرّف المستخدم المدير بنجاح';
  RAISE NOTICE 'الآن يجب أن تكون قادرًا على تسجيل الدخول باستخدام admin@charity.org';
END $$;
