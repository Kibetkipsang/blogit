import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  firstName: string;
  lastName: string;
  userName: string;
  emailAdress: string;
  password: string;
};
const userData = async (data: userDataType) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [emailAdress, setEmailAdress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["registerUser"],
    mutationFn: userData,
    onSuccess: () => {
      toast.success("Registration Successful!");
      navigate("/login");
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Registration Failed!");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    mutate({ firstName, lastName, userName, emailAdress, password });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    if (id === "firstName") {
      setFirstName(value);
    } else if (id === "lastName") {
      setLastName(value);
    } else if (id === "userName") {
      setUserName(value);
    } else if (id === "email") {
      setEmailAdress(value);
    } else if (id === "password") {
      setPassword(value);
    } else if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-5 px-4 sm:px-6 lg:px-8 mt-20">
      <Card className="w-full max-w-md lg:max-w-lg shadow-xl border-0">
        <CardHeader className="text-center space-y-4 p-6 sm:p-8">
          <div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-green-800">
              Create Account
            </CardTitle>
          </div>

          <div>
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-800 hover:underline font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
            {isError && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded-lg border border-red-200">
                {error?.response?.data?.message || "Registration Failed!"}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 pt-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* First Name & Last Name - Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="FirstName"
                    value={firstName}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="userName" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="username"
                  value={userName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@example.com"
                  value={emailAdress}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Password Requirements */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>Password must be at least 6 characters long</p>
                {password &&
                  confirmPassword &&
                  password !== confirmPassword && (
                    <p className="text-red-500">Passwords do not match</p>
                  )}
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col p-6 sm:p-8 pt-0">
          <Button
            type="submit"
            className="w-full bg-green-800 hover:bg-green-900 text-white font-medium py-2.5 transition-colors"
            onClick={handleSubmit}
            disabled={isPending}
            size="lg"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Register;
