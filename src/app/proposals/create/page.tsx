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
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

const proposalSchema = z.object({
  title: z.string().nonempty({ message: "Required" }),
  description: z.string().nonempty({ message: "Required" }),
  recipient: z.string().nonempty({ message: "Required" }),
  amount: z.number().min(1, "Must be greater than zero"),
  token: z.string().nonempty({ message: "Required" }),
  wasmHash: z.string().length(32, "Must be 32 bytes"),
});

type ProposalType = "transaction" | "update";

const CreateProposalPage: NextPage = () => {
  const [step, setStep] = useState<number>(1);
  const [proposalType, setProposalType] = useState<ProposalType | null>(null);

  const form = useForm({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: "",
      description: "",
      recipient: "",
      amount: 0,
      token: "",
      wasmHash: "",
    },
  });

  const onSubmit = (values: any) => {
    console.log(values);
  };

  const handleProposalTypeSelection = (type: ProposalType) => {
    setProposalType(type);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="p-8">
      <h1 className="text-xl mb-8">Create New Proposal</h1>
      {step === 1 && (
        <div className="grid grid-cols-2 gap-4">
          <Card
            onClick={() => handleProposalTypeSelection("transaction")}
            className="cursor-pointer hover:shadow-lg"
          >
            <CardHeader>
              <CardTitle>Transaction Proposal</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Create a proposal for a new transaction.</p>
            </CardContent>
          </Card>
          <Card
            onClick={() => handleProposalTypeSelection("update")}
            className="cursor-pointer hover:shadow-lg"
          >
            <CardHeader>
              <CardTitle>Update Proposal</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Create a proposal to update the contract.</p>
            </CardContent>
          </Card>
        </div>
      )}
      {step === 2 && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
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

            {proposalType === "transaction" && (
              <>
                <FormField
                  name="recipient"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="amount"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="token"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token</FormLabel>
                      <FormControl>
                        <Select>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Token" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="token1" className="flex">
                              <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>TK1</AvatarFallback>
                              </Avatar>
                              <p>Token 1</p>
                            </SelectItem>
                            <SelectItem value="token2">
                              <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>TK2</AvatarFallback>
                              </Avatar>
                              Token 2
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {proposalType === "update" && (
              <FormField
                name="wasmHash"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Wasm Hash</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="button" variant="secondary" onClick={handleBack}>
              Back
            </Button>

            <Button type="submit" variant="default">
              Create Proposal
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default CreateProposalPage;
