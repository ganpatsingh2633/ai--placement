import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { useProfiles, useNotices, useSubjects } from '@/hooks/use-college-data';
import { Users, ClipboardList, FileText, Bell, Loader2 } from 'lucide-react';

export default function TeacherDashboard() {
  const { profile } = useAuth();
  const { data: students = [], isLoading } = useProfiles('student');
  const { data: notices = [] } = useNotices();
  const { data: subjects = [] } = useSubjects();

  if (isLoading) {
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
        <h1 className="text-2xl font-display font-bold text-foreground">Welcome, {profile?.full_name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your classes and academic records.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Students" value={students.length} icon={<Users size={20} />} description="Registered students" />
        <StatCard title="Subjects" value={subjects.length} icon={<ClipboardList size={20} />} description="In the system" />
        <StatCard title="Notices" value={notices.length} icon={<Bell size={20} />} description="Active notices" />
        <StatCard title="Department" value={profile?.department || 'N/A'} icon={<FileText size={20} />} description="Your department" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Student List */}
        <Card className="shadow-card border-border/60 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Student Records</CardTitle>
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
                      <th className="text-left py-2 text-muted-foreground font-medium">Department</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Email</th>
                      <th className="text-center py-2 text-muted-foreground font-medium">Semester</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id} className="border-b border-border/50">
                        <td className="py-2.5 text-foreground font-medium">{s.full_name}</td>
                        <td className="py-2.5 text-muted-foreground">{s.roll_no || '-'}</td>
                        <td className="py-2.5 text-muted-foreground">{s.department || '-'}</td>
                        <td className="py-2.5 text-muted-foreground">{s.email}</td>
                        <td className="py-2.5 text-center">
                          <Badge variant="secondary">{s.semester || '-'}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notices */}
        <Card className="shadow-card border-border/60 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Recent Notices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notices.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notices yet.</p>
            ) : (
              notices.map((n: any) => (
                <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(n.created_at).toLocaleDateString()} · {n.profiles?.full_name || 'System'}
                    </p>
                  </div>
                  <Badge variant={n.priority === 'high' ? 'destructive' : 'secondary'} className="shrink-0">
                    {n.priority}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
