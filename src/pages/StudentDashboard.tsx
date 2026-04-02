import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/auth-context';
import { mockAttendance, mockMarks, mockNotices, mockAssignments } from '@/lib/mock-data';
import { ClipboardList, BarChart3, Bell, FileText } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const avgAttendance = Math.round(mockAttendance.reduce((a, b) => a + b.percentage, 0) / mockAttendance.length);
  const pendingAssignments = mockAssignments.filter(a => a.status === 'pending').length;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">Here's your academic overview for this semester.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Avg Attendance" value={`${avgAttendance}%`} icon={<ClipboardList size={20} />} description="Across all subjects" />
        <StatCard title="Subjects" value={mockAttendance.length} icon={<BarChart3 size={20} />} description="This semester" />
        <StatCard title="Pending Tasks" value={pendingAssignments} icon={<FileText size={20} />} description="Assignments due" />
        <StatCard title="Notices" value={mockNotices.length} icon={<Bell size={20} />} description="Unread notices" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Attendance Overview */}
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockAttendance.map(a => (
              <div key={a.subject}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-foreground font-medium">{a.subject}</span>
                  <span className={`font-semibold ${a.percentage >= 85 ? 'text-success' : a.percentage >= 75 ? 'text-accent' : 'text-destructive'}`}>
                    {a.percentage}%
                  </span>
                </div>
                <Progress value={a.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Notices */}
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Recent Notices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockNotices.slice(0, 4).map(n => (
              <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.date} · {n.author}</p>
                </div>
                <Badge variant={n.priority === 'high' ? 'destructive' : n.priority === 'medium' ? 'default' : 'secondary'} className="text-[10px] shrink-0">
                  {n.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Marks Summary */}
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Internal Marks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Subject</th>
                    <th className="text-center py-2 text-muted-foreground font-medium">Int-1</th>
                    <th className="text-center py-2 text-muted-foreground font-medium">Int-2</th>
                    <th className="text-center py-2 text-muted-foreground font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {mockMarks.map(m => (
                    <tr key={m.subject} className="border-b border-border/50">
                      <td className="py-2.5 text-foreground">{m.subject}</td>
                      <td className="py-2.5 text-center">{m.internal1}/25</td>
                      <td className="py-2.5 text-center">{m.internal2}/25</td>
                      <td className="py-2.5 text-center font-semibold">{m.total}/{m.maxTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Assignments */}
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockAssignments.map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.subject} · Due: {a.dueDate}</p>
                </div>
                <Badge variant={a.status === 'pending' ? 'destructive' : a.status === 'submitted' ? 'default' : 'secondary'}>
                  {a.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
