import express from "express"

const router = express.Router()

import { 
    getAll,
    getById,
    updateUser,
    deleteUser
} from "../controllers/user.controller";


// using routes

router.get("/api", getAll)

router.get("/api/:id", getById)

router.put("/api/:id",updateUser)

router.delete("/api/:id", deleteUser)



export default router