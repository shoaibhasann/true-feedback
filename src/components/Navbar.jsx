"use client"

import { signOut, useSession } from "next-auth/react"
import { Button } from "./ui/button";
import Link from "next/link";

export default function Navbar(){

    const { data: session, status } = useSession();
    const user = session?.user;



    return (
        <nav className="bg-gray-400 p-2">
            <div className="flex justify-around items-center">
                <a className="text-xl font-extrabold" href="#">True Feedback</a>
                {
                    session ? (
                       <>
                        <span className="text-lg">Welcome back, {user.username || user.email} 👋</span>
                        <Button className="cursor-pointer" onClick={() => signOut()}>Logout</Button>
                       </>
                    ) : (
                        <Link href={"/sign-in"}>
                        <Button>Login</Button>
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}