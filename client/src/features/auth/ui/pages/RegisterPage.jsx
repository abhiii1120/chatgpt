import { useState } from "react";
import {useForm} from "react-hook-form";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";


/**
 * RegisterForm
 * Props:
 *  - onRegister(data): async function called with { name, email, password }
 */
export default function RegisterForm({ onRegister }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const [serverError, setServerError] = useState("");
  const password = watch("password");

  const onSubmit = async (data) => {
    setServerError("");
    try {
      if (onRegister) {
        await onRegister(data);
      } else {
        console.log("Register data:", data);
      }
    } catch (err) {
      setServerError(err?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <AuthLayout
      heading="Create your account"
      footer={
        <>
          Already have an account?{" "}
          <a
            href={"/login"}
            className="text-ink underline underline-offset-2 hover:text-accent"
          >
            Log in
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
          id="name"
          type="text"
          label="Full name"
          placeholder="Your name"
          error={errors.name?.message}
          {...register("name", {
            required: "Name is required",
            minLength: { value: 2, message: "Name is too short" },
          })}
        />

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
          placeholder="Create a password"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />

        <Input
          id="confirmPassword"
          type="password"
          label="Confirm password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
        />

        <Button type="submit" disabled={isSubmitting} className="mt-2">
          {isSubmitting ? "Creating account..." : "Continue"}
        </Button>
      </form>
    </AuthLayout>
  );
}