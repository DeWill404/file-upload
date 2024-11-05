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
import { UserSignupModel } from "../utils/interface/user.model";
import { userSignup } from "../utils/services/auth.service";
import { CircularProgress } from "@mui/material";
import { UserContext } from "../utils/components/SnackbarProvider";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSignupModel>();
  const setAuthModel = React.useContext(UserContext)[1];
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const validation = {
    name: {
      required: "This field is required",
      minLength: {
        value: 8,
        message: "name should of 8 charecter at minimum.",
      },
      maxLength: {
        value: 50,
        message: "name should of 50 charecter at max.",
      },
    },
    email: {
      required: "This field is required",
      pattern: {
        value: /\S+@\S+\.\S+/,
        message: "Invalid email is provided",
      },
      maxLength: {
        value: 50,
        message: "there should not be more then 50 characters in email.",
      },
    },
    password: {
      required: "This field is required",
      pattern: {
        value:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?#&]+$/,
        message:
          "Password should contain atleast a lowercase alphabet, a uppercase alphabet, a number, a special character i.e. @$!%*?&#",
      },
      minLength: {
        value: 8,
        message: "password should of 8 charecter at minimum.",
      },
      maxLength: {
        value: 50,
        message: "password should of 50 charecter at max.",
      },
    },
  };

  const onSubmit = async (payload: UserSignupModel) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const res = await userSignup(payload);
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
          Sign Up
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
            <FormLabel htmlFor="name">Name</FormLabel>
            <TextField
              error={!!errors.name}
              helperText={errors.name?.message}
              id="name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              autoFocus
              required
              fullWidth
              variant="outlined"
              size="small"
              color={errors.name ? "error" : "primary"}
              sx={{ ariaLabel: "name" }}
              {...register("name", validation.name)}
            />
          </FormControl>
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
              "Sign Up"
            )}
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Already have an account?{" "}
            <span>
              <Link href="/login" variant="body2" sx={{ alignSelf: "center" }}>
                Login
              </Link>
            </span>
          </Typography>
        </Box>
      </CustomCard>
    </AuthContainer>
  );
}
