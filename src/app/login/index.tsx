import { Alert, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Button, Text, TextInput } from "react-native-paper";
import { Link } from "expo-router";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const LoginScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const { email, password } = data;
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome back</Text>
            <Text variant='bodyMedium' style={styles.subTitle}>
              Ready to make a splash in smart water management? Log in to AquaIntel and let's conserve together.
            </Text>
          </View>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Controller
                control={control}
                name='email'
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label='Email'
                    value={value}
                    onChangeText={onChange}
                    left={<TextInput.Icon icon='account' />}
                    mode='outlined'
                    theme={{ roundness: 50 }}
                  />
                )}
              />
              {errors.email && (
                <Text variant='labelSmall' style={styles.errorMessage}>
                  {errors.email.message}
                </Text>
              )}
            </View>
            <View style={styles.formControl}>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label='Password'
                    secureTextEntry={!passwordVisible}
                    value={value}
                    onChangeText={onChange}
                    mode='outlined'
                    theme={{ roundness: 50 }}
                    left={<TextInput.Icon icon='lock' />}
                    right={<TextInput.Icon icon='eye' onPress={() => setPasswordVisible(!passwordVisible)} />}
                  />
                )}
                name='password'
              />
              {errors.password && (
                <Text variant='labelSmall' style={styles.errorMessage}>
                  {errors.password.message}
                </Text>
              )}
            </View>
            <Button mode='contained' style={styles.button} onPress={handleSubmit(onSubmit)}>
              Log In
            </Button>
          </View>
        </View>
        <View style={styles.footer}>
          <Text variant='bodyMedium' style={styles.noAccount}>
            Don't have an account?{" "}
            <Link href='https://promovize.dev'>
              <Text
                variant='bodyMedium'
                style={[
                  {
                    color: "#007AFF",
                    fontWeight: "bold",
                  },
                ]}
              >
                Contact Us
              </Text>
            </Link>
          </Text>
        </View>
      </View>
    </Screen>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: "10%",
  },
  subTitle: {
    textAlign: "center",
  },
  header: {
    paddingBottom: 30,
    gap: 10,
  },
  form: {
    width: "100%",
    gap: 20,
  },
  button: {},
  noAccount: {
    textAlign: "center",
    fontWeight: "600",
  },
  footer: {
    marginBottom: "10%",
  },
  errorMessage: {
    color: "red",
    marginTop: 5,
  },
  formControl: {},
});
