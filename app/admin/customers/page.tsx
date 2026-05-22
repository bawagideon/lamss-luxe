"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Mail, MapPin, Instagram, Bookmark, Calendar, Eye, Package } from "lucide-react";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import { fetchCustomers, fetchNewsletterSubscribers, fetchCustomerWishlist, fetchCustomerViewed, fetchCustomerOrders } from "@/app/actions/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminEmailDialog } from "@/components/AdminEmailDialog";
import toast from "react-hot-toast";

interface Customer {
  id: string;
  full_name?: string | null;
  email: string;
  phone?: string | null;
  created_at: string;
  wishlist?: string[];
  viewed_ids?: string[];
  instagram_handle?: string | null;
  tiktok_handle?: string | null;
  birthday?: string | null;
  gender?: string | null;
  default_shipping_address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  } | null;
}

interface Subscriber {
  id: string;
  email: string;
  name?: string | null;
  city?: string | null;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  image_url: string;
  price: number | string;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [viewedProducts, setViewedProducts] = useState<Product[]>([]);
  const [viewedLoading, setViewedLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("accounts");

  useEffect(() => {
    async function init() {
      const [cData, sData] = await Promise.all([
        fetchCustomers(),
        fetchNewsletterSubscribers()
      ]);
      setCustomers(cData);
      setSubscribers(sData);
      setLoading(false);
    }
    init();
  }, []);

  const handleViewProfile = async (customer: Customer) => {
    // 1. Fetch Wishlist
    if (customer.wishlist && customer.wishlist.length > 0) {
      setWishlistLoading(true);
      const products = await fetchCustomerWishlist(customer.wishlist);
      setWishlistProducts(products as Product[]);
      setWishlistLoading(false);
    } else {
      setWishlistProducts([]);
    }

    // 2. Fetch Viewed History
    if (customer.viewed_ids && customer.viewed_ids.length > 0) {
      setViewedLoading(true);
      const products = await fetchCustomerViewed(customer.viewed_ids);
      setViewedProducts(products as Product[]);
      setViewedLoading(false);
    } else {
      setViewedProducts([]);
    }

    // 3. Fetch Orders
    setOrdersLoading(true);
    const orderData = await fetchCustomerOrders(customer.id);
    setOrders(orderData);
    setOrdersLoading(false);
  };

  const filteredCustomers = customers.filter(c => 
    c.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter(s => 
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = "";

    if (activeTab === "accounts") {
      headers = [
        "ID", "Full Name", "Email", "Phone", "Instagram", "TikTok", 
        "Birthday", "Gender Expression", "Shipping Street", "Shipping City", 
        "Shipping State", "Shipping Zip", "Shipping Country", "Joined Date"
      ];
      rows = filteredCustomers.map(c => [
        c.id,
        c.full_name || "",
        c.email || "",
        c.phone || "",
        c.instagram_handle || "",
        c.tiktok_handle || "",
        c.birthday || "",
        c.gender || "",
        c.default_shipping_address?.street || "",
        c.default_shipping_address?.city || "",
        c.default_shipping_address?.state || "",
        c.default_shipping_address?.zip || "",
        c.default_shipping_address?.country || "",
        c.created_at ? new Date(c.created_at).toLocaleDateString() : ""
      ]);
      filename = "lamsseluxe-account-holders.csv";
    } else {
      headers = ["ID", "Email", "Full Name", "Target City", "Joined Date"];
      rows = filteredSubscribers.map(s => [
        s.id,
        s.email || "",
        s.name || "",
        s.city || "",
        s.created_at ? new Date(s.created_at).toLocaleDateString() : ""
      ]);
      filename = "lamsseluxe-newsletter-waitlist.csv";
    }

    const escapeCSVField = (field: string) => {
      const stringified = String(field);
      if (stringified.includes(",") || stringified.includes('"') || stringified.includes("\n") || stringified.includes("\r")) {
        return `"${stringified.replace(/"/g, '""')}"`;
      }
      return stringified;
    };

    const csvContent = [
      headers.map(escapeCSVField).join(","),
      ...rows.map(row => row.map(escapeCSVField).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV database exported successfully!", {
      style: { borderRadius: '0px', background: '#000', color: '#fff' }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-100">CRM Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1 uppercase tracking-wider font-semibold">Manage your Soft Life Queens Network.</p>
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {selectedEmails.length > 0 && (
            <AdminEmailDialog 
              emails={selectedEmails} 
              onSuccess={() => setSelectedEmails([])}
              trigger={
                <Button className="bg-zinc-100 text-black font-black uppercase text-[10px] tracking-widest hover:bg-zinc-200 transition-all rounded-none h-10">
                  <Mail className="w-4 h-4 mr-2" /> Email {selectedEmails.length} Queens
                </Button>
              }
            />
          )}
          <Button 
            onClick={handleExportCSV}
            variant="outline" 
            className="font-bold uppercase text-xs tracking-wider border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-none h-10 transition-all"
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-zinc-800 shadow-none bg-zinc-900/30 text-zinc-100 rounded-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Registered Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-zinc-100">{customers.length}</div>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 shadow-none bg-zinc-900/30 text-zinc-100 rounded-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Waitlist Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-zinc-100">{subscribers.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <TabsList className="bg-zinc-900 border border-zinc-800 p-1 rounded-none">
            <TabsTrigger value="accounts" className="rounded-none text-xs font-bold uppercase tracking-wider">Account Holders</TabsTrigger>
            <TabsTrigger value="newsletter" className="rounded-none text-xs font-bold uppercase tracking-wider">Newsletter Waitlist</TabsTrigger>
          </TabsList>
          
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-zinc-800 bg-zinc-900 text-zinc-100 h-10 rounded-none focus-visible:ring-zinc-700" 
            />
          </div>
        </div>

        <TabsContent value="accounts">
          <div className="bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-none overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-900/40 hover:bg-zinc-900/40 border-zinc-800">
                  <TableHead className="w-[50px] py-4 border-zinc-800">
                    <Checkbox 
                      checked={selectedEmails.length === filteredCustomers.length && filteredCustomers.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) setSelectedEmails(filteredCustomers.map(c => c.email));
                        else setSelectedEmails([]);
                      }}
                    />
                  </TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest py-4 text-zinc-400 border-zinc-800">Queen Detail</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest py-4 text-zinc-400 border-zinc-800">Phone</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest py-4 text-zinc-400 border-zinc-800">Joined</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest py-4 text-zinc-400 border-zinc-800 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-10 text-zinc-500 border-zinc-800">Loading Network...</TableCell></TableRow>
                ) : filteredCustomers.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-10 text-zinc-500 uppercase text-xs font-bold tracking-widest border-zinc-800">No matching accounts found.</TableCell></TableRow>
                ) : (
                  filteredCustomers.map((c) => (
                    <TableRow key={c.id} className="border-zinc-900 hover:bg-zinc-900/10">
                      <TableCell className="border-zinc-800">
                        <Checkbox 
                          checked={selectedEmails.includes(c.email)}
                          onCheckedChange={(checked) => {
                            if (checked) setSelectedEmails([...selectedEmails, c.email]);
                            else setSelectedEmails(selectedEmails.filter(e => e !== c.email));
                          }}
                        />
                      </TableCell>
                      <TableCell className="border-zinc-800">
                        <div className="font-bold text-sm uppercase text-zinc-100">{c.full_name || "New Member"}</div>
                        <div className="text-xs text-zinc-500 font-medium">{c.email}</div>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-zinc-300 border-zinc-800">{c.phone || "—"}</TableCell>
                      <TableCell className="text-xs text-zinc-500 font-bold border-zinc-800">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right border-zinc-800">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewProfile(c)}
                              className="font-black uppercase text-[10px] tracking-widest border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-none"
                            >
                              God View
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-zinc-950 border-zinc-800 text-zinc-100">
                            <SheetHeader className="mb-8">
                              <Badge className="w-fit mb-2 uppercase tracking-widest font-black text-[10px] bg-zinc-800 text-zinc-100 hover:bg-zinc-700 rounded-none">Account Profile</Badge>
                              <SheetTitle className="text-3xl font-black uppercase tracking-tight text-zinc-100">{c.full_name || c.email.split('@')[0]}</SheetTitle>
                              <SheetDescription className="text-sm text-zinc-400">Comprehensive breakdown of customer data and lifecycle.</SheetDescription>
                              <div className="pt-4">
                                <AdminEmailDialog emails={[c.email]} />
                              </div>
                            </SheetHeader>

                            <div className="space-y-8">
                              {/* Contact Section */}
                              <section>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center">
                                  <Mail className="w-3 h-3 mr-2" /> Contact & Connectivity
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-[9px] uppercase font-bold text-zinc-500 mb-1">Email Address</div>
                                    <div className="text-sm font-bold break-all text-zinc-100">{c.email}</div>
                                  </div>
                                  <div>
                                    <div className="text-[9px] uppercase font-bold text-zinc-500 mb-1">WhatsApp / Phone</div>
                                    <div className="text-sm font-bold text-zinc-100">{c.phone || "Not Provided"}</div>
                                  </div>
                                </div>
                              </section>

                              <Separator className="bg-zinc-800" />

                              {/* Socials Section */}
                              <section>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center">
                                  <Instagram className="w-3 h-3 mr-2" /> Digital Presence
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-[9px] uppercase font-bold text-zinc-500 mb-1">Instagram</div>
                                    {c.instagram_handle ? (
                                      <a href={`https://instagram.com/${c.instagram_handle.replace('@', '')}`} target="_blank" className="text-sm font-bold text-zinc-300 flex items-center hover:underline italic">
                                        {c.instagram_handle}
                                      </a>
                                    ) : (
                                      <div className="text-sm text-zinc-500">Not Linked</div>
                                    )}
                                  </div>
                                  <div>
                                    <div className="text-[9px] uppercase font-bold text-zinc-500 mb-1">TikTok</div>
                                    <div className="text-sm font-bold text-zinc-100">{c.tiktok_handle || "Not Linked"}</div>
                                  </div>
                                </div>
                              </section>

                              <Separator className="bg-zinc-800" />

                              {/* Personal Details */}
                              <section>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center">
                                  <Calendar className="w-3 h-3 mr-2" /> Identity Metrics
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-[9px] uppercase font-bold text-zinc-500 mb-1">Birthday</div>
                                    <div className="text-sm font-bold text-zinc-100">{c.birthday || "Unset"}</div>
                                  </div>
                                  <div>
                                    <div className="text-[9px] uppercase font-bold text-zinc-500 mb-1">Gender Expression</div>
                                    <div className="text-sm font-bold uppercase text-zinc-100">{c.gender || "Unset"}</div>
                                  </div>
                                </div>
                              </section>

                              <Separator className="bg-zinc-800" />

                              {/* Shipping Info */}
                              <section>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center">
                                  <MapPin className="w-3 h-3 mr-2" /> Global Logistics
                                </h4>
                                {c.default_shipping_address ? (
                                  <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-none text-sm font-medium leading-relaxed text-zinc-300">
                                    {c.default_shipping_address.street}<br/>
                                    {c.default_shipping_address.city}, {c.default_shipping_address.state} {c.default_shipping_address.zip}<br/>
                                    {c.default_shipping_address.country}
                                  </div>
                                ) : (
                                  <div className="text-sm text-zinc-500 italic">No primary shipping address on file.</div>
                                )}
                              </section>

                              <Separator className="bg-zinc-800" />

                              {/* Order Pipeline Section */}
                              <section>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center">
                                  <Package className="w-3 h-3 mr-2" /> Acquisition Record
                                </h4>
                                {ordersLoading ? (
                                  <div className="text-xs animate-pulse text-zinc-500 font-bold uppercase tracking-widest">Fetching PIPELINE...</div>
                                ) : orders.length === 0 ? (
                                  <div className="text-sm text-zinc-500 italic">No transactional record found.</div>
                                ) : (
                                  <div className="divide-y divide-zinc-800 bg-zinc-900/30 rounded-none overflow-hidden border border-zinc-800">
                                    {orders.map((o) => (
                                      <div key={o.id} className="p-3 flex justify-between items-center bg-zinc-950 border-zinc-800 border-b last:border-0 text-zinc-100">
                                         <div>
                                            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.1em]">#{o.id.slice(0, 8)}</p>
                                            <p className="text-xs font-bold text-zinc-100">${o.total_amount}</p>
                                         </div>
                                         <Badge className="text-[9px] uppercase font-black tracking-widest bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800">
                                            {o.status || "paid"}
                                         </Badge>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </section>

                              <Separator className="bg-zinc-800" />

                              {/* Wishlist Section */}
                              <section>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center">
                                  <Bookmark className="w-3 h-3 mr-2" /> Hearted Collection
                                </h4>
                                {wishlistLoading ? (
                                  <div className="text-xs animate-pulse text-zinc-500 font-bold uppercase tracking-widest">Hydrating Wishlist...</div>
                                ) : wishlistProducts.length === 0 ? (
                                  <div className="text-sm text-zinc-500 italic">Her closet is currently empty.</div>
                                ) : (
                                  <div className="grid grid-cols-1 gap-2">
                                    {wishlistProducts.map((p) => (
                                      <div key={p.id} className="flex items-center p-2 border border-zinc-800 bg-zinc-900/20 rounded-none group hover:border-zinc-500 transition-all">
                                        <div className="relative w-12 h-12 bg-zinc-900 rounded overflow-hidden mr-3">
                                          <NextImage src={p.image_url} alt={p.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                          <div className="text-xs font-black uppercase tracking-tight text-zinc-100">{p.name}</div>
                                          <div className="text-[10px] font-bold text-zinc-300">${p.price}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </section>

                              <Separator className="bg-zinc-800" />

                              {/* Viewed History Section */}
                              <section>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center">
                                  <Eye className="w-3 h-3 mr-2" /> Browsing Journey
                                </h4>
                                {viewedLoading ? (
                                  <div className="text-xs animate-pulse text-zinc-500 font-bold uppercase tracking-widest">Hydrating History...</div>
                                ) : viewedProducts.length === 0 ? (
                                  <div className="text-sm text-zinc-500 italic">No recent activity recorded.</div>
                                ) : (
                                  <div className="grid grid-cols-1 gap-2">
                                    {viewedProducts.map((p) => (
                                      <div key={p.id} className="flex items-center p-2 border border-zinc-800 bg-zinc-900/20 rounded-none group hover:border-zinc-500 transition-all">
                                        <div className="relative w-12 h-12 bg-zinc-900 rounded overflow-hidden mr-3">
                                          <NextImage src={p.image_url} alt={p.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                          <div className="text-xs font-black uppercase tracking-tight text-zinc-100">{p.name}</div>
                                          <div className="text-[10px] font-bold text-zinc-300">${p.price}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </section>
                            </div>
                          </SheetContent>
                        </Sheet>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="newsletter">
          <div className="bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-none overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-900/40 hover:bg-zinc-900/40 border-zinc-800">
                  <TableHead className="w-[50px] py-4 border-zinc-800">
                    <Checkbox 
                      checked={selectedEmails.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) setSelectedEmails(filteredSubscribers.map(s => s.email));
                        else setSelectedEmails([]);
                      }}
                    />
                  </TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest py-4 text-zinc-400 border-zinc-800">Waitlist Email</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest py-4 text-zinc-400 border-zinc-800">Full Name</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest py-4 text-zinc-400 border-zinc-800">Target City</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest py-4 text-zinc-400 border-zinc-800 text-right">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-10 text-zinc-500 border-zinc-800">Loading Network...</TableCell></TableRow>
                ) : filteredSubscribers.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-10 text-zinc-500 uppercase text-xs font-bold tracking-widest border-zinc-800">No waitlist signups found.</TableCell></TableRow>
                ) : (
                  filteredSubscribers.map((s) => (
                    <TableRow key={s.id} className="border-zinc-900 hover:bg-zinc-900/10 border-b border-zinc-900">
                      <TableCell className="border-zinc-800">
                        <Checkbox 
                          checked={selectedEmails.includes(s.email)}
                          onCheckedChange={(checked) => {
                            if (checked) setSelectedEmails([...selectedEmails, s.email]);
                            else setSelectedEmails(selectedEmails.filter(e => e !== s.email));
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-bold text-sm text-zinc-100 border-zinc-800">{s.email}</TableCell>
                      <TableCell className="text-sm font-medium uppercase text-zinc-300 border-zinc-800">{s.name || "—"}</TableCell>
                      <TableCell className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-zinc-800">{s.city || "Global"}</TableCell>
                      <TableCell className="text-right text-xs text-zinc-500 font-bold border-zinc-800">{new Date(s.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
