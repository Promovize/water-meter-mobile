import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { forwardRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Text, TextInput } from "react-native-paper";
import MaskInput, { Masks } from "react-native-mask-input";
import { supabase } from "@/lib/supabase";

const schema = z.object({
  firstName: z.string().min(2, "Too Short!").max(50, "Too Long!"),
  lastName: z.string().min(2, "Too Short!").max(50, "Too Long!"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Too Short!").max(50, "Too Long!"),
  phone: z.string().min(6, "Too Short!").max(50, "Too Long!"),
});

const EditUserScreen = () => {
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { control, handleSubmit, formState, reset } = useForm<z.infer<typeof schema>>({
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
      const { error, data: userData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: `${data.firstName} ${data.lastName}`,
            phone: data.phone,
          },
        },
      });
      if (error) {
        throw error;
      }
      if (userData) {
        Alert.alert("Success", "User created successfully");
        reset();
        setLoading(false);
      }
    } catch (error: any) {
      Alert.alert("Error creating account", error.message);
      setLoading(false);
    }
  };

  const phoneMask = ["(", /\d/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
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
            Create
          </Button>
        </View>
      </ScrollView>
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
