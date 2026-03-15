import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, TrendingUp, Clock, CheckCircle2, AlertCircle, Eye, RefreshCw, FileText, User, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { API_BASE_URL } from '@/lib/config';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Order {
  _id: string;
  user: {
    fullName: string;
    username: string;
    email: string;
  };
  products: Array<{
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  totalAmount: number;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentDetails: {
    transactionId: string;
    screenshot: string;
  };
  paymentStatus: 'pending' | 'verified' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

interface OrdersDashboardModalProps {
  shopId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrdersDashboardModal({ shopId, isOpen, onClose }: OrdersDashboardModalProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/orders/shop/${shopId}`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/orders/shop/${shopId}/stats`, { credentials: 'include' })
      ]);

      if (ordersRes.ok && statsRes.ok) {
        const ordersData = await ordersRes.json();
        const statsData = await statsRes.json();
        setOrders(ordersData.orders);
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && shopId) {
      fetchData();
    }
  }, [isOpen, shopId]);

  const updateStatus = async (orderId: string, statusType: 'orderStatus' | 'paymentStatus', value: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [statusType]: value }),
        credentials: 'include'
      });

      if (res.ok) {
        toast({ title: "Updated", description: "Status has been updated successfully." });
        fetchData();
        if (selectedOrder && selectedOrder._id === orderId) {
            setSelectedOrder(prev => prev ? { ...prev, [statusType]: value } : null);
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'verified':
      case 'delivered': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'failed':
      case 'cancelled': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'shipped': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full h-full bg-background shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-8 border-b bg-primary/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Shop Dashboard</h2>
                <p className="text-muted-foreground font-medium">Manage your orders and view analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={fetchData} className="rounded-full h-12 w-12 hover:rotate-180 transition-transform duration-500">
                <RefreshCw className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-12 w-12 hover:bg-red-500/10 hover:text-red-500 transition-colors">
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Stats & Tabs */}
            <div className="w-80 border-r bg-muted/10 p-6 flex flex-col gap-6">
              {stats && (
                <div className="space-y-4">
                  <Card className="rounded-2xl border-none bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between opacity-80 mb-2">
                        <p className="text-xs font-bold uppercase tracking-widest">Total Revenue</p>
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <p className="text-2xl font-bold">PKR {stats.totalRevenue.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background p-4 rounded-2xl border flex flex-col items-center text-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total Orders</p>
                      <p className="text-xl font-bold">{stats.orderCount}</p>
                    </div>
                    <div className="bg-background p-4 rounded-2xl border flex flex-col items-center text-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Pending</p>
                      <p className="text-xl font-bold text-yellow-500">{stats.pendingOrders}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-1 flex flex-col gap-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2 mb-1">Management</p>
                <Button variant="secondary" className="justify-start gap-3 rounded-xl h-12 font-bold bg-primary/10 text-primary border-primary/20">
                  <ShoppingBag className="h-5 w-5" /> All Orders
                </Button>
                {/* Future extensions like Products, Analytics tabs can go here */}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 gap-4">
                  <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-muted-foreground font-medium animate-pulse">Fetching your orders...</p>
                </div>
              ) : (
                <div className="flex-1 flex overflow-hidden">
                  {/* Order List */}
                  <div className="w-1/2 border-r flex flex-col">
                    <div className="p-4 border-b bg-muted/5 flex items-center justify-between">
                      <p className="font-bold">Recent Orders</p>
                      <Badge variant="outline" className="rounded-lg">{orders.length} Total</Badge>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-3">
                        {orders.map((order) => (
                          <motion.div
                            key={order._id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedOrder(order)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                              selectedOrder?._id === order._id 
                                ? 'bg-primary/5 border-primary ring-1 ring-primary/20 shadow-md' 
                                : 'bg-background hover:bg-muted/30 border-border/50'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-bold text-sm uppercase tracking-tight">#{order._id.slice(-6)}</p>
                                <p className="font-bold text-lg">{order.personalInfo.fullName}</p>
                              </div>
                              <Badge className={`rounded-xl border ${getStatusColor(order.orderStatus)}`}>
                                {order.orderStatus}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-end">
                              <p className="text-xs text-muted-foreground">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                              <p className="font-bold text-primary">PKR {order.totalAmount.toLocaleString()}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Order Details View */}
                  <div className="w-1/2 bg-muted/5 flex flex-col">
                    {selectedOrder ? (
                      <ScrollArea className="flex-1 p-8">
                        <div className="space-y-8">
                          <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold">Order Details</h3>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="rounded-xl h-10 gap-2 border-2">
                                    <FileText className="h-4 w-4" /> Invoice
                                </Button>
                            </div>
                          </div>

                          {/* Customer Info */}
                          <div className="grid grid-cols-1 gap-4">
                             <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
                               <CardHeader className="bg-primary/5 pb-4">
                                 <CardTitle className="text-sm font-bold flex items-center gap-2">
                                   <User className="h-4 w-4" /> Customer Information
                                 </CardTitle>
                               </CardHeader>
                               <CardContent className="p-4 space-y-3">
                                 <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Name</span>
                                    <span className="font-bold text-sm">{selectedOrder.personalInfo.fullName}</span>
                                 </div>
                                 <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Email</span>
                                    <span className="font-bold text-sm">{selectedOrder.personalInfo.email}</span>
                                 </div>
                                 <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Phone</span>
                                    <span className="font-bold text-sm text-primary flex items-center gap-1">
                                        <Phone className="h-3 w-3" /> {selectedOrder.personalInfo.phone}
                                    </span>
                                 </div>
                               </CardContent>
                             </Card>

                             <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
                               <CardHeader className="bg-primary/5 pb-4">
                                 <CardTitle className="text-sm font-bold flex items-center gap-2">
                                   <MapPin className="h-4 w-4" /> Shipping Address
                                 </CardTitle>
                               </CardHeader>
                               <CardContent className="p-4">
                                  <p className="text-sm font-medium leading-relaxed">
                                    {selectedOrder.address.street}<br />
                                    {selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.zipCode}
                                  </p>
                               </CardContent>
                             </Card>
                          </div>

                          {/* Order Items */}
                          <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Items Summary</p>
                            <div className="space-y-3">
                                {selectedOrder.products.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 bg-background p-3 rounded-2xl border border-border/50">
                                        <img src={item.image} className="h-14 w-14 rounded-xl object-cover" alt={item.name} />
                                        <div className="flex-1">
                                            <p className="font-bold text-sm">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-primary text-sm">PKR {item.price.toLocaleString()}</p>
                                    </div>
                                ))}
                                <div className="pt-2 flex justify-between items-center border-t border-dashed mt-4">
                                    <span className="font-bold">Total Payable</span>
                                    <span className="text-xl font-bold text-primary font-mono">PKR {selectedOrder.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                          </div>

                          {/* Payment Verification */}
                          <div className="space-y-4">
                             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Payment Verification</p>
                             <div className="bg-background rounded-2xl border border-border/50 overflow-hidden">
                                <div className="p-4 border-b flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-xs text-muted-foreground">Transaction ID</p>
                                        <p className="font-mono font-bold text-primary">{selectedOrder.paymentDetails.transactionId}</p>
                                    </div>
                                    <Badge className={`rounded-xl border ${getStatusColor(selectedOrder.paymentStatus)}`}>
                                        {selectedOrder.paymentStatus.toUpperCase()}
                                    </Badge>
                                </div>
                                <div className="p-2 aspect-video bg-muted/30">
                                    {selectedOrder.paymentDetails.screenshot ? (
                                        <div className="group relative h-full w-full rounded-xl overflow-hidden cursor-zoom-in">
                                             <img src={selectedOrder.paymentDetails.screenshot} className="h-full w-full object-contain" alt="Payment Proof" />
                                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                                <Button size="sm" variant="secondary" className="rounded-full gap-2 shadow-2xl" onClick={() => window.open(selectedOrder.paymentDetails.screenshot, '_blank')}>
                                                    <Eye className="h-4 w-4" /> View Full Image
                                                </Button>
                                             </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center opacity-30">
                                            <AlertCircle className="h-12 w-12 mb-2" />
                                            <p className="text-sm font-bold">No Screenshot Provided</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex gap-2">
                                    <Button 
                                        onClick={() => updateStatus(selectedOrder._id, 'paymentStatus', 'verified')} 
                                        disabled={selectedOrder.paymentStatus === 'verified'}
                                        className="flex-1 bg-green-500 hover:bg-green-600 rounded-xl font-bold h-11"
                                    >
                                        Verify Payment
                                    </Button>
                                    <Button 
                                        onClick={() => updateStatus(selectedOrder._id, 'paymentStatus', 'failed')} 
                                        variant="destructive"
                                        disabled={selectedOrder.paymentStatus === 'failed'}
                                        className="rounded-xl font-bold h-11"
                                    >
                                        Reject
                                    </Button>
                                </div>
                             </div>
                          </div>

                          {/* Order Status Management */}
                          <div className="space-y-4 pb-12">
                             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Update Order Status</p>
                             <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                    <Button
                                        key={status}
                                        variant={selectedOrder.orderStatus === status ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => updateStatus(selectedOrder._id, 'orderStatus', status)}
                                        className={`rounded-xl font-bold capitalize transition-all duration-300 ${
                                            selectedOrder.orderStatus === status 
                                                ? 'shadow-lg shadow-primary/20 scale-105' 
                                                : 'hover:bg-primary/5 hover:border-primary/40'
                                        }`}
                                    >
                                        {status}
                                    </Button>
                                ))}
                             </div>
                          </div>
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30 select-none">
                        <div className="h-24 w-24 rounded-full border-4 border-dashed border-muted-foreground flex items-center justify-center mb-6">
                            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <p className="text-xl font-bold mb-2">No Order Selected</p>
                        <p className="text-sm font-medium w-64">Select an order from the list on the left to view full details and manage status.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
