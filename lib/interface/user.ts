export interface cashierProps {
    fullName:string;
    email:string;
    phoneNumber:string;
    image:string;
    store?:Store;
    storeId?:string
}

export interface adminProps {
    fullName:string;
    email:string;
    phoneNumber:string;
    image:string;
    store:Store;
    storeId: string
}

export interface Store {
    id: string;
    name: string;
    address: string;
    phoneNumber: string;
}