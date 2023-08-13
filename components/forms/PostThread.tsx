
"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import {useForm} from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod"
import { Button } from "../ui/button";
import { ChangeEvent, useState } from "react";
import { ThreadValidation } from "@/lib/validations/thread";
// import { updateUser } from "@/lib/actions/user.actions";
import {usePathname, useRouter} from 'next/navigation';
import { Textarea } from "../ui/textarea";
import { createThread } from "@/lib/actions/thread.actions";
import { getRandomValues } from "crypto";

interface Props {
  user:{
    id: string;
    objectId: string;
    userName: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

  
function PostThread({userId}: {userId: string}){

  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues:{
      thread:'',
      accountId: userId
    }
  });


  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    await  createThread({
      text: values.thread,
      author: userId,
      communityId: null,
      path: pathname
    })
    router.push("/")
  }

  return (
    <Form {...form}>
    <form 
      onSubmit={form.handleSubmit(onSubmit)} 
      className="flex flex-col justify-start gap-10">
         <FormField
        control={form.control}
        name="thread"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full gap-3">
            <FormLabel className="text-base-semibold text-light-2">
            Content
           </FormLabel>
            <FormControl className="no-focus border border-dark-4 bg-dark-3 tex-light-1">
              <Textarea 
                rows={15}
                className="account-form_input no-focus"
                {...field}
                />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />
      <Button type="submit" className="bg-primary-500">
          Submit
      </Button>
      </form>
    </Form>
  )
}

export default PostThread;