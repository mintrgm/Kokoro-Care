import { createContext } from "react";

// Context for Admin login and token
const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
    const value= {}
    
    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider