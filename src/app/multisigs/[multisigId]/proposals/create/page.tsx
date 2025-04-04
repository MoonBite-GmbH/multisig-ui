"use client";
import React, { useState } from "react";
import { NextPage } from "next";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { usePersistStore } from "@/state/store";
import { useToast } from "@/components/ui/useToast";
import { ToastAction } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import {
  createTransactionProposal,
  createUpdateProposal,
  getLatestProposalId,
} from "@/lib/multisig";
import { SelectValue } from "@radix-ui/react-select";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/Calendar";
import Signer from "@/lib/wallets/Signer";

const schema = z.object({
  type: z.enum(["transaction", "update"], {
    required_error: "Type is required",
  }),
  title: z.string().optional(),
  description: z.string().optional(),
  recipient: z.string().optional(),
  amount: z.coerce.number().min(1, "Must be greater than zero").optional(),
  token: z.string().optional(),
  new_wasm_hash: z.string().optional(),
  expiration_date: z.date().optional(),
});

interface ProposalForm {
  type: string;
  title: string;
  description: string;
  recipient?: string;
  amount?: number;
  token?: string;
  new_wasm_hash?: string;
  expiration_date: Date | undefined;
}

interface CreatePorposalPageParams {
  readonly params: {
    readonly multisigId: string;
  };
}

const CreateProposalPage = ({ params }: CreatePorposalPageParams) => {
  const appStore = usePersistStore();
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "transaction",
      title: "",
      description: "",
      recipient: "",
      amount: 1,
      token: "",
      new_wasm_hash: "",
      expiration_date: undefined,
    },
  });

  const onSubmit = async (values: ProposalForm) => {
    setIsLoading(true);

    const {
      type,
      title,
      description,
      recipient,
      amount,
      token,
      new_wasm_hash,
      expiration_date,
    } = values;

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

      setIsLoading(false);
      return;
    }

    if (!title || !description) {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please fill out all required fields.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });

      setIsLoading(false);
      return;
    }

    try {
      if (type === "transaction") {
        if (!recipient || !amount || !token) {
          toast({
            className: cn(
              "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
            ),
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "Please fill out all required fields for transaction proposal.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
          return;
        }

        const signer = new Signer();
        const wallet = await signer.getWallet();

        const result = await createTransactionProposal(
          wallet!,
          appStore.wallet.address!,
          params.multisigId,
          {
            title,
            description,
            recipient,
            amount,
            token,
            creation_date: new Date(),
            expiration_date,
          }
        );

        setTimeout(
          async () => {
            const proposalId = await getLatestProposalId(params.multisigId);
            router.push(
              `/multisigs/${params.multisigId}/proposals/${proposalId}`
            );
          },
          1000
        );
      } else {
        if (!new_wasm_hash) {
          toast({
            className: cn(
              "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
            ),
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "Please fill out all required fields for update proposal.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
          return;
        }

        const signer = new Signer();
        const wallet = await signer.getWallet();

        const result = await createUpdateProposal(
          wallet!,
          appStore.wallet.address!,
          params.multisigId,
          {
            title,
            description,
            wasmHash: new_wasm_hash,
            creation_date: new Date(),
            expiration_date,
          }
        );

        setTimeout(
          async () => {
            const proposalId = await getLatestProposalId(params.multisigId);
            router.push(
              `/multisigs/${params.multisigId}/proposals/${proposalId}`
            );
          },
          1000
        );
      }
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        title: "Proposal created!",
        description: "Your proposal has been successfully created.",
      });
    } catch (e) {
      console.log(e);

      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });

      setIsLoading(false);
    }
  };

  return (
    <div className="md: p-8">
      <h1 className="text-2xl font-semibold mb-4">
        Create New Proposal for Multisig
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            name="type"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transaction">
                        Transaction Proposal
                      </SelectItem>
                      <SelectItem value="update">Update Proposal</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          {form.watch("type") === "transaction" && (
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {form.watch("type") === "update" && (
            <FormField
              name="new_wasm_hash"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New WASM Hash</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            name="expiration_date"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expiration Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <Button type="submit" variant="default" disabled={isLoading}>
            {isLoading && <Loader2 className="animate-spin" />}
            Create Proposal
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateProposalPage;
