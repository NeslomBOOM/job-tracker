import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

export const LoginPage = () => {
    const login = useAuthStore((s) => s.login);
    const navigate = useNavigate();

    const onLogin = () => {
        login();
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen grid place-items-center p-6">
            <div className="w-full max-w-sm rounded-2xl border p-6 space-y-4">
                <h1 className="text-2xl font-semibold">Login</h1>

                <button
                    className="w-full rounded-xl bg-black text-white px-4 py-2"
                    onClick={onLogin}
                >
                    Login (mock)
                </button>
            </div>
        </div>
    );
};
