/*
  # إصلاح معرّف المستخدم المدير بين جدول المصادقة وجدول المستخدمين
  
  1. المشكلة
    - معرّف مستخدم المدير في جدول المصادقة (7151aed7-6856-4ae7-bb15-41125c7c98ba)
    - مختلف عن معرّفه في جدول المستخدمين (1e57a768-c57b-4a3d-9b2d-f83d26a79ea1)
    - هذا يمنع تسجيل الدخول بشكل صحيح
  
  2. الحل
    - تحديث معرّف المستخدم في جدول public.users ليطابق معرّف المصادقة
    - نقل العلاقات المرتبطة بالمعرّف القديم إلى المعرّف الجديد
*/

-- إجراء لإصلاح معرّف المستخدم المدير بين نظامي المصادقة والمستخدمين
DO $$
DECLARE
  auth_user_id UUID := '7151aed7-6856-4ae7-bb15-41125c7c98ba';  -- المعرّف من نظام المصادقة
  public_user_id UUID := '1e57a768-c57b-4a3d-9b2d-f83d26a79ea1'; -- المعرّف الحالي في جدول المستخدمين
  admin_email TEXT := 'admin@charity.org';
  services_count INTEGER := 0;
  user_exists BOOLEAN;
BEGIN
  -- التحقق من وجود المستخدم بالمعرّف القديم
  SELECT EXISTS(
    SELECT 1 FROM public.users WHERE id = public_user_id
  ) INTO user_exists;
  
  IF user_exists THEN
    -- 1. تحديث الخدمات المرتبطة بالمعرّف القديم
    UPDATE services 
    SET created_by = auth_user_id
    WHERE created_by = public_user_id;
    
    GET DIAGNOSTICS services_count = ROW_COUNT;
    RAISE NOTICE 'تم تحديث % خدمة لاستخدام المعرّف الجديد', services_count;
    
    -- 2. إنشاء نسخة من المستخدم بالمعرّف الجديد (إذا لم تكن موجودة)
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
    SELECT 
      auth_user_id,
      'مدير النظام',
      admin_email,
      '+966500000000',
      'admin',
      true,
      now(),
      now()
    WHERE NOT EXISTS (
      SELECT 1 FROM public.users WHERE id = auth_user_id
    );
    
    -- 3. حذف المستخدم القديم
    DELETE FROM public.users 
    WHERE id = public_user_id;
    
    RAISE NOTICE 'تم حذف المستخدم القديم بالمعرّف % وإنشاء مستخدم جديد بالمعرّف %', 
      public_user_id, auth_user_id;
  ELSE
    RAISE NOTICE 'المستخدم بالمعرّف % غير موجود. لا حاجة للإصلاح.', public_user_id;
    
    -- التأكد من وجود المستخدم بالمعرّف الجديد
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
    SELECT 
      auth_user_id,
      'مدير النظام',
      admin_email,
      '+966500000000',
      'admin',
      true,
      now(),
      now()
    WHERE NOT EXISTS (
      SELECT 1 FROM public.users WHERE id = auth_user_id
    );
  END IF;
  
  -- 4. التأكد من أن المستخدم الجديد لديه دور المدير
  UPDATE public.users
  SET 
    role = 'admin',
    is_active = true,
    full_name = 'مدير النظام',
    email = admin_email,
    updated_at = now()
  WHERE id = auth_user_id;
  
  RAISE NOTICE 'اكتملت عملية إصلاح معرّف المستخدم المدير بنجاح';
  RAISE NOTICE 'الآن يجب أن تكون قادرًا على تسجيل الدخول باستخدام admin@charity.org';
END $$;
