import Navbar from "@/components/Navbar";


export default function layout({ children }){
    return (
        <>
        <Navbar/>
        <main>{children}</main>
        </>
    )
}