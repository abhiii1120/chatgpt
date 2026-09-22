import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { addUser } from "../state/authSlice";

export let useAuth = () => {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onRegisterSubmit = (data) => {
    console.log(data);
    dispatch(addUser(data));
  };

  const onLoginSubmit = (data) => {
    console.log(data);
    dispatch(addUser(data));
  };

  return {
    register,
    handleSubmit,
    onRegisterSubmit,
    onLoginSubmit,
    navigate,
    errors,
  };
};
