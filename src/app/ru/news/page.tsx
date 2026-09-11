import { createNewsListPage } from "@/i18n/create-pages";

const page = createNewsListPage("ru");
export const generateMetadata = page.generateMetadata;
export default page.Page;
