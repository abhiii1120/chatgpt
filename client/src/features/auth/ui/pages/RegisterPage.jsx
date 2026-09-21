import { useState } from "react";
import {useForm} from "react-hook-form";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterForm() {
  const {handleSubmit,navigate,onRegisterSubmit,register,errors} = useAuth();


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
        onSubmit={handleSubmit(onRegisterSubmit)}
        noValidate
      >

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

        <Button type="submit" className="mt-2">
          Continue
        </Button>
      </form>
    </AuthLayout>
  );
}