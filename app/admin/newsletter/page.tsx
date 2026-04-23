"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import { 
  getNewsletterStats, 
  sendTestEmail, 
  sendLiveNewsletter,
  getSubscribers,
  removeSubscriber
} from "@/app/actions/newsletter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Send, 
  TestTube, 
  AlertTriangle,
  Search,
  Trash2,
  Calendar,
  LayoutDashboard
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  city?: string;
  created_at: string;
}

export default function NewsletterStudioPage() {
  const [stats, setStats] = useState({ 
    totalSubscribers: 0, 
    newThisWeek: 0,
    openRate: "0%",
    clickRate: "0%",
    lastSent: "Never"
  });
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [isLiveOpen, setIsLiveOpen] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    const [statsData, subData] = await Promise.all([
      getNewsletterStats(),
      getSubscribers()
    ]);
    setStats(statsData);
    setSubscribers(subData);
  };

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter(s => 
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [subscribers, searchQuery]);

  const handleRemoveSubscriber = (id: string, email: string) => {
    if (confirm(`Remove ${email} from the audience?`)) {
      startTransition(async () => {
        const res = await removeSubscriber(id);
        if (res.success) {
          toast.success("Subscriber removed.");
          refreshData();
        } else {
          toast.error(res.error || "Failed to remove.");
        }
      });
    }
  };

  const handleTestSend = () => {
    if (!testEmail) return toast.error("Please provide a test email address.");
    
    startTransition(async () => {
      const result = await sendTestEmail(testEmail, subject || "Test Newsletter", content || "This is a test message.");
      if (result.success) {
        toast.success(`Test sent to ${testEmail}`);
        setIsTestOpen(false);
      } else {
        toast.error(result.error || "Failed to send test.");
      }
    });
  };

  const handleLiveSend = () => {
    if (!subject || !content) return toast.error("Please fill in both subject and body.");

    startTransition(async () => {
      const result = await sendLiveNewsletter(subject, content);
      if (result.success) {
        toast.success(`Newsletter dispatched to ${result.count} subscribers!`);
        if ((result.failures ?? 0) > 0) {
           toast.error(`${result.failures} dispatches failed. Check system logs.`);
        }
        setSubject("");
        setContent("");
        setIsLiveOpen(false);
        refreshData();
      } else {
        toast.error(result.error || "Failed to dispatch newsletter.");
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight italic">Newsletter Hub</h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-medium italic">Advanced Automated Distribution & Audience Growth Engine.</p>
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="rounded-none border-black border-2 bg-black text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest">
              Campaign Engine v2.0
           </Badge>
        </div>
      </div>

      <Tabs defaultValue="studio" className="w-full">
        <TabsList className="bg-zinc-100 p-1 h-14 rounded-none border-b-2 border-black w-full justify-start gap-1">
          <TabsTrigger value="studio" className="data-[state=active]:bg-black data-[state=active]:text-white rounded-none h-full px-8 font-black uppercase tracking-widest text-[11px] flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" /> Campaign Studio
          </TabsTrigger>
          <TabsTrigger value="audience" className="data-[state=active]:bg-black data-[state=active]:text-white rounded-none h-full px-8 font-black uppercase tracking-widest text-[11px] flex items-center gap-2">
            <Users className="w-4 h-4" /> Audience List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="studio" className="pt-8 space-y-8">
          {/* Analytics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="rounded-none border-black border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Audience</p>
                <h3 className="text-4xl font-black italic tracking-tighter">{stats.totalSubscribers}</h3>
              </CardContent>
            </Card>

            <Card className="rounded-none border-black border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-black text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Week-over-Week</p>
                <h3 className="text-4xl font-black italic tracking-tighter">+{stats.newThisWeek}</h3>
              </CardContent>
            </Card>

            <Card className="rounded-none border-gray-100 border bg-gray-50/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Delivery Status</p>
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                   Resend Active
                </h3>
              </CardContent>
            </Card>
          </div>

          {/* Composer Section */}
          <Card className="rounded-none border-black border-2">
            <CardHeader className="border-b border-gray-100 bg-zinc-50/50">
              <CardTitle className="text-xl font-black uppercase tracking-widest italic">Campaign Composer</CardTitle>
              <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                 Draft your narrative. Automated branding and signatures will be injected.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Broadcast Subject</label>
                <Input 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. THE SPRING DROP: UNLEASH YOUR SOFT LIFE"
                  className="rounded-none border-black h-12 font-black italic uppercase tracking-widest text-sm focus-visible:ring-black"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Content / Brand Story</label>
                </div>
                <Textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tell your story. Describe the new collection, share upcoming events, or simply say hello..."
                  className="rounded-none border-black min-h-[400px] font-medium leading-relaxed p-6 text-sm focus-visible:ring-black"
                />
              </div>

              <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">
                   <AlertTriangle className="w-5 h-5 flex-shrink-0" /> Triple-check your content before the final blast.
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                  <Dialog open={isTestOpen} onOpenChange={setIsTestOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1 md:flex-none h-14 rounded-none border-black border-2 hover:bg-black hover:text-white font-black uppercase tracking-widest text-[11px] px-10 transition-all">
                        <TestTube className="w-4 h-4 mr-2" /> Send Test
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-none border-2 border-black p-0 overflow-hidden">
                      <div className="bg-black text-white p-6"><DialogTitle className="font-black uppercase tracking-tight italic text-2xl">Quality Check</DialogTitle></div>
                      <div className="p-8 space-y-6">
                        <Input placeholder="your-email@gmail.com" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} className="rounded-none border-black h-12" />
                        <Button onClick={handleTestSend} disabled={isPending} className="w-full bg-black text-white rounded-none h-12 font-black uppercase">{isPending ? "Dispatching..." : "Dispatch Test"}</Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isLiveOpen} onOpenChange={setIsLiveOpen}>
                    <DialogTrigger asChild>
                      <Button variant="default" className="flex-1 md:flex-none h-14 rounded-none bg-black text-white hover:bg-zinc-800 font-black uppercase tracking-widest text-[11px] px-10 transition-all">
                        <Send className="w-4 h-4 mr-2" /> BROADCAST LIVE
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-none border-2 border-black p-0 overflow-hidden">
                      <div className="bg-red-600 text-white p-6"><DialogTitle className="font-black uppercase tracking-tight italic text-2xl">Final Confirmation</DialogTitle></div>
                      <div className="p-8 space-y-6">
                        <div className="bg-zinc-50 p-6 border-l-4 border-red-600"><p className="text-sm font-black uppercase tracking-tight">Warning</p><p className="text-sm">You are about to blast this campaign to <strong>{stats.totalSubscribers}</strong> subscribers.</p></div>
                        <Button onClick={handleLiveSend} disabled={isPending} className="w-full bg-red-600 text-white rounded-none h-14 font-black uppercase">{isPending ? "BROADCASTING ACTIVE..." : "YES, DISPATCH LIVE"}</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="pt-8">
          <Card className="rounded-none border-black border-2">
            <CardHeader className="border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-widest italic">Audience Member Registry</CardTitle>
                <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Search, monitor, and prune your audience list.</CardDescription>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search email or name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 rounded-none border-black bg-white focus-visible:ring-black italic text-sm font-medium"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
               <Table>
                 <TableHeader className="bg-zinc-50 border-b border-black">
                   <TableRow className="hover:bg-transparent">
                     <TableHead className="text-[10px] font-black uppercase tracking-widest text-black h-12">Audience Member</TableHead>
                     <TableHead className="text-[10px] font-black uppercase tracking-widest text-black h-12">Joined</TableHead>
                     <TableHead className="text-[10px] font-black uppercase tracking-widest text-black h-12 text-right">Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {filteredSubscribers.length === 0 ? (
                     <TableRow>
                       <TableCell colSpan={3} className="h-40 text-center font-bold uppercase text-gray-400 tracking-widest text-xs">No audience members found.</TableCell>
                     </TableRow>
                   ) : (
                     filteredSubscribers.map((member) => (
                       <TableRow key={member.id} className="border-b border-gray-100 hover:bg-zinc-50/50 transition-colors">
                         <TableCell>
                           <div className="flex flex-col py-2">
                             <p className="font-black text-sm uppercase tracking-tight">{member.name || "Anonymous Member"}</p>
                             <p className="text-[10px] text-gray-500 font-medium lowercase italic">{member.email}</p>
                           </div>
                         </TableCell>
                         <TableCell>
                            <div className="flex items-center gap-2 text-gray-500">
                               <Calendar className="w-3 h-3" />
                               <span className="text-[10px] font-black uppercase tracking-tighter">
                                 {new Date(member.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                               </span>
                            </div>
                         </TableCell>
                         <TableCell className="text-right">
                           <Button 
                             onClick={() => handleRemoveSubscriber(member.id, member.email)}
                             variant="ghost" 
                             size="icon" 
                             className="text-gray-300 hover:text-red-500 hover:bg-red-50"
                           >
                             <Trash2 className="w-4 h-4" />
                           </Button>
                         </TableCell>
                       </TableRow>
                     ))
                   )}
                 </TableBody>
               </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
