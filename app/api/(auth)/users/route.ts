import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server"


// validating existing users
const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async() => {
    try{
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), {status: 200});
    }catch(error: any){
        return new NextResponse('Error in fetching users' + error.message, {status: 500});
    }  
}

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connect();
        const newUser = new User(body);
        await newUser.save();

        return new NextResponse(JSON.stringify({message: 'User is created', user: newUser}),{status: 200})
    } catch (error: any) {
        return new NextResponse("Error creating user" + error.message, {status: 500});
    }
}

// Modifing(updating) the the user that we have created to the database.
export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        const { userId, newUsername } = body;

        await connect();

        if (!userId || !newUsername) {
            return new NextResponse(JSON.stringify({ message: "ID or new username not found!" }), { status: 400 });
        }

        // Validate the ID using `Types.ObjectId.isValid`
        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid user ID!" }), { status: 400 });
        }

        // Update the user in the database
        const updatedUser = await User.findOneAndUpdate(
            { _id: new ObjectId(userId) },   
            { username: newUsername },
            { new: true }
        );

        if (!updatedUser) {
            return new NextResponse(JSON.stringify({ message: "User not found in the database" }), { status: 400 });
        }

        return new NextResponse(JSON.stringify({ message: "User is updated", user: updatedUser }), { status: 200 });
    } catch (error: any) {
        return new NextResponse("Error in Updating user: " + error.message, { status: 500 });
    }
}; 

// Delete request..........
export const DELETE = async(request: Request) => {
    try {
        const {searchParams} = new URL(request.url);
        // this is how we recive the userId from the url.
        const userId = searchParams.get('userId');

        // Validating the userId. 
        if (!userId) {
            return new NextResponse(JSON.stringify({ message: "ID is not found!" }), { status: 400 });
        }

        // varefing if the userId is valid or not.
        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid user ID!" }), { status: 400 });
        }

        await connect();

        const deleteUser = await User.findByIdAndDelete(new Types.ObjectId(userId));

        if(!deleteUser) {
            return new NextResponse(JSON.stringify({ messsage: 'User not found in database'}), {status: 400});
        }

        return new NextResponse(JSON.stringify({message: 'User is deleted', user: deleteUser}), {status: 200})

    } catch (error: any) {
        return new NextResponse("Error in deleting user" + error.message, {status: 500});        
    }
}