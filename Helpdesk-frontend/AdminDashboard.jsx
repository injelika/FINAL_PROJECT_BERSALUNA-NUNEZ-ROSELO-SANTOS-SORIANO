import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { tickets, users, departments } from "../data/mockDB";

const AdminDashboard = () => {
  const { user, updateUser, deleteUser, createTicket, updateTicket, deleteTicket, logout } = useAuth();

  const [currentAdminView, setCurrentAdminView] = useState("tickets"); 
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);
  const [newTicketData, setNewTicketData] = useState({
    title: "",
    description: "",
    severity: "Low",
    departmentId: departments[0]?.id || "", 
    assignedTo: "",
    status: "Open",
  });
  const [editingTicket, setEditingTicket] = useState(null); 
  const [editingUser, setEditingUser] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "", 
    role: "Junior Officer",
    departmentId: departments[0]?.id || "",
  });

  const colors = {
    maroon: "#800000",
    maroonLight: "#b22222",
    maroonLighter: "#f8e6e6",
    textDark: "#4b1c1c",
    statusOpen: { bg: "#d4edda", text: "#155724" },
    statusInProgress: { bg: "#fff3cd", text: "#856404" },
    statusResolved: { bg: "#d1ecf1", text: "#0c5460" },
  };

  const getUserName = (userId) => users.find((u) => u.id === userId)?.name || "N/A";
  const getDepartmentName = (deptId) => departments.find((d) => d.id === deptId)?.name || "N/A";

  // --- Ticket Management Functions ---
  const handleCreateTicket = () => {
    if (!newTicketData.title || !newTicketData.description || !newTicketData.departmentId) {
      alert("Please fill in all required ticket fields.");
      return;
    }
    createTicket(newTicketData);
    setNewTicketData({
      title: "",
      description: "",
      severity: "Low",
      departmentId: departments[0]?.id || "",
      assignedTo: "",
      status: "Open",
    });
    setShowAddTicketModal(false);
  };

  const handleUpdateTicket = (id, field, value) => {
    updateTicket(id, { [field]: value });
  };

  const handleDeleteTicket = (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      deleteTicket(id);
      if (editingTicket?.id === id) setEditingTicket(null); 
    }
  };

  const handleCreateUser = () => {
    if (!newUserData.name || !newUserData.email || !newUserData.password || !newUserData.departmentId || !newUserData.role) {
      alert("Please fill in all required user fields.");
      return;
    }
    const newUserWithId = { ...newUserData, id: `user-${Date.now()}` }; 
    users.push(newUserWithId); 
    alert("User created successfully!");
    setNewUserData({
      name: "",
      email: "",
      password: "",
      role: "Junior Officer",
      departmentId: departments[0]?.id || "",
    });
    setShowAddUserModal(false);
  };

  const handleUpdateUser = (id, field, value) => {

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], [field]: value };
      alert("User updated successfully!");
      setEditingUser(null); 
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      const initialLength = users.length;
      users.splice(users.findIndex(u => u.id === id), 1);
      if (users.length < initialLength) {
        alert("User deleted successfully!");
        if (editingUser?.id === id) setEditingUser(null); 
      } else {
        alert("Failed to delete user.");
      }
    }
  };

  const AdminTicketsView = () => (
    <section className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: colors.maroonLighter }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold" style={{ color: colors.maroon }}>
          Manage Tickets
        </h2>
        <button
          onClick={() => setShowAddTicketModal(true)}
          className="px-6 py-3 rounded-lg text-white font-semibold transition duration-200 hover:opacity-90"
          style={{ backgroundColor: colors.maroon }}
        >
          Add New Ticket
        </button>
      </div>

      {showAddTicketModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md" style={{ color: colors.textDark }}>
            <h3 className="text-2xl font-bold mb-4" style={{ color: colors.maroon }}>
              Create New Ticket
            </h3>
            <input
              type="text"
              placeholder="Title"
              className="w-full p-3 mb-3 border rounded-md"
              value={newTicketData.title}
              onChange={(e) => setNewTicketData({ ...newTicketData, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="w-full p-3 mb-3 border rounded-md"
              rows="3"
              value={newTicketData.description}
              onChange={(e) => setNewTicketData({ ...newTicketData, description: e.target.value })}
            ></textarea>
            <select
              className="w-full p-3 mb-3 border rounded-md"
              value={newTicketData.severity}
              onChange={(e) => setNewTicketData({ ...newTicketData, severity: e.target.value })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            <select
              className="w-full p-3 mb-3 border rounded-md"
              value={newTicketData.departmentId}
              onChange={(e) => setNewTicketData({ ...newTicketData, departmentId: e.target.value })}
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <select
              className="w-full p-3 mb-4 border rounded-md"
              value={newTicketData.assignedTo}
              onChange={(e) => setNewTicketData({ ...newTicketData, assignedTo: e.target.value })}
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddTicketModal(false)}
                className="px-5 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                className="px-5 py-2 rounded-lg text-white font-semibold"
                style={{ backgroundColor: colors.maroon }}
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead style={{ backgroundColor: colors.maroonLight, color: "white" }}>
            <tr>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Severity</th>
              <th className="py-3 px-4 text-left">Department</th>
              <th className="py-3 px-4 text-left">Assigned To</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4" style={{ color: colors.textDark }}>No tickets to display.</td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="border-b last:border-b-0 hover:bg-gray-50" style={{ borderColor: colors.maroonLighter }}>
                  <td className="py-3 px-4" style={{ color: colors.textDark }}>
                    {editingTicket?.id === ticket.id ? (
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={editingTicket.title}
                        onChange={(e) => setEditingTicket({ ...editingTicket, title: e.target.value })}
                      />
                    ) : (
                      ticket.title
                    )}
                  </td>
                  <td className="py-3 px-4" style={{ color: colors.textDark }}>
                    {editingTicket?.id === ticket.id ? (
                      <textarea
                        className="w-full p-2 border rounded"
                        rows="2"
                        value={editingTicket.description}
                        onChange={(e) => setEditingTicket({ ...editingTicket, description: e.target.value })}
                      ></textarea>
                    ) : (
                      ticket.description
                    )}
                  </td>
                  <td className="py-3 px-4" style={{ color: colors.textDark }}>
                    {editingTicket?.id === ticket.id ? (
                      <select
                        className="w-full p-2 border rounded"
                        value={editingTicket.severity}
                        onChange={(e) => setEditingTicket({ ...editingTicket, severity: e.target.value })}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    ) : (
                      ticket.severity
                    )}
                  </td>
                  <td className="py-3 px-4" style={{ color: colors.textDark }}>
                    {editingTicket?.id === ticket.id ? (
                      <select
                        className="w-full p-2 border rounded"
                        value={editingTicket.departmentId}
                        onChange={(e) => setEditingTicket({ ...editingTicket, departmentId: e.target.value })}
                      >
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    ) : (
                      getDepartmentName(ticket.departmentId)
                    )}
                  </td>
                  <td className="py-3 px-4" style={{ color: colors.textDark }}>
                    {editingTicket?.id === ticket.id ? (
                      <select
                        className="w-full p-2 border rounded"
                        value={editingTicket.assignedTo || ""}
                        onChange={(e) => setEditingTicket({ ...editingTicket, assignedTo: e.target.value })}
                      >
                        <option value="">Unassigned</option>
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                    ) : (
                      getUserName(ticket.assignedTo) || "Unassigned"
                    )}
                  </td>
                  <td className="py-3 px-4" style={{ color: colors.textDark }}>
                    {editingTicket?.id === ticket.id ? (
                      <select
                        className="w-full p-2 border rounded"
                        value={editingTicket.status}
                        onChange={(e) => setEditingTicket({ ...editingTicket, status: e.target.value })}
                      >
                        <option value="Open">Open</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold`}
                        style={{
                          backgroundColor: colors[`status${ticket.status.replace(/\s/g, "")}`]?.bg || "#ccc",
                          color: colors[`status${ticket.status.replace(/\s/g, "")}`]?.text || "#666",
                        }}
                      >
                        {ticket.status}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {editingTicket?.id === ticket.id ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            handleUpdateTicket(editingTicket.id, "title", editingTicket.title);
                            handleUpdateTicket(editingTicket.id, "description", editingTicket.description);
                            handleUpdateTicket(editingTicket.id, "severity", editingTicket.severity);
                            handleUpdateTicket(editingTicket.id, "departmentId", editingTicket.departmentId);
                            handleUpdateTicket(editingTicket.id, "assignedTo", editingTicket.assignedTo);
                            handleUpdateTicket(editingTicket.id, "status", editingTicket.status);
                            setEditingTicket(null);
                          }}
                          className="text-green-600 hover:text-green-800"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTicket(null)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => setEditingTicket({ ...ticket })}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTicket(ticket.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const AdminUsersView = () => (
    <section className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: colors.maroonLighter }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold" style={{ color: colors.maroon }}>
          Manage Users
        </h2>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="px-6 py-3 rounded-lg text-white font-semibold transition duration-200 hover:opacity-90"
          style={{ backgroundColor: colors.maroon }}
        >
          Add New User
        </button>
      </div>

      {showAddUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md" style={{ color: colors.textDark }}>
            <h3 className="text-2xl font-bold mb-4" style={{ color: colors.maroon }}>
              Create New User
            </h3>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 mb-3 border rounded-md"
              value={newUserData.name}
              onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-3 border rounded-md"
              value={newUserData.email}
              onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-3 border rounded-md"
              value={newUserData.password}
              onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
            />
            <select
              className="w-full p-3 mb-3 border rounded-md"
              value={newUserData.role}
              onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
            >
              <option value="Admin">Admin</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Junior Officer">Junior Officer</option>
            </select>
            <select
              className="w-full p-3 mb-4 border rounded-md"
              value={newUserData.departmentId}
              onChange={(e) => setNewUserData({ ...newUserData, departmentId: e.target.value })}
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-5 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="px-5 py-2 rounded-lg text-white font-semibold"
                style={{ backgroundColor: colors.maroon }}
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead style={{ backgroundColor: colors.maroonLight, color: "white" }}>
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Department</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4" style={{ color: colors.textDark }}>No users to display.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b last:border-b-0 hover:bg-gray-50" style={{ borderColor: colors.maroonLighter }}>
                  <td className="py-3 px-4" style={{ color: colors.textDark }}>
                    {editingUser?.id === u.id ? (
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      />
                    ) : (
                      u.name
                    )}
                  </td>
                  <td className="py-3 px-4" style={{ color: colors.textDark }}>
                    {editingUser?.id === u.id ? (
                      <input
                        type="email"
                        className="w-full p-2 border rounded"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      />
                    ) : (
                      u.email
                    )}
                  </td>
                  <td className="py-3 px-4" style={{ color: colors.textDark }}>
                    {editingUser?.id === u.id ? (
                      <select
                        className="w-full p-2 border rounded"
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Supervisor">Supervisor</option>
                        <option value="Junior Officer">Junior Officer</option>
                      </select>
                    ) : (
                      u.role
                    )}
                  </td>
                  <td className="py-3 px-4" style={{ color: colors.textDark }}>
                    {editingUser?.id === u.id ? (
                      <select
                        className="w-full p-2 border rounded"
                        value={editingUser.departmentId}
                        onChange={(e) => setEditingUser({ ...editingUser, departmentId: e.target.value })}
                      >
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    ) : (
                      getDepartmentName(u.departmentId)
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {editingUser?.id === u.id ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            handleUpdateUser(editingUser.id, "name", editingUser.name);
                            handleUpdateUser(editingUser.id, "email", editingUser.email);
                            handleUpdateUser(editingUser.id, "role", editingUser.role);
                            handleUpdateUser(editingUser.id, "departmentId", editingUser.departmentId);
                            setEditingUser(null);
                          }}
                          className="text-green-600 hover:text-green-800"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => setEditingUser({ ...u })}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        {user.id !== u.id && ( 
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const Profile = () => (
    <section
      className="rounded-2xl p-6 shadow-lg max-w-2xl mx-auto my-8"
      style={{ backgroundColor: colors.maroonLighter, color: colors.textDark }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: colors.maroon }}>
        My Profile
      </h2>
      <div className="space-y-4 text-lg">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email || "user@example.com"}</p>
        <p><strong>Department:</strong> {getDepartmentName(user.departmentId)}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </section>
  );

  return (
    <div className="flex h-screen font-sans bg-gray-100">
      <nav
        className="flex flex-col p-4 text-white w-64 transition-all duration-300 shadow-xl z-10"
        style={{ backgroundColor: colors.maroon }}
      >
        <h1 className="text-3xl font-bold mb-8 text-center">Admin Panel</h1>
        <ul className="flex flex-col gap-4 flex-grow">
          <li>
            <button
              onClick={() => setCurrentAdminView("tickets")}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                currentAdminView === "tickets" ? "bg-white text-maroon shadow-md" : "hover:bg-maroonLight"
              }`}
              style={{ color: currentAdminView === "tickets" ? colors.maroon : "white" }}
            >
              <i className="fas fa-ticket-alt"></i> Manage Tickets
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentAdminView("users")}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                currentAdminView === "users" ? "bg-white text-maroon shadow-md" : "hover:bg-maroonLight"
              }`}
              style={{ color: currentAdminView === "users" ? colors.maroon : "white" }}
            >
              <i className="fas fa-users"></i> Manage Users
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentAdminView("profile")}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                currentAdminView === "profile" ? "bg-white text-maroon shadow-md" : "hover:bg-maroonLight"
              }`}
              style={{ color: currentAdminView === "profile" ? colors.maroon : "white" }}
            >
              <i className="fas fa-user-circle"></i> Profile
            </button>
          </li>
          <li className="mt-auto">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 hover:bg-maroonLight"
              style={{ color: "white" }}
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </li>
        </ul>
      </nav>

      <main className="flex-1 p-8 overflow-auto">
        {currentAdminView === "tickets" && <AdminTicketsView />}
        {currentAdminView === "users" && <AdminUsersView />}
        {currentAdminView === "profile" && <Profile />}
      </main>
    </div>
  );
};

export default AdminDashboard;