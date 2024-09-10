"use client";
import React, { useState } from "react";
import { NextPage } from "next";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Slider } from "@/components/ui/Slider";
import { usePersistStore } from "@/state/store";
import { useToast } from "@/components/ui/useToast";
import { deployMultisigContract, setUserMultisig } from "@/lib/deploy";
import { ToastAction } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Signer from "@/lib/wallets/Signer";
import { XIcon } from "lucide-react";

const schema = z.object({
  name: z.string().nonempty({ message: "Required" }),
  description: z.string().nonempty({ message: "Required" }),
  threshold: z.coerce.number().min(1, "Must be greater than zero"),
  members: z
    .array(z.object({ address: z.string().nonempty({ message: "Required" }) }))
    .min(1, "At least one member is required"),
});

interface Member {
  address: string;
}

const CreateMultisigPage: NextPage = () => {
  const appStore = usePersistStore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      threshold: 50,
      members: [{ address: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  const onSubmit = async (values: any) => {
    // Call deployMultisigContract
    const { name, description, threshold, members } = values;

    // Error if wallet address is not set
    if (!appStore.wallet.address) {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
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
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
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
      const signer = new Signer();
      const wallet = await signer.getWallet();

      const result = await deployMultisigContract(
        wallet!,
        appStore.wallet.address!,
        {
          name,
          description,
          threshold,
          members: memberAddresses,
        }
      );
      if (result) {
        setUserMultisig(result, memberAddresses);

        toast({
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
          ),
          title: "Multisig created!",
          description: `Your multisig contract ${result} has been successfully created.`,
        });

        setTimeout(() => router.push(`/multisigs/${result}`), 1000);
      }
    } catch (e) {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  const handleAddMember = () => {
    append({ address: "" });
  };

  const handleRemoveMember = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast({ description: "At least one member is required" });
    }
  };

  return (
    <div className="md:p-8">
      <h1 className="text-2xl font-semibold mb-8">Create New Multisig</h1>
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
                <FormLabel>Passing Threshold (in Percent)</FormLabel>
                <div className="flex justify-end font-bold text-xs mt-2">
                  {field.value}%
                </div>
                <FormControl>
                  <Slider
                    defaultValue={[50]}
                    max={100}
                    step={1}
                    name={field.name}
                    value={[field.value]}
                    onValueChange={(vals) => {
                      field.onChange(vals[0]);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Accordion type={"multiple"}>
            {fields.map((field, index) => (
              <AccordionItem key={field.id} value={index.toString()}>
                <AccordionTrigger>Member {index + 1} Address</AccordionTrigger>
                <AccordionContent>
                  <div className="flex p-1">
                    <Button
                      className="mr-2 p-2"
                      variant="outline"
                      onClick={() => handleRemoveMember(index)}
                      disabled={fields.length === 1}
                    >
                      <XIcon className="w-[16px]" />
                    </Button>
                    <FormField
                      name={`members.${index}.address`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Button
            onClick={handleAddMember}
            type="button"
            variant="secondary"
            className="mb-4 mr-2"
          >
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
