import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { profileApi } from "./api";

type FormInput = {
  name: string;
  city?: string;
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

export default function Me() {
  const { data: me, isLoading } = useQuery({ queryKey: ["me"], queryFn: profileApi.me });

  const { register, handleSubmit, setValue, watch, reset } = useForm<FormInput>({
    defaultValues: { name: "", city: "", tags: [] }
  });

  const tags = watch("tags") || [];

  const toggleTag = (t: string) => {
    const next = tags.includes(t) ? tags.filter((x: string) => x !== t) : [...tags, t];
    setValue("tags", next, { shouldValidate: false });
  };

  const update = useMutation({
    mutationFn: (input: Partial<FormInput>) => profileApi.update(input),
    onSuccess: () => { /* could toast */ }
  });

  if (isLoading) return <div className="card p-6">Loading…</div>;
  if (!me) return <div className="card p-6">Please log in.</div>;

  // Prime the form once when me loads
  if (me && (!tags.length && !watch("name"))) {
    reset({ name: me.name || "", city: me.city || "", tags: me.tags || [] });
  }

  return (
    <section className="space-y-3">
      <header className="mb-1">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-600">Tell the community who you are and how you like to help.</p>
      </header>

      <form
        onSubmit={handleSubmit((d) => update.mutate(d))}
        className="card p-4 space-y-3"
      >
        <label className="block">
          <span className="block text-sm font-medium">Name</span>
          <input className="w-full border rounded-xl px-3 py-2" {...register("name")} />
        </label>

        <label className="block">
          <span className="block text-sm font-medium">City</span>
          <input className="w-full border rounded-xl px-3 py-2" {...register("city")} />
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
        </div>

        <button className="btn btn-primary" disabled={update.isPending}>
          {update.isPending ? "Saving…" : "Save changes"}
        </button>
      </form>
    </section>
  );
}
