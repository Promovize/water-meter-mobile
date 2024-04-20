import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { getClaims } from "@/api/userFetcher";
import useSWR from "swr";
import moment from "moment";
import { Button } from "react-native-paper";
import { supabase } from "@/lib/supabase";
import { ActivityIndicator } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const ClaimsScreen = () => {
  const {
    data: claims,
    error,
    isLoading,
    mutate,
    isValidating,
  } = useSWR(`/claims`, () => getClaims());

  const [loading, setLoading] = React.useState(false);

  const handleResolve = async (id: string) => {
    setLoading(true);
    try {
      await supabase.from("claims").update({ resolved: true }).eq("id", id);
      await mutate();
      Alert.alert("Claim resolved successfully");
    } catch (error: any) {
      Alert.alert("Error resolving claim", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {(loading || isLoading) && (
        <ActivityIndicator animating={isLoading || loading} />
      )}
      <FlatList
        data={claims}
        onRefresh={mutate}
        refreshing={isValidating}
        renderItem={({ item }) => (
          <View style={styles.claimCard}>
            <Text style={styles.claimDate}>
              Submited At: {moment(item.created_at).format("LLL")}
            </Text>
            {item.resolved && (
              <View style={styles.resolvedIcon}>
                <AntDesign name="checkcircle" size={18} color="green" />
              </View>
            )}
            <Text style={styles.claimMessage}>{item.message}</Text>
            <Text style={styles.claimStatus}>
              Scan Status: {item.scan?.is_paid ? "Paid" : "Unpaid"}
            </Text>
            <Text style={styles.claimAmount}>Amount: {item.scan?.amount}</Text>
            <Button
              onPress={() => handleResolve(item.id)}
              disabled={item.resolved}
            >
              Resolve
            </Button>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ClaimsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  claimCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  claimDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  claimMessage: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    marginBottom: 5,
  },
  claimStatus: {
    fontSize: 14,
    color: "#3498db",
    marginBottom: 5,
  },
  claimAmount: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2ecc71",
  },
  resolvedIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
