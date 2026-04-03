
-- Allow teachers/admins to delete their own assignments
CREATE POLICY "Teachers can delete assignments"
ON public.assignments
FOR DELETE
TO authenticated
USING (posted_by = public.get_profile_id(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete subjects
-- Already covered by "Admins can manage subjects" ALL policy
