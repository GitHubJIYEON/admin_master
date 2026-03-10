import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, KeyRound, UserSearch } from "lucide-react";
import { z } from "zod";
import {
    type FieldError,
    type FieldErrors,
    type FieldValues,
    type Path,
    type Resolver,
    useForm,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type ZodShape<T extends FieldValues> = z.ZodType<T>;

const createZodResolver =
    <T extends FieldValues>(schema: ZodShape<T>): Resolver<T> =>
    async (values) => {
        const result = schema.safeParse(values);
        if (result.success) {
            return { values: result.data, errors: {} };
        }

        const errors: FieldErrors<T> = {};
        result.error.issues.forEach((issue) => {
            const field = issue.path[0];
            if (typeof field !== "string") return;
            const fieldError: FieldError = {
                type: "zod",
                message: issue.message,
            };
            errors[field as Path<T>] = fieldError as FieldErrors<T>[Path<T>];
        });

        return { values: {}, errors };
    };

const loginSchema = z.object({
    userId: z.string().trim().min(1, "아이디를 입력해주세요."),
    password: z.string().trim().min(1, "비밀번호를 입력해주세요."),
});

const findIdSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "이메일을 입력해주세요.")
        .email("올바른 이메일을 입력해주세요."),
});

const resetPasswordSchema = z.object({
    userId: z.string().trim().min(1, "아이디를 입력해주세요."),
});

export function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const redirectTo = useMemo(() => {
        const raw = searchParams.get("redirect");
        if (!raw) return "/dashboard";
        return raw.startsWith("/") ? raw : "/dashboard";
    }, [searchParams]);

    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = useForm<z.infer<typeof loginSchema>>({
        mode: "onChange",
        resolver: createZodResolver(loginSchema),
        defaultValues: {
            userId: "",
            password: "",
        },
    });

    const canSubmit = isValid && !isSubmitting;

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        // UI-only: 실제 인증은 백엔드 연동 시 추가합니다.
        window.setTimeout(() => {
            void values;
            navigate(redirectTo, { replace: true });
        }, 450);
    };

    return (
        <main className="bg-[#f7f7f7] min-h-screen p-4">
            <div className="mx-auto grid min-h-screen w-full max-w-md place-items-center">
                <Card className="w-full">
                    <CardHeader className="gap-3">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary text-primary-foreground grid size-10 place-items-center rounded-lg font-semibold">
                                M
                            </div>
                            <div className="min-w-0">
                                <CardTitle className="text-xl">마스터 관리자 로그인</CardTitle>
                                <CardDescription className="mt-1">
                                    관리자 계정으로 와이즈온 시스템에 로그인합니다.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                            <label className="flex flex-col gap-2 text-sm">
                                <span className="font-medium">아이디</span>
                                <Input
                                    autoComplete="username"
                                    {...register("userId")}
                                    placeholder="아이디를 입력하세요"
                                    required
                                />
                                {errors.userId?.message && (
                                    <span className="text-destructive text-xs">
                                        {errors.userId.message}
                                    </span>
                                )}
                            </label>

                            <label className="flex flex-col gap-2 text-sm">
                                <span className="font-medium">비밀번호</span>
                                <div className="relative">
                                    <Input
                                        autoComplete="current-password"
                                        type={showPassword ? "text" : "password"}
                                        {...register("password")}
                                        placeholder="비밀번호를 입력하세요"
                                        required
                                        className="pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute top-1/2 right-1 -translate-y-1/2"
                                        aria-label={
                                            showPassword ? "비밀번호 숨기기" : "비밀번호 표시"
                                        }>
                                        {showPassword ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </Button>
                                </div>
                                {errors.password?.message && (
                                    <span className="text-destructive text-xs">
                                        {errors.password.message}
                                    </span>
                                )}
                            </label>

                            <Button type="submit" disabled={!canSubmit} className="w-full">
                                로그인
                            </Button>
                        </form>

                        <div className="mt-4 flex items-center justify-between">
                            <FindIdDialog />
                            <ResetPasswordDialog />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start gap-1">
                        <p className="text-muted-foreground text-xs">
                            회원가입은 제공되지 않습니다. <br /> 계정 발급은 시스템 관리자에게
                            문의하세요.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </main>
    );
}

function FindIdDialog() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm<z.infer<typeof findIdSchema>>({
        mode: "onChange",
        resolver: createZodResolver(findIdSchema),
        defaultValues: {
            email: "",
        },
    });

    const handleRequest = () => {
        setMessage("입력한 이메일로 아이디 안내를 전송했습니다. (UI 시뮬레이션)");
        window.alert("아이디 찾기 요청이 접수되었습니다. (UI)");
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (!next) {
                    reset();
                    setMessage(null);
                }
            }}>
            <DialogTrigger asChild>
                <Button type="button" variant="link" size="sm" className="px-0">
                    <UserSearch className="size-4" />
                    아이디 찾기
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>아이디 찾기</DialogTitle>
                    <DialogDescription>
                        등록된 이메일 주소로 아이디 안내를 전송합니다.
                    </DialogDescription>
                </DialogHeader>

                <form className="grid gap-3" onSubmit={handleSubmit(handleRequest)}>
                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">이메일</span>
                        <Input
                            {...register("email")}
                            placeholder="예: admin@example.com"
                            autoComplete="email"
                        />
                        {errors.email?.message && (
                            <span className="text-destructive text-xs">{errors.email.message}</span>
                        )}
                    </label>
                    {message && (
                        <p className="text-muted-foreground text-sm" role="status">
                            {message}
                        </p>
                    )}
                </form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            닫기
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        onClick={handleSubmit(handleRequest)}
                        disabled={!isValid || isSubmitting}>
                        안내 메일 보내기
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ResetPasswordDialog() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm<z.infer<typeof resetPasswordSchema>>({
        mode: "onChange",
        resolver: createZodResolver(resetPasswordSchema),
        defaultValues: {
            userId: "",
        },
    });

    const handleRequest = () => {
        setMessage("비밀번호 재설정 안내를 전송했습니다. (UI 시뮬레이션)");
        window.alert("비밀번호 재설정 요청이 접수되었습니다. (UI)");
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (!next) {
                    reset();
                    setMessage(null);
                }
            }}>
            <DialogTrigger asChild>
                <Button type="button" variant="link" size="sm" className="px-0">
                    <KeyRound className="size-4" />
                    비밀번호 재설정
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>비밀번호 재설정</DialogTitle>
                    <DialogDescription>
                        본인 확인 후 비밀번호를 재설정할 수 있습니다. (백엔드 연동 전 UI만 구성)
                    </DialogDescription>
                </DialogHeader>

                <form className="grid gap-3" onSubmit={handleSubmit(handleRequest)}>
                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">아이디</span>
                        <Input
                            {...register("userId")}
                            placeholder="아이디를 입력하세요"
                            autoComplete="username"
                        />
                        {errors.userId?.message && (
                            <span className="text-destructive text-xs">
                                {errors.userId.message}
                            </span>
                        )}
                    </label>
                    {message && (
                        <p className="text-muted-foreground text-sm" role="status">
                            {message}
                        </p>
                    )}
                </form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            닫기
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        onClick={handleSubmit(handleRequest)}
                        disabled={!isValid || isSubmitting}>
                        재설정 안내 받기
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
