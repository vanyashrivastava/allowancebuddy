import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../theme/colors";

type BalanceCardProps = {
  label: string;
  amount: string;
  subtitle?: string;
};

/** A simple card that displays a dollar amount prominently. */
export default function BalanceCard({ label, amount, subtitle }: BalanceCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.amount}>{amount}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  label: {
    color: colors.primary,
    fontSize: 13,
  },
  amount: {
    fontSize: 30,
    fontWeight: "800",
    color: "#17483A",
    marginTop: 6,
  },
  subtitle: {
    marginTop: 4,
    color: colors.textMedium,
    fontSize: 13,
  },
});
