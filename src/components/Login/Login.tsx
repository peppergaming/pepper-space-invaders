import Typography from "@mui/material/Typography";
import style from "./Login.module.scss";
import TextField from "@mui/material/TextField";
import {ChangeEvent, useEffect, useState} from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import GoogleIcon from "../../assets/icons/GoogleIcon";
import TwitchIcon from "../../assets/icons/TwitchIcon";
import DiscordIcon from "../../assets/icons/DiscordIcon";
import IconButton from "@mui/material/IconButton";
import {PEPPER_OAUTH_TOKEN_KEY} from "@/config/constants";
import {useAuthConfig} from "@/services/auth";
import {useRouter} from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorIcon from "@mui/icons-material/Error";
import useStorage from "../../utils/storage";
import {useModalContext} from "@/services/modal";

export interface LoginProps {
    onLoggedInCallback?: () => any;
}

export interface ErrorViewProps {
    message?: string;
}

export interface LoadingViewProps {
    authorizing: boolean;
}

export interface LoginFormViewProps {
    isPepperLogged: boolean;
    isAuthorized: boolean;
    onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
    loginWithEmail: () => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    loginWithDiscord: () => Promise<void>;
    loginWithTwitch: () => Promise<void>;
}

export const Login = ({onLoggedInCallback}: LoginProps) => {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);
    const [loginToken, setLoginToken] = useState<string | null | undefined>(null);

    const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const {
        isOauth,
        oauthStatus,
        setOauthStatus,
        isPepperLogged,
        isLoading: isAuthConfigLoading,
        socialLogin,
        refreshLogin,
    } = useAuthConfig();

    const [isLoading, setIsLoading] = useState<boolean>(isAuthConfigLoading);
    const storage = useStorage();
    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const {hideModal, isModalVisible} = useModalContext();

    const triggerLogin = async (provider: any, hint?: string) => {
        setIsAuthorizing(true);
        const web3Provider = await socialLogin(
            provider,
            hint,
            loginToken || undefined
        );
        if (web3Provider) {
            setIsAuthorized(true);
        }
        setIsAuthorizing(false);
    };

    const loginWithEmail = async () => {
        if (email) {
            await triggerLogin("email_passwordless", email);
        }
    };

    const loginWithGoogle = async () => {
        await triggerLogin("google");
    };

    const loginWithTwitch = async () => {
        await triggerLogin("twitch");
    };

    const loginWithDiscord = async () => {
        await triggerLogin("discord");
    };

    const triggerLoginRefresh = async (token: string) => {
        const signer = await refreshLogin(token);
        if (signer) {
            setOauthStatus("success");
            storage.removeItem(PEPPER_OAUTH_TOKEN_KEY);
        }
        setIsAuthorizing(false);
        setIsLoading(false);
    };

    useEffect(() => {
        if (isAuthorized && isModalVisible) {
            hideModal();
        }
    }, [isModalVisible, isAuthorized]);

    useEffect(() => {
        if (isOauth && router) {
            const token = router.query.token;
            if (typeof token === "string") {
                setLoginToken(token);
                storage.setItem(PEPPER_OAUTH_TOKEN_KEY, token);
                setOauthStatus("pending");
                return () => {
                    setOauthStatus("none");
                    storage.removeItem(PEPPER_OAUTH_TOKEN_KEY);
                };
            } else {
                setError("Invalid Token");
            }
        }
    }, [isOauth, router]);

    useEffect(() => {
        if (
            !isAuthConfigLoading &&
            isPepperLogged &&
            isOauth &&
            oauthStatus === "pending" &&
            loginToken
        ) {
            console.debug("Oauth pending, refreshing login");
            setIsAuthorizing(true);
            triggerLoginRefresh(loginToken);
        }
    }, [isOauth, oauthStatus, loginToken, isAuthConfigLoading]);

    useEffect(() => {
        if (!isAuthConfigLoading && isLoading) {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }, [isAuthConfigLoading]);

    useEffect(() => {
        if (isOauth && oauthStatus === "success") {
            setIsAuthorized(true);
        }
    }, [isOauth, oauthStatus]);

    if (error) {
        return <ErrorView message={error}/>;
    }

    return isLoading || isAuthConfigLoading || isAuthorizing ? (
        <LoadingView authorizing={isAuthorizing}/>
    ) : (
        <LoginFormView
            isPepperLogged={isPepperLogged}
            isAuthorized={isAuthorized}
            onEmailChange={handleEmailChange}
            loginWithEmail={loginWithEmail}
            loginWithGoogle={loginWithGoogle}
            loginWithDiscord={loginWithDiscord}
            loginWithTwitch={loginWithTwitch}
        />
    );
};

const ErrorView = ({message}: ErrorViewProps) => {
    return (
        <Stack direction={"column"} spacing={3} alignItems={"center"}>
            <ErrorIcon sx={{fontSize: 60}} color={"error"}/>
            <Typography variant={"h5"} color={"error"}>
                Error
            </Typography>
            {message && <Typography variant={"h3"}>{message}</Typography>}
        </Stack>
    );
};

const AuthorizedView = () => {
    return (
        <Stack direction={"column"} spacing={3} alignItems={"center"} sx={{padding:"10rem"}}>
            <Typography sx={{color:"white", fontSize:"35px"}}>Login Successful</Typography>
        </Stack>
    );
};

const LoadingView = ({authorizing}: LoadingViewProps) => {
    const loadMessage = authorizing ? "Authorizing" : "Loading";
    return (
        <Stack direction={"column"} alignItems={"center"} spacing={3} sx={{padding:"10rem"}}>
            <CircularProgress size={"4rem"} color="primary"/>
            <Typography variant={"h3"}  sx={{color:"white"}} >{loadMessage}</Typography>
        </Stack>
    );
};

const LoginFormView = ({
                           isAuthorized,
                           isPepperLogged,
                           onEmailChange,
                           loginWithDiscord,
                           loginWithGoogle,
                           loginWithTwitch,
                           loginWithEmail
                       }: LoginFormViewProps) => {
    return isAuthorized && isPepperLogged ? (
        <AuthorizedView/>
    ) : (
        <div className={style.Login}>
            <Typography fontWeight={600} fontSize={25} sx={{color: "white"}}>
                Starship Battle
            </Typography>
            <Typography mt={1} mb={6} fontSize={16} sx={{color: "white"}}>
                Demo of the capabilities of Pepper Web3 SDK
            </Typography>
            <Stack mb={3} direction={"column"} spacing={4}>
                <TextField
                    className={style.EmailInput}
                    id={"login-mail"}
                    fullWidth
                    label={"email"}
                    color={"primary"}
                    placeholder={"username@example.com"}
                    onChange={onEmailChange}
                    onKeyUp={async (e) => {
                        if (e.key === "Enter") {
                            await loginWithEmail();
                        }
                    }}
                />

                <Button
                    size={"large"}
                    className={style.EmailButton}
                    fullWidth
                    variant={"contained"}
                    onClick={loginWithEmail}
                >
                    Get Started
                </Button>
            </Stack>
            <Divider/>
            <Stack direction={"column"}>
                <Typography mt={2} mb={2} variant={"body3"} color={"text.secondary"}>
                    or sign in with your favorite
                </Typography>
                <Stack
                    alignItems={"center"}
                    justifyContent={"center"}
                    direction={"row"}
                    spacing={3}
                >
                    <IconButton onClick={loginWithGoogle}>
                        <GoogleIcon/>
                    </IconButton>

                    <IconButton onClick={loginWithDiscord}>
                        <DiscordIcon/>
                    </IconButton>

                    <IconButton onClick={loginWithTwitch}>
                        <TwitchIcon/>
                    </IconButton>
                </Stack>
            </Stack>
        </div>
    );
};