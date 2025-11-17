import express from "express"

const router = express.Router()

import { 
    getAll,
    getById,
    updateUser,
    deleteUser
} from "../controllers/user.controller.js";


// using routes

router.get("/", getAll)

router.get("/:id", getById)

router.put("/:id",updateUser)

router.delete("/:id", deleteUser)



export default router