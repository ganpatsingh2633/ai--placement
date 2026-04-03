import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAddDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dept: { name: string; head_of_department?: string }) => {
      const { data, error } = await supabase.from('departments').insert(dept).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['departments'] }); toast.success('Department added'); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('departments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['departments'] }); toast.success('Department deleted'); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; name?: string; head_of_department?: string }) => {
      const { error } = await supabase.from('departments').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['departments'] }); toast.success('Department updated'); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useAddNotice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notice: { title: string; content: string; priority: string; target_role?: string; author_id: string }) => {
      const { data, error } = await supabase.from('notices').insert(notice).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notices'] }); toast.success('Notice published'); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteNotice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notices').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notices'] }); toast.success('Notice deleted'); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useAddSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (subject: { name: string; department: string; semester: number; teacher_id?: string }) => {
      const { data, error } = await supabase.from('subjects').insert(subject).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subjects'] }); toast.success('Subject added'); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('subjects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subjects'] }); toast.success('Subject deleted'); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['profiles'] }); toast.success('Profile removed'); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; full_name?: string; department?: string; roll_no?: string; semester?: number; employee_id?: string }) => {
      const { error } = await supabase.from('profiles').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['profiles'] }); toast.success('Profile updated'); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useAddAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (records: { student_id: string; subject_id: string; date: string; present: boolean; marked_by: string }[]) => {
      const { error } = await supabase.from('attendance').insert(records);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['attendance-summary'] }); toast.success('Attendance marked'); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpsertMarks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (mark: { student_id: string; subject_id: string; internal1?: number; internal2?: number; assignment_score?: number; updated_by: string }) => {
      const { data: existing } = await supabase.from('marks').select('id').eq('student_id', mark.student_id).eq('subject_id', mark.subject_id).maybeSingle();
      if (existing) {
        const { error } = await supabase.from('marks').update(mark).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('marks').insert(mark);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['marks'] }); toast.success('Marks saved'); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useAddAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (assignment: { title: string; description?: string; subject_id: string; due_date: string; posted_by: string }) => {
      const { data, error } = await supabase.from('assignments').insert(assignment).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['assignments'] }); toast.success('Assignment created'); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('assignments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['assignments'] }); toast.success('Assignment deleted'); },
    onError: (e: Error) => toast.error(e.message),
  });
}
