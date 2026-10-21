"use client";

import React from "react";
import { Document, Page, Text, View, Image, StyleSheet, Font  } from "@react-pdf/renderer";
import type { Product } from "@/types/product";
import { host } from "@/config";

Font.register({
  family: "Bricolage Grotesque",
   fonts: [
    { src: "/fonts/Tanker/BricolageGrotesqueRegular.ttf" },
    { src: "/fonts/BricolageGrotesqueSemiBold.ttf", fontWeight: 600 },
    { src: "/fonts/Tanker/BricolageGrotesque.ttf", fontWeight: 700 }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: "Bricolage Grotesque",
    fontSize: 11,
    color: "#111827",
  },
  h1: { fontSize: 22, fontWeight: 700, lineHeight: 1.2 },
  smallMuted: { fontSize: 10, color: "#6B7280", marginTop: 4 },
  heroWrap: {
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 8,
  },
  heroImg: {
    width: "100%",
    height: 520,
    objectFit: "contain",
  },
  h2: { fontSize: 16, fontWeight: 700, color: "#000000", marginBottom: 8 },
  paragraph: { fontSize: 12, lineHeight: 2 , fontWeight: 400  },
  list: { marginTop: 6 },
  listItem: { flexDirection: "row", gap: 6, marginBottom: 4 },
  bullet: { fontWeight: 900, color: "#000000" },
});

type Props = { data: Product; locale: string };

const ProductPdfDocument: React.FC<Props> = ({ data, locale }) => {
  const { name, images, description, category } = data;
  const hero = images?.[0] ?? "/images/placeholder-image.jpg";

  return (
    <Document title={name}>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.h1}>{name}</Text>
          <Text style={styles.smallMuted}>
            Category: {(category ?? "").replace(/-/g, " ")}
          </Text>
        </View>
        <View style={styles.heroWrap}>
          <Image src={hero} style={styles.heroImg} />
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
        <View >
          <Text style={styles.h2}>Description</Text>
          <Text style={styles.paragraph}>
            {description || "No description provided."}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ProductPdfDocument;
