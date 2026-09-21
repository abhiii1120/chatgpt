import { useState } from "react";
import {useForm} from "react-hook-form";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";

/**
 * LoginForm
 * Props:
 *  - onLogin(data): async function called with { email, password }
 */
export default function LoginForm({ onLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });
 
  const [serverError, setServerError] = useState("");
 
  const onSubmit = async (data) => {
    setServerError("");
    try {
      if (onLogin) {
        await onLogin(data);
      } else {
        console.log("Login data:", data);
      }
    } catch (err) {
      setServerError(err?.message || "Something went wrong. Please try again.");
    }
  };
 
  return (
    <AuthLayout
      heading="Welcome back"
      footer={
        <>
          Don't have an account?{" "}
          <a
            href={'/register'}
            className="text-ink underline underline-offset-2 hover:text-accent"
          >
            Sign up
          </a>
        </>
      }
    >
      <form
        className="flex w-full flex-col gap-3.5"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {serverError && (
          <div className="rounded-lg border border-danger-line bg-danger-soft px-3 py-2.5 text-left text-[13.5px] text-danger">
            {serverError}
          </div>
        )}
 
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
 
        <Button type="submit" disabled={isSubmitting} className="mt-2">
          {isSubmitting ? "Continuing..." : "Continue"}
        </Button>
      </form>
    </AuthLayout>
  );
}
 