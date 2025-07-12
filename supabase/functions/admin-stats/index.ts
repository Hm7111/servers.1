import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

interface AdminStatsRequest {
  adminId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { adminId }: AdminStatsRequest = await req.json()

    console.log('Admin Stats Request:', { adminId })

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify admin access
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', adminId)
      .eq('role', 'admin')
      .single()

    if (adminError || !adminUser) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'غير مصرح للوصول' 
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get total users count
    const { count: totalUsers } = await supabase
      .from('users')
      .select('id', { count: 'exact' })

    // Get total members count
    const { count: totalMembers } = await supabase
      .from('members')
      .select('id', { count: 'exact' })

    // Get pending requests count
    const { count: pendingRequests } = await supabase
      .from('members')
      .select('id', { count: 'exact' })
      .in('registration_status', ['pending_review', 'under_employee_review', 'under_manager_review'])

    // Get active branches count
    const { count: activeBranches } = await supabase
      .from('branches')
      .select('id', { count: 'exact' })
      .eq('is_active', true)

    // Get total services count
    const { count: totalServices } = await supabase
      .from('services')
      .select('id', { count: 'exact' })
      .eq('is_active', true)

    // Determine system health based on pending requests
    let systemHealth: 'excellent' | 'good' | 'warning' | 'critical' = 'good'
    if (pendingRequests === 0) {
      systemHealth = 'excellent'
    } else if (pendingRequests <= 5) {
      systemHealth = 'good'
    } else if (pendingRequests <= 15) {
      systemHealth = 'warning'
    } else {
      systemHealth = 'critical'
    }

    const stats = {
      totalUsers: totalUsers || 0,
      totalMembers: totalMembers || 0,
      pendingRequests: pendingRequests || 0,
      activeBranches: activeBranches || 0,
      totalServices: totalServices || 0,
      systemHealth
    }

    console.log('Generated stats:', stats)

    return new Response(
      JSON.stringify({ 
        success: true, 
        stats,
        message: 'تم تحميل الإحصائيات بنجاح'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Admin Stats Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'حدث خطأ في تحميل الإحصائيات'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
