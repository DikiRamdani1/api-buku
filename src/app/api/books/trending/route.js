import { getDataTrending } from "@/libs/firebase/service";
import { NextResponse as res } from "next/server";

export async function GET(request) {
    const token = request.headers.get('authorization')?.split(' ')[1]

    if (!token) {
        return res.json({status: 401, message: "token tidak ada", data: "tidak ada data"})
    }

    if (token != process.env.KEY_API) {
        return res.json({status: 403, message: "token salah", data: "tidak ada data"})
    }
    try {
        const books = await getDataTrending("book")
        return res.json({status: 200, message: "data behasil ditemukan", data: books})
    } catch (error) {
        return res.json({status: 500, message: "data gagal ditemukan", data: "tidak ada data"})
    }
}