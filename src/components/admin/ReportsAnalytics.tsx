import React from 'react';
import { useState } from 'react';
import { 
  TrendingUp, Users, Building, FileText, BarChart3, 
  Calendar, Download, RefreshCw 
} from 'lucide-react';
import Button from '../ui/Button';
import ReportDetailsModal from '../../features/admin/components/reports/ReportDetailsModal';

interface ReportsAnalyticsProps {
  stats: {
    totalUsers: number;
    totalMembers: number;
    pendingRequests: number;
    activeBranches: number;
    totalServices: number;
    systemHealth: string;
  };
}

const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({ stats }) => {
  // إضافة حالة لتتبع التقرير المحدد وحالة العرض
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  
  const reportCards = [
    {
      title: 'تقرير المستخدمين',
      description: 'إحصائيات شاملة للمستخدمين والنشاط',
      icon: <Users className="w-6 h-6" />,
      color: 'blue',
      metrics: [
        { label: 'إجمالي المستخدمين', value: stats.totalUsers },
        { label: 'المستفيدين', value: stats.totalMembers },
        { label: 'نمو هذا الشهر', value: '+12%' }
      ]
    },
    {
      title: 'تقرير الفروع',
      description: 'أداء الفروع وتوزيع الخدمات',
      icon: <Building className="w-6 h-6" />,
      color: 'green',
      metrics: [
        { label: 'إجمالي الفروع', value: stats.activeBranches },
        { label: 'الفروع النشطة', value: stats.activeBranches },
        { label: 'متوسط الطلبات', value: '25/فرع' }
      ]
    },
    {
      title: 'تقرير الخدمات',
      description: 'استخدام الخدمات ومعدلات الطلب',
      icon: <FileText className="w-6 h-6" />,
      color: 'orange',
      metrics: [
        { label: 'إجمالي الخدمات', value: stats.totalServices },
        { label: 'الطلبات الحالية', value: stats.pendingRequests },
        { label: 'معدل الموافقة', value: '85%' }
      ]
    },
    {
      title: 'تقرير الأداء',
      description: 'مؤشرات الأداء الرئيسية',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'purple',
      metrics: [
        { label: 'حالة النظام', value: stats.systemHealth },
        { label: 'زمن المعالجة', value: '2.3 يوم' },
        { label: 'رضا المستخدمين', value: '4.2/5' }
      ]
    }
  ];

  const quickReports = [
    {
      title: 'تقرير يومي',
      description: 'نشاط آخر 24 ساعة',
      period: 'اليوم',
      action: () => console.log('Generate daily report')
    },
    {
      title: 'تقرير أسبوعي',
      description: 'ملخص الأسبوع الماضي',
      period: 'هذا الأسبوع',
      action: () => console.log('Generate weekly report')
    },
    {
      title: 'تقرير شهري',
      description: 'إحصائيات الشهر الحالي',
      period: 'هذا الشهر',
      action: () => console.log('Generate monthly report')
    },
    {
      title: 'تقرير سنوي',
      description: 'تحليل شامل للعام',
      period: 'هذا العام',
      action: () => console.log('Generate yearly report')
    }
  ];
  
  // دالة فتح التقرير
  const handleOpenReport = (reportType: string) => {
    // بيانات تجريبية للتقرير
    const reportData = generateMockReportData(reportType);
    
    setSelectedReport({
      id: `report-${Date.now()}`,
      title: reportType === 'users' ? 'تقرير المستخدمين' : 
            reportType === 'branches' ? 'تقرير الفروع' :
            reportType === 'services' ? 'تقرير الخدمات' : 'تقرير الأداء',
      type: reportType,
      generatedAt: new Date().toISOString(),
      data: reportData
    });
    
    setShowReportModal(true);
  };
  
  // دالة لتوليد بيانات تجريبية للتقرير
  const generateMockReportData = (reportType: string) => {
    switch (reportType) {
      case 'users':
        return {
          roleDistribution: [
            { role: 'admin', label: 'مدير النظام', count: 1, percentage: 5 },
            { role: 'branch_manager', label: 'مدير فرع', count: 3, percentage: 15 },
            { role: 'employee', label: 'موظف', count: 6, percentage: 30 },
            { role: 'beneficiary', label: 'مستفيد', count: 10, percentage: 50 }
          ],
          activeUsers: 18,
          inactiveUsers: 2,
          newUsers: 4,
          completionRate: 78,
          completeProfiles: 8,
          partialProfiles: 4,
          incompleteProfiles: 2
        };
        
      case 'branches':
        return {
          branches: [
            { 
              id: 'b1', name: 'فرع الرياض الرئيسي', employeesCount: 4, 
              membersCount: 45, activeRequests: 12, isActive: true,
              memberPercentage: 60, completionRate: 85
            },
            { 
              id: 'b2', name: 'فرع جدة', employeesCount: 3, 
              membersCount: 22, activeRequests: 7, isActive: true,
              memberPercentage: 30, completionRate: 78
            },
            { 
              id: 'b3', name: 'فرع الدمام', employeesCount: 2, 
              membersCount: 8, activeRequests: 3, isActive: false,
              memberPercentage: 10, completionRate: 65
            }
          ]
        };
        
      case 'services':
        return {
          topServices: [
            { id: 's1', name: 'مساعدة مالية طارئة', requestCount: 28, percentage: 40 },
            { id: 's2', name: 'كفالة أيتام', requestCount: 15, percentage: 22 },
            { id: 's3', name: 'مساعدة في السكن', requestCount: 12, percentage: 18 },
            { id: 's4', name: 'مساعدة تعليمية', requestCount: 10, percentage: 14 },
            { id: 's5', name: 'أجهزة تعويضية', requestCount: 4, percentage: 6 }
          ],
          categoryDistribution: [
            { name: 'مساعدات مالية', count: 3, percentage: 40 },
            { name: 'مساعدات عينية', count: 2, percentage: 20 },
            { name: 'رعاية اجتماعية', count: 2, percentage: 20 },
            { name: 'تطوير مهارات', count: 1, percentage: 10 },
            { name: 'أخرى', count: 1, percentage: 10 }
          ],
          approvalRate: 72,
          rejectionRate: 28,
          averageProcessingDays: 2.5,
          pendingRequests: 15
        };
        
      case 'performance':
        return {
          averageResponseTime: 2.3,
          responseTimeChange: -8,
          completionRate: 85,
          completionRateChange: 5,
          satisfactionRate: 4.2,
          satisfactionRateChange: 2,
          performanceMetrics: [
            { name: 'سرعة الاستجابة', value: 85, status: 'good', change: 5 },
            { name: 'دقة التقييم', value: 90, status: 'good', change: 8 },
            { name: 'إنجاز الطلبات', value: 78, status: 'warning', change: -3 },
            { name: 'رضا المستفيدين', value: 82, status: 'good', change: 4 },
            { name: 'التواصل', value: 65, status: 'warning', change: -2 }
          ]
        };
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              التقارير والإحصائيات
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              تحليل شامل لأداء النظام والإحصائيات التفصيلية
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={<RefreshCw className="w-5 h-5" />}
            >
              تحديث البيانات
            </Button>
            <Button
              icon={<Download className="w-5 h-5" />}
            >
              تصدير التقرير
            </Button>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reportCards.map((report, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center gap-4 mb-6"> 
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                report.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' :
                report.color === 'green' ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' :
                report.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400' :
                'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
              }`}>
                {report.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{report.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{report.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {report.metrics.map((metric, metricIndex) => (
                <div key={metricIndex} className="text-center">
                  <div className={`text-2xl font-bold ${
                    report.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    report.color === 'green' ? 'text-green-600 dark:text-green-400' :
                    report.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                    'text-purple-600 dark:text-purple-400'
                  }`}>
                    {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                icon={<BarChart3 className="w-4 h-4" />}
                onClick={() => handleOpenReport(report.title.includes('مستخدمين') ? 'users' : 
                                               report.title.includes('فروع') ? 'branches' : 
                                               report.title.includes('خدمات') ? 'services' : 
                                               'performance')}
              >
                عرض التفاصيل
              </Button>
              <Button
                size="sm"
                icon={<Download className="w-4 h-4" />}
              >
                تصدير
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Reports */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          التقارير السريعة
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickReports.map((report, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg dark:hover:shadow-gray-900/30 transition-all duration-300">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{report.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{report.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                  {report.period}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenReport(index === 0 ? 'users' : 
                                                index === 1 ? 'branches' : 
                                                index === 2 ? 'services' : 
                                                'performance')}
                  icon={<Download className="w-3 h-3" />}
                >
                  تحميل
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <p className="text-blue-600 font-medium">الرسوم البيانية قيد التطوير</p>
            <p className="text-sm text-blue-500">سيتم إضافة الرسوم البيانية التفاعلية قريباً</p>
          </div>
        </div>

      {/* Export Options */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-indigo-900 mb-2">تصدير البيانات</h4>
            <p className="text-indigo-700">احصل على نسخة من جميع البيانات والتقارير</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4" />}
            >
              Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4" />}
            >
              PDF
            </Button>
            <Button
              size="sm"
              icon={<Download className="w-4 h-4" />}
            >
              تصدير شامل
            </Button>
          </div>
        </div>
      </div>
      
      {/* Report Details Modal */}
      {selectedReport && (
        <ReportDetailsModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          report={selectedReport}
        />
      )}

      {/* Report Details Modal */}
      {selectedReport && (
        <ReportDetailsModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          report={selectedReport}
        />
      )}
    </div>
  );
};

export default ReportsAnalytics;
