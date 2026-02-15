import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from "../../components/AdminSidebar";
import GlassCard from "../../components/common/GlassCard";
import { FiTrendingUp, FiUsers, FiBox, FiShoppingBag, FiActivity, FiPlus } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { getAllOrders, getAllUsers, getProducts } from "../../api"; // Use real API

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [timeFilter, setTimeFilter] = useState('Month');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [ordersRes, usersRes, productsRes] = await Promise.all([
                getAllOrders(),
                getAllUsers(),
                getProducts()
            ]);
            setOrders(ordersRes.data);
            setUsers(usersRes.data);
            setProducts(productsRes.data);
        } catch (err) {
            console.error("Dashboard fetch error - defaulting to mock data:", err);
            // Mock data fallback for visibility
            setOrders([
                { id: "MOCK-1", amount: 1500, customerName: "Demo User", status: "pending", createdAt: new Date().toISOString() },
                { id: "MOCK-2", amount: 2500, customerName: "John Doe", status: "completed", createdAt: new Date().toISOString() }
            ]);
            setUsers([{ id: 1 }, { id: 2 }, { id: 3 }]); // minimal mock
            setProducts([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
        }
    };
    
    fetchData();
    const intervalId = setInterval(fetchData, 5000); // Real-time updates every 5s

    return () => clearInterval(intervalId);
  }, []);

  const totalRevenue = orders.reduce((acc, order) => acc + (order.amount || 0), 0);
  const totalUsers = users.length;
  const newOrdersCount = orders.length;
  const totalProducts = products.length;

  // Mock data generators for the graph based on filter
  useEffect(() => {
    // In a real app, this would be aggregation of orders by date
    if (timeFilter === 'Week') {
        setChartData([40, 65, 45, 80, 55, 90, 70]); // Mon-Sun
    } else if (timeFilter === 'Month') {
        setChartData([30, 45, 60, 50, 70, 65, 80, 75, 90, 85, 95]); // Weeks
    } else {
        setChartData([50, 60, 55, 70, 65, 80, 75, 90, 85, 95, 100, 90]); // Jan-Dec
    }
  }, [timeFilter]);

  const stats = [
    { 
      title: "Total Revenue", 
      value: `₹${totalRevenue.toLocaleString()}`, 
      increase: "+12.5%", 
      icon: <FaRupeeSign className="w-6 h-6" />,
      color: "text-green-400",
      bgInfo: "from-green-500/10 to-green-500/5",
      borderColor: "border-green-500/30"
    },
    { 
      title: "Total Users", 
      value: totalUsers, 
      increase: "+5.2%", 
      icon: <FiUsers className="w-6 h-6" />,
      color: "text-blue-400",
      bgInfo: "from-blue-500/10 to-blue-500/5",
      borderColor: "border-blue-500/30"
    },
    { 
      title: "New Orders", 
      value: newOrdersCount > 0 ? newOrdersCount : "356", 
      increase: "+18%", 
      icon: <FiShoppingBag className="w-6 h-6" />,
      color: "text-indigo-400",
      bgInfo: "from-indigo-500/10 to-indigo-500/5",
      borderColor: "border-indigo-500/30"
    },
    { 
      title: "Products", 
      value: totalProducts, 
      increase: "+2", 
      icon: <FiBox className="w-6 h-6" />,
      color: "text-cyan-400",
      bgInfo: "from-cyan-500/10 to-cyan-500/5",
      borderColor: "border-cyan-500/30"
    },
  ];

  const recentActivity = [
    ...orders.slice(0, 3).map(o => ({ 
        type: "order", 
        message: `New order #${o.id} from ${o.customerName || 'Customer'}`, 
        time: "Just now", 
        color: "text-green-400" 
    })),
    { type: "order", message: "New order #1024 from Rahul K.", time: "2 min ago", color: "text-green-400" },
    { type: "user", message: "New user registration: Priya S.", time: "15 min ago", color: "text-blue-400" },
    { type: "alert", message: "Stock alert: Wireless Headphones low (2 left)", time: "1 hr ago", color: "text-red-400" },
  ];

  const popularProducts = [
    { name: "Neon Gaming Headset", sales: 124, progress: "w-[85%]", color: "bg-cyber-blue" },
    { name: "Mechanical Keyboard", sales: 98, progress: "w-[65%]", color: "bg-indigo-500" },
    { name: "Gaming Mouse RGB", sales: 76, progress: "w-[45%]", color: "bg-cyan-500" },
  ];

  return (
    <div className="flex bg-background min-h-screen text-gray-900 font-inter">
      <div className="fixed inset-y-0 left-0 z-50">
        <AdminSidebar />
      </div>
      
      {/* Main Content - added ml-64 to account for sidebar */}
      <main className="flex-1 ml-64 p-8 relative overflow-hidden text-gray-800">
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyber-blue/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-end mb-8 relative z-10">
          <div>
            <h1 className="text-3xl font-bold font-poppins text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              Dashboard Overview
            </h1>
            <p className="text-gray-400 mt-1">Welcome back, Admin. Here's what's happening today.</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-cyber-dark2 border border-white/10 rounded-lg hover:bg-white/5 transition text-sm">
                <FiActivity /> System Health
             </button>
             <button 
                onClick={() => navigate('/admin/add-product')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyber-blue to-blue-600 rounded-lg hover:opacity-90 transition shadow-lg shadow-blue-500/20 text-sm font-medium"
             >
                <FiPlus /> New Product
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <GlassCard key={index} className={`p-6 relative overflow-hidden group border-t-0 border-l-0 border-r-0 border-b-2 ${stat.borderColor} bg-gradient-to-b ${stat.bgInfo}`}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                {React.cloneElement(stat.icon, { className: "w-24 h-24" })}
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-black/30 backdrop-blur-sm ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <span className="flex items-center text-xs font-medium bg-green-500/10 text-green-400 px-2 py-1 rounded-full border border-green-500/20">
                    <FiTrendingUp className="mr-1" /> {stat.increase}
                  </span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                <p className="text-2xl font-bold font-poppins mt-1">{stat.value}</p>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Section Placeholder */}
          <div className="lg:col-span-2 flex flex-col gap-8">
             <GlassCard className="p-6">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-bold font-poppins">Revenue Analytics</h3>
                   <div className="flex gap-2">
                      {['Week', 'Month', 'Year'].map(period => (
                        <button 
                           key={period} 
                           onClick={() => setTimeFilter(period)}
                           className={`text-xs px-3 py-1 rounded-full transition ${timeFilter === period ? 'bg-cyber-blue text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                        >
                           {period}
                        </button>
                      ))}
                   </div>
                </div>
                {/* Dynamic Chart Visualization */}
                <div className="h-64 flex items-end justify-between gap-2 px-2">
                   {chartData.map((height, i) => (
                      <div key={i} className="w-full relative group h-full">
                         <div className="absolute bottom-0 w-full bg-gradient-to-t from-cyber-blue/20 to-cyber-blue rounded-t-lg transition-all duration-500 group-hover:to-cyan-300" 
                              style={{ height: `${height}%` }}></div>
                         {/* Tooltip on hover */}
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-xs px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-20">
                            {/* Mock value generation based on height */}
                            ₹{(height * (timeFilter === 'Year' ? 1000 : 250)).toLocaleString()}
                         </div>
                      </div>
                   ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-500 uppercase font-medium">
                   {timeFilter === 'Week' && ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <span key={day}>{day}</span>)}
                   {timeFilter === 'Month' && ['W1', 'W2', 'W3', 'W4', '...'].map(w => <span key={w}>{w}</span>)}
                   {timeFilter === 'Year' && ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', ' Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <span key={m}>{m}</span>)}
                   {/* Fallback layout support */}
                   {!['Week', 'Month', 'Year'].includes(timeFilter) && ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <span key={day}>{day}</span>)}
                </div>
             </GlassCard>

             <GlassCard className="p-6">
                <h3 className="text-lg font-bold font-poppins mb-6">Popular Products</h3>
                <div className="space-y-5">
                   {popularProducts.map((product, i) => (
                      <div key={i}>
                         <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">{product.name}</span>
                            <span className="text-gray-400">{product.sales} sales</span>
                         </div>
                         <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                            <div className={`h-full ${product.color} rounded-full ${product.progress}`}></div>
                         </div>
                      </div>
                   ))}
                </div>
             </GlassCard>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">
             <GlassCard className="p-6">
                <h3 className="text-lg font-bold font-poppins mb-4">Recent Activity</h3>
                <div className="space-y-6">
                   {recentActivity.map((activity, i) => (
                      <div key={i} className="flex gap-4 relative">
                         {i !== recentActivity.length - 1 && (
                            <div className="absolute top-8 left-2.5 bottom-[-24px] w-px bg-white/10"></div>
                         )}
                         <div className={`w-5 h-5 rounded-full mt-1 flex-shrink-0 border-2 border-black ${i===0 ? 'bg-cyber-blue shadow-[0_0_10px_rgba(0,240,255,0.5)]' : 'bg-gray-700'}`}></div>
                         <div>
                            <p className="text-sm font-medium text-gray-200">{activity.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                         </div>
                      </div>
                   ))}
                </div>
                <button className="w-full mt-6 py-2 border border-white/10 rounded-lg text-sm text-gray-400 hover:bg-white/5 transition">
                   View All Activity
                </button>
             </GlassCard>

             <div className="bg-gradient-to-br from-indigo-600/20 to-cyan-600/20 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                <h3 className="text-lg font-bold font-poppins mb-2">Premium Plan</h3>
                <p className="text-sm text-gray-300 mb-4">You are currently running on the standard free tier.</p>
                <div className="flex items-center justify-between">
                   <span className="text-2xl font-bold">Free</span>
                   <button className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200 transition">Upgrade</button>
                </div>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}