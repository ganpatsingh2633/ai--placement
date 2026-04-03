import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/auth-context';
import { useAttendanceSummary, useMarks, useNotices, useAssignments, useRealtimeAttendance, useRealtimeMarks } from '@/hooks/use-college-data';
import { ClipboardList, BarChart3, Bell, FileText, Loader2, User, BookOpen } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';

function StudentProfile() {
  const { profile } = useAuth();
  if (!profile) return null;

  return (
    <div>
      <h2 className="text-lg font-display font-bold text-foreground mb-4">My Profile</h2>
      <Card className="shadow-card border-border/60 max-w-lg">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User size={28} className="text-primary" />
            </div>
            <div>
              <p className="text-lg font-display font-bold text-foreground">{profile.full_name}</p>
              <p className="text-sm text-muted-foreground capitalize">{profile.role}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Email', profile.email],
              ['Roll No', profile.roll_no || '-'],
              ['Department', profile.department || '-'],
              ['Semester', profile.semester?.toString() || '-'],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StudentAttendance() {
  const { profile } = useAuth();
  const { data: attendance = [], isLoading } = useAttendanceSummary(profile?.id);
  useRealtimeAttendance(profile?.id);

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={24} /></div>;

  const avgAttendance = attendance.length > 0
    ? Math.round(attendance.reduce((a, b) => a + b.percentage, 0) / attendance.length)
    : 0;

  const chartData = attendance.map(a => ({ name: a.subject, percentage: a.percentage, fill: a.percentage >= 85 ? '#22c55e' : a.percentage >= 75 ? 'hsl(var(--accent))' : 'hsl(var(--destructive))' }));

  return (
    <div>
      <h2 className="text-lg font-display font-bold text-foreground mb-4">Attendance Report</h2>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-2"><CardTitle className="text-base font-display">Subject-wise Attendance</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {attendance.length === 0 ? (
              <p className="text-sm text-muted-foreground">No attendance records yet.</p>
            ) : (
              attendance.map(a => (
                <div key={a.subject}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-foreground font-medium">{a.subject}</span>
                    <span className={`font-semibold ${a.percentage >= 85 ? 'text-green-500' : a.percentage >= 75 ? 'text-accent' : 'text-destructive'}`}>
                      {a.percentage}% ({a.attended}/{a.total})
                    </span>
                  </div>
                  <Progress value={a.percentage} className="h-2.5" />
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-2"><CardTitle className="text-base font-display">Attendance Chart</CardTitle></CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Bar key={i} dataKey="percentage" fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No data to display.</p>
            )}
            <div className="text-center mt-2">
              <p className="text-xs text-muted-foreground">Overall Average</p>
              <p className="text-2xl font-bold text-foreground">{avgAttendance}%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StudentMarks() {
  const { profile } = useAuth();
  const { data: marks = [], isLoading } = useMarks(profile?.id);
  useRealtimeMarks(profile?.id);

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={24} /></div>;

  const chartData = marks.map((m: any) => ({
    name: m.subjects?.name || 'N/A',
    Internal1: Number(m.internal1) || 0,
    Internal2: Number(m.internal2) || 0,
    Assignment: Number(m.assignment_score) || 0,
  }));

  return (
    <div>
      <h2 className="text-lg font-display font-bold text-foreground mb-4">Marks & Results</h2>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-2"><CardTitle className="text-base font-display">Internal Marks</CardTitle></CardHeader>
          <CardContent>
            {marks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No marks recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground font-medium">Subject</th>
                      <th className="text-center py-2 text-muted-foreground font-medium">Int-1 /25</th>
                      <th className="text-center py-2 text-muted-foreground font-medium">Int-2 /25</th>
                      <th className="text-center py-2 text-muted-foreground font-medium">Assign /10</th>
                      <th className="text-center py-2 text-muted-foreground font-medium">Total /60</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((m: any) => {
                      const total = Number(m.internal1) + Number(m.internal2) + Number(m.assignment_score);
                      return (
                        <tr key={m.id} className="border-b border-border/50">
                          <td className="py-2.5 text-foreground font-medium">{m.subjects?.name || 'N/A'}</td>
                          <td className="py-2.5 text-center">{m.internal1}</td>
                          <td className="py-2.5 text-center">{m.internal2}</td>
                          <td className="py-2.5 text-center">{m.assignment_score}</td>
                          <td className="py-2.5 text-center font-semibold">
                            <Badge variant={total >= 36 ? 'default' : 'destructive'}>{total}/60</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-2"><CardTitle className="text-base font-display">Performance Chart</CardTitle></CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Internal1" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Internal2" fill="hsl(var(--accent))" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Assignment" fill="#22c55e" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No data to display.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StudentAssignments() {
  const { data: assignments = [] } = useAssignments();

  return (
    <div>
      <h2 className="text-lg font-display font-bold text-foreground mb-4">Assignments</h2>
      <div className="space-y-3">
        {assignments.map((a: any) => (
          <Card key={a.id} className="shadow-card border-border/60">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{a.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{a.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {a.subjects?.name || 'N/A'} · Due: {new Date(a.due_date).toLocaleDateString()} · By: {a.profiles?.full_name || 'Unknown'}
                  </p>
                </div>
                <Badge variant={new Date(a.due_date) < new Date() ? 'destructive' : 'default'}>
                  {new Date(a.due_date) < new Date() ? 'Overdue' : 'Active'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {assignments.length === 0 && <p className="text-sm text-muted-foreground text-center mt-8">No assignments yet.</p>}
      </div>
    </div>
  );
}

function StudentNotices() {
  const { data: notices = [] } = useNotices();

  return (
    <div>
      <h2 className="text-lg font-display font-bold text-foreground mb-4">Notices & Announcements</h2>
      <div className="space-y-3">
        {notices.map((n: any) => (
          <Card key={n.id} className="shadow-card border-border/60">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{n.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{n.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleDateString()} · {n.profiles?.full_name || 'System'}</p>
                </div>
                <Badge variant={n.priority === 'high' ? 'destructive' : n.priority === 'medium' ? 'default' : 'secondary'} className="shrink-0">{n.priority}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {notices.length === 0 && <p className="text-sm text-muted-foreground text-center mt-8">No notices yet.</p>}
      </div>
    </div>
  );
}

function StudentOverview() {
  const { profile } = useAuth();
  const { data: attendance = [], isLoading: loadingAtt } = useAttendanceSummary(profile?.id);
  const { data: marks = [], isLoading: loadingMarks } = useMarks(profile?.id);
  const { data: notices = [] } = useNotices();
  const { data: assignments = [] } = useAssignments();

  useRealtimeAttendance(profile?.id);
  useRealtimeMarks(profile?.id);

  const avgAttendance = attendance.length > 0
    ? Math.round(attendance.reduce((a, b) => a + b.percentage, 0) / attendance.length)
    : 0;

  if (loadingAtt || loadingMarks) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Welcome, {profile?.full_name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">Here's your academic overview for this semester.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Avg Attendance" value={`${avgAttendance}%`} icon={<ClipboardList size={20} />} description="Across all subjects" />
        <StatCard title="Subjects" value={attendance.length} icon={<BarChart3 size={20} />} description="This semester" />
        <StatCard title="Assignments" value={assignments.length} icon={<FileText size={20} />} description="Total assignments" />
        <StatCard title="Notices" value={notices.length} icon={<Bell size={20} />} description="Active notices" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Attendance Overview</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {attendance.length === 0 ? (
              <p className="text-sm text-muted-foreground">No attendance records yet.</p>
            ) : (
              attendance.map(a => (
                <div key={a.subject}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-foreground font-medium">{a.subject}</span>
                    <span className={`font-semibold ${a.percentage >= 85 ? 'text-green-500' : a.percentage >= 75 ? 'text-accent' : 'text-destructive'}`}>
                      {a.percentage}%
                    </span>
                  </div>
                  <Progress value={a.percentage} className="h-2" />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Recent Notices</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {notices.slice(0, 4).map((n: any) => (
              <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{new Date(n.created_at).toLocaleDateString()}</p>
                </div>
                <Badge variant={n.priority === 'high' ? 'destructive' : 'secondary'} className="text-[10px] shrink-0">{n.priority}</Badge>
              </div>
            ))}
            {notices.length === 0 && <p className="text-sm text-muted-foreground">No notices yet.</p>}
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Internal Marks</CardTitle></CardHeader>
          <CardContent>
            {marks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No marks recorded yet.</p>
            ) : (
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
                    {marks.map((m: any) => (
                      <tr key={m.id} className="border-b border-border/50">
                        <td className="py-2.5 text-foreground">{m.subjects?.name || 'N/A'}</td>
                        <td className="py-2.5 text-center">{m.internal1}/25</td>
                        <td className="py-2.5 text-center">{m.internal2}/25</td>
                        <td className="py-2.5 text-center font-semibold">
                          {(Number(m.internal1) + Number(m.internal2) + Number(m.assignment_score)).toFixed(0)}/60
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Assignments</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {assignments.slice(0, 5).map((a: any) => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.subjects?.name} · Due: {new Date(a.due_date).toLocaleDateString()}</p>
                </div>
                <Badge variant={new Date(a.due_date) < new Date() ? 'destructive' : 'default'}>
                  {new Date(a.due_date) < new Date() ? 'Overdue' : 'Active'}
                </Badge>
              </div>
            ))}
            {assignments.length === 0 && <p className="text-sm text-muted-foreground">No assignments yet.</p>}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function StudentDashboard() {
  const location = useLocation();
  const path = location.pathname;

  const renderContent = () => {
    if (path.includes('/student/attendance')) return <StudentAttendance />;
    if (path.includes('/student/marks')) return <StudentMarks />;
    if (path.includes('/student/assignments')) return <StudentAssignments />;
    if (path.includes('/student/notices')) return <StudentNotices />;
    return <StudentOverview />;
  };

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
}
