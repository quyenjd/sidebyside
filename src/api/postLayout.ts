"use server";

import db from "@db";
import { Layout } from "@models/Layout";
import { randomInt } from "crypto";
import { doc, setDoc } from "firebase/firestore";
import trim from "lodash/trim";

export const postLayout = async (args: Pick<Layout, "leftUrl" | "rightUrl">) => {
  const layout = {
    createdAt: new Date().toISOString(),
    leftUrl: trim(args.leftUrl),
    rightUrl: trim(args.rightUrl),
  };

  try {
    const response = await fetch(args.leftUrl);
    if (response.status >= 400) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }

  try {
    const response = await fetch(args.rightUrl);
    if (response.status >= 400) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }

  const id = Array.from({ length: 10 }, () => {
    return "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(randomInt(0, 62));
  }).join("");

  await setDoc(doc(db, "layouts", id), layout);

  return id;
};
