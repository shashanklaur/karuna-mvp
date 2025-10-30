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

const TAGS = [
  // Everyday help
  "errands","groceries","pet-care","moving-help","cooking","cleaning","gardening","rideshare",
  // Skills & knowledge
  "tutoring","coding","design","writing","resume","translation","tech-support","math",
  // Emotional & social
  "listening","mentorship","motivation","companionship","positivity","empathy","life-advice","mindfulness",
  // Creative & hobbies
  "art","photography","music","dance","crafts","language-exchange","storytelling","yoga","journaling"
];

const CITIES = ["Toronto","Mississauga","Brampton","Etobicoke","Scarborough","Vaughan"];

export default function PostForm() {
  const nav = useNavigate();
  const qc = useQueryClient();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormInput>({
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
      qc.invalidateQueries({ queryKey: ["posts"] });
      nav(`/service/${post._id}`);
    }
  });

  return (
    <section>
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Post a Service</h1>
        <p className="text-gray-600">Offer help or ask for support—small acts matter.</p>
      </header>

      <form onSubmit={handleSubmit((d) => create.mutate(d))} className="card p-4 space-y-3">
        <div className="flex gap-3">
          <label className={`px-3 py-2 rounded-xl cursor-pointer ${type === "offer" ? "bg-emerald-100" : "bg-gray-100"}`}>
            <input type="radio" value="offer" {...register("type")} className="sr-only" /> Offer
          </label>
          <label className={`px-3 py-2 rounded-xl cursor-pointer ${type === "request" ? "bg-emerald-100" : "bg-gray-100"}`}>
            <input type="radio" value="request" {...register("type")} className="sr-only" /> Request
          </label>
        </div>

        <label className="block">
          <span className="block text-sm font-medium">Title</span>
          <input
            className="w-full border rounded-xl px-3 py-2"
            placeholder="Short, clear headline"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && <div className="text-sm text-red-600 mt-1">{errors.title.message}</div>}
        </label>

        <label className="block">
          <span className="block text-sm font-medium">City</span>
          <select
            className="w-full border rounded-xl px-3 py-2"
            {...register("city", { required: "City is required" })}
          >
            <option value="">Select</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.city && <div className="text-sm text-red-600 mt-1">{errors.city.message}</div>}
        </label>

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
                >
                  {t}
                </button>
              );
            })}
          </div>
          {tags.length === 0 && <div className="text-sm text-gray-500 mt-1">Pick at least one tag.</div>}
        </div>

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

        {create.isError && (
          <div className="text-sm text-red-600">
            {(create.error as Error)?.message || "Something went wrong"}
          </div>
        )}

        <button disabled={create.isPending} className="btn btn-primary">
          {create.isPending ? "Publishing…" : "Publish"}
        </button>
      </form>
    </section>
  );
}
