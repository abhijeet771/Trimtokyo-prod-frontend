import { useEffect, useState } from "react";
import { getLatestUsers } from "../services/api";

const useLatestUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getLatestUsers();
        setUsers(res.data.data); // matches backend response
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};

export default useLatestUsers;