import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export let useAuth = () => {
  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onRegisterSubmit = (data) => {
    console.log(data)
  }

  const onLoginSubmit = (data) => {
    console.log(data)
  }

  return {
    register,
    handleSubmit,
    onRegisterSubmit,
    onLoginSubmit,
    navigate,
    errors,
  }
};
