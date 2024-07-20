import {
    getDataTrending
} from "@/libs/firebase/service";
import {
    NextResponse as res
} from "next/server";

export async function GET(request) {
    const {
        searchParams
    } = new URL(request.url)
    const limit = searchParams.get('limit')
    const token = request.headers.get('authorization')?.split(' ')[1]

    if (!token) {
        return res.json({
            status: 401,
            message: "token tidak ada",
            data: "tidak ada data"
        })
    }

    if (token != process.env.KEY_API) {
        return res.json({
            status: 403,
            message: "token salah",
            data: "tidak ada data"
        })
    }
    try {
        if (limit) {
            const books = await getDataTrending("book")
            const book = books.slice(0, limit)
            if (book.length != 0) {
                return res.json({
                    status: 200,
                    message: "data ditemukan",
                    data: book
                })
            } else {
                return res.json({
                    status: 404,
                    message: "data tidak ditemukan",
                    data: "data tidak ada"
                })
            }
        } else {
            const books = await getDataTrending("book")
            return res.json({
                status: 200,
                message: "data behasil ditemukan",
                data: books
            })
        }
    } catch (error) {
        return res.json({
            status: 500,
            message: "data gagal ditemukan",
            data: "tidak ada data"
        })
    }
}
