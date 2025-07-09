import './AdminDashboard.css';
import './../../../components/dashboard/DashboardLayout'  // Only if you need it

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="dashboard-cards">
        <div className="admin-card">
          <h3>Total Users</h3>
          <p>1,230</p>
        </div>
        <div className="admin-card">
          <h3>Total Orders</h3>
          <p>540</p>
        </div>
        <div className="admin-card">
          <h3>Revenue</h3>
          <p>AED 24,320</p>
        </div>
        <div className="admin-card">
          <h3>Pending Orders</h3>
          <p>12</p>
        </div>
      </div>

      <div className="dashboard-widgets">
        <div className="widget">
          <h2>Recent Users</h2>
          <ul>
            <li>Fatima - fatima@example.com</li>
            <li>Ahmed - ahmed@example.com</li>
            <li>Layla - layla@example.com</li>
          </ul>
        </div>

        <div className="widget">
          <h2>Recent Orders</h2>
          <ul>
            <li>#1234 - AED 150 - Paid</li>
            <li>#1233 - AED 75 - COD</li>
            <li>#1232 - AED 200 - Paid</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
