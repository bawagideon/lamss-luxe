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

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [viewedProducts, setViewedProducts] = useState<Product[]>([]);
  const [viewedLoading, setViewedLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">CRM Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your Soft Life Queens Network.</p>
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button variant="outline" className="font-bold uppercase text-xs tracking-wider border-black hover:bg-black hover:text-white transition-all">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-black/5 shadow-none bg-gray-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-gray-400">Registered Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{customers.length}</div>
          </CardContent>
        </Card>
        <Card className="border-black/5 shadow-none bg-gray-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-gray-400">Waitlist Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">{subscribers.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accounts" className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <TabsList className="bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="accounts" className="rounded-md">Account Holders</TabsTrigger>
            <TabsTrigger value="newsletter" className="rounded-md">Newsletter Waitlist</TabsTrigger>
          </TabsList>
          
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-border bg-background h-10 rounded-full" 
            />
          </div>
        </div>

        <TabsContent value="accounts">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                  <TableHead className="font-black uppercase text-[10px] tracking-widest py-4">Queen Detail</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest py-4">Phone</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest py-4">Joined</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest py-4 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-10 text-gray-400">Loading Network...</TableCell></TableRow>
                ) : filteredCustomers.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-10 text-gray-400 uppercase text-xs font-bold tracking-widest">No matching accounts found.</TableCell></TableRow>
                ) : (
                  filteredCustomers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="font-bold text-sm uppercase">{c.full_name || "New Member"}</div>
                        <div className="text-xs text-gray-400 font-medium">{c.email}</div>
                      </TableCell>
                      <TableCell className="text-sm font-medium">{c.phone || "—"}</TableCell>
                      <TableCell className="text-xs text-gray-500 font-bold">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewProfile(c)}
                              className="font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white"
                            >
                              God View
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                            <SheetHeader className="mb-8">
                              <Badge className="w-fit mb-2 uppercase tracking-widest font-black text-[10px] bg-black text-white hover:bg-black">Account Profile</Badge>
                              <SheetTitle className="text-3xl font-black uppercase tracking-tight">{c.full_name || c.email.split('@')[0]}</SheetTitle>
                              <SheetDescription className="text-sm">Comprehensive breakdown of customer data and lifecycle.</SheetDescription>
                            </SheetHeader>

                            <div className="space-y-8">
                              {/* Contact Section */}
                              <section>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center">
                                  <Mail className="w-3 h-3 mr-2" /> Contact & Connectivity
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-[9px] uppercase font-bold text-gray-400 mb-1">Email Address</div>
                                    <div className="text-sm font-bold break-all">{c.email}</div>
                                  </div>
                                  <div>
                                    <div className="text-[9px] uppercase font-bold text-gray-400 mb-1">WhatsApp / Phone</div>
                                    <div className="text-sm font-bold">{c.phone || "Not Provided"}</div>
                                  </div>
                                </div>
                              </section>

                              <Separator />

                              {/* Socials Section */}
                              <section>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center">
                                  <Instagram className="w-3 h-3 mr-2" /> Digital Presence
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-[9px] uppercase font-bold text-gray-400 mb-1">Instagram</div>
                                    {c.instagram_handle ? (
                                      <a href={`https://instagram.com/${c.instagram_handle.replace('@', '')}`} target="_blank" className="text-sm font-bold text-primary flex items-center hover:underline italic">
                                        {c.instagram_handle}
                                      </a>
                                    ) : (
                                      <div className="text-sm text-gray-400">Not Linked</div>
                                    )}
                                  </div>
                                  <div>
                                    <div className="text-[9px] uppercase font-bold text-gray-400 mb-1">TikTok</div>
                                    <div className="text-sm font-bold">{c.tiktok_handle || "Not Linked"}</div>
                                  </div>
                                </div>
                              </section>

                              <Separator />

                              {/* Personal Details */}
                              <section>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center">
                                  <Calendar className="w-3 h-3 mr-2" /> Identity Metrics
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-[9px] uppercase font-bold text-gray-400 mb-1">Birthday</div>
                                    <div className="text-sm font-bold">{c.birthday || "Unset"}</div>
                                  </div>
                                  <div>
                                    <div className="text-[9px] uppercase font-bold text-gray-400 mb-1">Gender Expression</div>
                                    <div className="text-sm font-bold uppercase">{c.gender || "Unset"}</div>
                                  </div>
                                </div>
                              </section>

                              <Separator />

                              {/* Shipping Info */}
                              <section>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center">
                                  <MapPin className="w-3 h-3 mr-2" /> Global Logistics
                                </h4>
                                {c.default_shipping_address ? (
                                  <div className="p-4 bg-gray-50 rounded-lg text-sm font-medium leading-relaxed">
                                    {c.default_shipping_address.street}<br/>
                                    {c.default_shipping_address.city}, {c.default_shipping_address.state} {c.default_shipping_address.zip}<br/>
                                    {c.default_shipping_address.country}
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-400 italic">No primary shipping address on file.</div>
                                )}
                              </section>

                              <Separator />

                              {/* Order Pipeline Section */}
                              <section>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center">
                                  <Package className="w-3 h-3 mr-2" /> Acquisition Record
                                </h4>
                                {ordersLoading ? (
                                  <div className="text-xs animate-pulse text-gray-400 font-bold uppercase tracking-widest">Fetching PIPELINE...</div>
                                ) : orders.length === 0 ? (
                                  <div className="text-sm text-gray-400 italic">No transactional record found.</div>
                                ) : (
                                  <div className="divide-y divide-gray-100 bg-gray-50/50 rounded-lg overflow-hidden border">
                                    {orders.map((o) => (
                                      <div key={o.id} className="p-3 flex justify-between items-center bg-white border-b last:border-0">
                                         <div>
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.1em]">#{o.id.slice(0, 8)}</p>
                                            <p className="text-xs font-bold">${o.total_amount}</p>
                                         </div>
                                         <Badge className="text-[9px] uppercase font-black tracking-widest bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">
                                            {o.status || "paid"}
                                         </Badge>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </section>

                              <Separator />

                              {/* Wishlist Section */}
                              <section>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center">
                                  <Bookmark className="w-3 h-3 mr-2" /> Hearted Collection
                                </h4>
                                {wishlistLoading ? (
                                  <div className="text-xs animate-pulse text-gray-400 font-bold uppercase tracking-widest">Hydrating Wishlist...</div>
                                ) : wishlistProducts.length === 0 ? (
                                  <div className="text-sm text-gray-400 italic">Her closet is currently empty.</div>
                                ) : (
                                  <div className="grid grid-cols-1 gap-2">
                                    {wishlistProducts.map((p) => (
                                      <div key={p.id} className="flex items-center p-2 border border-gray-100 rounded-lg group hover:border-black transition-all">
                                        <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden mr-3">
                                          <NextImage src={p.image_url} alt={p.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                          <div className="text-xs font-black uppercase tracking-tight">{p.name}</div>
                                          <div className="text-[10px] font-bold text-primary">${p.price}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </section>

                              <Separator />

                              {/* Viewed History Section */}
                              <section>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center">
                                  <Eye className="w-3 h-3 mr-2" /> Browsing Journey
                                </h4>
                                {viewedLoading ? (
                                  <div className="text-xs animate-pulse text-gray-400 font-bold uppercase tracking-widest">Hydrating History...</div>
                                ) : viewedProducts.length === 0 ? (
                                  <div className="text-sm text-gray-400 italic">No recent activity recorded.</div>
                                ) : (
                                  <div className="grid grid-cols-1 gap-2">
                                    {viewedProducts.map((p) => (
                                      <div key={p.id} className="flex items-center p-2 border border-gray-100 rounded-lg group hover:border-black transition-all">
                                        <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden mr-3">
                                          <NextImage src={p.image_url} alt={p.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                          <div className="text-xs font-black uppercase tracking-tight">{p.name}</div>
                                          <div className="text-[10px] font-bold text-primary">${p.price}</div>
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
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                  <TableHead className="font-black uppercase text-[10px] tracking-widest py-4">Waitlist Email</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest py-4">Full Name</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest py-4">Target City</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest py-4 text-right">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-10 text-gray-400">Loading Network...</TableCell></TableRow>
                ) : filteredSubscribers.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-10 text-gray-400 uppercase text-xs font-bold tracking-widest">No waitlist signups found.</TableCell></TableRow>
                ) : (
                  filteredSubscribers.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-bold text-sm">{s.email}</TableCell>
                      <TableCell className="text-sm font-medium uppercase">{s.name || "—"}</TableCell>
                      <TableCell className="text-xs font-bold uppercase tracking-widest text-primary">{s.city || "Global"}</TableCell>
                      <TableCell className="text-right text-xs text-gray-400 font-bold">{new Date(s.created_at).toLocaleDateString()}</TableCell>
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
