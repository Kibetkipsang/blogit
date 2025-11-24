import React, {useState} from 'react';
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';
import {api} from '../axios';
import { toast } from 'sonner';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


type userDataType = {
    identifier: string;
    password: string;
}

const loginUser = async (data: userDataType) => {
  const response = await api.post("/auth/login", data);
  return response.data;
}

function Login() {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const {isPending, mutate, isError, error} = useMutation({
        mutationKey: ['LoginUser'],
        mutationFn: loginUser,
        onSuccess: () => {
          toast.success("Login Successful!");
          navigate("/");
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Login Failed!");
        }
        
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        mutate({ identifier, password });
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>){
        const {id, value} = e.target;
        if(id === "email" || id === "username"){
            setIdentifier(value);
        }else if(id === "password"){
            setPassword(value);
        }
    }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email or username below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Register</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email or Username</Label>
              <Input
                id="email"
                type="text"
                placeholder="m@example.com"
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
              <Input id="password" type="password" value={password} onChange={handleChange} required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" disabled={isPending} onClick={handleSubmit}>
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}

export default Login