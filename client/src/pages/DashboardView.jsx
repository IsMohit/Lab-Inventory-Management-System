import { 
  Package, 
  AlertTriangle, 
  Clock, 
  Calendar,
  MapPin,
  DollarSign,
  Activity,
  Zap,
  Globe,
  Target,
  Layers
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip,ResponsiveContainer,  PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

  // Enhanced Dashboard View
const DashboardView = ({ user, dashboardMetrics, components, pieColors, enhancedChartData }) => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[1]}!</h2>
            <p className="text-indigo-100 text-lg mb-6">Here's what's happening in your laboratory today</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-300" />
                <span className="text-sm font-medium">System Status: Operational</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-300" />
                <span className="text-sm font-medium">Last Sync: 2 min ago</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="h-24 w-24 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Zap className="h-12 w-12 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Components",
            value: dashboardMetrics.totalComponents.toLocaleString(),
            change: "+12% from last month",
            icon: Package,
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-50",
            textColor: "text-blue-700"
          },
          {
            title: "Inventory Value",
            value: `₹${(dashboardMetrics.totalValue / 1000).toFixed(1)}K`,
            change: `Avg: ₹${dashboardMetrics.averageValue.toFixed(0)} per item`,
            icon: DollarSign,
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-50",
            textColor: "text-green-700"
          },
          {
            title: "Low Stock Alerts",
            value: dashboardMetrics.lowStockCount,
            change: `${dashboardMetrics.criticalStockCount} critical`,
            icon: AlertTriangle,
            color: "from-yellow-500 to-orange-500",
            bgColor: "bg-yellow-50",
            textColor: "text-yellow-700"
          },
          {
            title: "Active Suppliers",
            value: dashboardMetrics.activeSuppliers,
            change: "Across all categories",
            icon: Globe,
            color: "from-purple-500 to-indigo-500",
            bgColor: "bg-purple-50",
            textColor: "text-purple-700"
          }
        ].map((metric, index) => (
          <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-2">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1 group-hover:scale-105 transition-transform duration-200">
                  {metric.value}
                </p>
                <p className={`text-sm ${metric.textColor} font-medium`}>{metric.change}</p>
              </div>
              <div className={`p-4 ${metric.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                <metric.icon className={`h-8 w-8 ${metric.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Monthly Trends */}
        <div className="xl:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Inventory Movement Trends</h3>
              <p className="text-gray-500">Monthly inward and outward component flow</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <span className="text-sm text-gray-600 font-medium">Inwarded</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-gray-600 font-medium">Outwarded</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={enhancedChartData}>
              <defs>
                <linearGradient id="colorInwarded" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorOutwarded" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="inwarded"
                stroke="#6366f1"
                strokeWidth={3}
                fill="url(#colorInwarded)"
              />
              <Area
                type="monotone"
                dataKey="outwarded"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#colorOutwarded)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Category Distribution</h3>
            <p className="text-gray-500">Component breakdown by type</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={dashboardMetrics.categoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {dashboardMetrics.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-3">
            {dashboardMetrics.categoryDistribution.slice(0, 4).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: pieColors[index % pieColors.length] }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Critical Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Critical Stock Alerts</h3>
                <p className="text-gray-600">Components requiring immediate attention</p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              {components.filter(comp => comp.quantity <= comp.criticalLowThreshold).length === 0 ? (
                <div className="text-center py-8">
                  <Target className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">All stock levels are healthy</p>
                  <p className="text-sm text-gray-400">No critical alerts at this time</p>
                </div>
              ) : (
                components.filter(comp => comp.quantity <= comp.criticalLowThreshold).slice(0, 5).map(comp => (
                  <div key={comp.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${comp.quantity === 0 ? 'bg-red-100' : 'bg-yellow-100'}`}>
                        <Package className={`h-5 w-5 ${comp.quantity === 0 ? 'text-red-600' : 'text-yellow-600'}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{comp.name}</p>
                        <p className="text-sm text-gray-600">{comp.partNumber}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{comp.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${comp.quantity === 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                        {comp.quantity}
                      </div>
                      <div className="text-xs text-gray-500">Min: {comp.criticalLowThreshold}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                        comp.quantity === 0 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {comp.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Old Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Inactive Inventory</h3>
                <p className="text-gray-600">Components inactive for 3+ months</p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              {components.filter(comp => {
                const lastUpdated = new Date(comp.lastUpdated);
                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                return lastUpdated < threeMonthsAgo;
              }).length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">All inventory is active</p>
                  <p className="text-sm text-gray-400">No stagnant stock detected</p>
                </div>
              ) : (
                components.filter(comp => {
                  const lastUpdated = new Date(comp.lastUpdated);
                  const threeMonthsAgo = new Date();
                  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                  return lastUpdated < threeMonthsAgo;
                }).slice(0, 5).map(comp => (
                  <div key={comp.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Layers className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{comp.name}</p>
                        <p className="text-sm text-gray-600">{comp.partNumber}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">Last updated: {comp.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{comp.quantity}</div>
                      <div className="text-xs text-gray-500">units</div>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 bg-blue-100 text-blue-800">
                        Inactive
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  export default DashboardView;