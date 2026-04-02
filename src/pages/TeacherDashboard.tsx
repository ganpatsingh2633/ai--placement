import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { mockStudentRecords, mockNotices, subjects } from '@/lib/mock-data';
import { Users, ClipboardList, FileText, Bell } from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your classes and academic records.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Students" value={mockStudentRecords.length} icon={<Users size={20} />} description="Under your classes" />
        <StatCard title="Subjects" value={subjects.length} icon={<ClipboardList size={20} />} description="Teaching this semester" />
        <StatCard title="Assignments" value={8} icon={<FileText size={20} />} description="Active assignments" />
        <StatCard title="Avg Attendance" value="85%" icon={<Bell size={20} />} description="Class average" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Student List */}
        <Card className="shadow-card border-border/60 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Student Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Roll No</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Department</th>
                    <th className="text-center py-2 text-muted-foreground font-medium">Sem</th>
                    <th className="text-center py-2 text-muted-foreground font-medium">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudentRecords.map(s => (
                    <tr key={s.id} className="border-b border-border/50">
                      <td className="py-2.5 text-foreground font-medium">{s.name}</td>
                      <td className="py-2.5 text-muted-foreground">{s.rollNo}</td>
                      <td className="py-2.5 text-muted-foreground">{s.department}</td>
                      <td className="py-2.5 text-center">{s.semester}</td>
                      <td className="py-2.5 text-center">
                        <Badge variant={s.attendance >= 85 ? 'default' : s.attendance >= 75 ? 'secondary' : 'destructive'}>
                          {s.attendance}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Notices */}
        <Card className="shadow-card border-border/60 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Recent Notices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockNotices.map(n => (
              <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.date} · {n.author}</p>
                </div>
                <Badge variant={n.priority === 'high' ? 'destructive' : 'secondary'} className="shrink-0">
                  {n.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
