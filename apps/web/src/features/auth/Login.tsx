import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "./api";

type FormInput = { email: string; password: string };

export default function Login() {
  const qc = useQueryClient();
  const nav = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormInput>({
    defaultValues: { email: "", password: "" }
  });

  const m = useMutation({
    mutationFn: (d: FormInput) => authApi.login(d.email, d.password),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
      nav("/");
    }
  });

  return (
    <section className="max-w-sm mx-auto p-4">
      <h1 className="text-2xl font-bold mb-3">Log in</h1>
      <form
        onSubmit={handleSubmit((d) => m.mutate(d))}
        className="bg-white rounded-2xl p-4 border shadow-sm space-y-3"
      >
        <label className="block">
          <span className="block text-sm font-medium">Email</span>
          <input
            className="w-full border rounded-xl px-3 py-2"
            placeholder="you@example.com"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <div className="text-sm text-red-600 mt-1">{errors.email.message}</div>}
        </label>

        <label className="block">
          <span className="block text-sm font-medium">Password</span>
          <input
            type="password"
            className="w-full border rounded-xl px-3 py-2"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <div className="text-sm text-red-600 mt-1">{errors.password.message}</div>}
        </label>

        {m.isError && (
          <div className="text-sm text-red-600">
            {(m.error as Error)?.message || "Login failed"}
          </div>
        )}

        <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl w-full" disabled={m.isPending}>
          {m.isPending ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-sm text-gray-600">
          No account?{" "}
          <Link to="/register" className="text-emerald-700 underline">
            Create one
          </Link>
        </p>
      </form>
    </section>
  );
}
