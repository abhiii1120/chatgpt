import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { register as registerThunk, login as loginThunk } from "../state/authSlice";

export let useAuth = () => {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {loading,error} = useSelector((state) => state.auth);

  const onRegisterSubmit = async (data) => {
    const result = await dispatch(registerThunk(data));
    if(registerThunk.fulfilled.match(result)){
      navigate("/dashboard");
    }
  };

  const onLoginSubmit = async (data) => {
    const result = await dispatch(loginThunk(data));
    if(loginThunk.fulfilled.match(result)){
      navigate("/dashboard");
    }
  };

  return {
    register,
    handleSubmit,
    onRegisterSubmit,
    onLoginSubmit,
    navigate,
    errors,
    loading,
    error
  };
};
