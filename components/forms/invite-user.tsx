"use client"

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { userNameSchema } from "@/lib/validations/user"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/shared/icons"

import { updateUserName, type FormData } from "@/actions/update-user-name"

interface UserNameFormProps {
  user: Pick<User, "id" | "name">
}

export function InviteUserForm({ user }: UserNameFormProps) {
  const [isPending, startTransition] = useTransition();
  const updateUserNameWithId = updateUserName.bind(null, user.id);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userNameSchema),
    defaultValues: {
      name: user?.name || "",
    },
  })

  const onSubmit = handleSubmit(data => {
    startTransition(async () => {
      const { status } = await updateUserNameWithId(data);

      if (status !== "success") {
        toast({
          title: "Something went wrong.",
          description: "Your name was not updated. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          description: "User invitation sent.",
        })
      }
    });

  });

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Invite Email</CardTitle>
          <CardDescription>
            Please enter the email of user you would like to invite.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Email
            </Label>
            <Input
              id="name"
              className="w-full sm:w-[400px]"
              size={32}
              {...register("name")}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <button
            type="submit"
            className={cn(buttonVariants())}
            disabled={isPending}
          >
            {isPending && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            <span>{isPending ? "Saving" : "Save"}</span>
          </button>
        </CardFooter>
      </Card>
    </form>
  )
}
