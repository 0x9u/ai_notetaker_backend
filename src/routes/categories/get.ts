import dbGetCategories from "@/db/category/get";
import { Request, Response } from "express";

async function routeGetCategories(req : Request, res : Response) {
    const user = req.user;

    const userCategories = await dbGetCategories(user.id);

    res.status(200).json(userCategories);
}

export default routeGetCategories;
