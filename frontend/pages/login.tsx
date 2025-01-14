import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import * as yup from "yup";
import Link from "../src/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { css, useTheme } from "@emotion/react";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import { Formik, FormikValues, Form } from "formik";
import { auth } from "../api";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import { useAppDispatch } from "../redux/hooks";
import { setUser } from "../redux/slices/userSlice";

import { authed } from "../utils/authed";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { NextPage } from "next";
import ShowErrors from "../components/common/ShowErrors";

import { IApiError } from "../@types";

const Login: NextPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const [apiError, setApiError] = useState<IApiError | null>(null);
  const router = useRouter();
  const { t } = useTranslation("auth");
  const { t: tCommon } = useTranslation("common");

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = yup.object({
    email: yup.string().email(t("invalid-email")).required(t("required")),
    password: yup.string().min(8, t("too-short")).required(t("required")),
  });

  const handleLogin = async ({ email, password }: FormikValues) => {
    try {
      const res = await auth.post("/login", {
        email,
        password,
      });

      if (res.data.status === "success") {
        const { data } = res;
        dispatch(setUser(data));
        setApiError(null);
        router.replace("/");
      }
    } catch (error: any) {
      setApiError(error?.response.data);
    }
  };

  const theme = useTheme();
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <Box
      component="main"
      sx={{
        height: "100vh",
        padding: { xs: 0, md: 4 },
        background: theme?.palette?.grey["200"],
      }}
    >
      <Grid
        container
        component={Paper}
        sx={{ height: "100%", overflow: "hidden", borderRadius: 3 }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          sx={{ paddingX: { xs: "1rem", md: "4rem" } }}
        >
          <Box
            css={css`
              display: flex;
              height: 100%;
              align-items: center;
              justify-content: center;
            `}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography component="h1" variant="h3" marginBottom={1}>
                {t("sign-in")}
              </Typography>
              <Typography component="p" variant="caption" marginBottom={2}>
                {t("description")}
              </Typography>
              <Box component="main" sx={{ mt: 1 }}>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleLogin}
                >
                  {({ handleChange, errors, isSubmitting }) => (
                    <Form>
                      {apiError && (
                        <ShowErrors apiErrors={apiError} screen="auth" />
                      )}

                      <TextField
                        error={!!errors.email}
                        helperText={errors.email}
                        size="small"
                        margin="dense"
                        onChange={handleChange}
                        fullWidth
                        id="email"
                        label={t("email")}
                        name="email"
                        autoFocus
                      />

                      <TextField
                        error={!!errors.password}
                        helperText={errors.password}
                        size="small"
                        margin="dense"
                        fullWidth
                        onChange={handleChange}
                        name="password"
                        label={t("password")}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        autoComplete="current-password"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              css={css`
                                background: ${theme?.palette?.grey["200"]};
                              `}
                            >
                              <IconButton
                                css={css`
                                  background: ${theme?.palette?.grey["200"]};
                                `}
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      <Grid container>
                        <Grid item xs>
                          <Link href="/register" variant="caption">
                            {t("dont-have-account")}
                          </Link>
                        </Grid>
                        <Grid item>
                          <Link href="/forgot-password" variant="caption">
                            {t("forgot-password")}
                          </Link>
                        </Grid>
                      </Grid>

                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        {t("sign-in")}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          md={6}
          sx={{
            display: { xs: "none", md: "flex" },
            backgroundRepeat: "no-repeat",
            background: (theme) =>
              theme?.palette?.mode === "light"
                ? "linear-gradient(180deg, rgba(18,57,143,1) 0%, rgba(0,212,255,0.5690651260504201) 100%);"
                : theme?.palette?.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          css={css`
            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          <Box
            css={css`
              box-shadow: inset 0 0 0 3000px rgba(255, 255, 255, 0.3);
              border-radius: 20px;
              height: 80%;
              width: 70%;
              padding: 3rem;
              position: relative;

              :before {
                box-shadow: inset 0 0 2000px rgba(255, 255, 255, 0.5);
                filter: blur(10px);
              }
              :after {
                content: "💯";
                position: absolute;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.7rem;
                bottom: 3rem;
                left: -2rem;
                height: 5rem;
                width: 5rem;
                background-color: ${theme?.palette?.common.white};
                border-radius: 5rem;
              }
            `}
          >
            <Typography
              variant="h3"
              css={css`
                color: ${theme?.palette?.common.white};
                margin-bottom: 1rem;
              `}
            >
              {tCommon("slug")}
            </Typography>
          </Box>
          <Box
            css={css`
              position: absolute;
              bottom: 0;
              right: 0;
            `}
          >
            <Image
              src={require("../public/png/login.png")}
              height={400}
              width={280}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;

export const getServerSideProps = authed(async (_context) => {
  return {
    props: {},
  };
});
