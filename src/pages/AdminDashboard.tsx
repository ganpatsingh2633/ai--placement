import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth-context';
import { useProfiles, useNotices, useDepartments, useSubjects, useAssignments } from '@/hooks/use-college-data';
import { useAddDepartment, useDeleteDepartment, useAddNotice, useDeleteNotice, useDeleteProfile, useUpdateProfile, useAddSubject, useDeleteSubject } from '@/hooks/use-college-mutations';
import { Users, GraduationCap, BookOpen, Bell, Loader2, Plus, Trash2, Search, Edit2, Building2, FileText } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--destructive))', '#22c55e', '#f59e0b', '#8b5cf6'];

function AdminStudents() {
  const { data: students = [] } = useProfiles('student');
  const deleteMut = useDeleteProfile();
  const updateMut = useUpdateProfile();
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ full_name: '', department: '', roll_no: '', semester: 1 });

  const filtered = students.filter(s =>
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (s.roll_no || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.department || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-bold text-foreground">Student Management</h2>
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
                  <th className="text-center p-3 text-muted-foreground font-medium">Actions</th>
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
                    <td className="p-3 text-center">
                      <div className="flex gap-1 justify-center">
                        <Dialog open={editId === s.id} onOpenChange={o => { if (!o) setEditId(null); }}>
                          <DialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditId(s.id); setEditData({ full_name: s.full_name, department: s.department || '', roll_no: s.roll_no || '', semester: s.semester || 1 }); }}>
                              <Edit2 size={14} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Edit Student</DialogTitle></DialogHeader>
                            <div className="space-y-3">
                              <Input placeholder="Full Name" value={editData.full_name} onChange={e => setEditData(p => ({ ...p, full_name: e.target.value }))} />
                              <Input placeholder="Department" value={editData.department} onChange={e => setEditData(p => ({ ...p, department: e.target.value }))} />
                              <Input placeholder="Roll No" value={editData.roll_no} onChange={e => setEditData(p => ({ ...p, roll_no: e.target.value }))} />
                              <Input type="number" placeholder="Semester" value={editData.semester} onChange={e => setEditData(p => ({ ...p, semester: Number(e.target.value) }))} />
                              <Button className="w-full" onClick={() => { updateMut.mutate({ id: s.id, ...editData }); setEditId(null); }}>Save</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => deleteMut.mutate(s.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
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

function AdminTeachers() {
  const { data: teachers = [] } = useProfiles('teacher');
  const deleteMut = useDeleteProfile();
  const updateMut = useUpdateProfile();
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ full_name: '', department: '', employee_id: '' });

  const filtered = teachers.filter(t =>
    t.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (t.department || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-bold text-foreground">Teacher Management</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input placeholder="Search teachers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>
      <Card className="shadow-card border-border/60">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 text-muted-foreground font-medium">Name</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Employee ID</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Department</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Email</th>
                  <th className="text-center p-3 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-3 text-foreground font-medium">{t.full_name}</td>
                    <td className="p-3 text-muted-foreground">{t.employee_id || '-'}</td>
                    <td className="p-3 text-muted-foreground">{t.department || '-'}</td>
                    <td className="p-3 text-muted-foreground">{t.email}</td>
                    <td className="p-3 text-center">
                      <div className="flex gap-1 justify-center">
                        <Dialog open={editId === t.id} onOpenChange={o => { if (!o) setEditId(null); }}>
                          <DialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditId(t.id); setEditData({ full_name: t.full_name, department: t.department || '', employee_id: t.employee_id || '' }); }}>
                              <Edit2 size={14} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Edit Teacher</DialogTitle></DialogHeader>
                            <div className="space-y-3">
                              <Input placeholder="Full Name" value={editData.full_name} onChange={e => setEditData(p => ({ ...p, full_name: e.target.value }))} />
                              <Input placeholder="Department" value={editData.department} onChange={e => setEditData(p => ({ ...p, department: e.target.value }))} />
                              <Input placeholder="Employee ID" value={editData.employee_id} onChange={e => setEditData(p => ({ ...p, employee_id: e.target.value }))} />
                              <Button className="w-full" onClick={() => { updateMut.mutate({ id: t.id, ...editData }); setEditId(null); }}>Save</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => deleteMut.mutate(t.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="text-sm text-muted-foreground p-4 text-center">No teachers found.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function AdminDepartments() {
  const { data: departments = [] } = useDepartments();
  const addMut = useAddDepartment();
  const deleteMut = useDeleteDepartment();
  const [name, setName] = useState('');
  const [hod, setHod] = useState('');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-bold text-foreground">Department Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm"><Plus size={16} className="mr-1" /> Add Department</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Department</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Department Name" value={name} onChange={e => setName(e.target.value)} />
              <Input placeholder="Head of Department" value={hod} onChange={e => setHod(e.target.value)} />
              <Button className="w-full" onClick={() => { addMut.mutate({ name, head_of_department: hod || undefined }); setName(''); setHod(''); }}>Add</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map(d => (
          <Card key={d.id} className="shadow-card border-border/60">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 size={16} className="text-primary" />
                    <p className="font-medium text-foreground">{d.name}</p>
                  </div>
                  {d.head_of_department && <p className="text-xs text-muted-foreground">HOD: {d.head_of_department}</p>}
                </div>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => deleteMut.mutate(d.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {departments.length === 0 && <p className="text-sm text-muted-foreground text-center mt-8">No departments yet.</p>}
    </div>
  );
}

function AdminNotices() {
  const { profile } = useAuth();
  const { data: notices = [] } = useNotices();
  const addMut = useAddNotice();
  const deleteMut = useDeleteNotice();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('low');
  const [targetRole, setTargetRole] = useState('all');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-bold text-foreground">Notice Management</h2>
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
              <Select value={targetRole} onValueChange={setTargetRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="teacher">Teachers</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full" onClick={() => {
                if (!title || !content) return;
                addMut.mutate({ title, content, priority, target_role: targetRole, author_id: profile!.id });
                setTitle(''); setContent(''); setPriority('low');
              }}>Publish</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {notices.map((n: any) => (
          <Card key={n.id} className="shadow-card border-border/60">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground">{n.title}</p>
                    <Badge variant={n.priority === 'high' ? 'destructive' : n.priority === 'medium' ? 'default' : 'secondary'}>{n.priority}</Badge>
                    {n.target_role && n.target_role !== 'all' && <Badge variant="outline">{n.target_role}</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{n.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleDateString()} · {n.profiles?.full_name || 'System'}</p>
                </div>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive shrink-0" onClick={() => deleteMut.mutate(n.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {notices.length === 0 && <p className="text-sm text-muted-foreground text-center mt-8">No notices yet.</p>}
      </div>
    </div>
  );
}

function AdminSettings() {
  const { data: subjects = [] } = useSubjects();
  const { data: teachers = [] } = useProfiles('teacher');
  const { data: departments = [] } = useDepartments();
  const addSubject = useAddSubject();
  const deleteSubject = useDeleteSubject();
  const [subName, setSubName] = useState('');
  const [subDept, setSubDept] = useState('');
  const [subSem, setSubSem] = useState(1);
  const [subTeacher, setSubTeacher] = useState('');

  return (
    <div>
      <h2 className="text-lg font-display font-bold text-foreground mb-4">Subjects & Settings</h2>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{subjects.length} subjects configured</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm"><Plus size={16} className="mr-1" /> Add Subject</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Subject</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Subject Name" value={subName} onChange={e => setSubName(e.target.value)} />
              <Select value={subDept} onValueChange={setSubDept}>
                <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
                <SelectContent>
                  {departments.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input type="number" placeholder="Semester" value={subSem} onChange={e => setSubSem(Number(e.target.value))} />
              <Select value={subTeacher} onValueChange={setSubTeacher}>
                <SelectTrigger><SelectValue placeholder="Assign Teacher" /></SelectTrigger>
                <SelectContent>
                  {teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button className="w-full" onClick={() => {
                if (!subName || !subDept) return;
                addSubject.mutate({ name: subName, department: subDept, semester: subSem, teacher_id: subTeacher || undefined });
                setSubName(''); setSubDept(''); setSubSem(1); setSubTeacher('');
              }}>Add Subject</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="shadow-card border-border/60">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 text-muted-foreground font-medium">Subject</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Department</th>
                  <th className="text-center p-3 text-muted-foreground font-medium">Semester</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Teacher</th>
                  <th className="text-center p-3 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s: any) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-3 text-foreground font-medium">{s.name}</td>
                    <td className="p-3 text-muted-foreground">{s.department}</td>
                    <td className="p-3 text-center"><Badge variant="secondary">{s.semester}</Badge></td>
                    <td className="p-3 text-muted-foreground">{s.profiles?.full_name || 'Unassigned'}</td>
                    <td className="p-3 text-center">
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => deleteSubject.mutate(s.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {subjects.length === 0 && <p className="text-sm text-muted-foreground p-4 text-center">No subjects configured.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function AdminOverview() {
  const { data: students = [] } = useProfiles('student');
  const { data: teachers = [] } = useProfiles('teacher');
  const { data: departments = [] } = useDepartments();
  const { data: notices = [] } = useNotices();
  const { data: subjects = [] } = useSubjects();

  const deptStudentCount = departments.map(d => ({
    name: d.name.length > 12 ? d.name.slice(0, 12) + '…' : d.name,
    students: students.filter(s => s.department === d.name).length,
  }));

  const roleDistribution = [
    { name: 'Students', value: students.length },
    { name: 'Teachers', value: teachers.length },
  ];

  return (
    <>
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

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-2"><CardTitle className="text-base font-display">Students by Department</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptStudentCount}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-2"><CardTitle className="text-base font-display">User Distribution</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={roleDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                  {roleDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
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

        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Subjects Overview</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {subjects.slice(0, 5).map((s: any) => (
              <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.department} · Sem {s.semester}</p>
                </div>
                <Badge variant="outline">{(s as any).profiles?.full_name || 'Unassigned'}</Badge>
              </div>
            ))}
            {subjects.length === 0 && <p className="text-sm text-muted-foreground">No subjects yet.</p>}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function AdminDashboard() {
  const location = useLocation();
  const path = location.pathname;

  const renderContent = () => {
    if (path.includes('/admin/students')) return <AdminStudents />;
    if (path.includes('/admin/teachers')) return <AdminTeachers />;
    if (path.includes('/admin/departments')) return <AdminDepartments />;
    if (path.includes('/admin/notices')) return <AdminNotices />;
    if (path.includes('/admin/settings')) return <AdminSettings />;
    return <AdminOverview />;
  };

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
}
