import React, {useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useSelector from "@src/hooks/use-selector";

interface ProtectedProps {
  children: React.ReactNode | React.ReactNode[],
  redirect: string
}

function Protected(props: ProtectedProps) {

  const navigate = useNavigate();
  const location = useLocation();

  const select = useSelector(state => ({
    exists: state.session.exists,
    waiting: state.session.waiting
  }));

  useEffect(() => {
    if (!select.exists && !select.waiting) {
      navigate(props.redirect, {state: { back: location.pathname }});
    }
  }, [select.exists, select.waiting]);

  return !select.exists || select.waiting ? <div>Проверка доступа...</div> : <>{props.children}</> ;
}

export default React.memo(Protected);
