import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

function PixelButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button"
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  className?: string;
  type?: "button" | "submit";
}) {
  const baseClasses = "relative font-bold uppercase tracking-wider transition-all duration-100 active:translate-y-1 active:shadow-none";
  const variantClasses = {
    primary: "bg-[#4ade80] text-[#1a1a2e] shadow-[4px_4px_0px_#166534] hover:bg-[#86efac] border-2 border-[#166534]",
    secondary: "bg-[#818cf8] text-white shadow-[4px_4px_0px_#3730a3] hover:bg-[#a5b4fc] border-2 border-[#3730a3]",
    danger: "bg-[#f87171] text-white shadow-[4px_4px_0px_#991b1b] hover:bg-[#fca5a5] border-2 border-[#991b1b]",
    ghost: "bg-transparent text-[#a5b4fc] hover:text-[#c7d2fe] hover:bg-[#1a1a2e]/50"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function PixelInput({
  value,
  onChange,
  placeholder,
  type = "text",
  name,
  className = ""
}: {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  name?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-[#0f0f1a] border-2 border-[#3730a3] text-[#e0e7ff] placeholder-[#6366f1]/50 px-4 py-3 focus:outline-none focus:border-[#818cf8] focus:shadow-[0_0_10px_#818cf8] transition-all ${className}`}
    />
  );
}

function SignIn() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch {
      setError("Authentication failed. Check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Pixel grid background */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(to right, #818cf8 1px, transparent 1px),
          linear-gradient(to bottom, #818cf8 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }} />

      {/* Floating pixels */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-[#4ade80] animate-pulse" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-[#f87171] animate-bounce" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-[#818cf8] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-[#fbbf24] animate-bounce" style={{ animationDelay: '0.3s' }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Window frame */}
        <div className="bg-[#1a1a2e] border-4 border-[#3730a3] shadow-[8px_8px_0px_#0f0f1a]">
          {/* Title bar */}
          <div className="bg-gradient-to-r from-[#3730a3] to-[#6366f1] px-4 py-2 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-[#f87171] border border-[#991b1b]" />
              <div className="w-3 h-3 bg-[#fbbf24] border border-[#b45309]" />
              <div className="w-3 h-3 bg-[#4ade80] border border-[#166534]" />
            </div>
            <span className="text-white font-bold tracking-widest text-sm ml-2">
              PIXEL_TODO.exe
            </span>
          </div>

          <div className="p-6 md:p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-block relative">
                <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#4ade80] to-[#166534] tracking-tight">
                  PIXEL
                </span>
                <span className="text-4xl md:text-5xl font-black text-[#818cf8] tracking-tight ml-1">
                  TODO
                </span>
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-[#4ade80] via-[#818cf8] to-[#f87171]" />
              </div>
              <p className="text-[#6366f1] mt-4 text-sm tracking-wider">
                {flow === "signIn" ? "[ WELCOME BACK, PLAYER ]" : "[ CREATE NEW SAVE FILE ]"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#4ade80] text-xs font-bold mb-2 tracking-wider">
                  EMAIL_ADDRESS:
                </label>
                <PixelInput
                  name="email"
                  type="email"
                  placeholder="player@pixel.quest"
                />
              </div>
              <div>
                <label className="block text-[#4ade80] text-xs font-bold mb-2 tracking-wider">
                  PASSWORD:
                </label>
                <PixelInput
                  name="password"
                  type="password"
                  placeholder="********"
                />
              </div>
              <input name="flow" type="hidden" value={flow} />

              {error && (
                <div className="bg-[#991b1b]/20 border-2 border-[#f87171] p-3 text-[#f87171] text-sm">
                  ! ERROR: {error}
                </div>
              )}

              <PixelButton type="submit" variant="primary" className="w-full py-3 text-sm">
                {flow === "signIn" ? ">> START GAME <<" : ">> CREATE SAVE <<"}
              </PixelButton>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
                className="text-[#818cf8] hover:text-[#a5b4fc] text-sm transition-colors"
              >
                {flow === "signIn" ? "[ NEW PLAYER? SIGN UP ]" : "[ EXISTING PLAYER? SIGN IN ]"}
              </button>
            </div>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-[#3730a3]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#1a1a2e] px-4 text-[#6366f1] text-xs">OR</span>
              </div>
            </div>

            <div className="mt-6">
              <GuestSignIn />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuestSignIn() {
  const { signIn } = useAuthActions();
  return (
    <PixelButton
      onClick={() => signIn("anonymous")}
      variant="ghost"
      className="w-full py-3 text-sm border-2 border-dashed border-[#3730a3]"
    >
      CONTINUE AS GUEST
    </PixelButton>
  );
}

function TodoItem({
  todo
}: {
  todo: { _id: Id<"todos">; text: string; completed: boolean; priority?: "low" | "medium" | "high"; createdAt: number }
}) {
  const toggle = useMutation(api.todos.toggle);
  const remove = useMutation(api.todos.remove);
  const [isDeleting, setIsDeleting] = useState(false);

  const priorityColors = {
    low: "border-l-[#4ade80]",
    medium: "border-l-[#fbbf24]",
    high: "border-l-[#f87171]"
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await remove({ id: todo._id });
  };

  return (
    <div
      className={`
        group bg-[#1a1a2e] border-2 border-[#3730a3] border-l-4 ${priorityColors[todo.priority || "medium"]}
        p-3 md:p-4 transition-all hover:border-[#818cf8] hover:shadow-[4px_4px_0px_#3730a3]
        ${todo.completed ? 'opacity-60' : ''}
        ${isDeleting ? 'animate-pulse scale-95' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <button
          onClick={() => toggle({ id: todo._id })}
          className={`
            w-6 h-6 border-2 flex items-center justify-center transition-all flex-shrink-0
            ${todo.completed
              ? 'bg-[#4ade80] border-[#166534]'
              : 'bg-[#0f0f1a] border-[#3730a3] hover:border-[#4ade80]'
            }
          `}
        >
          {todo.completed && (
            <span className="text-[#1a1a2e] font-bold text-sm">X</span>
          )}
        </button>

        {/* Text */}
        <span className={`
          flex-1 text-[#e0e7ff] text-sm md:text-base break-words
          ${todo.completed ? 'line-through text-[#6366f1]' : ''}
        `}>
          {todo.text}
        </span>

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 w-8 h-8 bg-[#991b1b]/20 border-2 border-[#f87171] text-[#f87171] hover:bg-[#f87171] hover:text-white transition-all flex items-center justify-center flex-shrink-0"
        >
          X
        </button>
      </div>
    </div>
  );
}

function AddTodo() {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const create = useMutation(api.todos.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await create({ text: text.trim(), priority });
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <PixelInput
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter new quest..."
          className="flex-1"
        />
        <PixelButton type="submit" variant="primary" className="px-6 py-3 text-sm whitespace-nowrap">
          + ADD
        </PixelButton>
      </div>

      {/* Priority selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[#6366f1] text-xs tracking-wider">PRIORITY:</span>
        {(["low", "medium", "high"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriority(p)}
            className={`
              px-3 py-1 text-xs uppercase tracking-wider border-2 transition-all
              ${priority === p
                ? p === "low"
                  ? "bg-[#4ade80] border-[#166534] text-[#1a1a2e]"
                  : p === "medium"
                    ? "bg-[#fbbf24] border-[#b45309] text-[#1a1a2e]"
                    : "bg-[#f87171] border-[#991b1b] text-white"
                : "bg-[#0f0f1a] border-[#3730a3] text-[#6366f1] hover:border-[#818cf8]"
              }
            `}
          >
            {p}
          </button>
        ))}
      </div>
    </form>
  );
}

function Stats() {
  const stats = useQuery(api.todos.stats);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4">
      {[
        { label: "TOTAL", value: stats.total, color: "text-[#818cf8]" },
        { label: "DONE", value: stats.completed, color: "text-[#4ade80]" },
        { label: "LEFT", value: stats.pending, color: "text-[#f87171]" },
      ].map((stat) => (
        <div key={stat.label} className="bg-[#0f0f1a] border-2 border-[#3730a3] p-2 md:p-4 text-center">
          <div className={`text-xl md:text-3xl font-black ${stat.color}`}>{stat.value}</div>
          <div className="text-[#6366f1] text-xs tracking-wider">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

function TodoList() {
  const todos = useQuery(api.todos.list);
  const { signOut } = useAuthActions();

  if (todos === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
        <div className="text-[#4ade80] animate-pulse text-xl tracking-widest">
          LOADING...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] relative overflow-hidden flex flex-col">
      {/* Scanlines overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)'
        }}
      />

      {/* Pixel grid background */}
      <div className="fixed inset-0 opacity-5" style={{
        backgroundImage: `
          linear-gradient(to right, #818cf8 1px, transparent 1px),
          linear-gradient(to bottom, #818cf8 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 max-w-2xl mx-auto p-4 md:p-8 w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-[#1a1a2e] border-4 border-[#3730a3] shadow-[8px_8px_0px_#0f0f1a] mb-6">
          <div className="bg-gradient-to-r from-[#3730a3] to-[#6366f1] px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-[#f87171] border border-[#991b1b]" />
                <div className="w-3 h-3 bg-[#fbbf24] border border-[#b45309]" />
                <div className="w-3 h-3 bg-[#4ade80] border border-[#166534]" />
              </div>
              <span className="text-white font-bold tracking-widest text-xs md:text-sm ml-2">
                PIXEL_TODO.exe
              </span>
            </div>
            <button
              onClick={() => signOut()}
              className="text-white/80 hover:text-white text-xs tracking-wider transition-colors"
            >
              [LOGOUT]
            </button>
          </div>

          <div className="p-4 md:p-6">
            {/* Logo */}
            <div className="text-center mb-6">
              <div className="inline-block relative">
                <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#4ade80] to-[#166534] tracking-tight">
                  PIXEL
                </span>
                <span className="text-3xl md:text-4xl font-black text-[#818cf8] tracking-tight ml-1">
                  TODO
                </span>
              </div>
            </div>

            <Stats />
          </div>
        </div>

        {/* Add Todo */}
        <div className="bg-[#1a1a2e] border-4 border-[#3730a3] shadow-[8px_8px_0px_#0f0f1a] p-4 md:p-6 mb-6">
          <h2 className="text-[#4ade80] font-bold tracking-wider mb-4 text-sm">
            + NEW QUEST:
          </h2>
          <AddTodo />
        </div>

        {/* Todo List */}
        <div className="bg-[#1a1a2e] border-4 border-[#3730a3] shadow-[8px_8px_0px_#0f0f1a] flex-1">
          <div className="bg-[#3730a3]/30 px-4 py-2 border-b-2 border-[#3730a3]">
            <span className="text-[#818cf8] font-bold tracking-wider text-sm">
              QUEST LOG [{todos.length}]
            </span>
          </div>

          <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
            {todos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-[#3730a3] text-6xl mb-4">?</div>
                <p className="text-[#6366f1] tracking-wider">NO QUESTS FOUND</p>
                <p className="text-[#6366f1]/60 text-sm mt-2">Add your first quest above!</p>
              </div>
            ) : (
              todos.map((todo: { _id: Id<"todos">; text: string; completed: boolean; priority?: "low" | "medium" | "high"; createdAt: number }) => (
                <TodoItem key={todo._id} todo={todo} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 px-4">
        <p className="text-[#3730a3] text-xs tracking-wider">
          Requested by @jianke2 · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#4ade80] border-t-transparent animate-spin" />
          <p className="text-[#4ade80] mt-4 tracking-widest animate-pulse">
            LOADING...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignIn />;
  }

  return <TodoList />;
}
