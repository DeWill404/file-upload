"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CustomCard from "../utils/components/CustomCard";
import AuthContainer from "../utils/components/AuthContainer";
import { useForm } from "react-hook-form";
import { UserLoginModel } from "../utils/interface/user.model";
import { userLogin } from "../utils/services/auth.service";
import { UserContext } from "../utils/components/SnackbarProvider";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";

export default function Login() {
  const setAuthModel = React.useContext(UserContext)[1];
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginModel>();

  const validation = {
    email: {
      required: "This field is required",
      pattern: {
        value: /\S+@\S+\.\S+/,
        message: "Invalid email is provided",
      },
    },
    password: {
      required: "This field is required",
    },
  };

  const onSubmit = async (payload: UserLoginModel) => {
    setIsLoading(true);
    const res = await userLogin(payload);
    setIsLoading(false);
    if (res.success && res.data) {
      setAuthModel(res.data);
      router.push("/home");
    }
  };

  return (
    <AuthContainer direction="column" justifyContent="space-between">
      <CustomCard variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={!!errors.email}
              helperText={errors.email?.message}
              id="email"
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              size="small"
              color={errors.email ? "error" : "primary"}
              sx={{ ariaLabel: "email" }}
              {...register("email", validation.email)}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              error={!!errors.password}
              helperText={errors.password?.message}
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              size="small"
              color={errors.password ? "error" : "primary"}
              {...register("password", validation.password)}
            />
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              pointerEvents: isLoading ? "none" : "auto",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
            tabIndex={isLoading ? -1 : 0}
          >
            {isLoading ? (
              <CircularProgress color="inherit" size={25} />
            ) : (
              "Login"
            )}
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <span>
              <Link href="/signup" variant="body2" sx={{ alignSelf: "center" }}>
                Signup
              </Link>
            </span>
          </Typography>
        </Box>
      </CustomCard>
    </AuthContainer>
  );
}
