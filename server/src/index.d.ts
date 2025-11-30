import express from "express";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  emailAdress: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
