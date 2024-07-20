import {
    addDoc,
    collection,
    getDocs,
    getFirestore,
    orderBy,
    query,
    updateDoc,
    where
} from "firebase/firestore"
import app from "./db"
const db = getFirestore(app)

export async function getData(collectionName) {
    const snapshot = await getDocs(collection(db, collectionName))
    const data = []
    snapshot.forEach((doc) => {
        data.push(doc.data())
    })
    return data
}

export async function getDataById(collectionName, id) {
    try {
        const q = query(collection(db, collectionName), where("id", "==", id))
        const snapshot = await getDocs(q)
        const data = []
        snapshot.forEach((doc) => {
            data.push(doc.data())
        });
        return data
    } catch (error) {
        throw error
    }
}

export async function getDataTrending(collectionName) {
    const q = query(collection(db, collectionName), where("rating", ">=", 8), orderBy("rating", "desc"))
    const snapshot = await getDocs(q)
    const data = []
    snapshot.forEach((doc) => {
        data.push(doc.data())
    })
    return data
}

export async function getDataNew(collectionName) {
    const q = query(collection(db, collectionName), orderBy("terbit", "desc"))
    const snapshot = await getDocs(q)
    const data = []
    snapshot.forEach((doc) => {
        data.push(doc.data())
    })
    return data
}