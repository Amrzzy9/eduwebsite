import { supabase } from './supabase';
export async function saveProgress(userId, lessonId, seconds, completed) {
    await supabase.from('lesson_progress').upsert({ user_id: userId, lesson_id: lessonId, position_seconds: Math.floor(seconds), completed, updated_at: new Date().toISOString() }, { onConflict: 'user_id,lesson_id' });
}
