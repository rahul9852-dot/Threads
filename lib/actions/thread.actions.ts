"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectionToDb } from "../mongoose";


interface Params{
  text: string;
  author: string;
  communityId: string | null,
  path: string,
}
export async function createThread({text, author, communityId, path}: Params){

  try{

    connectionToDb();
  
    const createThread = await Thread.create({
      text,
      author,
      community: null,
    });
  
    // update user model
    await User.findByIdAndUpdate(author, {
      $push:{threads: createThread._id }
    })
    revalidatePath(path)
  }catch(error: any){
    throw new Error(`Error creating thread: ${error.message}`);
    
  }
}


export async function fetchPosts(pageNumber = 1, pageSize= 20){

  connectionToDb();

  // calculate the number of posts to skip.
  const skipAmount =(pageNumber - 1) *pageSize;

  // fech the posts that have no parents (top-level threads..)
  const postQuery = Thread.find({parentId:{$in:[null, undefined]}})
        .sort({createdAt:'desc'})
        .skip(skipAmount)
        .limit(pageSize)
        .populate({path:'author', model: User})
        .populate({
          path:'children',
          populate:{
            path:'author',
            model:User,
            select:"_id name parentId image"
          }
        })

        const totalPostsCount = await Thread.countDocuments({parentId: {$in: [null, undefined]}});

        const posts = await postQuery.exec();
        const isNext = totalPostsCount > skipAmount +posts.length;

        return {posts, isNext};
}

export async function fetchThreadById(threadId: string) {
  connectionToDb();

  try {
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (err) {
    console.error("Error while fetching thread:", err);
    throw new Error("Unable to fetch thread");
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
  ){
    connectionToDb();
    try{
      // Find the original thread by Id
      const originalThread = await Thread.findById(threadId);
      console.log(originalThread);

      if(!originalThread){
        throw new Error("Thread not found")
      }

      // create a new thread with comment text
      const commentThread = new Thread({
        text: commentText,
        author: userId,
        parentId: threadId,
      })

      //  save the new thread
      const savedCommentThread = await commentThread.save();

      console.log("save-->", savedCommentThread)

      // Update the original thread to include the new comment.
      originalThread.children.push(savedCommentThread._id);
      await originalThread.save();
      console.log(savedCommentThread._id)

      // save the original thread;
      revalidatePath(path);


    }catch(error: any){
      throw new Error(`Error adding comment to thread: ${error.message}`)
    }

  }