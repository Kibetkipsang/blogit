import React, { useState, useEffect } from "react";
import useAuthStore from "../stores/useStore";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../axios";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type userDataType = {
  identifier: string;
  password: string;
};

const loginUser = async (data: userDataType) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

// Token status debug component
const TokenStatus = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = () => {
      const storedToken = localStorage.getItem("authToken");
      setToken(storedToken);
    };

    checkToken();
    const interval = setInterval(checkToken, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-3 rounded-lg text-xs max-w-xs">
      <div className="font-bold mb-1">Token Status:</div>
      <div className={token ? "text-green-400" : "text-red-400"}>
        {token ? ` Present (${token.substring(0, 10)}...)` : " Missing"}
      </div>
      {token && (
        <button
          onClick={() => {
            localStorage.removeItem("authToken");
            setToken(null);
          }}
          className="mt-2 px-2 py-1 bg-red-600 text-white rounded text-xs"
        >
          Clear Token
        </button>
      )}
    </div>
  );
};

function Login() {
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const { isPending, mutate } = useMutation({
    mutationKey: ["LoginUser"],
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("Login response data:", data);

      // ✅ FIX: Store the token and user data
      if (data.user && data.token) {
        setUser(data.user);

        // 🔥 CRITICAL: Store the token in localStorage
        localStorage.setItem("authToken", data.token);
        console.log(
          "✅ Token stored in localStorage:",
          data.token.substring(0, 20) + "...",
        );

        toast.success("Login Successful!");
        navigate("/");
      } else if (data.user) {
        // Fallback if token is missing (shouldn't happen with updated backend)
        setUser(data.user);
        console.warn("⚠️ Token missing from login response");
        toast.success("Login Successful!");
        navigate("/");
      } else {
        toast.error("Invalid login response");
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Login Failed!");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Logging in with:", { identifier });
    mutate({ identifier, password });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    if (id === "email") {
      setIdentifier(value);
    } else if (id === "password") {
      setPassword(value);
    }
  }

  // Clear all auth data
  const clearAuthData = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    useAuthStore.getState().clearUser();
    toast.info("Auth data cleared");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      {/* <TokenStatus /> */}
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-green-800 font-bold">Login</CardTitle>
          <CardDescription>
            <div>
              <div>
                <p>
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-green-800 hover:underline"
                  >
                    Register
                  </Link>
                </p>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email or Username</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="m@example.com or yourusername"
                  value={identifier}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full bg-green-800 hover:bg-green-900"
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
