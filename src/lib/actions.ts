"use server";
import { cookies } from 'next/headers';

// const checkAdmin = async () => {
//     const token = cookies().get("admin-token");

//     if (!token) {
//         return null;
//     }
    
//     const isTokenValid = await 
// }

export const setAdminSessionToken = (token: string) => {
    cookies().set("admin-token", token, {
        sameSite: "strict", 
        maxAge: 60 * 60 * 2 // 2 hours only
    });
}

export const adminLogOut = () => {
    cookies().delete("admin-token");
}