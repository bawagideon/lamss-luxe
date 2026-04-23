'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Monitor, Trash2, Loader2, UserPlus, Smartphone, Laptop } from "lucide-react";
import { getStaffMembers, addStaffMember, removeStaffMember, getActiveSessions, revokeSession, StaffMember, AdminSession } from "@/app/actions/staff";
import toast from "react-hot-toast";

export function StaffSecuritySettings() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const [newStaff, setNewStaff] = useState({ name: "", email: "", password: "", role: "editor" });

  const fetchData = async () => {
    setLoading(true);
    const [staffData, sessionData] = await Promise.all([
      getStaffMembers(),
      getActiveSessions()
    ]);
    setStaff(staffData);
    setSessions(sessionData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await addStaffMember(newStaff.name, newStaff.email, newStaff.password, newStaff.role);
      toast.success(`${newStaff.name} added to the logistics team.`);
      setNewStaff({ name: "", email: "", password: "", role: "editor" });
      fetchData();
    } catch {
      toast.error("Failed to add staff member.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveStaff = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to revoke all access for ${name}?`)) return;
    try {
      await removeStaffMember(id);
      toast.success(`${name} has been removed from the system.`);
      fetchData();
    } catch {
      toast.error("Failed to remove staff.");
    }
  };

  const handleRevokeSession = async (id: string) => {
    setRevokingId(id);
    try {
      await revokeSession(id);
      toast.success("Device session terminated.");
      fetchData();
    } catch {
      toast.error("Failed to revoke session.");
    } finally {
      setRevokingId(null);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-40 bg-gray-50 rounded-xl" />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* Staff Management */}
        <Card className="rounded-xl border-gray-100 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-gray-50 bg-gray-50/30">
            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Staff & Operators
            </CardTitle>
            <CardDescription>Manage individual access for the logistics team.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <form onSubmit={handleAddStaff} className="p-4 bg-zinc-50 rounded-xl border border-dashed border-zinc-200 space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                <UserPlus className="w-3 h-3" /> Add New Operator
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Full Name (e.g. Yemi Admin)"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="h-10 text-xs font-bold"
                  required
                />
                <Input
                  type="email"
                  placeholder="Login Email (e.g. yemi@lamsseluxe.com)"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="h-10 text-xs font-bold"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="password"
                  placeholder="Access Passcode"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  className="h-10 text-xs font-bold"
                  required
                />
                <select 
                  className="h-10 text-[10px] font-black uppercase tracking-widest bg-white border border-zinc-200 rounded-md px-3 focus:outline-none focus:ring-1 focus:ring-black"
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                >
                  <option value="editor">Role: Editor</option>
                  <option value="admin">Role: Admin</option>
                </select>
              </div>
              <Button disabled={adding} className="w-full h-10 bg-black text-white font-black uppercase tracking-widest text-[10px] rounded-lg">
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Authorize Operator"}
              </Button>
            </form>

            <div className="border rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest py-3">Operator</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest py-3">Role</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest py-3 text-right">Access</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="font-bold text-sm uppercase">{s.name}</div>
                        <div className="text-[10px] text-primary font-black uppercase tracking-tighter lowercase">{s.email}</div>
                        <div className="text-[10px] text-gray-400 font-medium italic">Added {new Date(s.created_at).toLocaleDateString()}</div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-0.5 bg-zinc-100 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-600 border border-zinc-200">
                          {s.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveStaff(s.id, s.name)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Session & Device Tracking */}
        <Card className="rounded-xl border-gray-100 shadow-sm overflow-hidden ring-2 ring-primary/5">
          <CardHeader className="border-b border-gray-50 bg-gray-50/30">
            <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" />
              Luxe Network Nodes
              {sessions.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black flex items-center gap-1 border border-green-100 animate-in fade-in zoom-in duration-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  {sessions.length} Live
                </span>
              )}
            </CardTitle>
            <CardDescription>Live tracking of devices currently accessing the logistics portal.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {sessions.length === 0 ? (
                <div className="text-center py-10 text-zinc-400 text-xs font-bold uppercase tracking-widest italic border-2 border-dashed rounded-xl">
                  No active session nodes detected.
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-primary/20 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400">
                          {session.device_id.toLowerCase().includes('phone') ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs uppercase">{session.staff_name || "Unknown Operator"}</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                          </div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                            {session.device_id} • Last seen {new Date(session.last_active).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={revokingId === session.id}
                        onClick={() => handleRevokeSession(session.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity font-black uppercase text-[9px] tracking-widest border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 h-8"
                      >
                        {revokingId === session.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Revoke Access"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
