import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";

const EditUser = () => {
  const route = useRoute();

  return (
    <View>
      <Text>EditUser</Text>
    </View>
  );
};

export default EditUser;

const styles = StyleSheet.create({});
