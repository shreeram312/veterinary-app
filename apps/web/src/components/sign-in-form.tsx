import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignInForm({
  onSwitchToSignUp,
}: {
  onSwitchToSignUp: () => void;
}) {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
            toast.success("Sign in successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="w-full rounded-xl border border-border bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-center text-2xl font-semibold text-foreground">
        Welcome Back
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <form.Field name="email">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name} className="text-foreground font-medium">
                Email
              </Label>
              <Input
                className="h-11 rounded-lg border-border bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20"
                id={field.name}
                name={field.name}
                type="email"
                placeholder="you@example.com"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error?.message} className="text-destructive text-sm">
                  {error?.message}
                </p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name} className="text-foreground font-medium">
                Password
              </Label>
              <Input
                className="h-11 rounded-lg border-border bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20"
                id={field.name}
                name={field.name}
                type="password"
                placeholder="••••••••"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error?.message} className="text-destructive text-sm">
                  {error?.message}
                </p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Subscribe>
          {(state) => (
            <Button
              type="submit"
              className="w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
              disabled={!state.canSubmit || state.isSubmitting}
            >
              {state.isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-6 text-center">
        <span className="text-muted-foreground text-sm">Need an account? </span>
        <button
          onClick={onSwitchToSignUp}
          className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
