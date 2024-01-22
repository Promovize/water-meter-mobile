import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Text, TextInput } from "react-native-paper";
import MaskInput from "react-native-mask-input";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import { getSingleUser } from "@/api/userFetcher";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";

const EditUserScreen = () => {
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const route = useRoute();
  const { id } = route.params as any;
  const router = useRouter();

  const { data: user, error, mutate } = useSWR(id !== "new" ? `/users/${id}` : null, () => getSingleUser(id));
  const isCreatingNewUser = id === "new";
  const loadingUser = !user && !error && !isCreatingNewUser;

  const schema = z.object({
    firstName: z.string().min(2, "Too Short!").max(50, "Too Long!"),
    lastName: z.string().min(2, "Too Short!").max(50, "Too Long!"),
    email: z.string().email("Invalid email"),
    password: isCreatingNewUser ? z.string().min(8, "Too Short!").max(50, "Too Long!") : z.string().optional(),
    phone: z.string().min(6, "Too Short!").max(50, "Too Long!"),
  });

  const { control, handleSubmit, formState, reset, setValue } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "123456",
      firstName: "",
      lastName: "",
      email: "",
    },
  });
  const { errors } = formState;

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      setLoading(true);
      if (!isCreatingNewUser) {
        const { error } = await supabase.auth.updateUser({
          email: data.email === user!.email ? undefined : data.email,
          data: {
            full_name: `${data.firstName} ${data.lastName}`,
            phone: data.phone,
          },
        });
        if (error) throw error;
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: `${data.firstName} ${data.lastName}`,
            phone: data.phone,
          })
          .eq("id", user!.id);

        if (profileError) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password!,
          options: {
            data: {
              full_name: `${data.firstName} ${data.lastName}`,
              phone: data.phone,
            },
          },
        });
        if (error) throw error;
      }

      Alert.alert("Success", !isCreatingNewUser ? "User created successfully" : "User updated successfully");

      reset();
      setLoading(false);
      router.push("/(tabs)/profile/admin/users/list");
    } catch (error: any) {
      Alert.alert("Error creating account", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id === "new" || loading) return;
    if (id !== "new" && user) {
      setValue("firstName", user.full_name.split(" ")[0]);
      setValue("lastName", user.full_name.split(" ")[1]);
      setValue("email", user.email);
      setValue("phone", user.phone);
      setValue("password", "");
    } else {
      Alert.alert("Error", "User not found");
      router.push("/(tabs)/profile/admin/users/list");
    }
  }, [user, id, loading]);

  const phoneMask = ["(", /\d/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      {loadingUser && (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Loading...</Text>
        </View>
      )}
      {!loadingUser && (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <View style={styles.form}>
            <View style={styles.formControl}>
              <Controller
                control={control}
                name='firstName'
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label='First Name'
                    value={value}
                    autoCapitalize='words'
                    autoComplete='given-name'
                    onChangeText={onChange}
                    mode='outlined'
                    theme={{ roundness: 50 }}
                  />
                )}
              />
              {errors.firstName && (
                <Text variant='labelSmall' style={styles.errorMessage}>
                  {errors.firstName.message}
                </Text>
              )}
            </View>
            <View style={styles.formControl}>
              <Controller
                control={control}
                name='lastName'
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label='Last Name'
                    value={value}
                    autoCapitalize='words'
                    autoComplete='family-name'
                    onChangeText={onChange}
                    mode='outlined'
                    theme={{ roundness: 50 }}
                  />
                )}
              />
              {errors.lastName && (
                <Text variant='labelSmall' style={styles.errorMessage}>
                  {errors.lastName.message}
                </Text>
              )}
            </View>
            <View style={styles.formControl}>
              <Controller
                control={control}
                name='email'
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label='Email'
                    value={value}
                    autoCapitalize='none'
                    autoComplete='email'
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
                    secureTextEntry={true}
                    value={value}
                    onChangeText={onChange}
                    mode='outlined'
                    theme={{ roundness: 50 }}
                    right={
                      <TouchableOpacity
                        onPress={() => setPasswordVisible(!passwordVisible)}
                        style={styles.passwordToggle}
                      >
                        {passwordVisible ? <TextInput.Icon icon='eye-off' /> : <TextInput.Icon icon='eye' />}
                      </TouchableOpacity>
                    }
                    left={<TextInput.Icon icon='lock' />}
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
            <View style={styles.formControl}>
              <Controller
                control={control}
                name='phone'
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label='Phone'
                    value={value}
                    autoCapitalize='none'
                    render={(props) => <MaskInput {...props} mask={phoneMask} onChangeText={onChange} ref={null} />}
                    keyboardType='phone-pad'
                    enterKeyHint='done'
                    autoComplete='tel'
                    left={<TextInput.Icon icon='phone' />}
                    mode='outlined'
                    theme={{ roundness: 50 }}
                  />
                )}
              />
              {errors.phone && (
                <Text variant='labelSmall' style={styles.errorMessage}>
                  {errors.phone?.message}
                </Text>
              )}
            </View>
            <Button loading={loading} mode='contained' onPress={handleSubmit(onSubmit)}>
              {isCreatingNewUser ? "Create" : "Update"}
            </Button>
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
};

export default EditUserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  form: {
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: "100%",
    gap: 20,
  },
  formControl: {
    width: "100%",
  },
  errorMessage: {
    color: "red",
    marginTop: 5,
  },

  passwordToggle: {
    height: 50,
    justifyContent: "center",
  },
});
