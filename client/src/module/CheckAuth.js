import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckAuth({ children }) {
  const isAuth = false;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, []);
  return children;
}
