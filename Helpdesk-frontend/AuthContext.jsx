import React, { createContext, useContext, useState, useEffect } from "react";
import {
  users as initialUsers, 
  tickets as initialTickets, 
  departments,
  remarks as initialRemarks,
  updateTicket as dbUpdateTicket,
  addRemark as dbAddRemark,
  addTicket as dbAddTicket, 
  deleteTicket as dbDeleteTicket, 
  addUser as dbAddUser, 
  updateUser as dbUpdateUser, 
  deleteUser as dbDeleteUser, 
} from "../data/mockDB";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [tickets, setTickets] = useState(initialTickets);
  const [remarks, setRemarks] = useState(initialRemarks);
  const [users, setUsers] = useState(initialUsers);

  useEffect(() => {
  }, []);

  const login = (email, password) => {
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      localStorage.setItem("user", JSON.stringify(found));
      setUser(found);
      return found;
    }
    return null;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateTicket = (ticketId, updates) => {
    dbUpdateTicket(ticketId, updates);
    setTickets([...initialTickets]); 
  };

  const addRemark = (ticketId, userId, text) => {
  const timestamp = new Date().toISOString();
  dbAddRemark(ticketId, userId, text, timestamp); 
  setRemarks([...initialRemarks]);
};


  const createTicket = (newTicketData) => {
    dbAddTicket(newTicketData);
    setTickets([...initialTickets]); 
  };

  const removeTicket = (ticketId) => {
    dbDeleteTicket(ticketId);
    setTickets([...initialTickets]); 
    setRemarks([...initialRemarks]); 
  };

  const createUser = (newUserData) => {
    dbAddUser(newUserData);
    setUsers([...initialUsers]); 
  };

  const modifyUser = (userId, updates) => {
    dbUpdateUser(userId, updates);
    setUsers([...initialUsers]);
  };

  const removeUser = (userId) => {
    dbDeleteUser(userId);
    setUsers([...initialUsers]); 
    setTickets([...initialTickets]); 
    setRemarks([...initialRemarks]); 
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        tickets, 
        users, 
        departments, 
        remarks, 
        updateTicket,
        addRemark,
        createTicket, 
        removeTicket, 
        createUser,   
        modifyUser,   
        removeUser,  
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};