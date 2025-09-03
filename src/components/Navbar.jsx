"use client"

import { signOut, useSession } from "next-auth/react"
import { Button } from "./ui/button";
import Link from "next/link";

export default function Navbar(){

    const { data: session, status } = useSession();
    const user = session?.user;

    return (
        <nav>
            <div>
                <a href="#">Mystery Message</a>
                {
                    session ? (
                       <>
                        <span>Welcome, {user.username || user.email}</span>
                        <Button onClick={() => signOut()}>Logout</Button>
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