import { useState } from "react";
import {useForm} from "react-hook-form";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../../hooks/useAuth";

export default function LoginForm() {
  const {handleSubmit,navigate,onLoginSubmit,register,errors} = useAuth();
 
  return (
    <AuthLayout
      heading="Welcome back"
      footer={
        <>
          Don't have an account?{" "}
          <span
          onClick={() => navigate('/register')}
            className="text-ink underline underline-offset-2 hover:text-accent "
          >
            Sign up
          </span>
        </>
      }
    >
      <form
        className="flex w-full flex-col gap-3.5"
        onSubmit={handleSubmit(onLoginSubmit)}
      >
    
        <Input
          id="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
        />
 
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
 
        <Button type="submit" className="mt-2">
          Continue
        </Button>
      </form>
    </AuthLayout>
  );
}
 