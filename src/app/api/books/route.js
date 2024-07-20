import {
    addData,
    getData,
    getDataById,
} from "@/libs/firebase/service";
import {
    addDoc,
    collection,
    getFirestore,
    Timestamp,
    updateDoc
} from "firebase/firestore";
import {
    NextResponse as res
} from "next/server";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytes
} from "firebase/storage"
import app from "../../../libs/firebase/db"

const db = getFirestore(app)
const storage = getStorage(app)

export async function GET(request) {
    const {
        searchParams
    } = new URL(request.url)
    const id = searchParams.get("id")
    const name = searchParams.get("name")
    const category = searchParams.get("category")
    const token = request.headers.get('authorization')?.split(' ')[1]

    if (!token) {
        return res.json({status: 401, message: "token tidak ada", data: "tidak ada data"})
    }

    if (token != process.env.KEY_API) {
        return res.json({status: 403, message: "token salah", data: "tidak ada data"})
    }

    if (id) {
        const book = await getDataById("book", id)
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
                data: "tidak ada data"
            })
        }
    } else if (name) {
        const books = await getData("book")
        const book = books.filter(item => item.name.toLowerCase().includes(name.toLowerCase()))
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
    } else if (category) {
        const books = await getData("book")
        const book = books.filter(item => item.category.toLowerCase().includes(category.toLowerCase()))
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
        const books = await getData("book")
        return res.json({
            status: 200,
            message: "data ditemukan",
            data: books,
            token: token
        })
    }
}

export async function POST(request) {
    const token = request.headers.get('authorization')?.split(' ')[1]

    if (!token) {
        return res.json({status: 401, message: "token tidak ada", data: "tidak ada data"})
    }

    if (token != process.env.KEY_API) {
        return res.json({status: 403, message: "token salah", data: "tidak ada data"})
    }

    try {
    const data = await request.formData()
    const name = data.get('name')
    const category = data.get("category")
    const image = data.get("image")
    const rating = data.get("rating")
    const cerita = data.get("cerita")
    const terbit = data.get("terbit")
    const parseRating = parseFloat(rating)
    const parseTerbit = new Date(terbit)
    const year = parseTerbit.getFullYear()
    const storageRef = ref(storage, `image/${image.name}`)
    const snapshot = await uploadBytes(storageRef, image)
    const imageUrl = await getDownloadURL(snapshot.ref)

        const docRef = await addDoc(collection(db, "book"), {
            name: name,
            image: imageUrl,
            category: category,
            rating: parseRating,
            cerita: cerita,
            terbit: year,
            timestamp: Timestamp.now()
        })

        await updateDoc(docRef, {
            id: docRef.id
        })

        return res.json({
            status: 200,
            message: "data berhasil ditambahkan",
            data: `data berhasil ditambahkan dengan id data ${docRef.id}`
        })
    } catch (error) {
        return res.json({
            status: 500,
            message: "data gagal ditambahkan",
            data: "data tidak ada yang ditambahkan"
        })
    }
}