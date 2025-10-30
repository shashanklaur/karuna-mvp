import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { postsApi } from "./api";

type FormInput = {
  type: "offer" | "request";
  title: string;
  city: string;
  description: string;
  tags: string[];
};

const TAGS = ["coding", "guitar", "groceries", "tutoring", "listening", "yoga", "resume", "math"];
const CITIES = ["Toronto", "Mississauga", "Brampton", "Etobicoke"];

export default function PostForm() {
  const nav = useNavigate();
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormInput>({
    defaultValues: { type: "offer", title: "", city: "", description: "", tags: [] }
  });

  const tags = watch("tags");
  const type = watch("type");

  const toggleTag = (t: string) => {
    const next = tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t];
    setValue("tags", next, { shouldValidate: true });
  };

  const create = useMutation({
    mutationFn: (input: FormInput) => postsApi.create(input),
    onSuccess: (post) => {
      // refresh Discover cache and go to the new post
      qc.invalidateQueries({ queryKey: ["posts"] });
      nav(`/service/${post._id}`);
    }
  });

  return (
    <section className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Post a Service</h1>

      <form
        onSubmit={handleSubmit((d) => create.mutate(d))}
        className="bg-white rounded-2xl p-4 shadow-sm border space-y-3"
      >
        {/* Type toggle */}
        <div className="flex gap-3">
          <label className={`px-3 py-2 rounded-xl cursor-pointer ${type === "offer" ? "bg-emerald-100" : "bg-gray-100"}`}>
            <input type="radio" value="offer" {...register("type")} className="sr-only" /> Offer
          </label>
          <label className={`px-3 py-2 rounded-xl cursor-pointer ${type === "request" ? "bg-emerald-100" : "bg-gray-100"}`}>
            <input type="radio" value="request" {...register("type")} className="sr-only" /> Request
          </label>
        </div>

        {/* Title */}
        <label className="block">
          <span className="block text-sm font-medium">Title</span>
          <input
            className="w-full border rounded-xl px-3 py-2"
            placeholder="Short, clear headline"
            {...register("title", { required: "Title is required", minLength: { value: 3, message: "Min 3 chars" } })}
          />
          {errors.title && <div className="text-sm text-red-600 mt-1">{errors.title.message}</div>}
        </label>

        {/* City */}
        <label className="block">
          <span className="block text-sm font-medium">City</span>
          <select
            className="w-full border rounded-xl px-3 py-2"
            {...register("city", { required: "City is required" })}
          >
            <option value="">Select</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.city && <div className="text-sm text-red-600 mt-1">{errors.city.message}</div>}
        </label>

        {/* Tags */}
        <div>
          <span className="block text-sm font-medium">Tags</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {TAGS.map((t) => {
              const active = tags.includes(t);
              return (
                <button
                  type="button"
                  key={t}
                  className={`px-2 py-1 rounded ${active ? "bg-emerald-200" : "bg-gray-100"}`}
                  onClick={() => toggleTag(t)}
                  aria-pressed={active}
                >
                  {t}
                </button>
              );
            })}
          </div>
          {tags.length === 0 && <div className="text-sm text-gray-500 mt-1">Pick at least one tag.</div>}
        </div>

        {/* Description */}
        <label className="block">
          <span className="block text-sm font-medium">Description</span>
          <textarea
            rows={4}
            className="w-full border rounded-xl px-3 py-2"
            placeholder="Explain what you’re offering or requesting…"
            {...register("description", {
              required: "Description is required",
              minLength: { value: 10, message: "Min 10 chars" }
            })}
          />
          {errors.description && <div className="text-sm text-red-600 mt-1">{errors.description.message}</div>}
        </label>

        {/* Submit */}
        {create.isError && (
          <div className="text-sm text-red-600">
            {(create.error as Error)?.message || "Something went wrong"}
          </div>
        )}
        <button
          disabled={create.isPending}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl disabled:bg-gray-300"
        >
          {create.isPending ? "Publishing…" : "Publish"}
        </button>
      </form>
    </section>
  );
}
