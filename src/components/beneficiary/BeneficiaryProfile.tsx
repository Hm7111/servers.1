import React, { useState, useEffect } from 'react';
import { 
  User, Phone, Mail, Calendar, MapPin, 
  Briefcase, Building, Heart, Save, Edit,
  ChevronRight, ChevronLeft, FileText, CheckCircle
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import ErrorMessage from '../ui/ErrorMessage';
import { formatGregorianDate } from '../../utils/dateHelpers';
import { disabilityTypes, educationLevels, employmentStatuses, saudiCities } from '../../utils/registrationData';
import { formatPhoneNumber } from '../../utils/helpers';

interface BeneficiaryProfileProps {
  userData: any;
  memberData: any;
  activeSubTab: 'personal' | 'professional' | 'address' | 'contact' | 'documents';
  onChangeSubTab: (subTab: 'personal' | 'professional' | 'address' | 'contact' | 'documents') => void;
}

const BeneficiaryProfile: React.FC<BeneficiaryProfileProps> = ({
  userData,
  memberData,
  activeSubTab,
  onChangeSubTab
}) => {
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: memberData?.full_name || '',
    gender: memberData?.gender || 'male',
    birthDate: memberData?.birth_date || '',
    age: memberData?.age || '',
    disabilityType: memberData?.disability_type || '',
    disabilityDetails: memberData?.disability_details || '',
    disabilityCardNumber: memberData?.disability_card_number || '',
    // Professional Info
    educationLevel: memberData?.education_level || '',
    employmentStatus: memberData?.employment_status || '',
    jobTitle: memberData?.job_title || '',
    employer: memberData?.employer || '',
    monthlyIncome: memberData?.monthly_income || '',
    // Address Info
    buildingNumber: memberData?.building_number || '',
    streetName: memberData?.street_name || '',
    district: memberData?.district || '',
    city: memberData?.city || '',
    postalCode: memberData?.postal_code || '',
    additionalNumber: memberData?.additional_number || '',
    address: memberData?.address || '',
    // Contact Info
    phone: memberData?.phone || '',
    alternativePhone: memberData?.alternative_phone || '',
    email: memberData?.email || '',
    emergencyContactName: memberData?.emergency_contact_name || '',
    emergencyContactPhone: memberData?.emergency_contact_phone || '',
    emergencyContactRelation: memberData?.emergency_contact_relation || ''
  });

  useEffect(() => {
    if (memberData) {
      setFormData({
        // Personal Info
        fullName: memberData.full_name || '',
        gender: memberData.gender || 'male',
        birthDate: memberData.birth_date || '',
        age: memberData.age || '',
        disabilityType: memberData.disability_type || '',
        disabilityDetails: memberData.disability_details || '',
        disabilityCardNumber: memberData.disability_card_number || '',
        // Professional Info
        educationLevel: memberData.education_level || '',
        employmentStatus: memberData.employment_status || '',
        jobTitle: memberData.job_title || '',
        employer: memberData.employer || '',
        monthlyIncome: memberData.monthly_income || '',
        // Address Info
        buildingNumber: memberData.building_number || '',
        streetName: memberData.street_name || '',
        district: memberData.district || '',
        city: memberData.city || '',
        postalCode: memberData.postal_code || '',
        additionalNumber: memberData.additional_number || '',
        address: memberData.address || '',
        // Contact Info
        phone: memberData.phone || '',
        alternativePhone: memberData.alternative_phone || '',
        email: memberData.email || '',
        emergencyContactName: memberData.emergency_contact_name || '',
        emergencyContactPhone: memberData.emergency_contact_phone || '',
        emergencyContactRelation: memberData.emergency_contact_relation || ''
      });
    }
  }, [memberData]);

  // Load any additional data if needed
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // In a real app, you might load additional data from backend
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    };

    loadData();
  }, [activeSubTab]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // In a real app, save changes to the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('تم حفظ التغييرات بنجاح');
      setEditMode(false);
    } catch (error) {
      alert('حدث خطأ أثناء حفظ التغييرات');
    } finally {
      setIsSaving(false);
    }
  };

  const tabItems = [
    { id: 'personal', label: 'البيانات الشخصية', icon: <User className="w-5 h-5" /> },
    { id: 'professional', label: 'البيانات المهنية', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'address', label: 'العنوان', icon: <MapPin className="w-5 h-5" /> },
    { id: 'contact', label: 'بيانات التواصل', icon: <Phone className="w-5 h-5" /> },
    { id: 'documents', label: 'المستندات', icon: <FileText className="w-5 h-5" /> }
  ];

  const renderPersonalInfo = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <User className="w-6 h-6 text-blue-600" />
          البيانات الشخصية
        </h3>
        {!editMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditMode(true)}
            icon={<Edit className="w-4 h-4" />}
          >
            تعديل
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {editMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="الاسم الكامل"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="الاسم الكامل"
            />

            <Select
              label="الجنس"
              value={formData.gender}
              onChange={(value) => handleInputChange('gender', value)}
              options={[
                { value: 'male', label: 'ذكر' },
                { value: 'female', label: 'أنثى' }
              ]}
            />

            <Input
              label="تاريخ الميلاد"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
            />

            <Input
              label="العمر"
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              disabled={true}
            />

            <Select
              label="نوع الإعاقة"
              value={formData.disabilityType}
              onChange={(value) => handleInputChange('disabilityType', value)}
              options={Object.entries(disabilityTypes).map(([key, label]) => ({
                value: key,
                label: label
              }))}
            />

            <Input
              label="رقم بطاقة الإعاقة"
              type="text"
              value={formData.disabilityCardNumber}
              onChange={(e) => handleInputChange('disabilityCardNumber', e.target.value)}
            />

            <Input
              label="تفاصيل الإعاقة"
              type="text"
              value={formData.disabilityDetails}
              onChange={(e) => handleInputChange('disabilityDetails', e.target.value)}
              className="col-span-2 h-20"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">الاسم الكامل</p>
                <p className="text-lg font-medium text-gray-900">{formData.fullName || 'غير محدد'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">الجنس</p>
                <p className="text-lg font-medium text-gray-900">{formData.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">تاريخ الميلاد</p>
                <p className="text-lg font-medium text-gray-900">{formData.birthDate ? formatGregorianDate(formData.birthDate) : 'غير محدد'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">العمر</p>
                <p className="text-lg font-medium text-gray-900">{formData.age || 'غير محدد'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">نوع الإعاقة</p>
                <p className="text-lg font-medium text-gray-900">
                  {formData.disabilityType ? disabilityTypes[formData.disabilityType as keyof typeof disabilityTypes] : 'غير محدد'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">رقم بطاقة الإعاقة</p>
                <p className="text-lg font-medium text-gray-900">{formData.disabilityCardNumber || 'غير محدد'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">تفاصيل الإعاقة</p>
                <p className="text-lg font-medium text-gray-900">{formData.disabilityDetails || 'غير محدد'}</p>
              </div>
            </div>
          </div>
        )}

        {editMode && (
          <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setEditMode(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSaveChanges}
              isLoading={isSaving}
              icon={<Save className="w-5 h-5" />}
            >
              حفظ التغييرات
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-green-600" />
          البيانات المهنية
        </h3>
        {!editMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditMode(true)}
            icon={<Edit className="w-4 h-4" />}
          >
            تعديل
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {editMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="المؤهل العلمي"
              value={formData.educationLevel}
              onChange={(value) => handleInputChange('educationLevel', value)}
              options={Object.entries(educationLevels).map(([key, label]) => ({
                value: key,
                label: label
              }))}
            />

            <Select
              label="الحالة الوظيفية"
              value={formData.employmentStatus}
              onChange={(value) => handleInputChange('employmentStatus', value)}
              options={Object.entries(employmentStatuses).map(([key, label]) => ({
                value: key,
                label: label
              }))}
            />

            <Input
              label="المسمى الوظيفي"
              type="text"
              value={formData.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              disabled={formData.employmentStatus !== 'employed'}
            />

            <Input
              label="جهة العمل"
              type="text"
              value={formData.employer}
              onChange={(e) => handleInputChange('employer', e.target.value)}
              disabled={formData.employmentStatus !== 'employed'}
            />

            <Input
              label="الدخل الشهري (ريال)"
              type="number"
              value={formData.monthlyIncome}
              onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">المؤهل الدراسي</p>
                <p className="text-lg font-medium text-gray-900">
                  {formData.educationLevel ? educationLevels[formData.educationLevel as keyof typeof educationLevels] : 'غير محدد'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">الحالة الوظيفية</p>
                <p className="text-lg font-medium text-gray-900">
                  {formData.employmentStatus ? employmentStatuses[formData.employmentStatus as keyof typeof employmentStatuses] : 'غير محدد'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">المسمى الوظيفي</p>
                <p className="text-lg font-medium text-gray-900">{formData.jobTitle || 'غير محدد'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">جهة العمل</p>
                <p className="text-lg font-medium text-gray-900">{formData.employer || 'غير محدد'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">الدخل الشهري (ريال)</p>
                <p className="text-lg font-medium text-gray-900">{formData.monthlyIncome || '0'}</p>
              </div>
            </div>
          </div>
        )}

        {editMode && (
          <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setEditMode(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSaveChanges}
              isLoading={isSaving}
              icon={<Save className="w-5 h-5" />}
              className="bg-green-600 hover:bg-green-700"
            >
              حفظ التغييرات
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderAddressInfo = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <MapPin className="w-6 h-6 text-orange-600" />
          بيانات العنوان
        </h3>
        {!editMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditMode(true)}
            icon={<Edit className="w-4 h-4" />}
          >
            تعديل
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {editMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="رقم المبنى"
              type="text"
              value={formData.buildingNumber}
              onChange={(e) => handleInputChange('buildingNumber', e.target.value)}
              maxLength={4}
            />

            <Input
              label="اسم الشارع"
              type="text"
              value={formData.streetName}
              onChange={(e) => handleInputChange('streetName', e.target.value)}
            />

            <Input
              label="الحي"
              type="text"
              value={formData.district}
              onChange={(e) => handleInputChange('district', e.target.value)}
            />

            <Select
              label="المدينة"
              value={formData.city}
              onChange={(value) => handleInputChange('city', value)}
              options={saudiCities.map(city => ({
                value: city,
                label: city
              }))}
            />

            <Input
              label="الرمز البريدي"
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
              maxLength={5}
            />

            <Input
              label="الرقم الإضافي"
              type="text"
              value={formData.additionalNumber}
              onChange={(e) => handleInputChange('additionalNumber', e.target.value)}
              maxLength={4}
            />

            <Input
              label="العنوان التفصيلي"
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="col-span-2 h-20"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">رقم المبنى</p>
                <p className="text-lg font-medium text-gray-900">{formData.buildingNumber || 'غير محدد'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">اسم الشارع</p>
                <p className="text-lg font-medium text-gray-900">{formData.streetName || 'غير محدد'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">الحي</p>
                <p className="text-lg font-medium text-gray-900">{formData.district || 'غير محدد'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">المدينة</p>
                <p className="text-lg font-medium text-gray-900">{formData.city || 'غير محدد'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">الرمز البريدي</p>
                <p className="text-lg font-medium text-gray-900">{formData.postalCode || 'غير محدد'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">الرقم الإضافي</p>
                <p className="text-lg font-medium text-gray-900">{formData.additionalNumber || 'غير محدد'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">العنوان التفصيلي</p>
                <p className="text-lg font-medium text-gray-900">{formData.address || 'غير محدد'}</p>
              </div>
            </div>
          </div>
        )}

        {editMode && (
          <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setEditMode(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSaveChanges}
              isLoading={isSaving}
              icon={<Save className="w-5 h-5" />}
              className="bg-orange-600 hover:bg-orange-700"
            >
              حفظ التغييرات
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <Phone className="w-6 h-6 text-purple-600" />
          بيانات التواصل
        </h3>
        {!editMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditMode(true)}
            icon={<Edit className="w-4 h-4" />}
          >
            تعديل
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {editMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="رقم الجوال"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />

            <Input
              label="رقم الجوال البديل"
              type="tel"
              value={formData.alternativePhone}
              onChange={(e) => handleInputChange('alternativePhone', e.target.value)}
            />

            <Input
              label="البريد الإلكتروني"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />

            <Input
              label="اسم جهة الاتصال للطوارئ"
              type="text"
              value={formData.emergencyContactName}
              onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
            />

            <Input
              label="رقم جوال جهة الاتصال للطوارئ"
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
            />

            <Input
              label="صلة القرابة بجهة الاتصال للطوارئ"
              type="text"
              value={formData.emergencyContactRelation}
              onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">رقم الجوال</p>
                <p className="text-lg font-medium text-gray-900">
                  {formData.phone ? formatPhoneNumber(formData.phone) : 'غير محدد'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">رقم الجوال البديل</p>
                <p className="text-lg font-medium text-gray-900">
                  {formData.alternativePhone ? formatPhoneNumber(formData.alternativePhone) : 'غير محدد'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                <p className="text-lg font-medium text-gray-900">{formData.email || 'غير محدد'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">اسم جهة الاتصال للطوارئ</p>
                <p className="text-lg font-medium text-gray-900">{formData.emergencyContactName || 'غير محدد'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">رقم جوال جهة الاتصال للطوارئ</p>
                <p className="text-lg font-medium text-gray-900">
                  {formData.emergencyContactPhone ? formatPhoneNumber(formData.emergencyContactPhone) : 'غير محدد'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">صلة القرابة بجهة الاتصال للطوارئ</p>
                <p className="text-lg font-medium text-gray-900">{formData.emergencyContactRelation || 'غير محدد'}</p>
              </div>
            </div>
          </div>
        )}

        {editMode && (
          <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setEditMode(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSaveChanges}
              isLoading={isSaving}
              icon={<Save className="w-5 h-5" />}
              className="bg-purple-600 hover:bg-purple-700"
            >
              حفظ التغييرات
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderDocumentsSection = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="w-6 h-6 text-indigo-600" />
          المستندات
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => alert('رفع مستند جديد')}
        >
          رفع مستند جديد
        </Button>
      </div>

      <div className="space-y-6">
        <div className="overflow-hidden border border-gray-200 rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  اسم المستند
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نوع المستند
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ الرفع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  صورة الهوية الوطنية
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  مستند إلزامي
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatGregorianDate(new Date().toISOString())}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    تم التحقق
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-indigo-600 hover:text-indigo-900">عرض</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  بطاقة الإعاقة
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  مستند إلزامي
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatGregorianDate(new Date().toISOString())}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    تم التحقق
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-indigo-600 hover:text-indigo-900">عرض</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Upload New Document Section */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200/50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-indigo-900 mb-4">رفع مستند جديد</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="نوع المستند"
              value=""
              onChange={() => {}}
              options={[
                { value: 'national_id', label: 'صورة الهوية الوطنية' },
                { value: 'disability_card', label: 'بطاقة الإعاقة' },
                { value: 'income_certificate', label: 'شهادة الدخل' },
                { value: 'medical_report', label: 'تقرير طبي' },
                { value: 'other', label: 'أخرى' }
              ]}
              placeholder="اختر نوع المستند"
            />
            
            <Input
              label="المستند"
              type="file"
              onChange={() => {}}
            />
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              رفع المستند
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeSubTab) {
      case 'personal':
        return renderPersonalInfo();
      case 'professional':
        return renderProfessionalInfo();
      case 'address':
        return renderAddressInfo();
      case 'contact':
        return renderContactInfo();
      case 'documents':
        return renderDocumentsSection();
      default:
        return renderPersonalInfo();
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">
                {userData?.full_name?.charAt(0) || 'م'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{userData?.full_name || 'اسم المستفيد'}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-gray-600">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4 text-gray-400" />
                  {userData?.national_id || 'رقم الهوية'}
                </span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {userData?.phone || 'رقم الجوال'}
                </span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  مسجل منذ {formatGregorianDate(userData?.created_at || new Date().toISOString())}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-green-100 px-4 py-2 rounded-xl text-green-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">مستفيد معتمد</span>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <div className="flex border-b border-gray-200 min-w-max">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onChangeSubTab(tab.id as any);
                setEditMode(false);
              }}
              className={`
                flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                ${activeSubTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {renderActiveTab()}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        {tabItems.findIndex(tab => tab.id === activeSubTab) > 0 && (
          <Button
            variant="outline"
            onClick={() => {
              const currentIndex = tabItems.findIndex(tab => tab.id === activeSubTab);
              if (currentIndex > 0) {
                onChangeSubTab(tabItems[currentIndex - 1].id as any);
                setEditMode(false);
              }
            }}
            icon={<ChevronRight className="w-5 h-5" />}
          >
            السابق
          </Button>
        )}
        
        {tabItems.findIndex(tab => tab.id === activeSubTab) < tabItems.length - 1 && (
          <Button
            onClick={() => {
              const currentIndex = tabItems.findIndex(tab => tab.id === activeSubTab);
              if (currentIndex < tabItems.length - 1) {
                onChangeSubTab(tabItems[currentIndex + 1].id as any);
                setEditMode(false);
              }
            }}
            icon={<ChevronLeft className="w-5 h-5 ml-2" />}
            className="mr-auto"
          >
            التالي
          </Button>
        )}
      </div>
    </div>
  );
};

export default BeneficiaryProfile;
