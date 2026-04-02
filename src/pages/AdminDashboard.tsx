import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProfiles, useNotices, useDepartments } from '@/hooks/use-college-data';
import { Users, GraduationCap, BookOpen, Bell, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const { data: students = [], isLoading: loadingStudents } = useProfiles('student');
  const { data: teachers = [] } = useProfiles('teacher');
  const { data: departments = [] } = useDepartments();
  const { data: notices = [] } = useNotices();

  if (loadingStudents) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Complete overview of the college management system.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Students" value={students.length} icon={<GraduationCap size={20} />} description="Registered students" />
        <StatCard title="Total Teachers" value={teachers.length} icon={<Users size={20} />} description="Faculty members" />
        <StatCard title="Departments" value={departments.length} icon={<BookOpen size={20} />} description="Active departments" />
        <StatCard title="Notices" value={notices.length} icon={<Bell size={20} />} description="Active notices" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Departments */}
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Departments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {departments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No departments configured.</p>
            ) : (
              departments.map(d => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium text-foreground">{d.name}</span>
                  {d.head_of_department && (
                    <Badge variant="secondary">{d.head_of_department}</Badge>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Students */}
        <Card className="shadow-card border-border/60 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Students</CardTitle>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-sm text-muted-foreground">No students registered yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground font-medium">Name</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Roll No</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Dept</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id} className="border-b border-border/50">
                        <td className="py-2.5 text-foreground font-medium">{s.full_name}</td>
                        <td className="py-2.5 text-muted-foreground">{s.roll_no || '-'}</td>
                        <td className="py-2.5 text-muted-foreground">{s.department || '-'}</td>
                        <td className="py-2.5 text-muted-foreground">{s.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notices */}
        <Card className="shadow-card border-border/60 lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">College Notices</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-3">
            {notices.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notices yet.</p>
            ) : (
              notices.map((n: any) => (
                <div key={n.id} className="p-4 rounded-lg border border-border/60 bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold text-foreground">{n.title}</p>
                    <Badge variant={n.priority === 'high' ? 'destructive' : 'secondary'} className="shrink-0 ml-2">{n.priority}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{n.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(n.created_at).toLocaleDateString()} · {n.profiles?.full_name || 'System'}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
