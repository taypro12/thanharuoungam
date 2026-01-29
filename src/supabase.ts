

import { createClient } from '@supabase/supabase-js';

// Thông tin kết nối Supabase của bạn
// Explicitly typed as string to avoid literal type overlap errors when checking configuration against placeholder strings
const supabaseUrl: string = 'https://tlsvjtgajrhnwqaaqmjm.supabase.co';
const supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsc3ZqdGdhanJobndxYWFxbWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1OTk2ODAsImV4cCI6MjA4NTE3NTY4MH0.sWotXfrb1TUTjfHRIWYU8pJyqHx2T6yLkhJCr_iyGTk';

export const isSupabaseConfigured = 
  supabaseUrl !== 'https://your-project-url.supabase.co' && 
  supabaseAnonKey !== 'your-anon-key' &&
  supabaseUrl.includes('supabase.co');

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ Supabase chưa được cấu hình chính xác! \n' +
    'Hiện tại ứng dụng đang sử dụng dữ liệu mẫu (Mock Data).'
  );
} else {
  console.log('✅ Kết nối Supabase đã sẵn sàng.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);