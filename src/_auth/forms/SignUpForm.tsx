import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { SignupValidation } from "@/lib/validation";
import { Link, useNavigate } from "react-router-dom";
import {
    useCreateUserAccount,
    useSignInAccount,
} from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";

const SignUpForm = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

    // Queries
    const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } =
        useCreateUserAccount();

    const { mutateAsync: signInAccount, isLoading: isSigningInUser } =
        useSignInAccount();

    // 1. Define your form.
    const form = useForm<z.infer<typeof SignupValidation>>({
        resolver: zodResolver(SignupValidation),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof SignupValidation>) {
        const newUser = await createUserAccount(values);

        if (!newUser) {
            return toast({ title: "Sign up failed. Please try again." });
        }
        console.log(newUser);

        const session = await signInAccount({
            email: values.email,
            password: values.password,
        });

        if (!session) {
            toast({
                title: "Something went wrong. Please login your new account",
            });

            navigate("/sign-in");

            return;
        }

        const isLoggedIn = await checkAuthUser();

        if (isLoggedIn) {
            form.reset();

            navigate("/");
        } else {
            toast({ title: "Login failed. Please try again." });

            return;
        }
    }

    return (
        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col">
                <img src="/assets/images/logo.svg" alt="logo" />

                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-10">
                    Create a new account
                </h2>
                <p className="text-light-3 small-medium md:base-regular mt-2">
                    To use snapgram, Please enter your details
                </p>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-5 mt-4 w-full"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        className="shad-input"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label">
                                    Username
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        className="shad-input"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label">
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        className="shad-input"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label">
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        className="shad-input"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="shad-button_primary">
                        {isCreatingAccount ||
                        isSigningInUser ||
                        isUserLoading ? (
                            <div className="flex-center gap-2">
                                <Loader /> Loading...
                            </div>
                        ) : (
                            "Sign up"
                        )}
                    </Button>

                    <p className="text-small-regular text-light-2 text-center mt-2">
                        Already have an account?
                        <Link
                            to="/sign-in"
                            className="text-primary-500 text-small-semibold ml-1"
                        >
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
        </Form>
    );
};

export default SignUpForm;
