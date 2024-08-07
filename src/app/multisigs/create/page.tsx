"use client";
import React, { useState } from "react";
import { NextPage } from "next";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { usePersistStore } from "@/state/store";
import { useToast } from "@/components/ui/useToast";
import { deployMultisigContract } from "@/lib/deploy";
import { xBull } from "@/lib/wallets/xbull";
import { ToastAction } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().nonempty({ message: "Required" }),
  description: z.string().nonempty({ message: "Required" }),
  threshold: z.number().min(1, "Must be greater than zero"),
  members: z
    .array(z.object({ address: z.string().nonempty({ message: "Required" }) }))
    .min(1, "At least one member is required"),
});

interface Member {
  address: string;
}

const CreateMultisigPage: NextPage = () => {
  const [members, setMembers] = useState<Member[]>([{ address: "" }]);
  const appStore = usePersistStore();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      threshold: 1,
      members: [{ address: "" }],
    },
  });

  const onSubmit = async (values: any) => {
    // Call deployMultisigContract
    const { name, description, threshold, members } = values;

    // Error if wallet address is not set
    if (!appStore.wallet.address) {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        ),
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please connect your wallet to continue.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    // If values not set, return
    if (!name || !description || !threshold || !members) {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        ),
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please fill out all required fields.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }
    const memberAddresses = members.map((member: Member) => member.address);
    try {
      const result = await deployMultisigContract(
        new xBull(),
        appStore.wallet.address!,
        {
          name,
          description,
          threshold,
          members: memberAddresses,
        },
      );
      if (result) {
        toast({
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
          ),
          title: "Multisig created!",
          description: `Your multisig contract ${result} has been successfully created.`,
        });
      }
    } catch (e) {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        ),
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  const handleAddMember = () => {
    setMembers([...members, { address: "" }]);
  };

  const handleRemoveMember = (index: number) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
    form.reset({ ...form.watch(), members: newMembers });
  };

  return (
    <div className="p-8">
      <h1 className="text-xl mb-8">Create New Multisig</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="threshold"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Threshold</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Accordion type={"multiple"}>
            {members.map((member, index) => (
              <AccordionItem key={index} value={index.toString()}>
                <AccordionTrigger>Member {index + 1} Address</AccordionTrigger>
                <AccordionContent>
                  <FormField
                    name={`members.${index}.address`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    onClick={() => handleRemoveMember(index)}
                    disabled={members.length === 1}
                  >
                    Remove
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Button onClick={handleAddMember} className="mb-4">
            Add Member
          </Button>

          <Button type="submit" variant="default">
            Create Multisig
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateMultisigPage;
