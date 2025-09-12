import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/auth-options";

export const getServerAuthSession = () => getServerSession(authOptions);