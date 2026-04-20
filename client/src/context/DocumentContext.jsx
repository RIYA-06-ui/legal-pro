import React, { createContext, useState } from 'react';

export const DocumentContext = createContext(null);

export function DocumentProvider({ children }) {
  const [document, setDocument] = useState(null);
  const [role, setRole] = useState('Tenant');
  const [clauses, setClauses] = useState([]);

  const value = {
    document,
    setDocument,
    role,
    setRole,
    clauses,
    setClauses,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
}

export default DocumentProvider;
