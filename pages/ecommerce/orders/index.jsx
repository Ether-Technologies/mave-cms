import { message } from "antd";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import OrdersTable from "./components/OrdersTable";
import OrderStats from "./components/OrderStats";
import OrderFilters from "./components/OrderFilters";
import OrderBulkActions from "./components/OrderBulkActions";
import OrderPaymentSummary from "./components/OrderPaymentSummary";
import { ordersApi } from "../../../utils/orderApi";
import OrdersTopbar from "./components/orderTopbar";

const OrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("4");
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    paymentStatus: '',
    paymentType: '',
    dateRange: null
  });

  const menuItems = [
    { key: "1", title: "Categories", link: "/ecommerce/categories" },
    { key: "2", title: "Packages", link: "/ecommerce/packages" },
    { key: "3", title: "Customers", link: "/ecommerce/customers" },
    { key: "4", title: "Orders", link: "/ecommerce/orders" },
  ];

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error parsing user:", error);
        message.error("Failed to load user");
      }
    }
  }, []);

  useEffect(() => {
    if (router.pathname === "/ecommerce/orders") {
      setActive("4");
    }
  }, [router.pathname]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersApi.getAll();
      if (response.orders) {
        setOrders(response.orders);
        setFilteredOrders(response.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const applyFilters = () => {
    let filtered = [...orders];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(order => 
        order.transaction_id?.toLowerCase().includes(searchTerm) ||
        order.user?.name?.toLowerCase().includes(searchTerm) ||
        order.user?.email?.toLowerCase().includes(searchTerm) ||
        order.id?.toString().includes(searchTerm) ||
        order.nationality?.toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(order => order.order_status === filters.status);
    }

    // Payment status filter
    if (filters.paymentStatus) {
      filtered = filtered.filter(order => order.payment_status === filters.paymentStatus);
    }

    // Payment type filter
    if (filters.paymentType) {
      filtered = filtered.filter(order => order.payment_type === filters.paymentType);
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange.length === 2) {
      const startDate = filters.dateRange[0].startOf('day');
      const endDate = filters.dateRange[1].endOf('day');
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    setFilteredOrders(filtered);
  };

  const clearFilters = () => {
    setFilteredOrders(orders);
  };

  const handleBulkStatusUpdate = async (selectedOrders, newStatus) => {
    try {
      for (const order of selectedOrders) {
        await ordersApi.updateStatus(order.id, newStatus);
      }
      fetchOrders();
    } catch (error) {
      throw error;
    }
  };

  const handleBulkDelete = async (selectedOrders) => {
    try {
      for (const order of selectedOrders) {
        await ordersApi.delete(order.id);
      }
      fetchOrders();
    } catch (error) {
      throw error;
    }
  };

  const handleExport = (selectedOrders) => {
    // Create CSV content
    const headers = ['Order ID', 'Customer', 'Transaction ID', 'Status', 'Payment Status', 'Amount', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...selectedOrders.map(order => [
        order.id,
        order.user?.name || 'N/A',
        order.transaction_id,
        order.order_status,
        order.payment_status,
        order.payable_amount,
        new Date(order.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, orders]);

  if (!currentUser) return null;

  return (
    <div className="mavecontainer">
      <OrdersTopbar
        menuItems={menuItems}
        active={active}
        setActive={setActive}
      />
      
      <OrderStats orders={orders} />
      
      <OrderPaymentSummary orders={orders} />
      
      <OrderFilters
        filters={filters}
        setFilters={setFilters}
        onFilter={applyFilters}
        onClear={clearFilters}
      />
      
      <OrdersTable
        orders={filteredOrders}
        fetchOrders={fetchOrders}
        currentUser={currentUser}
        loading={loading}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onBulkDelete={handleBulkDelete}
        onExport={handleExport}
      />
    </div>
  );
};

export default OrdersPage;
