import { Headset, Mail, User } from "lucide-react";
import image from "/image/contactus.jpg"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useCreateContact } from "@/hooks/useContact";

const Contactus = () => {
    const { t } = useTranslation("common");

    const contactusSchema = z.object({
        fullname: z.string().min(1, t("contactus.fullname_error")),
        email: z.string().email(t("contactus.email_error")),
        message: z
            .string()
            .refine(
                (val) => val.trim().split(/\s+/).filter(w => w.length > 0).length >= 10,
                t("contactus.message_error")
            ),
    })
    const contactform = useForm({
        resolver: zodResolver(contactusSchema),
        mode: "onTouched",
        reValidateMode: "onChange",
        defaultValues: {
            fullname: "",
            email: "",
            message: ""
        }
    })

    const contactMutation = useCreateContact();

    const onSubmit = (data) => {
        contactMutation.mutate(data, {
            onSuccess: () => {
                contactform.reset();
            }
        });
    };

    return (
        <div className="flex min-h-full py-8 flex-col w-full items-center md:justify-center gap-8 bg-[linear-gradient(to_top,#1e3c72_0%,#1e3c72_1%,#2a5298_100%)] max-md:pb-24">
            <h1 className="flex gap-4 text-3xl items-center font-bold text-amber-400"><Headset className="size-10" /> {t("contactus.title")}</h1>
            <div className="flex flex-row p-4 md:p-8 gap-8 bg-white items-center justify-center lg:w-[70%] rounded-xl shadow-md w-[340px] md:w-[400px] max-md:mb-8">
                <div className="w-1/2 items-center justify-center hidden lg:flex">
                    <img src={image} alt="" className="w-[80%]" />
                </div>
                <div className="w-full lg:w-1/2 p-4 rounded-xl">
                    <Form {...contactform}>
                        <form onSubmit={contactform.handleSubmit(onSubmit)} className="grid gap-6">
                            <FormField
                                control={contactform.control}
                                name="fullname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("contactus.fullname_label")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder={t("contactus.fullname_placeholder")}
                                                icon={<User className="h-5 w-5" />}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={contactform.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("contactus.email_label")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder={t("contactus.email_placeholder")}
                                                icon={<Mail className="h-5 w-5" />}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={contactform.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("contactus.message_label")}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                type="textarea"
                                                placeholder={t("contactus.message_placeholder")}
                                                {...field}
                                                className="resize-none border max-h-[120px]"
                                            />
                                        </FormControl>
                                        <div className="flex justify-between items-center px-1">
                                            <FormMessage className="text-xs" />
                                            <p className="text-[10px] text-slate-400 font-medium">
                                                {(field.value || "").trim().split(/\s+/).filter(w => w.length > 0).length} / 10 {t("posts.word_count_min", "words min")}
                                            </p>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={!contactform.formState.isValid || contactMutation.isPending} className="cursor-pointer rounded-lg">
                                {contactMutation.isPending ? t("contactus.sending") : t("contactus.submit")}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
export default Contactus;