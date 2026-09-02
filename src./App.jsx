import React, { useState, useMemo } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import HeaderStats from './components/layout/HeaderStats';
import OrdersModule from './components/orders/OrdersModule';
import DriversModule from './components/drivers/DriversModule';
import BuySellModule from './components/buysell/BuySellModule';
import FinanceModule from './components/finance/FinanceModule';
import NotificationsModule from './components/notifications/NotificationsModule';
import NotificationDrawer from './components/notifications/NotificationDrawer';
import Toast from './components/common/Toast';

import {
  INITIAL_ORDERS,
  INITIAL_DRIVERS_PENDING,
  INITIAL_DRIVERS_VERIFIED,
  INITIAL_BUY_SELL_PENDING,
  INITIAL_BUY_SELL_LIVE,
  INITIAL_FINANCE_INSURANCE,
  INITIAL_NOTIFICATIONS
} from './mockData/staffMockData';

export default function App() {
  // Navigation State
  const [activeModule, setActiveModule] = useState('orders'); // orders | drivers | buysell | finance | notifications
  const [ordersDefaultTab, setOrdersDefaultTab] = useState('waiting');
  const [driversDefaultTab, setDriversDefaultTab] = useState('pending');
  const [buysellDefaultTab, setBuysellDefaultTab] = useState('pending');

  // UI Drawers & Toasts
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Domain State
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [pendingDrivers, setPendingDrivers] = useState(INITIAL_DRIVERS_PENDING);
  const [verifiedDrivers, setVerifiedDrivers] = useState(INITIAL_DRIVERS_VERIFIED);
  const [pendingListings, setPendingListings] = useState(INITIAL_BUY_SELL_PENDING);
  const [liveListings, setLiveListings] = useState(INITIAL_BUY_SELL_LIVE);
  const [enquiries, setEnquiries] = useState(INITIAL_FINANCE_INSURANCE);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Helper Toast Trigger
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // ==========================================
  // ORDERS MODULE ACTIONS
  // ==========================================
  const handleAcceptOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, status: 'accepted', statusBadge: 'Awaiting Driver' }
          : ord
      )
    );
    showToast(`Order ${orderId} accepted! Moved to Accepted Orders tab.`, 'success');
  };

  const handleRejectOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, status: 'rejected', statusBadge: 'Rejected' }
          : ord
      )
    );
    showToast(`Order ${orderId} rejected with confirmation.`, 'error');
  };

  const handleSimulateDriverAccept = (orderId) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'driver_accepted',
              statusBadge: 'Accepted',
              driverName: 'Mahesh Yadav',
              driverPhone: '+91 98480 11223',
              driverVehicle: 'TS 09 EU 4812 (Container 14ft)'
            }
          : ord
      )
    );
    showToast(`Driver Mahesh Yadav accepted Order ${orderId}! Moved to Driver Accepted tab.`, 'success');
  };

  const handleSendMessageOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, status: 'on_the_way', statusBadge: 'To Be Delivered' }
          : ord
      )
    );
    showToast(`Confirmation SMS dispatched to Customer & Driver! Order ${orderId} is now On The Way.`, 'success');
  };

  const handleMarkDeliveredOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { 
              ...ord, 
              status: 'delivered', 
              statusBadge: 'Delivered', 
              completedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
            }
          : ord
      )
    );
    showToast(`Order ${orderId} marked as Delivered! Saved to History log.`, 'success');
  };

  // ==========================================
  // DRIVERS MODULE ACTIONS
  // ==========================================
  const handleApproveDriver = (driverId) => {
    const target = pendingDrivers.find((d) => d.id === driverId);
    if (!target) return;

    setPendingDrivers((prev) => prev.filter((d) => d.id !== driverId));
    setVerifiedDrivers((prev) => [
      {
        id: target.id,
        name: target.name,
        phone: target.phone,
        vehicleType: target.vehicleType,
        vehicleNumber: target.vehicleNumber,
        experienceYears: target.experienceYears,
        status: 'Active',
        currentOrder: 'None (Available)',
        rating: 5.0,
        tripsCompleted: 0
      },
      ...prev
    ]);
    showToast(`Driver ${target.name} approved & verified! Driver can now log in and take orders.`, 'success');
  };

  const handleRejectDriver = (driverId) => {
    const target = pendingDrivers.find((d) => d.id === driverId);
    setPendingDrivers((prev) => prev.filter((d) => d.id !== driverId));
    showToast(`Driver registration profile for ${target?.name || driverId} rejected.`, 'error');
  };

  const handleToggleDriverStatus = (driverId) => {
    setVerifiedDrivers((prev) =>
      prev.map((drv) =>
        drv.id === driverId
          ? { ...drv, status: drv.status === 'Active' ? 'Inactive' : 'Active' }
          : drv
      )
    );
    showToast(`Driver status updated successfully.`, 'info');
  };

  // ==========================================
  // BUY & SELL MODULE ACTIONS
  // ==========================================
  const handleApproveListing = (listingId) => {
    const target = pendingListings.find((l) => l.id === listingId);
    if (!target) return;

    setPendingListings((prev) => prev.filter((l) => l.id !== listingId));
    setLiveListings((prev) => [
      {
        ...target,
        status: 'live',
        publishedAt: 'Just Now',
        interestedBuyers: [
          { id: 'B-NEW', name: 'Rajesh Naidu', phone: '+91 98490 77889', requestedDate: 'Just Now' }
        ]
      },
      ...prev
    ]);
    showToast(`Listing ${target.makeModel} approved and published live to marketplace!`, 'success');
  };

  const handleRejectListing = (listingId) => {
    const target = pendingListings.find((l) => l.id === listingId);
    setPendingListings((prev) => prev.filter((l) => l.id !== listingId));
    showToast(`Listing submission for ${target?.makeModel || listingId} rejected.`, 'error');
  };

  // ==========================================
  // FINANCE & INSURANCE ACTIONS
  // ==========================================
  const handleToggleContactedStatus = (enquiryId) => {
    setEnquiries((prev) =>
      prev.map((enq) =>
        enq.id === enquiryId
          ? { ...enq, status: enq.status === 'contacted' ? 'pending' : 'contacted' }
          : enq
      )
    );
    showToast(`Lead status updated.`, 'info');
  };

  // ==========================================
  // NOTIFICATIONS ACTIONS
  // ==========================================
  const handleMarkAsRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, unread: false } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast(`All notifications marked as read.`, 'info');
  };

  const handleNavigateToTab = (moduleName, tabName) => {
    setActiveModule(moduleName);
    if (moduleName === 'orders' && tabName) setOrdersDefaultTab(tabName);
    if (moduleName === 'drivers' && tabName) setDriversDefaultTab(tabName);
    if (moduleName === 'buysell' && tabName) setBuysellDefaultTab(tabName);
  };

  // ==========================================
  // GLOBAL SEARCH RESULTS COMPUTATION
  // ==========================================
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results = [];

    // Search Orders
    orders.forEach((o) => {
      if (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.goodsType.toLowerCase().includes(q)
      ) {
        results.push({
          id: o.id,
          type: 'order',
          title: `${o.id}: ${o.customerName} (${o.goodsType})`,
          subtitle: `${o.fromLocation.split(',')[0]} → ${o.toLocation.split(',')[0]}`,
          tag: `Order: ${o.statusBadge}`,
          targetModule: 'orders',
          targetTab: o.status === 'waiting' ? 'waiting' : o.status === 'accepted' ? 'accepted' : o.status === 'driver_accepted' ? 'driver_accepted' : o.status === 'on_the_way' ? 'on_the_way' : 'delivered'
        });
      }
    });

    // Search Drivers
    pendingDrivers.forEach((d) => {
      if (d.name.toLowerCase().includes(q) || d.phone.includes(q) || d.vehicleNumber.toLowerCase().includes(q)) {
        results.push({
          id: d.id,
          type: 'driver',
          title: `Pending Driver: ${d.name}`,
          subtitle: `${d.vehicleType} (${d.vehicleNumber})`,
          tag: 'Driver Pending',
          targetModule: 'drivers',
          targetTab: 'pending'
        });
      }
    });

    verifiedDrivers.forEach((d) => {
      if (d.name.toLowerCase().includes(q) || d.phone.includes(q) || d.vehicleNumber.toLowerCase().includes(q)) {
        results.push({
          id: d.id,
          type: 'driver',
          title: `Verified Driver: ${d.name}`,
          subtitle: `${d.vehicleType} (${d.vehicleNumber})`,
          tag: `Driver: ${d.status}`,
          targetModule: 'drivers',
          targetTab: 'verified'
        });
      }
    });

    // Search Buy & Sell
    pendingListings.concat(liveListings).forEach((l) => {
      if (l.makeModel.toLowerCase().includes(q) || l.sellerName.toLowerCase().includes(q) || l.rcNumber.toLowerCase().includes(q)) {
        results.push({
          id: l.id,
          type: 'buysell',
          title: `Vehicle: ${l.makeModel}`,
          subtitle: `Seller: ${l.sellerName} (${l.price})`,
          tag: `Listing: ${l.status}`,
          targetModule: 'buysell',
          targetTab: l.status === 'pending' ? 'pending' : 'live'
        });
      }
    });

    return results.slice(0, 8);
  }, [searchQuery, orders, pendingDrivers, verifiedDrivers, pendingListings, liveListings]);

  const handleSelectSearchResult = (item) => {
    handleNavigateToTab(item.targetModule, item.targetTab);
    setSearchQuery('');
  };

  // Badge Counts
  const counts = {
    waitingOrders: orders.filter((o) => o.status === 'waiting').length,
    pendingDrivers: pendingDrivers.length,
    pendingListings: pendingListings.length,
    pendingFinance: enquiries.filter((e) => e.status === 'pending').length,
    unreadNotifs: notifications.filter((n) => n.unread).length
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        counts={counts}
      />

      {/* Main Content Area */}
      <div className="md:pl-20 lg:pl-64 flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        {/* Top Bar */}
        <TopBar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          unreadCount={counts.unreadNotifs}
          onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          onSelectSearchResult={handleSelectSearchResult}
        />

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          
          {/* Top Operational Stats */}
          <HeaderStats counts={counts} onNavigateTab={handleNavigateToTab} />

          {/* Module Router */}
          {activeModule === 'orders' && (
            <OrdersModule
              orders={orders}
              onAcceptOrder={handleAcceptOrder}
              onRejectOrder={handleRejectOrder}
              onSimulateDriverAccept={handleSimulateDriverAccept}
              onSendMessageOrder={handleSendMessageOrder}
              onMarkDeliveredOrder={handleMarkDeliveredOrder}
              defaultTab={ordersDefaultTab}
            />
          )}

          {activeModule === 'drivers' && (
            <DriversModule
              pendingDrivers={pendingDrivers}
              verifiedDrivers={verifiedDrivers}
              onApproveDriver={handleApproveDriver}
              onRejectDriver={handleRejectDriver}
              onToggleDriverStatus={handleToggleDriverStatus}
              defaultTab={driversDefaultTab}
            />
          )}

          {activeModule === 'buysell' && (
            <BuySellModule
              pendingListings={pendingListings}
              liveListings={liveListings}
              onApproveListing={handleApproveListing}
              onRejectListing={handleRejectListing}
              defaultTab={buysellDefaultTab}
            />
          )}

          {activeModule === 'finance' && (
            <FinanceModule
              enquiries={enquiries}
              onToggleContactedStatus={handleToggleContactedStatus}
            />
          )}

          {activeModule === 'notifications' && (
            <NotificationsModule
              notifications={notifications}
              onNavigateToTab={handleNavigateToTab}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          )}

        </main>
      </div>

      {/* Sliding Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onNavigateToTab={handleNavigateToTab}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      {/* Snackbar Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}