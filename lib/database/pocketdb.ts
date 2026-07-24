import PocketBase from "pocketbase";

export const pb = new PocketBase(process.env.NEXT_PUBLIC_BACKEND_URL);