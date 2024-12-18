import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { Types } from "mongoose";
import { NextResponse } from "next/server"

export const GET = async (request: Request) => {
    try {
        const {searchParams} = new URL(request.url);
        // this is how we recive the userId from the url.
        const userId = searchParams.get('userId');

        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId!"}), { status: 400 });
        }

        await connect();

        // getting the user which is going to be passed.
        const user = await User.findById(userId);
        if(!user){
            return new NextResponse(JSON.stringify({ message: "User not found!"}), { status: 404 });
        }

        // finde the category with userId
        const categories = await Category.find({user: new Types.ObjectId(userId)});

        // matching the userId and user means that who is the creatore of this user.
        return new NextResponse(JSON.stringify(categories), {
            status: 200,
        });

    } catch (error: any) {
        return new NextResponse("Error in fetching categories" + error.message, {
            status: 500,
        })
    }
};

export const POST = async (request: Request) => {
    try {
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get('userId');

        // get the data from category
        const {title} = await request.json();

        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userId!"}), { status: 400 });
        }

        await connect();
        const user = await User.findById(userId);
        if(!user){
            return new NextResponse(JSON.stringify({ message: "User not found!"}), { status: 404 });
        }

        const newCategory = new Category({
            title,
            user: new Types.ObjectId(userId),
        });

        await newCategory.save();

        return new NextResponse(JSON.stringify({message: "Category is created", category: newCategory}), {
            status: 200,
        });

    } catch (error: any) {
        return new NextResponse("Error in creating categories" + error.message, {
            status: 500,
        })
    }
}