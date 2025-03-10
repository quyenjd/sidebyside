"use server";

import db from "@/db";
import { Layout } from "@models/Layout";
import { doc, getDoc } from "firebase/firestore";

export async function getLayout(id: string) {
  const layout = await getDoc(doc(db, "layouts", id));
  return (layout.data() ?? null) as Layout | null;
}
