import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/lib/auth-context';
import { useProfiles, useNotices, useSubjects, useAssignments } from '@/hooks/use-college-data';
import { useAddAttendance, useUpsertMarks, useAddNotice, useAddAssignment, useDeleteAssignment } from '@/hooks/use-college-mutations';
import { Users, ClipboardList, FileText, Bell, Loader2, Plus, Search, Trash2, BarChart3, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function TeacherAttendance() {
  const { profile } = useAuth();
  const { data: students = [] } = useProfiles('student');
  const { data: subjects = [] } = useSubjects();
  const addAttendance = useAddAttendance();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [presentMap, setPresentMap] = useState<Record<string, boolean>>({});

  const subjectData = subjects.find((s: any) => s.id === selectedSubject);
  const filteredStudents = selectedSubject && subjectData
    ? students.filter(s => s.department === (subjectData as any).department && s.semester === (subjectData as any).semester)
    : [];

  const handleMark = () => {
    if (!selectedSubject || !date || filteredStudents.length === 0) return;
    const records = filteredStudents.map(s => ({
      student_id: s.id,
      subject_id: selectedSubject,
      date,
      present: presentMap[s.id] ?? true,
      marked_by: profile!.id,
    }));
    addAttendance.mutate(records);
    setPresentMap({});
  };

  return (
    <div>
      <h2 className="text-lg font-display font-bold text-foreground mb-4">Mark Attendance</h2>
      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <Select value={selectedSubject} onValueChange={v => { setSelectedSubject(v); setPresentMap({}); }}>
          <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
          <SelectContent>
            {subjects.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name} (Sem {s.semester})</SelectItem>)}
          </SelectContent>
        </Select>
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <Button onClick={handleMark} disabled={!selectedSubject || filteredStudents.length === 0 || addAttendance.isPending}>
          <CheckCircle2 size={16} className="mr-1" /> Submit Attendance
        </Button>
      </div>
      {filteredStudents.length > 0 && (
        <Card className="shadow-card border-border/60">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 text-muted-foreground font-medium">Student</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Roll No</th>
                  <th className="text-center p-3 text-muted-foreground font-medium">Present</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(s => (
                  <tr key={s.id} className="border-b border-border/50">
                    <td className="p-3 text-foreground font-medium">{s.full_name}</td>
                    <td className="p-3 text-muted-foreground">{s.roll_no || '-'}</td>
                    <td className="p-3 text-center">
                      <Checkbox
                        checked={presentMap[s.id] ?? true}
                        onCheckedChange={v => setPresentMap(p => ({ ...p, [s.id]: v as boolean }))}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
      {selectedSubject && filteredStudents.length === 0 && (
        <p className="text-sm text-muted-foreground text-center mt-4">No students found for this subject's department and semester.</p>
      )}
    </div>
  );
}

function TeacherMarks() {
  const { profile } = useAuth();
  const { data: students = [] } = useProfiles('student');
  const { data: subjects = [] } = useSubjects();
  const upsertMarks = useUpsertMarks();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [int1, setInt1] = useState('');
  const [int2, setInt2] = useState('');
  const [assignScore, setAssignScore] = useState('');

  const subjectData = subjects.find((s: any) => s.id === selectedSubject);
  const filteredStudents = selectedSubject && subjectData
    ? students.filter(s => s.department === (subjectData as any).department && s.semester === (subjectData as any).semester)
    : [];

  return (
    <div>
      <h2 className="text-lg font-display font-bold text-foreground mb-4">Upload Marks</h2>
      <Card className="shadow-card border-border/60">
        <CardContent className="p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Select value={selectedSubject} onValueChange={v => { setSelectedSubject(v); setSelectedStudent(''); }}>
              <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
              <SelectContent>
                {subjects.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger><SelectValue placeholder="Select Student" /></SelectTrigger>
              <SelectContent>
                {filteredStudents.map(s => <SelectItem key={s.id} value={s.id}>{s.full_name} ({s.roll_no})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <Input type="number" placeholder="Internal 1 (out of 25)" value={int1} onChange={e => setInt1(e.target.value)} max={25} />
            <Input type="number" placeholder="Internal 2 (out of 25)" value={int2} onChange={e => setInt2(e.target.value)} max={25} />
            <Input type="number" placeholder="Assignment (out of 10)" value={assignScore} onChange={e => setAssignScore(e.target.value)} max={10} />
          </div>
          <Button onClick={() => {
            if (!selectedSubject || !selectedStudent) return;
            upsertMarks.mutate({
              student_id: selectedStudent,
              subject_id: selectedSubject,
              internal1: int1 ? Number(int1) : undefined,
              internal2: int2 ? Number(int2) : undefined,
              assignment_score: assignScore ? Number(assignScore) : undefined,
              updated_by: profile!.id,
            });
            setInt1(''); setInt2(''); setAssignScore('');
          }} disabled={!selectedSubject || !selectedStudent || upsertMarks.isPending}>
            Save Marks
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function TeacherAssignments() {
  const { profile } = useAuth();
  const { data: assignments = [] } = useAssignments();
  const { data: subjects = [] } = useSubjects();
  const addAssignment = useAddAssignment();
  const deleteAssignment = useDeleteAssignment();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [dueDate, setDueDate] = useState('');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-bold text-foreground">Assignments</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm"><Plus size={16} className="mr-1" /> Create Assignment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Assignment</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
              <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger><SelectValue placeholder="Subject" /></SelectTrigger>
                <SelectContent>
                  {subjects.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              <Button className="w-full" onClick={() => {
                if (!title || !subjectId || !dueDate) return;
                addAssignment.mutate({ title, description: desc, subject_id: subjectId, due_date: dueDate, posted_by: profile!.id });
                setTitle(''); setDesc(''); setSubjectId(''); setDueDate('');
              }}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {assignments.map((a: any) => (
          <Card key={a.id} className="shadow-card border-border/60">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{a.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{a.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(a as any).subjects?.name || 'N/A'} · Due: {new Date(a.due_date).toLocaleDateString()} · By: {(a as any).profiles?.full_name || 'Unknown'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={new Date(a.due_date) < new Date() ? 'destructive' : 'default'}>
                    {new Date(a.due_date) < new Date() ? 'Overdue' : 'Active'}
                  </Badge>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteAssignment.mutate(a.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {assignments.length === 0 && <p className="text-sm text-muted-foreground text-center mt-8">No assignments yet.</p>}
      </div>
    </div>
  );
}

function TeacherStudents() {
  const { data: students = [] } = useProfiles('student');
  const [search, setSearch] = useState('');

  const filtered = students.filter(s =>
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (s.roll_no || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.department || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-bold text-foreground">Student Records</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>
      <Card className="shadow-card border-border/60">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 text-muted-foreground font-medium">Name</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Roll No</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Department</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Email</th>
                  <th className="text-center p-3 text-muted-foreground font-medium">Semester</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-3 text-foreground font-medium">{s.full_name}</td>
                    <td className="p-3 text-muted-foreground">{s.roll_no || '-'}</td>
                    <td className="p-3 text-muted-foreground">{s.department || '-'}</td>
                    <td className="p-3 text-muted-foreground">{s.email}</td>
                    <td className="p-3 text-center"><Badge variant="secondary">{s.semester || '-'}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="text-sm text-muted-foreground p-4 text-center">No students found.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function TeacherNotices() {
  const { profile } = useAuth();
  const { data: notices = [] } = useNotices();
  const addMut = useAddNotice();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('low');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-bold text-foreground">Notices</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm"><Plus size={16} className="mr-1" /> Post Notice</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Post Notice</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
              <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]" placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full" onClick={() => {
                if (!title || !content) return;
                addMut.mutate({ title, content, priority, target_role: 'all', author_id: profile!.id });
                setTitle(''); setContent('');
              }}>Publish</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {notices.map((n: any) => (
          <div key={n.id} className="flex items-start gap-3 p-4 rounded-lg border border-border/60 bg-card">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{n.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{n.content}</p>
              <p className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleDateString()} · {n.profiles?.full_name || 'System'}</p>
            </div>
            <Badge variant={n.priority === 'high' ? 'destructive' : 'secondary'}>{n.priority}</Badge>
          </div>
        ))}
        {notices.length === 0 && <p className="text-sm text-muted-foreground text-center mt-8">No notices yet.</p>}
      </div>
    </div>
  );
}

function TeacherOverview() {
  const { profile } = useAuth();
  const { data: students = [], isLoading } = useProfiles('student');
  const { data: notices = [] } = useNotices();
  const { data: subjects = [] } = useSubjects();
  const { data: assignments = [] } = useAssignments();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const deptDistribution = subjects.reduce((acc: Record<string, number>, s: any) => {
    acc[s.department] = (acc[s.department] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(deptDistribution).map(([name, value]) => ({ name, subjects: value }));

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Welcome, {profile?.full_name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your classes and academic records.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Students" value={students.length} icon={<Users size={20} />} description="Registered students" />
        <StatCard title="Subjects" value={subjects.length} icon={<ClipboardList size={20} />} description="In the system" />
        <StatCard title="Assignments" value={assignments.length} icon={<FileText size={20} />} description="Total assignments" />
        <StatCard title="Notices" value={notices.length} icon={<Bell size={20} />} description="Active notices" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-2"><CardTitle className="text-base font-display">Subjects by Department</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="subjects" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Recent Notices</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {notices.slice(0, 4).map((n: any) => (
              <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{new Date(n.created_at).toLocaleDateString()}</p>
                </div>
                <Badge variant={n.priority === 'high' ? 'destructive' : 'secondary'}>{n.priority}</Badge>
              </div>
            ))}
            {notices.length === 0 && <p className="text-sm text-muted-foreground">No notices yet.</p>}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function TeacherDashboard() {
  const location = useLocation();
  const path = location.pathname;

  const renderContent = () => {
    if (path.includes('/teacher/attendance')) return <TeacherAttendance />;
    if (path.includes('/teacher/marks')) return <TeacherMarks />;
    if (path.includes('/teacher/assignments')) return <TeacherAssignments />;
    if (path.includes('/teacher/students')) return <TeacherStudents />;
    if (path.includes('/teacher/notices')) return <TeacherNotices />;
    return <TeacherOverview />;
  };

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
}
