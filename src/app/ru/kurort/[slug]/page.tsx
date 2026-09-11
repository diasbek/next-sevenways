import { createResortPage } from "@/i18n/create-pages";

const page = createResortPage("ru");
export const generateStaticParams = page.generateStaticParams;
export const generateMetadata = page.generateMetadata;
export default page.Page;
