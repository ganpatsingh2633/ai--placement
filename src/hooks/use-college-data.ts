import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

export function useProfiles(role?: string) {
  return useQuery({
    queryKey: ['profiles', role],
    queryFn: async () => {
      let q = supabase.from('profiles').select('*');
      if (role) q = q.eq('role', role as 'student' | 'teacher' | 'admin');
      const { data, error } = await q.order('full_name');
      if (error) throw error;
      return data as Profile[];
    },
  });
}

export function useAttendanceSummary(studentProfileId?: string) {
  return useQuery({
    queryKey: ['attendance-summary', studentProfileId],
    enabled: !!studentProfileId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select('subject_id, present, subjects(name)')
        .eq('student_id', studentProfileId!);
      if (error) throw error;

      const grouped: Record<string, { subject: string; total: number; attended: number }> = {};
      for (const row of data) {
        const subjectName = (row.subjects as any)?.name || 'Unknown';
        if (!grouped[row.subject_id]) grouped[row.subject_id] = { subject: subjectName, total: 0, attended: 0 };
        grouped[row.subject_id].total++;
        if (row.present) grouped[row.subject_id].attended++;
      }

      return Object.values(grouped).map(g => ({
        ...g,
        percentage: g.total > 0 ? Math.round((g.attended / g.total) * 100) : 0,
      }));
    },
  });
}

export function useMarks(studentProfileId?: string) {
  return useQuery({
    queryKey: ['marks', studentProfileId],
    enabled: !!studentProfileId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marks')
        .select('*, subjects(name)')
        .eq('student_id', studentProfileId!);
      if (error) throw error;
      return data;
    },
  });
}

export function useNotices() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('notices-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, () => {
        queryClient.invalidateQueries({ queryKey: ['notices'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ['notices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notices')
        .select('*, profiles:author_id(full_name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAssignments() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('assignments-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assignments' }, () => {
        queryClient.invalidateQueries({ queryKey: ['assignments'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assignments')
        .select('*, subjects(name), profiles:posted_by(full_name)')
        .order('due_date', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*, profiles:teacher_id(full_name)');
      if (error) throw error;
      return data;
    },
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });
}

export function useRealtimeAttendance(studentProfileId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!studentProfileId) return;
    const channel = supabase
      .channel('attendance-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance', filter: `student_id=eq.${studentProfileId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['attendance-summary', studentProfileId] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [studentProfileId, queryClient]);
}

export function useRealtimeMarks(studentProfileId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!studentProfileId) return;
    const channel = supabase
      .channel('marks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marks', filter: `student_id=eq.${studentProfileId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['marks', studentProfileId] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [studentProfileId, queryClient]);
}
