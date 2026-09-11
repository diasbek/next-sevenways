import { createHomePage } from "@/i18n/create-pages";

const page = createHomePage("ru");
export const generateMetadata = page.generateMetadata;
export default page.Page;
