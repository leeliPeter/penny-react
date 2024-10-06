const url:string = "http://localhost:3000";
export default url;

type User = {
    id: string;
    email: string;
    name?:string;
    password?: string;
    icon?: string;
    image?: string[];
}
export type {User};