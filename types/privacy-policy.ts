export type PrivacyPolicy = {
    id: string;
    title: string;
    description: string;
    lists: {
        title: string;
        description: string;
    }[]
};