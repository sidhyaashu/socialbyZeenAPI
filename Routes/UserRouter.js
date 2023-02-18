import express from "express";
import {getUser,updateUseer,deletUser,followUser,unfollowUser} from "../Controllers/UserController.js";
const router = express.Router();

router.get('/:id',getUser);
router.put('/:id',updateUseer);
router.delete('/:id',deletUser);
router.put('/:id/follow',followUser);
router.put("/:id/unfollow",unfollowUser);
export default router