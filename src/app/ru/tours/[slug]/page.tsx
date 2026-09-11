import { createTourDestinationPage } from "@/i18n/create-pages";

const page = createTourDestinationPage("ru");
export const generateStaticParams = page.generateStaticParams;
export const generateMetadata = page.generateMetadata;
export default page.Page;
