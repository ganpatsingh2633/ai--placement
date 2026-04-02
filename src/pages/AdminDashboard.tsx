import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockStudentRecords, mockNotices, departments } from '@/lib/mock-data';
import { Users, GraduationCap, BookOpen, Bell } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Complete overview of the college management system.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Students" value={342} icon={<GraduationCap size={20} />} trend={{ value: '+12 this month', positive: true }} />
        <StatCard title="Total Teachers" value={28} icon={<Users size={20} />} description="Across all departments" />
        <StatCard title="Departments" value={departments.length} icon={<BookOpen size={20} />} description="Active departments" />
        <StatCard title="Notices" value={mockNotices.length} icon={<Bell size={20} />} description="Active notices" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Departments */}
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Departments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {departments.map((d, i) => (
              <div key={d} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium text-foreground">{d}</span>
                <Badge variant="secondary">{[85, 42, 56, 38, 45][i]} students</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Students */}
        <Card className="shadow-card border-border/60 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Recent Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Roll No</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Dept</th>
                    <th className="text-center py-2 text-muted-foreground font-medium">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudentRecords.map(s => (
                    <tr key={s.id} className="border-b border-border/50">
                      <td className="py-2.5 text-foreground font-medium">{s.name}</td>
                      <td className="py-2.5 text-muted-foreground">{s.rollNo}</td>
                      <td className="py-2.5 text-muted-foreground">{s.department}</td>
                      <td className="py-2.5 text-center">
                        <Badge variant={s.attendance >= 85 ? 'default' : 'destructive'}>{s.attendance}%</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Notices */}
        <Card className="shadow-card border-border/60 lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">College Notices</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-3">
            {mockNotices.map(n => (
              <div key={n.id} className="p-4 rounded-lg border border-border/60 bg-card">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-semibold text-foreground">{n.title}</p>
                  <Badge variant={n.priority === 'high' ? 'destructive' : 'secondary'} className="shrink-0 ml-2">{n.priority}</Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{n.content}</p>
                <p className="text-xs text-muted-foreground mt-2">{n.date} · {n.author}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
