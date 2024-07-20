import {
    deleteDoc,
    doc,
    getFirestore,
    Timestamp,
    updateDoc
} from "firebase/firestore"
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytes
} from "firebase/storage"
import app from "../../../../libs/firebase/db"
import {
    NextResponse as res
} from "next/server"

const db = getFirestore(app)
const storage = getStorage(app)

export async function PUT(request, {
    params
}) {
    try {
        const {
            id
        } = params
        const data = await request.formData()
        const name = data.get("name")
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
        const token = request.headers.get('authorization')?.split(' ')[1]

        if (!token) {
            return res.json({status: 401, message: "token tidak ada", data: "tidak ada data"})
        }
    
        if (token != process.env.KEY_API) {
            return res.json({status: 403, message: "token salah", data: "tidak ada data"})
        }
        

        const docRef = doc(db, "book", id)
        await updateDoc(docRef, {
            name: name,
            category: category,
            image: imageUrl,
            rating: parseRating,
            cerita: cerita,
            terbit: year,
            timestamp: Timestamp.now()
        })

        return res.json({
            status: 200,
            message: "data berhasil diupdate",
            data: `data dengan id ${id} diupdate`
        })
    } catch (error) {
        return res.json({
            status: 500,
            message: "data gagal diupdate",
            data: "tidak ada data yang di update"
        })
    }
}

export async function DELETE(request, {
    params
}) {
    try {
        const {
            id
        } = params
        const token = request.headers.get('authorization')?.split(' ')[1]

        if (!token) {
            return res.json({status: 401, message: "token tidak ada", data: "tidak ada data"})
        }
    
        if (token != process.env.KEY_API) {
            return res.json({status: 403, message: "token salah", data: "tidak ada data"})
        }
        const docRef = doc(db, "book", id)
        await deleteDoc(docRef)
        return res.json({status: 200, message: "data berhasil dihapus", data: `data dengan id ${id} terhapus`})
    } catch (error) {
        return res.json({status: 500, message: "data gagal dihapus", data: `data dengan id ${id} gagal dihapus`})
    }
}