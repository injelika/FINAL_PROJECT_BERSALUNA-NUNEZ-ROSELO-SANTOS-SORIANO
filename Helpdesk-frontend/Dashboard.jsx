import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import '../index.css';
import { tickets, users, departments, remarks } from "../data/mockDB";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const {
    user,
    updateTicket,
    addRemark,
    logout,
    tickets: authTickets,
    users: authUsers,
    remarks: authRemarks, 
    createTicket,
    removeTicket,
    createUser,
    modifyUser,
    removeUser
  } = useAuth();

  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [remarkText, setRemarkText] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState("dashboard");

  // Use the state-managed data from AuthContext
  const currentTickets = authTickets || tickets;
  const currentUsers = authUsers || users;
  const currentRemarks = authRemarks || remarks;

  // Debug logging to check remarks data
  console.log("Current Remarks:", currentRemarks);
  console.log("Selected Ticket ID:", selectedTicketId);

  // Filtering visible tickets based on user role and department
  const visibleTickets = user.role === "Admin"
    ? currentTickets
    : currentTickets.filter(
        (t) =>
          t.departmentId === user.departmentId ||
          (t.severity === "Critical" &&
            (t.assignedTo === user.id || user.role === "Supervisor"))
      );

  const severityData = ["Low", "Medium", "High", "Critical"].map((level) => ({
    name: level,
    count: visibleTickets.filter((t) => t.severity === level).length,
  }));

  const getUserName = (userId) => {
    const foundUser = currentUsers.find((u) => u.id === userId);
    console.log("Looking for user:", userId, "Found:", foundUser);
    return foundUser?.name || "N/A";
  };
  
  const getDepartmentName = (deptId) =>
    departments.find((d) => d.id === deptId)?.name || "N/A";

  const canActOnTicket = (ticket) => {
    if (user.role === "Admin") return true;
    if (ticket.severity === "Critical") {
      if (user.role === "Supervisor") return true;
      if (ticket.assignedTo === user.id) return true;
      if (user.role === "Junior Officer") return false;
    }
    if (user.role === "Junior Officer") {
      if (ticket.severity !== "Critical") return true;
      if (ticket.assignedTo === user.id) return true;
      return false;
    }
    return ticket.departmentId === user.departmentId;
  };

  const handleTicketUpdate = (ticketId, field, value) => {
    const ticket = currentTickets.find((t) => t.id === ticketId);

    if (user.role !== "Admin") {
      if (
        field === "status" &&
        ticket.severity === "Critical" &&
        user.role === "Junior Officer" &&
        user.id !== ticket.assignedTo
      ) {
        alert("You can't change the status of a Critical ticket unless it's assigned to you.");
        return;
      }

      if (field === "assignedTo" && user.role !== "Supervisor") {
        alert("Only Supervisors can assign tickets.");
        return;
      }

      if (field === "departmentId" && user.role !== "Supervisor") {
        alert("Only Supervisors can delegate tickets to other departments.");
        return;
      }
    }

    updateTicket(ticketId, { [field]: value });
  };

  const handleAddRemark = () => {
    if (!remarkText.trim()) {
      alert("Remark cannot be empty.");
      return;
    }
    if (!selectedTicketId) {
      alert("Please select a ticket to add a remark.");
      return;
    }
    
    console.log("Adding remark:", remarkText, "to ticket:", selectedTicketId);
    addRemark(selectedTicketId, user.id, remarkText.trim());
    setRemarkText("");
  };

  const getRemarksForTicket = (ticketId) => {
    const ticketRemarks = currentRemarks
      .filter((r) => r.ticketId === ticketId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by newest first
      .map((r) => ({
        ...r,
        userName: getUserName(r.userId),
      }));
    
    console.log("Remarks for ticket", ticketId, ":", ticketRemarks);
    return ticketRemarks;
  };

  const formatDateTime = (timestamp) => {
    try {
      let date;
      if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      } else if (typeof timestamp === 'number') {
        date = new Date(timestamp);
      } else {
        console.log("Invalid timestamp format:", timestamp);
        return "Invalid Date";
      }
      
      if (isNaN(date.getTime())) {
        console.log("Cannot parse timestamp:", timestamp);
        return "Invalid Date";
      }
      
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error("Error formatting date:", error, timestamp);
      return "Invalid Date";
    }
  };

  const colors = {
    maroon: "#800000",
    maroonLight: "#b22222",
    maroonLighter: "#f8e6e6",
    textDark: "#4b1c1c",
    statusOpen: { bg: "#d4edda", text: "#155724" },
    statusInProgress: { bg: "#fff3cd", text: "#856404" },
    statusResolved: { bg: "#d1ecf1", text: "#0c5460" },
  };

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

  const DashboardView = () => (
    <>
      <section
        className="mb-8 rounded-2xl p-6 shadow-lg"
        style={{ backgroundColor: colors.maroonLighter }}
      >
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.maroon }}>
          Tickets by Severity
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={severityData}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.maroonLight} />
            <XAxis dataKey="name" stroke={colors.maroon} />
            <YAxis allowDecimals={false} stroke={colors.maroon} />
            <Tooltip
              contentStyle={{ backgroundColor: colors.maroonLighter, borderColor: colors.maroon, borderRadius: "8px" }}
              labelStyle={{ color: colors.maroon, fontWeight: "bold" }}
              itemStyle={{ color: colors.maroonLight }}
            />
            <Bar dataKey="count" fill={colors.maroon} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section
          className="rounded-2xl p-6 shadow-lg"
          style={{ backgroundColor: colors.maroonLighter }}
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.maroon }}>
            Tickets
          </h2>
          {visibleTickets.length === 0 && (
            <p className="text-center py-4" style={{ color: colors.textDark }}>No tickets available for your view.</p>
          )}
          <ul className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {visibleTickets.map((t) => (
              <li
                key={t.id}
                className={`border p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedTicketId === t.id ? "bg-white border-maroon-light shadow-md" : "hover:bg-white hover:border-maroon-light"
                }`}
                style={{
                  borderColor: colors.maroonLight,
                  color: colors.textDark,
                }}
                onClick={() => setSelectedTicketId(t.id)}
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-lg font-semibold" style={{ color: colors.maroon }}>
                    {t.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold`}
                    style={{
                      backgroundColor: colors[`status${t.status.replace(/\s/g, "")}`]?.bg || "#ccc",
                      color: colors[`status${t.status.replace(/\s/g, "")}`]?.text || "#666",
                    }}
                  >
                    {t.status}
                  </span>
                </div>
                <p className="text-sm mb-2 opacity-90" style={{ color: colors.textDark }}>
                  {t.description}
                </p>
                <div className="text-xs space-y-1" style={{ color: "#6b4c4c" }}>
                  <p><strong>Severity:</strong> {t.severity}</p>
                  <p><strong>Department:</strong> {getDepartmentName(t.departmentId)}</p>
                  <p><strong>Assigned to:</strong> {getUserName(t.assignedTo) || "Unassigned"}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="rounded-2xl p-6 shadow-lg max-h-[600px] overflow-y-auto pr-2 custom-scrollbar"
          style={{ backgroundColor: colors.maroonLighter }}
        >
          {selectedTicketId ? (
            (() => {
              const ticket = currentTickets.find((t) => t.id === selectedTicketId);
              if (!ticket)
                return <p className="text-center py-4" style={{ color: colors.textDark }}>Ticket not found.</p>;

              const ticketRemarks = getRemarksForTicket(ticket.id);
              const canAct = canActOnTicket(ticket);

              return (
                <>
                  <h2 className="text-2xl font-bold mb-4" style={{ color: colors.maroon }}>
                    {ticket.title}
                  </h2>
                  <p className="mb-4 text-base" style={{ color: colors.textDark }}>
                    {ticket.description}
                  </p>

                  {(user.role === "Supervisor" || user.role === "Admin") && (
                    <div className="mb-4">
                      <label htmlFor="assigned-to" className="block mb-2 font-semibold text-lg" style={{ color: colors.maroon }}>
                        Assign To
                      </label>
                      <select
                        id="assigned-to"
                        className="w-full p-3 rounded-md border"
                        value={ticket.assignedTo || ""}
                        onChange={(e) =>
                          handleTicketUpdate(ticket.id, "assignedTo", parseInt(e.target.value) || null)
                        }
                        style={{ borderColor: colors.maroonLight, color: colors.textDark }}
                      >
                        <option value="">Unassigned</option>
                        {currentUsers
                          .filter((u) => u.departmentId === user.departmentId || user.role === "Admin")
                          .map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name} ({u.role})
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  {(user.role === "Supervisor" || user.role === "Admin") && (
                    <div className="mb-4">
                      <label htmlFor="delegate-department" className="block mb-2 font-semibold text-lg" style={{ color: colors.maroon }}>
                        Delegate Department
                      </label>
                      <select
                        id="delegate-department"
                        className="w-full p-3 rounded-md border"
                        value={ticket.departmentId}
                        onChange={(e) =>
                          handleTicketUpdate(ticket.id, "departmentId", parseInt(e.target.value))
                        }
                        style={{ borderColor: colors.maroonLight, color: colors.textDark }}
                      >
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="mb-4">
                    <label htmlFor="status-select" className="block mb-2 font-semibold text-lg" style={{ color: colors.maroon }}>
                      Status
                    </label>
                    <select
                      id="status-select"
                      className="w-full p-3 rounded-md border"
                      value={ticket.status}
                      onChange={(e) => {
                        handleTicketUpdate(ticket.id, "status", e.target.value);
                      }}
                      disabled={!canAct}
                      style={{
                        borderColor: colors.maroonLight,
                        color: colors.textDark,
                        backgroundColor: !canAct ? "#f0f0f0" : "white",
                        cursor: !canAct ? "not-allowed" : "pointer"
                      }}
                    >
                      <option value="Open">Open</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    {!canAct && <p className="text-red-600 text-sm mt-1">You cannot change the status of this ticket.</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 font-semibold text-lg" style={{ color: colors.maroon }}>
                      Remarks ({ticketRemarks.length})
                    </label>
                    <div className="mb-3 max-h-48 overflow-y-auto border rounded-lg p-3 bg-white text-black text-sm custom-scrollbar">
                      {ticketRemarks.length === 0 && <p className="text-gray-500 text-center py-4">No remarks yet.</p>}
                      {ticketRemarks.map((r) => (
                        <div key={r.id} className="mb-3 last:mb-0 border-b border-gray-100 pb-3 last:border-b-0">
                          <div className="flex justify-between items-start mb-1">
                            <strong className="text-red-800">{r.userName}:</strong>
                            <span className="text-xs text-gray-400">
                              {r.createdAt ? formatDateTime(r.createdAt) : 'No timestamp'}
                            </span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {r.text || r.content || 'No content'}
                          </p>
                          <div className="text-xs text-red-500 mt-1">
                        
                          </div>
                        </div>
                      ))}
                    </div>
                    {canAct && (
                      <div>
                        <textarea
                          className="w-full p-3 rounded-md border resize-y"
                          rows={4}
                          value={remarkText}
                          onChange={(e) => setRemarkText(e.target.value)}
                          placeholder="Add a remark..."
                          style={{ borderColor: colors.maroonLight, color: colors.textDark }}
                        />
                        <button
                          onClick={handleAddRemark}
                          className="mt-3 px-6 py-3 rounded-lg text-white font-semibold transition duration-200 hover:opacity-90"
                          style={{ backgroundColor: colors.maroon }}
                        >
                          Add Remark
                        </button>
                      </div>
                    )}
                  </div>
                </>
              );
            })()
          ) : (
            <p className="text-center py-8 text-lg" style={{ color: colors.textDark }}>Select a ticket from the list to view its details and actions.</p>
          )}
        </section>
      </div>
    </>
  );

  const AdminUsersView = () => {
    const [editingUserId, setEditingUserId] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', departmentId: '', role: '' });
    const [editUserForm, setEditUserForm] = useState({});

    const handleCreateUser = () => {
      if (!newUser.name || !newUser.email || !newUser.password || !newUser.departmentId || !newUser.role) {
        alert("Please fill all fields for the new user.");
        return;
      }
      createUser(newUser);
      setNewUser({ name: '', email: '', password: '', departmentId: '', role: '' });
      alert("User created successfully!");
    };

    const handleEditUser = (userToEdit) => {
      setEditingUserId(userToEdit.id);
      setEditUserForm({ ...userToEdit });
    };

    const handleUpdateUser = () => {
      if (editingUserId) {
        modifyUser(editingUserId, editUserForm);
        setEditingUserId(null);
        setEditUserForm({});
        alert("User updated successfully!");
      }
    };

    const handleDeleteUser = (userId) => {
      if (userId === user.id) {
        alert("You cannot delete your own account!");
        return;
      }
      if (window.confirm("Are you sure you want to delete this user?")) {
        removeUser(userId);
        alert("User deleted successfully!");
      }
    };

    const handleCancelEdit = () => {
      setEditingUserId(null);
      setEditUserForm({});
    };

    return (
      <section
        className="rounded-2xl p-6 shadow-lg my-8"
        style={{ backgroundColor: colors.maroonLighter, color: colors.textDark }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: colors.maroon }}>
          Manage Users
        </h2>

        <div className="mb-8 p-4 border rounded-lg" style={{ borderColor: colors.maroonLight, backgroundColor: 'white' }}>
          <h3 className="text-xl font-semibold mb-3" style={{ color: colors.maroon }}>Add New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Name"
              className="p-2 border rounded-md"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              style={{ borderColor: colors.maroonLight }}
            />
            <input
              type="email"
              placeholder="Email"
              className="p-2 border rounded-md"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              style={{ borderColor: colors.maroonLight }}
            />
            <input
              type="password"
              placeholder="Password"
              className="p-2 border rounded-md"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              style={{ borderColor: colors.maroonLight }}
            />
            <select
              className="p-2 border rounded-md"
              value={newUser.departmentId}
              onChange={(e) => setNewUser({ ...newUser, departmentId: parseInt(e.target.value) })}
              style={{ borderColor: colors.maroonLight }}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <select
              className="p-2 border rounded-md"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              style={{ borderColor: colors.maroonLight }}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Junior Officer">Junior Officer</option>
            </select>
          </div>
          <button
            onClick={handleCreateUser}
            className="px-5 py-2 rounded-lg text-white font-semibold transition duration-200 hover:opacity-90"
            style={{ backgroundColor: colors.maroon }}
          >
            Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead style={{ backgroundColor: colors.maroonLight, color: 'white' }}>
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Department</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(u => (
                <tr key={u.id} className="border-b" style={{ borderColor: colors.maroonLighter }}>
                  <td className="py-3 px-4">{u.id}</td>
                  <td className="py-3 px-4">{editingUserId === u.id ?
                    <input 
                      type="text" 
                      value={editUserForm.name || ''} 
                      onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })} 
                      className="border rounded px-2 py-1 w-full" 
                      style={{ borderColor: colors.maroonLight }} 
                    />
                    : u.name}
                  </td>
                  <td className="py-3 px-4">{editingUserId === u.id ?
                    <input 
                      type="email" 
                      value={editUserForm.email || ''} 
                      onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })} 
                      className="border rounded px-2 py-1 w-full" 
                      style={{ borderColor: colors.maroonLight }} 
                    />
                    : u.email}
                  </td>
                  <td className="py-3 px-4">{editingUserId === u.id ?
                    <select 
                      value={editUserForm.departmentId || ''} 
                      onChange={(e) => setEditUserForm({ ...editUserForm, departmentId: parseInt(e.target.value) })} 
                      className="border rounded px-2 py-1 w-full" 
                      style={{ borderColor: colors.maroonLight }}
                    >
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                    : getDepartmentName(u.departmentId)}
                  </td>
                  <td className="py-3 px-4">{editingUserId === u.id ?
                    <select 
                      value={editUserForm.role || ''} 
                      onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })} 
                      className="border rounded px-2 py-1 w-full" 
                      style={{ borderColor: colors.maroonLight }}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Junior Officer">Junior Officer</option>
                    </select>
                    : u.role}
                  </td>
                  <td className="py-3 px-4">
                    {editingUserId === u.id ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={handleUpdateUser} 
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button 
                          onClick={handleCancelEdit} 
                          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditUser(u)} 
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u.id)} 
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                          disabled={u.id === user.id}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  };

  const AdminTicketsView = () => {
    const [editingTicketId, setEditingTicketId] = useState(null);
    const [newTicket, setNewTicket] = useState({ 
      title: '', 
      description: '', 
      severity: '', 
      departmentId: '', 
      assignedTo: '', 
      status: 'Open' 
    });
    const [editTicketForm, setEditTicketForm] = useState({});

    const handleCreateTicket = () => {
      if (!newTicket.title || !newTicket.description || !newTicket.severity || !newTicket.departmentId) {
        alert("Please fill required fields for the new ticket (Title, Description, Severity, Department).");
        return;
      }
      createTicket(newTicket);
      setNewTicket({ title: '', description: '', severity: '', departmentId: '', assignedTo: '', status: 'Open' });
      alert("Ticket created successfully!");
    };

    const handleEditTicket = (ticketToEdit) => {
      setEditingTicketId(ticketToEdit.id);
      setEditTicketForm({ ...ticketToEdit });
    };

    const handleUpdateTicket = () => {
      if (editingTicketId) {
        updateTicket(editingTicketId, editTicketForm);
        setEditingTicketId(null);
        setEditTicketForm({});
        alert("Ticket updated successfully!");
      }
    };

    const handleDeleteTicket = (ticketId) => {
      if (window.confirm("Are you sure you want to delete this ticket and all its remarks?")) {
        removeTicket(ticketId);
        alert("Ticket deleted successfully!");
      }
    };

    const handleCancelEdit = () => {
      setEditingTicketId(null);
      setEditTicketForm({});
    };

    return (
      <section
        className="rounded-2xl p-6 shadow-lg my-8"
        style={{ backgroundColor: colors.maroonLighter, color: colors.textDark }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: colors.maroon }}>
          Manage Tickets
        </h2>

        <div className="mb-8 p-4 border rounded-lg" style={{ borderColor: colors.maroonLight, backgroundColor: 'white' }}>
          <h3 className="text-xl font-semibold mb-3" style={{ color: colors.maroon }}>Add New Ticket</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Title"
              className="p-2 border rounded-md"
              value={newTicket.title}
              onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
              style={{ borderColor: colors.maroonLight }}
            />
            <textarea
              placeholder="Description"
              className="p-2 border rounded-md resize-y"
              rows={3}
              value={newTicket.description}
              onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              style={{ borderColor: colors.maroonLight }}
            />
            <select
              className="p-2 border rounded-md"
              value={newTicket.severity}
              onChange={(e) => setNewTicket({ ...newTicket, severity: e.target.value })}
              style={{ borderColor: colors.maroonLight }}
            >
              <option value="">Select Severity</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            <select
              className="p-2 border rounded-md"
              value={newTicket.departmentId}
              onChange={(e) => setNewTicket({ ...newTicket, departmentId: parseInt(e.target.value) })}
              style={{ borderColor: colors.maroonLight }}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <select
              className="p-2 border rounded-md"
              value={newTicket.assignedTo}
              onChange={(e) => setNewTicket({ ...newTicket, assignedTo: parseInt(e.target.value) || null })}
              style={{ borderColor: colors.maroonLight }}
            >
              <option value="">Assign To (Optional)</option>
              {currentUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
             <select
              className="p-2 border rounded-md"
              value={newTicket.status}
              onChange={(e) => setNewTicket({ ...newTicket, status: e.target.value })}
              style={{ borderColor: colors.maroonLight }}
            >
              <option value="Open">Open</option>
              <option value="InProgress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <button
            onClick={handleCreateTicket}
            className="px-5 py-2 rounded-lg text-white font-semibold transition duration-200 hover:opacity-90"
            style={{ backgroundColor: colors.maroon }}
          >
            Add Ticket
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead style={{ backgroundColor: colors.maroonLight, color: 'white' }}>
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Severity</th>
                <th className="py-3 px-4 text-left">Department</th>
                <th className="py-3 px-4 text-left">Assigned To</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTickets.map(t => (
                <tr key={t.id} className="border-b" style={{ borderColor: colors.maroonLighter }}>
                  <td className="py-3 px-4">{t.id}</td>
                  <td className="py-3 px-4">{editingTicketId === t.id ?
                    <input type="text" value={editTicketForm.title || ''} onChange={(e) => setEditTicketForm({ ...editTicketForm, title: e.target.value })} className="border rounded px-2 py-1" style={{ borderColor: colors.maroonLight }} />
                    : t.title}
                  </td>
                  <td className="py-3 px-4">{editingTicketId === t.id ?
                    <select value={editTicketForm.severity || ''} onChange={(e) => setEditTicketForm({ ...editTicketForm, severity: e.target.value })} className="border rounded px-2 py-1" style={{ borderColor: colors.maroonLight }}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                    : t.severity}
                  </td>
                  <td className="py-3 px-4">{editingTicketId === t.id ?
                    <select value={editTicketForm.departmentId || ''} onChange={(e) => setEditTicketForm({ ...editTicketForm, departmentId: parseInt(e.target.value) })} className="border rounded px-2 py-1" style={{ borderColor: colors.maroonLight }}>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                    : getDepartmentName(t.departmentId)}
                  </td>
                  <td className="py-3 px-4">{editingTicketId === t.id ?
                    <select value={editTicketForm.assignedTo || ''} onChange={(e) => setEditTicketForm({ ...editTicketForm, assignedTo: parseInt(e.target.value) || null })} className="border rounded px-2 py-1" style={{ borderColor: colors.maroonLight }}>
                      <option value="">Unassigned</option>
                      {currentUsers.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                    : getUserName(t.assignedTo) || "Unassigned"}
                  </td>
                  <td className="py-3 px-4">{editingTicketId === t.id ?
                    <select value={editTicketForm.status || ''} onChange={(e) => setEditTicketForm({ ...editTicketForm, status: e.target.value })} className="border rounded px-2 py-1" style={{ borderColor: colors.maroonLight }}>
                      <option value="Open">Open</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    : t.status}
                  </td>
                  <td className="py-3 px-4">
                    {editingTicketId === t.id ? (
                      <button onClick={handleUpdateTicket} className="bg-green-500 text-white px-3 py-1 rounded text-sm mr-2 hover:bg-green-600">Save</button>
                    ) : (
                      <button onClick={() => handleEditTicket(t)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm mr-2 hover:bg-blue-600">Edit</button>
                    )}
                    <button onClick={() => handleDeleteTicket(t.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  };


  return (
    <div className="flex h-screen font-sans bg-gray-100">
      <nav
        className={`flex flex-col p-4 text-white ${
          sidebarOpen ? "w-64" : "w-20 items-center"
        } transition-all duration-300 shadow-xl z-10`}
        style={{ backgroundColor: colors.maroon }}
      >
        <button
          className={`mb-8 ${sidebarOpen ? "self-end" : "self-center"} text-3xl font-bold text-white transition-transform duration-300 hover:scale-110`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? "←" : "☰"}
        </button>
        <ul className="flex flex-col gap-4 flex-grow">
          <li>
            <button
              onClick={() => setCurrentView("dashboard")}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                currentView === "dashboard" ? "bg-white text-maroon shadow-md" : "hover:bg-maroonLight"
              }`}
              style={{ color: currentView === "dashboard" ? colors.maroon : "white" }}
            >
              <i className="fas fa-tachometer-alt"></i>
              {sidebarOpen && "Dashboard"}
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentView("profile")}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                currentView === "profile" ? "bg-white text-maroon shadow-md" : "hover:bg-maroonLight"
              }`}
              style={{ color: currentView === "profile" ? colors.maroon : "white" }}
            >
              <i className="fas fa-user-circle"></i>
              {sidebarOpen && "Profile"}
            </button>
          </li>
          {user && user.role === "Admin" && (
            <>
              <hr className="border-t border-maroonLight my-2" />
              <li>
                <button
                  onClick={() => setCurrentView("adminUsers")}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    currentView === "adminUsers" ? "bg-white text-maroon shadow-md" : "hover:bg-maroonLight"
                  }`}
                  style={{ color: currentView === "adminUsers" ? colors.maroon : "white" }}
                >
                  <i className="fas fa-users-cog"></i>
                  {sidebarOpen && "Manage Users"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("adminTickets")}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    currentView === "adminTickets" ? "bg-white text-maroon shadow-md" : "hover:bg-maroonLight"
                  }`}
                  style={{ color: currentView === "adminTickets" ? colors.maroon : "white" }}
                >
                  <i className="fas fa-ticket-alt"></i>
                  {sidebarOpen && "Manage Tickets"}
                </button>
              </li>
            </>
          )}

          <li className="mt-auto">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 hover:bg-maroonLight"
              style={{ color: "white" }}
            >
              <i className="fas fa-sign-out-alt"></i>
              {sidebarOpen && "Logout"}
            </button>
          </li>
        </ul>
      </nav>

      <main className="flex-1 p-8 overflow-auto">
        {currentView === "dashboard" && <DashboardView />}
        {currentView === "profile" && <Profile />}
        {user && user.role === "Admin" && currentView === "adminUsers" && <AdminUsersView />}
        {user && user.role === "Admin" && currentView === "adminTickets" && <AdminTicketsView />}
      </main>
    </div>
  );
};

export default Dashboard;