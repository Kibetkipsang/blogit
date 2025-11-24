
import {useState} from 'react';
import { useMutation } from "@tanstack/react-query";
import { Link } from 'react-router-dom';
import { api } from '../axios'
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import {
  Card,
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
    firstName: string;
    lastName: string;
    userName: string;
    emailAdress: string;
    password: string;
}
const userData = async (data: userDataType) => {
  const res = await api.post('/auth/register', data);
  return res.data;
}

function Register() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [emailAdress, setEmailAdress] = useState("");
    const [password, setPassword] = useState("");

    const { mutate, isPending, isError, error } = useMutation({
        mutationKey: ['registerUser'],
        mutationFn: userData,
        onSuccess: () => {
          toast.success("Registration Successful!");
          setFirstName(firstName);
          setLastName(lastName);
          setUserName(userName);
          setEmailAdress(emailAdress);
          setPassword(password);
          navigate('/login');
        },
        
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Registration Failed!");
        },
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
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
      }
    }


  return (
    <div className="flex justify-center items-center  bg-gray-50 mt-26">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>REGISTER</CardTitle>
          <CardDescription>
            <div>
                <p>Already have an account? <Link to="/login" className='text-blue-500 hover:underline'>Login</Link></p>
            </div>
            <div className='text-red-600'>
            {isError ? error.response.data.message || "Registration Failed!" : null}
            </div>
            </CardDescription>
          
        </CardHeader>

        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Your First Name"
                  value={firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Your Last Name"
                  value={lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="userName">Username</Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="Your Username"
                  value={userName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={emailAdress}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your Password"
                  value={password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" className="w-full" onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Registering..." : "Register" }
          </Button>
          <Button variant="outline" className="w-full">
            Sign up with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Register